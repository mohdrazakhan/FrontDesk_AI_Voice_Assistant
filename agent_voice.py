import asyncio
import os
import sqlite3
from typing import Optional
from datetime import datetime

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm, function_tool
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import google, silero

# Load environment variables from .env file
load_dotenv()

# --- LIVEKIT CREDENTIALS ---
LIVEKIT_URL = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# --- GOOGLE GEMINI API KEY ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

"""
Global state: track the currently connected customer's identity so function tools
can log help requests against the correct customer identifier used for monitoring.
"""
CURRENT_CUSTOMER_ID: Optional[str] = None


# ----------------------
# Database and Message Helpers
# ----------------------
def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect("project.db", timeout=30.0)
    conn.row_factory = sqlite3.Row
    # Improve concurrency: enable WAL and sane timeouts on every connection
    try:
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        conn.execute("PRAGMA busy_timeout=5000;")  # 5s busy timeout at the SQLite layer
    except Exception:
        # If PRAGMAs fail (older SQLite), continue with defaults
        pass
    return conn


def find_answer_in_kb(question: str) -> Optional[str]:
    """Search knowledge base for an answer to the question."""
    if not question:
        return None
    with get_db_connection() as conn:
        conn.create_function("LOWER", 1, lambda s: s.lower() if isinstance(s, str) else s)
        row = conn.execute(
            "SELECT answer FROM knowledge_base WHERE LOWER(question) LIKE LOWER(?) LIMIT 1",
            (f"%{question}%",),
        ).fetchone()
        return row["answer"] if row else None


def log_help_request(customer_id: str, question: str) -> None:
    """Log a help request when the agent doesn't know the answer."""
    if not question:
        return
    with get_db_connection() as conn:
        conn.execute(
            "INSERT INTO help_requests (customer_identifier, question_text, status) VALUES (?, ?, 'Pending')",
            (customer_id or "UnknownCustomer", question),
        )
        conn.commit()
    print(f"📞 SUPERVISOR ALERT: Need help with: '{question}' from {customer_id}")


# ----------------------
# Heartbeat System
# ----------------------
async def send_heartbeat(customer_id: str) -> None:
    """Send heartbeat every 10 seconds and log user activity."""
    print("💓 Starting heartbeat monitoring...")
    conn = get_db_connection()
    
    # Create user activity session
    conn.execute('''
        INSERT INTO user_activity (customer_id, start_time, last_heartbeat)
        VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ''', (customer_id,))
    session_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
    conn.commit()
    conn.close()
    
    print(f"📊 Started activity tracking for {customer_id}, session: {session_id}")
    
    while True:
        try:
            # Write heartbeat file for agent status
            with open('agent_heartbeat.txt', 'w') as f:
                f.write(datetime.now().isoformat())
            
            # Update database with heartbeat with retry to avoid 'database is locked'
            backoff = 0.2
            for attempt in range(5):
                try:
                    conn = get_db_connection()
                    conn.execute('''
                        UPDATE user_activity 
                        SET last_heartbeat = CURRENT_TIMESTAMP,
                            duration_seconds = (julianday(CURRENT_TIMESTAMP) - julianday(start_time)) * 86400
                        WHERE id = ?
                    ''', (session_id,))
                    conn.commit()
                    conn.close()
                    break
                except sqlite3.OperationalError as oe:
                    if 'locked' in str(oe).lower():
                        await asyncio.sleep(backoff)
                        backoff = min(backoff * 2, 2.0)
                        continue
                    else:
                        raise
                finally:
                    try:
                        conn.close()
                    except Exception:
                        pass
            
            await asyncio.sleep(10)
        except Exception as e:
            print(f"❌ Error in heartbeat: {e}")
            await asyncio.sleep(10)


# ----------------------
# Supervisor Answer Monitoring
# ----------------------
async def check_supervisor_answers(session: AgentSession, customer_id: str) -> None:
    """Monitor for supervisor answers and immediately relay them to the customer via voice."""
    print("🔄 Starting supervisor answer monitoring...")
    
    # Track which requests we've already delivered
    delivered_requests = set()
    
    while True:
        try:
            await asyncio.sleep(3)  # Check every 3 seconds for faster response
            
            # Query database for answered requests for this customer
            conn = get_db_connection()
            answered_requests = conn.execute('''
                SELECT id, question_text, supervisor_answer, resolved_at
                FROM help_requests 
                WHERE customer_identifier = ? 
                                    AND status = 'Resolved' 
                  AND supervisor_answer IS NOT NULL
                  AND supervisor_answer != ''
                ORDER BY resolved_at DESC
            ''', (customer_id,)).fetchall()
            conn.close()
            
            # Check for new answers
            for request in answered_requests:
                request_id = request['id']
                
                # Skip if already delivered
                if request_id in delivered_requests:
                    continue
                
                question = request['question_text']
                answer = request['supervisor_answer']
                
                print(f"📢 New supervisor answer for request #{request_id}!")
                print(f"   Question: {question}")
                print(f"   Answer: {answer}")
                
                # Generate voice response with the supervisor's answer
                response_instruction = (
                    f"Speak this exactly to the customer, with no follow-up question: "
                    f"'Regarding your question about {question}, my supervisor says: {answer}.'"
                )
                
                # Send the answer via voice (guard for disconnect/timeouts)
                try:
                    session.generate_reply(instructions=response_instruction)
                except Exception as speak_err:
                    msg = str(speak_err)
                    print(f"❌ Failed to deliver answer via voice: {msg}")
                    # If session likely closed, stop monitoring to avoid repeated timeouts
                    if 'timed out' in msg.lower() or 'disconnect' in msg.lower() or 'cancelled' in msg.lower():
                        print("🛑 Stopping supervisor monitoring due to inactive session")
                        return
                    # Otherwise continue loop
                    continue
                print(f"✅ Delivered supervisor answer to customer via voice!")
                
                # Mark as delivered
                delivered_requests.add(request_id)
                
                # Optional: Update database to mark as delivered
                backoff = 0.2
                for attempt in range(5):
                    try:
                        conn = get_db_connection()
                        conn.execute('''
                            UPDATE help_requests 
                            SET status = 'Delivered'
                            WHERE id = ?
                        ''', (request_id,))
                        conn.commit()
                        conn.close()
                        break
                    except sqlite3.OperationalError as oe:
                        if 'locked' in str(oe).lower():
                            await asyncio.sleep(backoff)
                            backoff = min(backoff * 2, 2.0)
                            continue
                        else:
                            raise
                    finally:
                        try:
                            conn.close()
                        except Exception:
                            pass
            
        except Exception as e:
            print(f"❌ Error in supervisor monitoring: {e}")
            await asyncio.sleep(5)


# ----------------------
# Custom Function for Knowledge Base Query
# ----------------------
@function_tool
async def search_knowledge_base(question: str) -> str:
    """Search the salon's knowledge base for answers to customer questions.
    
    Args:
        question: The customer's question to search for
        
    Returns:
        The answer from the knowledge base, or a message to escalate
    """
    print(f"🔍 Searching KB for: {question}")
    answer = find_answer_in_kb(question)
    if answer:
        print(f"✅ Found answer in KB: {answer[:50]}...")
        return answer
    else:
        print(f"❌ No answer found, escalating to supervisor")
        return "I couldn't find that information in my knowledge base. Let me ask my supervisor."


@function_tool
async def request_supervisor_help(question: str, customer_name: str, customer_phone: str) -> str:
    """Escalate an appointment booking or complex question to a human supervisor.
    
    ALWAYS use this function when a customer wants to:
    - Book an appointment
    - Check appointment availability
    - Reschedule or cancel appointments
    
    Args:
        question: The customer's request (e.g., "Book appointment for haircut tomorrow at 3pm")
        customer_name: The customer's name
        customer_phone: The customer's phone number
        
    Returns:
        Confirmation message that supervisor will contact them
    """
    print(f"🆘 Escalating to supervisor: {question}")
    print(f"👤 Customer: {customer_name}, Phone: {customer_phone}")
    
    # Log to database with the active session's customer identifier (not the name)
    escalation_message = f"APPOINTMENT REQUEST - Name: {customer_name}, Phone: {customer_phone}, Request: {question}"
    log_help_request(CURRENT_CUSTOMER_ID or customer_name or "UnknownCustomer", escalation_message)

    # Return concise confirmation without asking any further questions
    return (
        f"Thanks {customer_name}. I've sent your request to my supervisor. "
        f"They'll call you at {customer_phone} to confirm your booking."
    )


# ----------------------
# Agent entrypoint
# ----------------------
async def entrypoint(ctx: JobContext):
    """Main agent entry point - handles voice conversations."""
    
    # Verify environment variables
    missing = []
    if not LIVEKIT_URL:
        missing.append("LIVEKIT_URL")
    if not LIVEKIT_API_KEY:
        missing.append("LIVEKIT_API_KEY")
    if not LIVEKIT_API_SECRET:
        missing.append("LIVEKIT_API_SECRET")
    if not GOOGLE_API_KEY:
        missing.append("GOOGLE_API_KEY")
    
    if missing:
        raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")

    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    
    print(f"🎙️  Agent joined room: {ctx.room.name}")
    
    # Get customer identity
    participant = await ctx.wait_for_participant()
    customer_id = participant.identity
    # Store globally for function tools to use when logging escalations
    global CURRENT_CUSTOMER_ID
    CURRENT_CUSTOMER_ID = customer_id
    print(f"👤 Customer connected: {customer_id}")
    
    # Instructions for the AI assistant
    instructions = (
        "You are a friendly and professional front desk assistant for Glamour Salon and Spa. "
        "You help customers with questions about our services. "
        "Our hours are Monday through Friday 9 AM to 6 PM, and Saturday 10 AM to 5 PM. We're closed Sundays. "
        "Our phone number is (555) 123-4567 and we're located at 123 Beauty Street, Downtown. "
        "Services include haircuts ($45), hair coloring ($80), manicures ($30), pedicures ($40), and massages ($90). "
        "Be warm, helpful, and keep responses brief for voice conversation. "
        "\n\n"
        "IMPORTANT RULES:\n"
        "1. You CANNOT book appointments yourself - you don't have access to the appointment system.\n"
        "2. When someone wants to book an appointment, you MUST tell them: "
        "'I need to connect you with my supervisor to check availability and book your appointment. "
        "What's your name and phone number so they can assist you?'\n"
        "3. After collecting their name and number, use the request_supervisor_help() function to escalate.\n"
        "4. Never say you can book directly - always escalate to supervisor for appointments.\n"
        "5. For other questions (services, prices, hours), answer directly without escalation."
    )
    
    print("🤖 Creating voice assistant session...")
    
    # Create the agent with instructions and tools
    agent = Agent(
        instructions=instructions,
        tools=[search_knowledge_base, request_supervisor_help],
    )
    
    # Create the session with Gemini Multimodal Live API
    # This uses your GOOGLE_API_KEY directly and handles voice natively
    session = AgentSession(
        llm=google.realtime.RealtimeModel(
            model="gemini-2.0-flash-exp",
            voice="Puck",  # Available voices: Puck, Charon, Kore, Fenrir, Aoede
        ),
    )
    
    print("🤖 Voice assistant session created with Gemini Multimodal Live API!")
    
    # Start background tasks with customer_id
    heartbeat_task = asyncio.create_task(send_heartbeat(customer_id))
    print(f"💚 Heartbeat started for {customer_id} - Dashboard will show activity!")
    
    supervisor_monitor_task = asyncio.create_task(check_supervisor_answers(session, customer_id))
    print(f"✅ Supervisor answer monitoring started for {customer_id}!")
    
    print("🎉 Starting voice agent session...")
    
    # Start the session - this is the correct way!
    await session.start(agent=agent, room=ctx.room)
    
    print("🎤 Voice agent session started successfully!")
    
    # Greet the customer immediately using generate_reply
    greeting_instruction = (
        "Greet the customer warmly and introduce yourself as the virtual assistant "
        "for Glamour Salon and Spa. Ask how you can help them today. Keep it brief and friendly."
    )
    session.generate_reply(instructions=greeting_instruction)
    print("👋 Greeting customer...")
    
    # The session will run until the room is closed or an error occurs


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
