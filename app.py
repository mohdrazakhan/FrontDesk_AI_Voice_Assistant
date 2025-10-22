
import sqlite3
import logging
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import datetime
from functools import wraps


app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'  # Change this to a random secret key

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
    handlers=[
        logging.FileHandler("app_backend.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("app")

# Supervisor credentials (In production, store hashed passwords in database)
SUPERVISORS = {
    'admin': '12345678',
    'supervisor': 'super123'
}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return jsonify({'error': 'Unauthorized', 'redirect': '/login'}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_db_connection():
    conn = sqlite3.connect('project.db', timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA journal_mode=WAL')  # Write-Ahead Logging for better concurrency
    return conn

# Knowledge Base API
@app.route('/knowledge_base', methods=['GET'])
@login_required
def get_knowledge_base():
    conn = get_db_connection()
    rows = conn.execute('SELECT id, question, answer FROM knowledge_base ORDER BY id DESC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/knowledge_base/add', methods=['POST'])
@login_required
def add_to_knowledge_base():
    """Add a new entry to the knowledge base."""
    try:
        data = request.get_json()
        question = data.get('question')
        answer = data.get('answer')
        
        if not question or not answer:
            return jsonify({'error': 'Question and answer are required'}), 400
        
        conn = get_db_connection()
        conn.execute('INSERT INTO knowledge_base (question, answer) VALUES (?, ?)', (question, answer))
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Added to knowledge base successfully'})
    except Exception as e:
        logger.error(f"Error adding to knowledge base: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/knowledge_base/<int:id>', methods=['PUT'])
@login_required
def update_knowledge_base(id):
    """Update an existing knowledge base entry."""
    try:
        data = request.get_json()
        question = data.get('question')
        answer = data.get('answer')
        
        if not question or not answer:
            return jsonify({'error': 'Question and answer are required'}), 400
        
        conn = get_db_connection()
        conn.execute('UPDATE knowledge_base SET question = ?, answer = ? WHERE id = ?', (question, answer, id))
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Knowledge base entry updated successfully'})
    except Exception as e:
        logger.error(f"Error updating knowledge base: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/knowledge_base/<int:id>', methods=['DELETE'])
@login_required
def delete_knowledge_base(id):
    """Delete a knowledge base entry."""
    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM knowledge_base WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Knowledge base entry deleted successfully'})
    except Exception as e:
        logger.error(f"Error deleting knowledge base: {e}")
        return jsonify({'error': str(e)}), 500


from flask import send_from_directory

# Login routes
@app.route('/')
def root():
    """Redirect to login page or dashboard based on auth state"""
    if 'logged_in' in session:
        return redirect('/dashboard')
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Serve login page on GET and handle authentication on POST"""
    if request.method == 'GET':
        if 'logged_in' in session:
            return redirect('/dashboard')
        return send_from_directory('dashboard', 'login.html')

    # POST: Handle login authentication
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')
    remember = data.get('remember', False)

    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password are required'}), 400

    # Check database for approved supervisors
    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM supervisors WHERE username = ? AND password = ? AND status = 'approved'",
        (username, password)
    ).fetchone()
    conn.close()

    if user:
        session['logged_in'] = True
        session['username'] = username
        session['user_role'] = user['role']
        if remember:
            session.permanent = True
        
        # Log session start
        if user:
            session['logged_in'] = True
            session['username'] = username
            session['user_role'] = user['role']
            if remember:
                session.permanent = True

            # Log session start
            try:
                conn = get_db_connection()
                ip_address = request.remote_addr
                user_agent = request.headers.get('User-Agent', '')
                login_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                # Log to session_logs
                cursor = conn.execute(
                    'INSERT INTO session_logs (username, login_time, ip_address, user_agent) VALUES (?, ?, ?, ?)',
                    (username, login_time, ip_address, user_agent)
                )
                # Log to user_activity for dashboard chart (supervisor activity)
                conn.execute(
                    'INSERT INTO user_activity (customer_id, start_time, last_heartbeat, duration_seconds, status) VALUES (?, ?, ?, 0, ?)',
                    (username, login_time, login_time, 'active')
                )
                conn.commit()
                conn.close()
            except Exception as e:
                logger.error(f"Error logging session: {e}")
            return jsonify({'success': True, 'message': 'Login successful'})
    
    return jsonify({'success': False, 'message': 'Invalid username or password'}), 401

@app.route('/logout')
def logout():
    """Handle logout - clear session and redirect to login"""
    session.clear()
    return redirect('/login')

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Handle forgot password request"""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    
    if not username or not email:
        return jsonify({'error': 'Username and email are required'}), 400
    
    conn = get_db_connection()
    
    # Check if user exists with matching username and email
    user = conn.execute(
        "SELECT * FROM supervisors WHERE username = ? AND email = ? AND status = 'approved'",
        (username, email)
    ).fetchone()
    
    if user:
        # In production, you would:
        # 1. Generate a secure reset token
        # 2. Store it in database with expiration
        # 3. Send email with reset link
        # For now, we'll just return the current password (NOT SECURE - only for demo)
        
        conn.close()
        return jsonify({
            'success': True, 
            'message': f'Password reset link sent to {email}. For demo: Your password is "{user["password"]}"'
        })
    else:
        conn.close()
        return jsonify({'error': 'No account found with that username and email combination'}), 404

@app.route('/check-auth')
def check_auth():
    """Check if user is authenticated"""
    if 'logged_in' in session:
        return jsonify({
            'authenticated': True, 
            'username': session.get('username'),
            'role': session.get('user_role', 'supervisor')
        })
    return jsonify({'authenticated': False}), 401

# Registration routes
@app.route('/register-page')
def register_page():
    """Serve registration page"""
    return send_from_directory('dashboard', 'register.html')

@app.route('/register', methods=['POST'])
def register():
    """Handle user registration"""
    data = request.get_json()
    full_name = data.get('fullName')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    # Validate required fields
    if not all([full_name, email, username, password]):
        return jsonify({'error': 'All fields are required'}), 400
    
    conn = get_db_connection()
    
    # Check if username or email already exists in supervisors or registration_requests
    existing_user = conn.execute(
        "SELECT username FROM supervisors WHERE username = ? OR email = ?",
        (username, email)
    ).fetchone()
    
    existing_request = conn.execute(
        "SELECT username FROM registration_requests WHERE username = ? OR email = ?",
        (username, email)
    ).fetchone()
    
    if existing_user or existing_request:
        conn.close()
        return jsonify({'error': 'Username or email already exists'}), 400
    
    # Insert registration request
    try:
        conn.execute(
            '''INSERT INTO registration_requests 
               (username, password, email, full_name, status, created_at)
               VALUES (?, ?, ?, ?, 'pending', ?)''',
            (username, password, email, full_name, datetime.datetime.now())
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Registration submitted successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/pending-registrations', methods=['GET'])
@login_required
def get_pending_registrations():
    """Get all pending registration requests (Admin only)"""
    # Check if user is admin
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    registrations = conn.execute(
        "SELECT * FROM registration_requests WHERE status = 'pending' ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    
    return jsonify([dict(reg) for reg in registrations])

@app.route('/approve-registration/<int:registration_id>', methods=['POST'])
@login_required
def approve_registration(registration_id):
    """Approve a registration request (Admin only)"""
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    
    # Get registration request
    registration = conn.execute(
        "SELECT * FROM registration_requests WHERE id = ?",
        (registration_id,)
    ).fetchone()
    
    if not registration:
        conn.close()
        return jsonify({'error': 'Registration not found'}), 404
    
    try:
        # Move to supervisors table
        conn.execute(
            '''INSERT INTO supervisors 
               (username, password, email, full_name, role, status, approved_by, approved_at)
               VALUES (?, ?, ?, ?, 'supervisor', 'approved', ?, ?)''',
            (registration['username'], registration['password'], registration['email'],
             registration['full_name'], session.get('username'), datetime.datetime.now())
        )
        
        # Update registration request status
        conn.execute(
            '''UPDATE registration_requests 
               SET status = 'approved', reviewed_by = ?, reviewed_at = ?
               WHERE id = ?''',
            (session.get('username'), datetime.datetime.now(), registration_id)
        )
        
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Registration approved'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/reject-registration/<int:registration_id>', methods=['POST'])
@login_required
def reject_registration(registration_id):
    """Reject a registration request (Admin only)"""
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    reason = data.get('reason', 'No reason provided')
    
    conn = get_db_connection()
    
    try:
        conn.execute(
            '''UPDATE registration_requests 
               SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, rejection_reason = ?
               WHERE id = ?''',
            (session.get('username'), datetime.datetime.now(), reason, registration_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Registration rejected'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

# Supervisor Management Endpoints
@app.route('/supervisors', methods=['GET'])
@login_required
def get_supervisors():
    """Get all supervisors with filtering (Admin only)"""
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    status_filter = request.args.get('status', 'approved')  # approved, pending, rejected
    
    conn = get_db_connection()
    supervisors = conn.execute(
        'SELECT * FROM supervisors WHERE status = ? ORDER BY created_at DESC',
        (status_filter,)
    ).fetchall()
    conn.close()
    
    return jsonify([dict(supervisor) for supervisor in supervisors])

@app.route('/supervisors', methods=['POST'])
@login_required
def add_supervisor():
    """Add a new supervisor (Admin only)"""
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    full_name = data.get('full_name')
    role = data.get('role', 'supervisor')
    
    if not all([username, password, email, full_name]):
        return jsonify({'error': 'All fields are required'}), 400
    
    conn = get_db_connection()
    
    try:
        # Check if username or email already exists
        existing = conn.execute(
            'SELECT * FROM supervisors WHERE username = ? OR email = ?',
            (username, email)
        ).fetchone()
        
        if existing:
            conn.close()
            return jsonify({'error': 'Username or email already exists'}), 400
        
        # Insert new supervisor with approved status (admin adding directly)
        conn.execute(
            '''INSERT INTO supervisors 
               (username, password, email, full_name, role, status, approved_by, approved_at)
               VALUES (?, ?, ?, ?, ?, 'approved', ?, ?)''',
            (username, password, email, full_name, role, session.get('username'), datetime.datetime.now())
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Supervisor added successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/supervisors/<int:supervisor_id>', methods=['DELETE'])
@login_required
def remove_supervisor(supervisor_id):
    """Remove a supervisor (Admin only)"""
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    
    try:
        # Get supervisor details
        supervisor = conn.execute('SELECT * FROM supervisors WHERE id = ?', (supervisor_id,)).fetchone()
        
        if not supervisor:
            conn.close()
            return jsonify({'error': 'Supervisor not found'}), 404
        
        # Prevent removal of protected 'admin' username
        if supervisor['username'] == 'admin':
            conn.close()
            return jsonify({'error': 'Cannot remove the protected system administrator account'}), 400
        
        # Prevent self-deletion
        if supervisor['username'] == session.get('username'):
            conn.close()
            return jsonify({'error': 'Cannot remove your own account'}), 400
        
        # Delete the supervisor
        conn.execute('DELETE FROM supervisors WHERE id = ?', (supervisor_id,))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Supervisor removed successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/supervisors/<int:supervisor_id>/approve', methods=['POST'])
@login_required
def approve_supervisor(supervisor_id):
    """Approve a pending supervisor (Admin only)"""
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    conn = get_db_connection()
    
    try:
        conn.execute(
            '''UPDATE supervisors 
               SET status = 'approved', approved_by = ?, approved_at = ?
               WHERE id = ?''',
            (session.get('username'), datetime.datetime.now(), supervisor_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Supervisor approved successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/supervisors/<int:supervisor_id>/reject', methods=['POST'])
@login_required
def reject_supervisor(supervisor_id):
    """Reject a pending supervisor (Admin only)"""
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    reason = data.get('reason', 'No reason provided')
    
    conn = get_db_connection()
    
    try:
        conn.execute(
            '''UPDATE supervisors 
               SET status = 'rejected', rejected_by = ?, rejected_at = ?, rejection_reason = ?
               WHERE id = ?''',
            (session.get('username'), datetime.datetime.now(), reason, supervisor_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Supervisor rejected'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/supervisors/<int:supervisor_id>/role', methods=['PUT'])
@login_required
def update_supervisor_role(supervisor_id):
    """Update a supervisor's role (Admin only)"""
    if session.get('user_role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    new_role = data.get('role')
    
    if new_role not in ['admin', 'supervisor']:
        return jsonify({'error': 'Invalid role'}), 400
    
    conn = get_db_connection()
    
    try:
        # Get supervisor details
        supervisor = conn.execute('SELECT * FROM supervisors WHERE id = ?', (supervisor_id,)).fetchone()
        
        if not supervisor:
            conn.close()
            return jsonify({'error': 'Supervisor not found'}), 404
        
        # Prevent changing role of protected 'admin' username
        if supervisor['username'] == 'admin':
            conn.close()
            return jsonify({'error': 'Cannot change the role of the protected system administrator'}), 400
        
        # Prevent changing your own role
        if supervisor['username'] == session.get('username'):
            conn.close()
            return jsonify({'error': 'Cannot change your own role'}), 400
        
        # Update the role
        conn.execute(
            'UPDATE supervisors SET role = ? WHERE id = ?',
            (new_role, supervisor_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Role updated successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

# Settings Endpoints
@app.route('/settings/profile', methods=['GET'])
@login_required
def get_profile():
    """Get current user's profile information"""
    conn = get_db_connection()
    user = conn.execute(
        'SELECT username, email, full_name, bio, profile_pic, role, created_at FROM supervisors WHERE username = ?',
        (session.get('username'),)
    ).fetchone()
    conn.close()
    
    if user:
        return jsonify(dict(user))
    return jsonify({'error': 'User not found'}), 404

@app.route('/settings/profile', methods=['PUT'])
@login_required
def update_profile():
    """Update current user's profile information"""
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    bio = data.get('bio', '')
    
    if not full_name or not email:
        return jsonify({'error': 'Full name and email are required'}), 400
    
    conn = get_db_connection()
    
    try:
        # Check if email is already used by another user
        existing = conn.execute(
            'SELECT * FROM supervisors WHERE email = ? AND username != ?',
            (email, session.get('username'))
        ).fetchone()
        
        if existing:
            conn.close()
            return jsonify({'error': 'Email already in use'}), 400
        
        # Update profile
        conn.execute(
            'UPDATE supervisors SET full_name = ?, email = ?, bio = ? WHERE username = ?',
            (full_name, email, bio, session.get('username'))
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Profile updated successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/settings/password', methods=['PUT'])
@login_required
def change_password():
    """Change current user's password"""
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Current and new password are required'}), 400
    
    if len(new_password) < 8:
        return jsonify({'error': 'New password must be at least 8 characters'}), 400
    
    conn = get_db_connection()
    
    try:
        # Verify current password
        user = conn.execute(
            'SELECT * FROM supervisors WHERE username = ? AND password = ?',
            (session.get('username'), current_password)
        ).fetchone()
        
        if not user:
            conn.close()
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Update password
        conn.execute(
            'UPDATE supervisors SET password = ? WHERE username = ?',
            (new_password, session.get('username'))
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Password changed successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/settings/profile-pic', methods=['POST'])
@login_required
def upload_profile_pic():
    """Upload profile picture (base64)"""
    data = request.get_json()
    profile_pic = data.get('profile_pic')
    
    if not profile_pic:
        return jsonify({'error': 'Profile picture data is required'}), 400
    
    conn = get_db_connection()
    
    try:
        conn.execute(
            'UPDATE supervisors SET profile_pic = ? WHERE username = ?',
            (profile_pic, session.get('username'))
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Profile picture updated successfully'})
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

# Serve dashboard at /dashboard URL
@app.route('/dashboard')
@login_required
def dashboard():
    """Serves the dashboard SPA HTML file as static."""
    return send_from_directory('dashboard', 'index.html')

# Serve static assets (CSS/JS) from dashboard/static
@app.route('/dashboard/static/<path:filename>')
def static_files(filename):
    return send_from_directory('dashboard/static', filename)

# Serve images from dashboard/images
@app.route('/dashboard/images/<path:filename>')
def image_files(filename):
    return send_from_directory('dashboard/images', filename)

@app.route('/requests', methods=['GET'])
@login_required
def get_all_requests():
    """API endpoint to get all help requests (pending, resolved, unresolved)."""
    conn = get_db_connection()
    requests = conn.execute("SELECT * FROM help_requests ORDER BY created_at DESC").fetchall()
    conn.close()
    # Convert the database rows to a list of dictionaries to send as JSON
    return jsonify([dict(ix) for ix in requests])

@app.route('/requests/<int:request_id>/respond', methods=['POST'])
@login_required
def respond_to_request(request_id):
    """API endpoint for a supervisor to submit an answer."""
    data = request.get_json()
    supervisor_answer = data['answer']
    
    # Get the logged-in supervisor's username
    supervisor_username = session.get('username', 'Unknown')

    conn = get_db_connection()
    try:
        # First, get the request details before updating it
        request_info = conn.execute("SELECT * FROM help_requests WHERE id = ?", (request_id,)).fetchone()
        
        if not request_info:
            return jsonify({'error': 'Request not found'}), 404
        
        # --- This is the "Close the Loop" Logic ---
        # 1. Update the original request with supervisor info
        conn.execute(
            "UPDATE help_requests SET status = 'Resolved', supervisor_answer = ?, resolved_at = ?, resolved_by = ? WHERE id = ?",
            (supervisor_answer, datetime.datetime.now(), supervisor_username, request_id)
        )

        # 2. Update the AI's knowledge base with the new information
        original_question = request_info['question_text']
        try:
            conn.execute("INSERT INTO knowledge_base (question, answer) VALUES (?, ?)", (original_question, supervisor_answer))
            logger.info(f"KNOWLEDGE BASE UPDATED: '{original_question}' -> '{supervisor_answer}'")
        except sqlite3.IntegrityError:
            logger.info(f"KNOWLEDGE BASE INFO: Question '{original_question}' already exists.")

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

    # 3. Simulate texting back the original caller
    customer_id = request_info['customer_identifier']
    logger.info("-" * 50)
    logger.info(f"SIMULATING TEXT TO CUSTOMER: {customer_id}")
    logger.info(f"MESSAGE: Regarding your question '{original_question}', the answer is: '{supervisor_answer}'")
    logger.info(f"RESOLVED BY: {supervisor_username}")
    logger.info("-" * 50)
    # 4. Notify that answer is ready for agent to send to customer
    logger.info("🔔 Answer is now available for the agent to send to customer!")

    return jsonify({'status': 'success'})

@app.route('/api/pending-notifications', methods=['GET'])
@login_required
def get_pending_notifications():
    """Get count and list of help requests that have been resolved by supervisors but not yet delivered to customers."""
    try:
        conn = get_db_connection()
        # Consider entries marked as 'Resolved' and not yet marked as 'Delivered'
        rows = conn.execute(
            """
            SELECT id, customer_identifier, question_text, supervisor_answer, resolved_at
            FROM help_requests
            WHERE status = 'Resolved'
            ORDER BY resolved_at DESC
            """
        ).fetchall()
        conn.close()

        notifications = [
            {
                'id': r['id'],
                'customer_identifier': r['customer_identifier'],
                'question_text': r['question_text'],
                'supervisor_answer': r['supervisor_answer'],
                'resolved_at': r['resolved_at']
            }
            for r in rows
        ]

        return jsonify({
            'count': len(notifications),
            'notifications': notifications
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/agent-status', methods=['GET'])
@login_required
def get_agent_status():
    """Check if agent is connected and active"""
    try:
        import os
        from datetime import datetime, timedelta
        
        # Check if agent heartbeat file exists and is recent
        heartbeat_file = 'agent_heartbeat.txt'
        
        if os.path.exists(heartbeat_file):
            # Read the last heartbeat timestamp
            with open(heartbeat_file, 'r') as f:
                last_heartbeat = f.read().strip()
            
            try:
                last_time = datetime.fromisoformat(last_heartbeat)
                current_time = datetime.now()
                time_diff = (current_time - last_time).total_seconds()
                
                # If heartbeat is within last 15 seconds, agent is connected
                is_connected = time_diff < 15
                
                return jsonify({
                    'connected': is_connected,
                    'last_heartbeat': last_heartbeat,
                    'seconds_ago': int(time_diff)
                })
            except ValueError:
                return jsonify({'connected': False, 'error': 'Invalid heartbeat format'})
        else:
            return jsonify({'connected': False, 'error': 'No heartbeat file found'})
            
    except Exception as e:
        return jsonify({'connected': False, 'error': str(e)})

@app.route('/api/agent-heartbeat', methods=['POST'])
def agent_heartbeat():
    """Endpoint for agent to send heartbeat signals"""
    try:
        from datetime import datetime
        
        # Write current timestamp to heartbeat file
        with open('agent_heartbeat.txt', 'w') as f:
            f.write(datetime.now().isoformat())
        
        return jsonify({'status': 'ok'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/requests/<int:request_id>/delete', methods=['DELETE'])
@login_required
def delete_request(request_id):
    """API endpoint to delete a help request."""
    try:
        conn = get_db_connection()
        result = conn.execute("DELETE FROM help_requests WHERE id = ?", (request_id,))
        conn.commit()
        conn.close()
        logger.info(f"Request ID {request_id} deleted successfully.")
        return jsonify({'status': 'success'})
    except Exception as e:
        logger.error(f"Error deleting request ID {request_id}: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/session-logs')
@login_required
def get_session_logs():
    """Get all session logs for the logged-in user"""
    try:
        username = session.get('username')
        conn = get_db_connection()
        
        # Get all session logs for this user, ordered by login time descending
        logs = conn.execute('''
            SELECT id, login_time, logout_time, session_duration, ip_address 
            FROM session_logs 
            WHERE username = ? 
            ORDER BY login_time DESC
        ''', (username,)).fetchall()
        
        conn.close()
        
        # Convert to list of dicts
        session_logs = []
        for log in logs:
            session_logs.append({
                'id': log['id'],
                'login_time': log['login_time'],
                'logout_time': log['logout_time'],
                'duration': log['session_duration'],
                'ip_address': log['ip_address'],
                'status': 'Active' if log['logout_time'] is None else 'Ended'
            })
        
        return jsonify(session_logs)
    except Exception as e:
        logger.error(f"Error fetching session logs: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/user-activity')
@login_required
def get_user_activity():
    """Get voice customer activity logs for dashboard chart"""
    try:
        conn = get_db_connection()
        
        # Get all active and recent user activity (last 24 hours)
        activities = conn.execute('''
            SELECT 
                customer_id,
                start_time,
                last_heartbeat,
                CASE 
                    WHEN status = 'active' THEN 
                        ABS(ROUND((julianday('now') - julianday(start_time)) * 1440.0, 2))
                    ELSE 
                        ABS(ROUND(duration_seconds / 60.0, 2))
                END as duration_minutes,
                status
            FROM user_activity 
            WHERE datetime(start_time) >= datetime('now', '-24 hours')
            ORDER BY start_time DESC
            LIMIT 50
        ''').fetchall()
        
        conn.close()
        
        # Convert to list of dicts
        activity_logs = []
        for activity in activities:
            activity_logs.append({
                'username': activity['customer_id'],  # Use customer_id as username for chart
                'login_time': activity['start_time'],
                'logout_time': activity['last_heartbeat'] if activity['status'] == 'ended' else None,
                'duration_minutes': activity['duration_minutes'],
                'status': activity['status']
            })
        
        return jsonify(activity_logs)
    except Exception as e:
        print(f"Error fetching user activity: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/bookmarks', methods=['GET'])
@login_required
def get_bookmarks():
    """Get all bookmarks with request details and supervisor info"""
    try:
        conn = get_db_connection()
        bookmarks = conn.execute('''
            SELECT 
                b.id as bookmark_id,
                b.request_id,
                b.bookmarked_by,
                b.bookmarked_at,
                h.customer_identifier,
                h.question_text,
                h.status,
                s.full_name as supervisor_name
            FROM bookmarks b
            JOIN help_requests h ON b.request_id = h.id
            JOIN supervisors s ON b.bookmarked_by = s.username
            ORDER BY b.bookmarked_at DESC
        ''').fetchall()
        conn.close()
        
        result = []
        for bookmark in bookmarks:
            result.append({
                'id': bookmark['bookmark_id'],
                'requestId': bookmark['request_id'],
                'question': bookmark['question_text'],
                'customer': bookmark['customer_identifier'],
                'bookmarkedBy': bookmark['supervisor_name'],
                'bookmarkedByUsername': bookmark['bookmarked_by'],
                'bookmarkedAt': bookmark['bookmarked_at'],
                'status': bookmark['status']
            })
        
        return jsonify(result)
    except Exception as e:
        print(f"Error fetching bookmarks: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/bookmarks/add', methods=['POST'])
@login_required
def add_bookmark():
    """Add a bookmark for a request"""
    data = request.get_json()
    request_id = data.get('request_id')
    
    if not request_id:
        return jsonify({'error': 'Request ID is required'}), 400
    
    try:
        conn = get_db_connection()
        username = session.get('username')
        
        # Check if already bookmarked
        existing = conn.execute(
            'SELECT id FROM bookmarks WHERE request_id = ? AND bookmarked_by = ?',
            (request_id, username)
        ).fetchone()
        
        if existing:
            conn.close()
            return jsonify({'error': 'Already bookmarked'}), 400
        
        # Add bookmark
        conn.execute(
            'INSERT INTO bookmarks (request_id, bookmarked_by) VALUES (?, ?)',
            (request_id, username)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Bookmark added successfully'})
    except Exception as e:
        print(f"Error adding bookmark: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/bookmarks/<int:request_id>', methods=['DELETE'])
@login_required
def remove_bookmark(request_id):
    """Remove a bookmark"""
    try:
        conn = get_db_connection()
        username = session.get('username')
        
        conn.execute(
            'DELETE FROM bookmarks WHERE request_id = ? AND bookmarked_by = ?',
            (request_id, username)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Bookmark removed successfully'})
    except Exception as e:
        print(f"Error removing bookmark: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/bookmarks/check/<int:request_id>', methods=['GET'])
@login_required
def check_bookmark(request_id):
    """Check if a request is bookmarked by current user"""
    try:
        conn = get_db_connection()
        username = session.get('username')
        
        bookmark = conn.execute(
            'SELECT id FROM bookmarks WHERE request_id = ? AND bookmarked_by = ?',
            (request_id, username)
        ).fetchone()
        conn.close()
        
        return jsonify({'bookmarked': bookmark is not None})
    except Exception as e:
        print(f"Error checking bookmark: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/login-history')
@login_required
def login_history_page():
    """Serve login history page"""
    return send_from_directory('dashboard', 'login-history.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)