# 🎙️ FrontDesk AI Voice Assistant# FrontDesk AI Voice Assistant# 🎙️ FrontDesk AI Voice Assistant# 🎙️ FrontDesk AI Voice Assistant# 🎙️ FrontDesk AI Voice Assistant# FrontDesk AI Agent Project



<div align="center">



![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)A production-ready, voice-native front desk agent built with LiveKit and Google Gemini. When the AI can't confidently answer, it escalates to a human supervisor via a web dashboard and relays the supervisor's answer back to the caller in real time.

[![Python](https://img.shields.io/badge/python-3.13+-green.svg)](https://www.python.org/)

[![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)](https://flask.palletsprojects.com/)

[![LiveKit](https://img.shields.io/badge/LiveKit-Voice%20Agent-orange.svg)](https://livekit.io/)

[![Gemini](https://img.shields.io/badge/Google-Gemini%202.0-4285F4.svg)](https://ai.google.dev/)

[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)- Voice-only agent using Gemini Multimodal Live API

- Automatic greeting on connect

An intelligent AI-powered front desk assistant that handles customer inquiries through voice interactions. When the AI encounters questions it cannot answer confidently, it seamlessly escalates to human supervisors through a modern web dashboard.- Mandatory supervisor escalation for appointments

- Real-time supervisor answer delivery (≈3s)

[Features](#-features) • [Quick Start](#-quick-start) • [Dashboard](#-supervisor-dashboard) • [API Reference](#-api-endpoints)- Supervisor dashboard with analytics and knowledge base

- **Browser notifications for new escalations** (supervisors get instant browser alerts)

</div>- **Database normalization script** (`scripts/normalize_status.py`) to update legacy status values

- **Improved dashboard error handling** (user-friendly toasts for failed API calls)

---- **Comprehensive backend logging** (all errors and key events logged to file)



## 📋 Table of Contents



- [Overview](#-overview)## Quick Start

- [Key Features](#-key-features)

- [Technology Stack](#-technology-stack)

- [Prerequisites](#-prerequisites)

- [Installation & Setup](#-installation--setup)1) Setup environment[![Python](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/)

- [Running the Application](#-running-the-application)

- [Supervisor Dashboard](#-supervisor-dashboard)```bash

- [Features & Functionality](#-features--functionality)

- [Project Structure](#-project-structure)python3 -m venv venv[![LiveKit](https://img.shields.io/badge/LiveKit-Voice%20Agents-orange.svg)](https://livekit.io/)

- [API Endpoints](#-api-endpoints)

- [Configuration](#-configuration)source venv/bin/activate

- [Troubleshooting](#-troubleshooting)

pip install -r requirements.txt[![Gemini](https://img.shields.io/badge/Google-Gemini%202.0-4285F4.svg)](https://ai.google.dev/)![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)<div align="center">This project implements an AI-powered front desk agent using LiveKit that can answer customer questions. When the AI doesn't know an answer, it escalates to a human supervisor through a modern, professional web dashboard.

---

cp .env.example .env

## 🌟 Overview

```[![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)](https://flask.palletsprojects.com/)

FrontDesk AI Voice Assistant is a production-ready voice agent that serves as an intelligent receptionist for businesses. Built with LiveKit Agents and Google's Gemini Multimodal Live API, it can handle customer inquiries, book appointments, and answer common questions - all through natural voice conversations.

Edit `.env` with your keys:

When the AI doesn't know the answer or needs human verification (like appointment bookings), it automatically escalates to supervisors who can respond through a real-time web dashboard. The supervisor's answer is then relayed back to the customer within seconds.

```[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)![Python](https://img.shields.io/badge/python-3.13+-green.svg)

---

LIVEKIT_URL=wss://<your>.livekit.cloud

## ✨ Key Features

LIVEKIT_API_KEY=...

### 🤖 AI Voice Agent

- **Natural Voice Interactions** - Powered by Google Gemini 2.0 Multimodal Live APILIVEKIT_API_SECRET=...

- **Real-time Conversations** - Low-latency voice processing through LiveKit

- **Smart Knowledge Base** - Learns from previous interactions and supervisor answersGOOGLE_API_KEY=...[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Dashboard](#-supervisor-dashboard) • [API](#-api-reference)![LiveKit](https://img.shields.io/badge/LiveKit-Voice%20Agent-orange.svg)

- **Auto-Escalation** - Automatically routes complex queries to human supervisors

- **Mandatory Escalation** - Appointment requests always require supervisor approvalFLASK_SECRET_KEY=change-me



### 👥 Supervisor Dashboard```

- **Modern, Responsive UI** - Clean, professional interface accessible on all devices

- **Real-time Request Monitoring** - Live updates for new escalated questions

- **Browser Notifications** - Instant alerts for new customer requests

- **Knowledge Base Management** - Add, edit, and delete Q&A entries2) Initialize database</div>![Google Gemini](https://img.shields.io/badge/Google-Gemini%202.0-4285F4.svg)

- **User Management** - Admin can approve/reject supervisor registration requests

- **Analytics & Reporting** - Track resolution rates, active time, and performance metrics```bash

- **Role-based Access Control** - Separate admin and supervisor permissions

python database.py

### 📊 Analytics & Insights

- **Question Status Tracking** - Visual charts for solved vs. unresolved queries```

- **User Activity Logs** - Monitor supervisor active time and engagement

- **Performance Metrics** - Dashboard stats including total, pending, and personal solved counts---![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)## ✨ Features

- **Recent Questions Display** - Quick access to latest escalations

3) Run

### 🔐 Security & Authentication

- **Secure Login System** - Session-based authentication- Voice agent

- **Password Protection** - Hashed password storage

- **User Registration Workflow** - Admin approval required for new supervisors```bash

- **Protected Routes** - Login required for dashboard access

- **Admin-only Features** - Supervisor management restricted to adminspython agent_voice.py start## 🌟 Overview



---```



## 🛠️ Technology Stack- Dashboard



### Backend```bash

- **Python 3.13+** - Core programming language

- **Flask 3.0+** - Web framework for dashboard and APIpython app.py**FrontDesk AI Voice Assistant** is an enterprise-grade voice AI system that handles customer inquiries through natural conversation. Built on **LiveKit's real-time communication platform** and powered by **Google Gemini 2.0 Flash Multimodal Live API**, it seamlessly escalates complex questions to human supervisors.**An intelligent voice assistant powered by Google Gemini AI with real-time supervisor escalation**![Python](https://img.shields.io/badge/python-3.13+-green.svg)

- **SQLite** - Lightweight database for storing requests, users, and knowledge base

- **LiveKit Agents** - Voice agent framework```

- **Google Gemini 2.0** - Multimodal AI for natural language processing

Dashboard: http://localhost:5000 (default admin: admin / admin123)

### Frontend

- **Vanilla JavaScript** - No heavy frameworks, fast and lightweightUse LiveKit Agents Playground to connect to the voice agent.

- **Chart.js** - Interactive data visualizations

- **Modern CSS** - Responsive design with custom animations### Why This Project?

- **HTML5** - Semantic markup



### Infrastructure## Quick Start

- **LiveKit Cloud** - Voice streaming and agent hosting

- **WebSockets** - Real-time communication1) Setup environment

- **RESTful API** - Clean, documented endpoints

```bash

---python3 -m venv venv

source venv/bin/activate

## 📋 Prerequisitespip install -r requirements.txt

cp .env.example .env

Before you begin, ensure you have the following installed:```



- **Python 3.13 or higher** - [Download Python](https://www.python.org/downloads/)Edit `.env` with your keys:

- **pip** - Python package installer (included with Python)

- **Git** - Version control system```env

- **LiveKit Account** - [Sign up at LiveKit](https://livekit.io/)LIVEKIT_URL=wss://<your>.livekit.cloud

- **Google AI Account** - [Get Gemini API Key](https://ai.google.dev/)LIVEKIT_API_KEY=...

LIVEKIT_API_SECRET=...

---GOOGLE_API_KEY=...

FLASK_SECRET_KEY=change-me

## 🚀 Installation & Setup```



### 1. Clone the Repository2) Initialize database



```bash```bash

git clone https://github.com/mohdrazakhan/FrontDesk_AI_Voice_Assistant.gitpython database.py

cd FrontDesk_AI_Voice_Assistant/frontdesk_project```

```

3) (Optional) Normalize legacy status values in help_requests (if upgrading from older version):

### 2. Create Virtual Environment

```bash

```bashpython scripts/normalize_status.py

# Create virtual environment```

python3 -m venv venv

4) Run the voice agent and dashboard:

# Activate virtual environment

# On macOS/Linux:```bash

source venv/bin/activate# Start the voice agent

python agent_voice.py start

# On Windows:# Start the dashboard

venv\Scripts\activatepython app.py

``````



### 3. Install DependenciesDashboard: http://localhost:5000 (default admin: admin / admin123)



```bash```

pip install -r requirements.txt

```- No voice/answer: verify `.env` keys, LiveKit URL, and that `agent_voice.py` and `app.py` are running## ✨ Features



### 4. Configure Environment Variables



Create a `.env` file in the project root:## License---![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)- **Human-in-the-Loop**: Escalates unknown questions to supervisors



```bashMIT

cp .env.example .env### 🎯 Voice Intelligence

```

- **Natural Conversations** - Customers speak, AI responds with human-like voice

Edit `.env` with your credentials:

- **Automatic Greeting** - Agent introduces itself immediately when customer connects

```env

# LiveKit Configuration- **Knowledge Base Search** - Searches internal documentation to answer questions## 🌟 Overview- **Learning System**: Updates knowledge base with supervisor answers

LIVEKIT_URL=wss://your-project.livekit.cloud

LIVEKIT_API_KEY=your_livekit_api_key- **Smart Escalation** - Automatically routes complex questions to supervisors

LIVEKIT_API_SECRET=your_livekit_api_secret

- **Appointment Handling** - Always escalates appointment bookings to human verification

# Google AI Configuration

GOOGLE_API_KEY=your_google_gemini_api_key



# Flask Configuration### 🔄 Real-Time Supervisor Integration**FrontDesk AI Voice Assistant** is a production-ready, enterprise-grade voice AI system that handles customer inquiries through natural conversation. Built on LiveKit's real-time communication platform and powered by Google Gemini 2.0 Flash with Multimodal Live API.**An intelligent voice assistant powered by Google Gemini AI with real-time supervisor escalation**- **Close the Loop**: Automatically notifies customers when supervisors provide answers

FLASK_SECRET_KEY=your_random_secret_key_here

- **3-Second Delivery** - Supervisor answers delivered to customers via voice within 3 seconds

# Database (optional - defaults to SQLite)

DATABASE_PATH=database.db- **Background Monitoring** - Agent continuously checks for new supervisor responses

```

- **Natural Flow** - Seamlessly transitions between AI and human responses

### 5. Initialize Database

- **Status Tracking** - Prevents duplicate answers with database state management### Key Capabilities

The database will be automatically created when you first run the application. It includes tables for:

- `supervisors` - User accounts

- `help_requests` - Escalated questions

- `knowledge_base` - Q&A repository### 📊 Supervisor Dashboard

- `user_activity` - Session logs

- `session_logs` - Voice agent sessions- **Modern UI** - Clean, responsive interface built with Bootstrap 5

- `registration_requests` - Pending supervisor approvals

- **Real-Time Updates** - Live charts showing customer activity and question volumes- 🎯 **Natural Voice Conversations** - Customers speak naturally, AI responds with human-like voice[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Usage](#-usage) • [API Reference](#-api-reference)### Modern Dashboard

### 6. Create Admin Account

- **Knowledge Management** - Add, edit, and delete knowledge base entries

On first run, use the default credentials to log in:

- **Request Queue** - View and respond to escalated customer questions- 🔄 **Real-Time Supervisor Escalation** - Complex questions automatically routed to human supervisors

**Default Admin:**

- Username: `admin`- **Activity Analytics** - Track customer session durations and engagement

- Password: `admin123`

- **User Management** - Role-based access (Admin/Supervisor)- ⚡ **Instant Answer Delivery** - Supervisor responses delivered to customers within 3 seconds- **Smart Active Timer**: Tracks only active session time (pauses on tab switch)

**Default Supervisor:**

- Username: `supervisor`

- Password: `super123`

### 🛡️ Security & Reliability- 📊 **Analytics Dashboard** - Track customer activity, questions, and performance metrics

⚠️ **Important:** Change these default passwords immediately after first login through the Settings page.

- **Authentication** - Login system with password hashing

---

- **Role-Based Access** - Separate permissions for admins and supervisors- 🧠 **Knowledge Base Integration** - AI learns from supervisor answers for future conversations</div>- **Supervisor-Specific Stats**: Shows your solved questions count

## 🏃 Running the Application

- **Session Management** - Secure Flask sessions with persistent login

### Start the Flask Dashboard

- **Error Handling** - Graceful degradation and comprehensive logging- 📱 **Enterprise-Ready** - Built with production best practices and scalability

```bash

# Make sure virtual environment is activated- **Database Integrity** - SQLite with foreign keys and transaction management

source venv/bin/activate  # or venv\Scripts\activate on Windows

- **Pending Questions Chart**: Visual representation with Chart.js

# Run the Flask application

python app.py---

```

---

The dashboard will be available at: **http://127.0.0.1:5001**

## 🚀 Quick Start

### Start the Voice Agent

---- **Recent Questions Grid**: Animated tiles with click-to-view

In a separate terminal:

### Prerequisites

```bash

# Activate virtual environment## ✨ Features

source venv/bin/activate

- **Python 3.13+** (or 3.10+)

# Run the LiveKit agent

python agent.py dev- **LiveKit Cloud Account** (free tier available at [livekit.io](https://livekit.io))- **Professional Design**: Modern cards, smooth animations, company branding

```

- **Google Gemini API Key** (get from [Google AI Studio](https://aistudio.google.com/apikey))

The agent will connect to LiveKit and be ready to handle voice calls.

### 🎙️ Voice Agent Capabilities

### Access the Dashboard

### Installation

1. Open your browser and navigate to `http://127.0.0.1:5001`

2. Login with admin credentials## 📋 Table of Contents- **Responsive Layout**: Works on desktop and mobile

3. Start monitoring customer requests!

1. **Clone the repository**

---

   ```bash- **Natural Speech Recognition** - Powered by Google Gemini STT

## 📱 Supervisor Dashboard

   git clone <your-repo-url>

### Dashboard Pages

   cd frontdesk_project- **Human-Like Voice Synthesis** - Natural "Puck" voice from Gemini TTS

#### 1. **Dashboard (Home)**

- **Overview Stats** - Total requests, pending, resolved, and your personal solved count   ```

- **Question Status Chart** - Visual breakdown of solved vs. unresolved queries

- **User Active Time Log** - Track supervisor engagement and activity duration- **Voice Activity Detection** - Smart turn-taking with Silero VAD

- **Recent Questions** - Quick view of latest escalations

- **Active Time Display** - Shows current session duration2. **Create virtual environment**



#### 2. **Requests**   ```bash- **Automatic Greeting** - Welcomes customers immediately upon connection- [Overview](#-overview)## 🚀 Quick Start

- **Request Cards** - All escalated questions displayed in a modern grid layout

- **Search & Filter** - Find requests by status or keywords   python3 -m venv venv

- **Quick Actions** - Answer, bookmark, or resolve requests

- **Status Badges** - Clear visual indicators (Pending, Solved, Unresolved)   source venv/bin/activate  # On Windows: venv\Scripts\activate- **Context-Aware Conversations** - Maintains conversation history

- **Real-time Updates** - New requests appear automatically

   ```

#### 3. **Knowledge Base**

- **Q&A Repository** - Searchable database of questions and answers- **Appointment Escalation** - Always routes bookings to supervisors- [Features](#-features)

- **Add New Entries** - Build your knowledge base with custom Q&A

- **Edit Entries** - Update existing knowledge base items3. **Install dependencies**

- **Delete Entries** - Remove outdated or incorrect information

- **Search Function** - Quick filtering of knowledge entries   ```bash

- **Entry Count** - Track total knowledge base size

   pip install -r requirements.txt

#### 4. **Supervisors** (Admin Only)

- **User Management** - View all active supervisors   ```### 🔄 Real-Time Supervisor Integration- [Tech Stack](#-tech-stack)### 1. Installation

- **Pending Requests** - Approve or reject new supervisor registrations

- **Rejected List** - Review previously rejected applications

- **Add Supervisor** - Manually create new supervisor accounts

- **User Status** - See active vs. pending supervisors4. **Configure environment variables**



#### 5. **Settings**   ```bash

- **Profile Management** - Update your personal information

- **Change Password** - Update account credentials   cp .env.example .env- **Instant Question Escalation** - AI automatically forwards unknown questions- [Prerequisites](#-prerequisites)

- **Profile Picture** - Upload custom avatar

- **Contact Information** - Update email and phone   ```



---   - **3-Second Answer Delivery** - Supervisor responses delivered immediately via voice



## 🎯 Features & Functionality   Edit `.env` and add your credentials:



### Voice Agent Capabilities   ```env- **Multi-Customer Support** - Handles multiple simultaneous conversations- [Installation](#-installation)```bash



#### Natural Conversation Flow   # LiveKit Configuration

The AI agent can:

- Greet customers automatically when they connect   LIVEKIT_URL=wss://your-project.livekit.cloud- **Status Tracking** - Tracks pending → answered → delivered lifecycle

- Answer common questions about services, hours, and pricing

- Provide information from the knowledge base   LIVEKIT_API_KEY=your_api_key

- Handle multiple conversation topics

- Maintain context throughout the conversation   LIVEKIT_API_SECRET=your_api_secret- **No Duplicate Deliveries** - Smart tracking prevents repeat answers- [Quick Start](#-quick-start)# Navigate to project directory



#### Smart Escalation

The agent escalates to supervisors when:

- Customer asks about appointment booking   # Google Gemini API

- Question is not in the knowledge base

- AI confidence is below threshold   GOOGLE_API_KEY=your_gemini_api_key

- Customer specifically requests to speak with a human

   ```### 📊 Professional Dashboard- [Architecture](#-architecture)cd "/Users/mac/Documents/Projects/Frontdesk Assign./frontdesk_project"

#### Learning System

- Supervisor answers are automatically added to the knowledge base

- Future similar questions get answered directly by AI

- Continuously improves response accuracy5. **Initialize database**



### Dashboard Functionality   ```bash



#### Real-time Notifications   python database.py- **Modern UI** - Clean, responsive design with smooth animations- [Usage Guide](#-usage-guide)

- **Browser Notifications** - Get alerted even when dashboard is in background

- **Sound Alerts** - Optional audio notification for new requests   ```

- **Badge Counts** - Visual indicators for pending requests

- **Real-Time Analytics** - Live customer activity charts with Chart.js

#### Request Management

- **Quick Answer** - Type and send responses in seconds### Running the Application

- **Bookmarking** - Save important requests for later review

- **Status Tracking** - Mark as resolved, pending, or escalated- **Question Management** - View, answer, and resolve customer inquiries- [Dashboard Features](#-dashboard-features)# Create and activate virtual environment

- **History View** - See all past interactions

#### Option 1: Manual Start (Recommended for Development)

#### Analytics

- **Visual Charts** - Chart.js powered interactive graphs- **Knowledge Base Editor** - Manage AI responses and training data

- **Time Tracking** - Monitor supervisor active time

- **Performance Metrics** - Track resolution rates**Terminal 1 - Start Voice Agent:**

- **User Statistics** - Per-supervisor analytics

```bash- **Supervisor Management** - User roles, permissions, and registration approval- [API Reference](#-api-reference)python3 -m venv venv

#### User Access Control

- **Admin Role** - Full access including supervisor managementsource venv/bin/activate

- **Supervisor Role** - Access to requests, knowledge, and settings

- **Protected Routes** - Admin-only pages hidden from supervisorspython agent_voice.py start- **Session Logs** - Track login history and supervisor activity

- **Session Management** - Secure login/logout functionality

```

---

- **Customer Activity Timeline** - Visual representation of voice sessions- [Configuration](#-configuration)source venv/bin/activate  # On Windows: venv\Scripts\activate

## 📁 Project Structure

**Terminal 2 - Start Dashboard:**

```

frontdesk_project/```bash

├── app.py                      # Flask application & API endpoints

├── agent.py                    # LiveKit voice agent logicsource venv/bin/activate

├── database.py                 # Database initialization & schema

├── requirements.txt            # Python dependenciespython app.py### 🔐 Security & Authentication- [Troubleshooting](#-troubleshooting)

├── .env                        # Environment variables (create from .env.example)

│```

├── dashboard/                  # Frontend files

│   ├── index.html             # Main dashboard HTML

│   ├── login.html             # Login page

│   ├── register.html          # Registration page#### Option 2: Quick Restart Script

│   │

│   ├── static/                # CSS & JavaScript```bash- **Secure Login System** - SHA-256 password hashing- [Project Structure](#-project-structure)# Install dependencies

│   │   ├── dashboard.css

│   │   ├── dashboard.jschmod +x restart_agent.sh

│   │   ├── login.css

│   │   ├── login.js./restart_agent.sh- **Role-Based Access Control** - Admin and Supervisor roles

│   │   ├── register.css

│   │   ├── register.js```

│   │   ├── dashboard-modern.css

│   │   ├── knowledge-modern.css- **Registration Approval Workflow** - Admin must approve new supervisors- [Contributing](#-contributing)pip install -r requirements.txt

│   │   ├── requests-modern.css

│   │   ├── settings-modern.css### Access the Application

│   │   └── supervisors-modern.css

│   │- **Session Management** - Secure Flask sessions

│   └── images/                # Assets & logos

│       └── frontdesk.png1. **Dashboard**: http://localhost:5000

│

├── database.db                 # SQLite database (auto-created)   - Default login: `admin` / `admin123`- **Protected Routes** - Login required for all dashboard pages```

└── README.md                   # This file

```   



---2. **Voice Agent**: Use LiveKit Playground



## 🔌 API Endpoints   - Go to your LiveKit Cloud dashboard



### Authentication   - Open "Agents Playground"------

- `POST /login` - User login

- `POST /register` - New supervisor registration   - Click "Connect" and start speaking

- `GET /logout` - User logout

- `GET /check-auth` - Verify authentication status



### Requests Management---

- `GET /requests` - Get all help requests

- `POST /answer_request` - Submit answer to a request## 🛠️ Tech Stack### 2. Initialize Database

- `POST /bookmarks` - Bookmark a request

- `GET /bookmarks` - Get all bookmarks## 🏗️ Architecture



### Knowledge Base

- `GET /knowledge_base` - Get all knowledge entries

- `POST /knowledge_base/add` - Add new entry### System Components

- `PUT /knowledge_base/<id>` - Update entry

- `DELETE /knowledge_base/<id>` - Delete entry### Backend## 🌟 Overview



### User Management (Admin Only)```

- `GET /supervisors` - Get all supervisors

- `POST /supervisors/add` - Add new supervisor┌─────────────────────────────────────────────────────────────┐- **Python 3.13+** - Modern async/await patterns

- `POST /supervisors/approve/<id>` - Approve pending request

- `POST /supervisors/reject/<id>` - Reject request│                     CUSTOMER (Voice)                        │



### Analytics│                  LiveKit WebRTC Connection                  │- **Flask** - Web framework for dashboard```bash

- `GET /user-activity` - Get activity logs

- `GET /settings/profile` - Get user profile└────────────────────────┬────────────────────────────────────┘

- `POST /settings/profile` - Update profile

                         │- **SQLite** - Lightweight, reliable database

---

                         ▼

## ⚙️ Configuration

┌─────────────────────────────────────────────────────────────┐- **LiveKit Agents SDK** - Real-time voice agent framework**FrontDesk AI Voice Assistant** is a production-ready, enterprise-grade voice AI system that handles customer inquiries through natural conversation. Built on LiveKit's real-time communication platform and powered by Google Gemini 2.0 Flash with Multimodal Live API, it provides:# Run database initialization

### LiveKit Setup

│                  VOICE AGENT (agent_voice.py)               │

1. Create a LiveKit account at [livekit.io](https://livekit.io/)

2. Create a new project│  ┌──────────────────────────────────────────────────────┐   │

3. Copy your project URL, API Key, and API Secret

4. Add them to your `.env` file│  │  Google Gemini 2.0 Flash Multimodal Live API         │   │



### Google Gemini Setup│  │  • Speech-to-Text (STT)                              │   │### AI & Voicepython database.py



1. Visit [Google AI Studio](https://ai.google.dev/)│  │  • Large Language Model (LLM)                        │   │

2. Create an API key

3. Add it to your `.env` file as `GOOGLE_API_KEY`│  │  • Text-to-Speech (TTS) - "Puck" Voice               │   │- **Google Gemini 2.0 Flash** - Multimodal Live API for voice



### Customization│  └──────────────────────────────────────────────────────┘   │



#### Change Company Information│                                                              │- **LiveKit** - WebRTC-based real-time communication- 🎯 **Natural Voice Conversations** - Customers speak naturally, AI responds with human-like voice```

Edit the knowledge base through the dashboard or modify the default responses in `agent.py`:

│  Background Tasks:                                           │

```python

# Example: Update business hours│  • Heartbeat Monitor (10s) - Track customer activity        │- **Silero VAD** - Voice activity detection (open source)

"Our business hours are Monday-Friday 9 AM to 5 PM"

```│  • Supervisor Answer Monitor (3s) - Check for responses     │



#### Modify Escalation Rules│                                                              │- 🔄 **Real-Time Supervisor Escalation** - Complex questions automatically routed to human supervisors

In `agent.py`, adjust the escalation logic:

│  Function Tools:                                             │

```python

# Force escalation for specific keywords│  • search_knowledge_base() - Query internal docs            │### Frontend

if any(word in question.lower() for word in ['appointment', 'booking', 'schedule']):

    escalate_to_supervisor(question)│  • request_supervisor_help() - Escalate to human            │

```

└────────────────────────┬────────────────────────────────────┘- **HTML5/CSS3/JavaScript** - Modern web standards- ⚡ **Instant Answer Delivery** - Supervisor responses delivered to customers within 3 secondsThis creates `project.db` with default users:

---

                         │

## 🐛 Troubleshooting

                         ▼- **Chart.js** - Beautiful data visualizations

### Common Issues

┌─────────────────────────────────────────────────────────────┐

#### Port Already in Use

```bash│                DATABASE (project.db - SQLite)                │- **Responsive Design** - Mobile and desktop support- 📊 **Analytics Dashboard** - Track customer activity, questions, and performance metrics- **Admin**: username: `admin` / password: `admin123`

# Error: Address already in use, Port 5001

# Solution: Kill the process or use a different port│  • knowledge_base - Q&A pairs                                │

lsof -ti:5001 | xargs kill -9

# Or change the port in app.py│  • help_requests - Escalated questions                       │

```

│  • supervisors - User accounts                               │

#### Database Locked

```bash│  • user_activity - Customer session tracking                 │### Infrastructure- 🧠 **Knowledge Base Integration** - AI learns from supervisor answers for future conversations- **Supervisor**: username: `supervisor` / password: `super123`

# Error: Database is locked

# Solution: Close any other connections to database.db└────────────────────────┬────────────────────────────────────┘

# Restart the Flask application

```                         │- **LiveKit Cloud** - Hosted in India South region



#### Voice Agent Not Connecting                         ▼

```bash

# Check LiveKit credentials in .env┌─────────────────────────────────────────────────────────────┐- **Environment Variables** - Secure configuration management- 📱 **Enterprise-Ready** - Built with production best practices and scalability in mind

# Verify internet connection

# Check LiveKit console for errors│              SUPERVISOR DASHBOARD (app.py)                   │

```

│  • Flask Web Server (Port 5000)                              │

#### Login Not Working

```bash│  • Bootstrap 5 Responsive UI                                 │

# Verify database.db exists

# Check for database initialization errors in console│  • Chart.js Analytics                                        │---### 3. Start the Dashboard

# Try default credentials: admin/admin123

```│  • Real-time Question Queue                                  │



### Enable Debug Mode│  • Knowledge Base Management                                 │



For more detailed error messages:└─────────────────────────────────────────────────────────────┘



```python```## 📦 Prerequisites---

# In app.py

if __name__ == '__main__':

    app.run(debug=True, host='0.0.0.0', port=5001)

```### Data Flow



---



## 📝 License1. **Customer Speaks** → LiveKit captures audio → Gemini STT transcribesBefore you begin, ensure you have:```bash



This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.2. **AI Processing** → Gemini LLM processes intent → Decides action



---3. **Knowledge Search** → Agent searches database for answers



## 👨‍💻 Developer4. **Escalation** → If no answer found → Creates help_request in database



**Mohd Raza Khan**5. **Supervisor Responds** → Types answer in dashboard → Saves to database- **Python 3.13+** installed ([Download](https://www.python.org/downloads/))## ✨ Features# Run Flask application

- GitHub: [@mohdrazakhan](https://github.com/mohdrazakhan)

- Repository: [FrontDesk_AI_Voice_Assistant](https://github.com/mohdrazakhan/FrontDesk_AI_Voice_Assistant)6. **Real-Time Delivery** → Agent detects answer (3s polling) → Speaks to customer via Gemini TTS



---7. **Activity Tracking** → Heartbeat updates user_activity table → Dashboard displays analytics- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))



## 🙏 Acknowledgments



- [LiveKit](https://livekit.io/) - Real-time voice infrastructure---- **LiveKit Account** ([Sign up free](https://livekit.io/))python app.py

- [Google Gemini](https://ai.google.dev/) - Multimodal AI capabilities

- [Flask](https://flask.palletsprojects.com/) - Web framework

- [Chart.js](https://www.chartjs.org/) - Data visualization

## 📱 Supervisor Dashboard- **Git** (for cloning the repository)

---



## 📞 Support

### Login & Authentication### 🎙️ Voice Agent Capabilities```

If you encounter any issues or have questions:

- Navigate to `http://localhost:5000`

1. Check the [Troubleshooting](#-troubleshooting) section

2. Review existing GitHub Issues- Login with credentials (default: `admin` / `admin123`)---

3. Create a new issue with detailed information

4. Include error messages and steps to reproduce- Role-based access control (Admin/Supervisor)



---



<div align="center">### Main Features



**Built with ❤️ for better customer experiences**## 🚀 Quick Start



⭐ Star this repo if you find it helpful!#### 1. **Dashboard Overview**



</div>- **Customer Activity Chart** - Last 24 hours of voice sessions- **Natural Speech Recognition** - Powered by Google Gemini STTThe dashboard will be available at: **http://127.0.0.1:5001**


- **Question Volume** - Escalation trends over time

- **Active Sessions** - Real-time customer count### 1. Installation

- **Quick Stats** - Total questions, resolutions, knowledge entries

- **Human-Like Voice Synthesis** - Natural "Puck" voice from Gemini TTS

#### 2. **Questions Overview**

- View all escalated customer questions```bash

- Status indicators: Pending, Answered, Delivered

- One-click answer submission# Navigate to project directory- **Voice Activity Detection** - Smart turn-taking with Silero VAD### 4. Access the Dashboard

- Question history and timestamps

cd "/Users/mac/Documents/Projects/Frontdesk Assign./frontdesk_project"

#### 3. **Knowledge Base Management**

- Add new Q&A pairs- **Automatic Greeting** - Welcomes customers immediately upon connection

- Edit existing entries

- Delete outdated information# Create and activate virtual environment

- Search and filter capabilities

python3 -m venv venv- **Context-Aware Conversations** - Maintains conversation history1. Open browser and navigate to: `http://127.0.0.1:5001/login`

#### 4. **User Management** (Admin Only)

- Create supervisor accountssource venv/bin/activate  # On Windows: venv\Scripts\activate

- Edit roles and permissions

- View login history- **Appointment Escalation** - Always routes bookings to supervisors2. Login with credentials: `admin` / `admin123`

- Disable/enable accounts

# Install dependencies

#### 5. **Analytics**

- Customer session durationspip install -r requirements.txt3. Dashboard homepage loads with:

- Peak usage times

- Answer resolution times```

- Knowledge base effectiveness

### 🔄 Real-Time Supervisor Integration   - Active session timer

---

### 2. Configuration

## 🔧 Configuration

   - Your solved questions count

### Environment Variables

Create a `.env` file in the project root with your credentials:

```env

# LiveKit Cloud Configuration- **Instant Question Escalation** - AI automatically forwards unknown questions   - Pending questions chart

LIVEKIT_URL=wss://your-project.livekit.cloud

LIVEKIT_API_KEY=APIxxxxxxxxxxxxxxx```bash

LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# LiveKit Credentials (from dashboard.livekit.io)- **3-Second Answer Delivery** - Supervisor responses delivered immediately via voice   - Recent questions grid

# Google Gemini API

GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXLIVEKIT_URL=wss://frontdesk-test-eyejq0fh.livekit.cloud



# Flask Dashboard (Optional)LIVEKIT_API_KEY=your_livekit_api_key- **Multi-Customer Support** - Handles multiple simultaneous conversations

FLASK_SECRET_KEY=your-secret-key-here

FLASK_DEBUG=FalseLIVEKIT_API_SECRET=your_livekit_api_secret

```

- **Status Tracking** - Tracks pending → answered → delivered lifecycle## 📁 Project Structure

### Voice Agent Configuration

# Google Gemini API (from aistudio.google.com)

Edit `agent_voice.py` to customize:

GOOGLE_API_KEY=your_gemini_api_key- **No Duplicate Deliveries** - Smart tracking prevents repeat answers

```python

# Voice Settings```

VOICE = "Puck"  # Options: Puck, Charon, Kore, Fenrir, Aoede

```

# Monitoring Intervals

HEARTBEAT_INTERVAL = 10  # seconds### 3. Initialize Database

SUPERVISOR_CHECK_INTERVAL = 3  # seconds

### 📊 Professional Dashboardfrontdesk_project/

# Model Settings

MODEL = "gemini-2.0-flash-exp"```bash

```

# Create database tables and default users├── agent.py                          # LiveKit AI agent

### Dashboard Configuration

python database.py

Edit `app.py` to customize:

```- **Modern UI** - Clean, responsive design with smooth animations├── app.py                            # Flask web application

```python

# Server Settings

PORT = 5000

DEBUG = False**Default Users Created:**- **Real-Time Analytics** - Live customer activity charts├── database.py                       # Database initialization



# Session Settings- **Admin**: `admin` / `admin123`

PERMANENT_SESSION_LIFETIME = timedelta(hours=24)

```- **Supervisor**: `supervisor` / `super123`- **Question Management** - View, answer, and resolve customer inquiries├── project.db                        # SQLite database



---



## 📡 API Reference### 4. Start the Dashboard- **Knowledge Base Editor** - Manage AI responses and training data├── requirements.txt                  # Python dependencies



### Voice Agent Functions



#### `search_knowledge_base(question: str)````bash- **Supervisor Management** - User roles, permissions, and registration approval├── .env                              # LiveKit credentials

Searches the knowledge base for answers to customer questions.

# Run Flask application

**Parameters:**

- `question` (str): Customer's question textpython app.py- **Session Logs** - Track login history and supervisor activity├── dashboard/



**Returns:**```

- `str`: Answer from knowledge base or "No answer found"

- **Customer Activity Timeline** - Visual representation of voice sessions│   ├── index.html                    # Main dashboard UI

**Example:**

```pythonDashboard available at: **http://127.0.0.1:5001**

answer = search_knowledge_base("What are your business hours?")

# Returns: "We are open Monday-Friday, 9 AM to 5 PM"│   ├── login.html                    # Login page

```

### 5. Start the Voice Agent

#### `request_supervisor_help(question: str, customer_name: str, customer_phone: str)`

Escalates a question to human supervisors.### 🔐 Security & Authentication│   ├── register.html                 # Registration page



**Parameters:**Open a **new terminal** and run:

- `question` (str): The customer's question

- `customer_name` (str): Customer's name│   ├── static/

- `customer_phone` (str): Customer's phone number

```bash

**Returns:**

- `str`: Confirmation message# Activate virtual environment- **Secure Login System** - SHA-256 password hashing│   │   ├── dashboard.css             # Base styles



**Example:**source venv/bin/activate

```python

result = request_supervisor_help(- **Role-Based Access Control** - Admin and Supervisor roles│   │   ├── dashboard-modern.css      # Modern dashboard styles

    question="Can I book an appointment tomorrow at 2pm?",

    customer_name="John Doe",# Start LiveKit voice agent

    customer_phone="555-1234"

)python agent_voice.py start- **Registration Approval Workflow** - Admin must approve new supervisors│   │   ├── dashboard.js              # Dashboard logic

# Returns: "I've sent your request to a supervisor..."

``````



### Dashboard API Endpoints- **Session Management** - Secure Flask sessions│   │   ├── dashboard-modern.js       # Timer & charts



#### `GET /user-activity`### 6. Test the System

Returns customer voice session activity for the last 24 hours.

- **Protected Routes** - Login required for all dashboard pages│   │   ├── login.css                 # Login page styles

**Response:**

```json1. **Login to Dashboard**: Navigate to `http://127.0.0.1:5001/login`

[

  {2. **Connect Voice Client**: Use LiveKit Playground or Agents Playground│   │   └── login.js                  # Login logic

    "customer_id": "participant_abc123",

    "start_time": "2025-10-21 14:30:00",3. **Speak to Agent**: Say "Hello, I need help booking an appointment"

    "duration_seconds": 180,

    "duration_minutes": 3.04. **Agent Escalates**: Question appears in dashboard---│   └── images/

  }

]5. **Supervisor Answers**: Type response and click "Resolve"

```

6. **Customer Hears Answer**: Agent speaks response within 3 seconds│       └── frontdesk.png             # Logo

#### `GET /help-requests`

Returns all escalated questions with status.



**Response:**---## 🛠️ Tech Stack├── DASHBOARD_REDESIGN.md             # Redesign documentation

```json

[

  {

    "id": 1,## 🏗️ Architecture├── TIMER_IMPLEMENTATION.md           # Timer technical docs

    "customer_identifier": "participant_abc123",

    "question_text": "Can I reschedule my appointment?",

    "supervisor_answer": "Yes, we can move you to Friday at 3pm",

    "status": "delivered",### System Flow### Backend└── DASHBOARD_COMPLETE.md             # Complete features summary

    "created_at": "2025-10-21 14:35:00",

    "resolved_at": "2025-10-21 14:36:30"

  }

]```- **Python 3.13+** - Modern async/await patterns```

```

┌─────────────┐         ┌──────────────┐         ┌────────────────┐

#### `POST /resolve-help-request/<id>`

Supervisor submits an answer to an escalated question.│  Customer   │  Voice  │  Voice Agent │  Data   │   Dashboard    │- **Flask** - Web framework for dashboard



**Request Body:**│   (Phone)   │ ──────> │   (Gemini)   │ ──────> │  (Supervisor)  │

```json

{└─────────────┘         └──────────────┘         └────────────────┘- **SQLite** - Lightweight, reliable database## 📊 Dashboard Features

  "answer": "Yes, we have availability at 2pm tomorrow"

}       ↑                        │                         │

```

       │                        │ Real-time              │- **LiveKit Agents SDK** - Real-time voice agent framework

**Response:**

```json       │    Voice Response      │ Monitoring             │ Answer

{

  "success": true,       └────────────────────────┴────────────────────────┘### Active Session Timer

  "message": "Answer submitted successfully"

}```

```

### AI & Voice- ⏱️ Displays HH:MM:SS format

---

### Components

## 🗄️ Database Schema

- **Google Gemini 2.0 Flash** - Multimodal Live API for voice- 💾 Persists across page refreshes

### `knowledge_base`

```sql1. **Voice Agent** (`agent_voice.py`)

CREATE TABLE knowledge_base (

    id INTEGER PRIMARY KEY AUTOINCREMENT,   - Handles customer voice interactions- **LiveKit** - WebRTC-based real-time communication- ⏸️ Pauses when tab is inactive

    question TEXT NOT NULL,

    answer TEXT NOT NULL,   - Powered by Google Gemini 2.0 Flash

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);   - Monitors database for supervisor answers- **Silero VAD** - Voice activity detection (open source)- ▶️ Resumes when tab becomes active

```

   - Delivers responses via voice synthesis

### `help_requests`

```sql- 🔴 Resets only on logout

CREATE TABLE help_requests (

    id INTEGER PRIMARY KEY AUTOINCREMENT,2. **Dashboard Backend** (`app.py`)

    customer_identifier TEXT NOT NULL,

    question_text TEXT NOT NULL,   - Flask web server### Frontend

    supervisor_answer TEXT,

    status TEXT DEFAULT 'pending',  -- pending, answered, delivered   - REST API endpoints

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    resolved_at TIMESTAMP   - Authentication and session management- **HTML5/CSS3/JavaScript** - Modern web standards### Your Stats

);

```   - Database operations



### `user_activity`- **Chart.js** - Beautiful data visualizations- ✅ **Your Solved**: Questions you resolved

```sql

CREATE TABLE user_activity (3. **Database** (`database.py`)

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    customer_id TEXT NOT NULL,   - SQLite database- **Responsive Design** - Mobile and desktop support- ⏳ **Pending**: Questions waiting for answers

    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    end_time TIMESTAMP,   - Tables: help_requests, knowledge_base, supervisors, user_activity

    duration_seconds INTEGER,

    last_heartbeat TIMESTAMP   - Stores questions, answers, and analytics- 📊 **Total**: All requests in system

);

```



### `supervisors`4. **Frontend** (`dashboard/`)### Infrastructure

```sql

CREATE TABLE supervisors (   - Modern HTML/CSS/JavaScript

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT UNIQUE NOT NULL,   - Real-time charts and analytics- **LiveKit Cloud** - Hosted in India South region### Pending Questions Chart

    password_hash TEXT NOT NULL,

    role TEXT DEFAULT 'supervisor',  -- admin, supervisor   - Responsive design

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);- **Environment Variables** - Secure configuration management- 📈 Beautiful line chart

```

---

---

- 🎨 Company colors (blue/purple)

## 🧪 Testing

## 📊 Dashboard Features

### Test Voice Agent

---- 💫 Smooth animations

1. **Start the agent**: `python agent_voice.py start`

2. **Open LiveKit Playground** in your LiveKit Cloud dashboard### Active Session Timer

3. **Click "Connect"** and allow microphone access

4. **Speak**: "Hello, what services do you offer?"- ⏱️ Displays HH:MM:SS format- 🖱️ Interactive tooltips

5. **Verify**: Agent responds with voice

- 💾 Persists across page refreshes

### Test Supervisor Escalation

- ⏸️ Pauses when tab is inactive## 📦 Prerequisites

1. **Customer speaks**: "I want to book an appointment for tomorrow at 3pm"

2. **Agent escalates**: Asks for name and phone, then escalates- ▶️ Resumes when tab becomes active

3. **Supervisor logs in**: Dashboard at http://localhost:5000

4. **View request**: Check "Questions Overview" section- 🔴 Resets only on logout### Recent Questions

5. **Type answer**: "Yes, 3pm is available. I've booked you in!"

6. **Submit**: Click "Resolve"

7. **Customer hears**: Within 3 seconds, agent speaks the answer

### Statistics CardsBefore you begin, ensure you have:- 📝 Last 6 questions as tiles

### Test Knowledge Base

- ✅ **Your Solved**: Questions you personally resolved

1. **Add entry in dashboard**: "What are your hours?" → "9 AM to 5 PM daily"

2. **Customer asks**: "What are your business hours?"- ⏳ **Pending**: Questions waiting for answers- 🎯 Click to view full details

3. **Agent responds immediately**: Without supervisor escalation

- 📊 **Total**: All requests in the system

---

- **Python 3.13+** installed ([Download](https://www.python.org/downloads/))- ✨ Animated appearance

## 🐛 Troubleshooting

### Pending Questions Chart

### Port 8081 Already in Use

```bash- 📈 Beautiful line chart with Chart.js- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))- 🎨 Status badges and icons

# Kill the process using port 8081

lsof -ti:8081 | xargs kill -9- 🎨 Company colors (blue/purple gradient)

pkill -9 python

python agent_voice.py start- 💫 Smooth animations- **LiveKit Account** ([Sign up free](https://livekit.io/))

```

- 🖱️ Interactive tooltips

### Agent Not Responding

- Check `.env` file has correct `GOOGLE_API_KEY`- **Git** (for cloning the repository)## 🎨 Design Highlights

- Verify LiveKit credentials are correct

- Check terminal for error messages### Recent Questions Grid

- Ensure `project.db` exists (run `python database.py`)

- 📝 Last 6 questions displayed as cards

### Dashboard Login Failed

- Default credentials: `admin` / `admin123`- 🎯 Click to view full details

- Reset database: `rm project.db && python database.py`

- Check Flask is running on port 5000- ✨ Animated slide-up appearance---- **Modern Cards**: Rounded corners, soft shadows



### Customer Can't Hear Supervisor Answer- 🎨 Status badges (pending/answered/delivered)

- Verify supervisor clicked "Resolve" button

- Check agent terminal for "Delivering supervisor answer..." logs- **Company Colors**: #4F6BFF (blue), #5B4FFF (purple)

- Ensure agent is still connected (check LiveKit dashboard)

- Verify database status changed from 'pending' to 'delivered'### Knowledge Base Management



---- 📚 Add, edit, delete FAQ entries## 🚀 Installation- **Smooth Animations**: Slide-up, fade-in, lift effects



## 📂 Project Structure- 🔍 Search and filter questions



```- 📝 Markdown support for answers- **Responsive**: Works on all screen sizes

frontdesk_project/

├── agent_voice.py          # Voice agent with Gemini integration- 🔄 Real-time updates to voice agent

├── app.py                  # Flask dashboard server

├── database.py             # Database schema and initialization### 1. Clone the Repository- **Professional**: Clean, enterprise-ready UI

├── requirements.txt        # Python dependencies

├── .env                    # Environment variables (create from .env.example)### User Management

├── .env.example            # Environment template

├── .gitignore              # Git ignore rules- 👥 View all supervisors

├── restart_agent.sh        # Quick restart script

├── project.db              # SQLite database (auto-generated)- ✅ Approve/reject registration requests

├── README.md               # This file

└── dashboard/- 🔐 Change user roles (Admin/Supervisor)```bash## Prerequisites

    ├── index.html          # Main dashboard page

    ├── login.html          # Login page- 📊 View supervisor activity logs

    ├── register.html       # Registration page

    ├── static/git clone <your-repository-url>

    │   ├── dashboard.css   # Dashboard styles

    │   ├── dashboard.js    # Dashboard logic---

    │   ├── login.css       # Login styles

    │   ├── login.js        # Login logiccd frontdesk_project- Python 3.8 or higher

    │   ├── register.css    # Registration styles

    │   └── register.js     # Registration logic## 🎨 Design Highlights

    └── images/             # UI images and icons

``````- pip (Python package installer)



---- **Modern Cards**: Rounded corners, soft shadows, gradient backgrounds



## 🔄 How It Works- **Company Colors**: #4F6BFF (primary blue), #5B4FFF (accent purple)



### Real-Time Supervisor Answer Delivery- **Smooth Animations**: Slide-up, fade-in, lift effects on hover



```- **Responsive Layout**: Flexbox/Grid for all screen sizes### 2. Create Virtual Environment## Installation & Setup

1. Customer Asks Question (Voice)

   ↓- **Professional Typography**: Clean fonts, proper hierarchy

2. Agent Realizes Needs Help

   ↓- **Accessibility**: ARIA labels, keyboard navigation support

3. Agent Calls request_supervisor_help()

   ↓

4. Question Saved to Database (status='pending')

   ↓---```bash### 1. Install Dependencies

5. Supervisor Sees Question in Dashboard

   ↓

6. Supervisor Types Answer, Clicks "Resolve"

   ↓## 📁 Project Structure# Create virtual environment

7. Database Updated (status='answered')

   ↓

8. Background Monitor Detects Answer (3s polling)

   ↓```python3 -m venv venv```bash

9. Agent Speaks Answer to Customer (Gemini TTS)

   ↓frontdesk_project/

10. Database Updated (status='delivered')

```├── agent_voice.py                 # LiveKit voice agent (Gemini 2.0)# Install required Python packages



### Automatic Greeting System├── app.py                         # Flask web application



When a customer connects:├── database.py                    # Database schema & initialization# Activate itpip install -r requirements.txt

1. Agent detects new participant

2. Captures customer identity from LiveKit metadata├── project.db                     # SQLite database

3. Immediately generates greeting: *"Hello! I'm your FrontDesk assistant..."*

4. No waiting for customer to speak first├── requirements.txt               # Python dependencies# macOS/Linux:```



### Appointment Escalation├── .env                           # Environment variables (create this)



When customer mentions "appointment" or "booking":├── .env.example                   # Environment templatesource venv/bin/activate

1. Agent asks for name and phone number

2. Calls `request_supervisor_help()` function├── .gitignore                     # Git ignore rules

3. Never books directly (per business rules)

4. Supervisor confirms availability and processes booking├── restart_agent.sh               # Quick restart script### 2. Initialize the Database



---├── README.md                      # This file



## 🚀 Deployment├── QUICKSTART.md                  # 5-minute setup guide# Windows:



### Production Checklist│



- [ ] Change default admin password├── dashboard/venv\Scripts\activate```bash

- [ ] Set strong `FLASK_SECRET_KEY` in `.env`

- [ ] Disable Flask debug mode (`FLASK_DEBUG=False`)│   ├── index.html                 # Main dashboard UI

- [ ] Use production WSGI server (Gunicorn/uWSGI)

- [ ] Enable HTTPS with SSL certificates│   ├── login.html                 # Login page```# Create the database tables and add initial knowledge

- [ ] Set up database backups

- [ ] Configure logging to files│   ├── register.html              # Registration page

- [ ] Monitor LiveKit usage and quotas

- [ ] Set up error alerting (Sentry, etc.)│   ├── login-history.html         # Session logs viewerpython database.py



### Deployment Options│   │



**Option 1: VPS (DigitalOcean, AWS EC2, etc.)**│   ├── static/### 3. Install Dependencies```

```bash

# Install dependencies│   │   ├── dashboard.css          # Legacy styles

sudo apt update

sudo apt install python3.13 python3-pip nginx│   │   ├── dashboard-modern.css   # Modern dashboard styles



# Clone and setup│   │   ├── dashboard.js           # Dashboard logic

git clone <your-repo>

cd frontdesk_project│   │   ├── dashboard-modern.js    # Timer & real-time features```bash### 3. Start the Supervisor Dashboard

python3 -m venv venv

source venv/bin/activate│   │   ├── login.css              # Login page styles

pip install -r requirements.txt

│   │   ├── login.js               # Login logicpip install -r requirements.txt

# Configure .env with production credentials

nano .env│   │   ├── register.css           # Registration styles



# Run with Gunicorn (dashboard)│   │   ├── register.js            # Registration logic``````bash

gunicorn -w 4 -b 0.0.0.0:5000 app:app

│   │   ├── login-history.css      # Session logs styles

# Run voice agent in screen/tmux

screen -S agent│   │   ├── login-history.js       # Session logs logic# Run the Flask web application on port 5001

python agent_voice.py start

```│   │   ├── knowledge-modern.css   # Knowledge base styles



**Option 2: Docker** (Create Dockerfile and docker-compose.yml)│   │   ├── supervisors-modern.css # User management styles### 4. Configure Environment Variablespython app.py



**Option 3: Platform-as-a-Service** (Heroku, Railway, Render)│   │   ├── requests-modern.css    # Questions view styles



---│   │   └── settings-modern.css    # Settings page styles```



## 🤝 Contributing│   │



Contributions are welcome! Please follow these steps:│   └── images/Create a `.env` file in the project root:



1. Fork the repository│       ├── favicon.png            # Browser favicon

2. Create a feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit your changes (`git commit -m 'Add AmazingFeature'`)│       └── frontdesk.png          # Company logoThe dashboard will be available at: http://localhost:5001

4. Push to the branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request│



---└── __pycache__/                   # Python cache (ignored)```bash



## 📄 License```



This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.# LiveKit Credentials### 4. Start the AI Agent (in a separate terminal)



------



## 🙏 AcknowledgmentsLIVEKIT_URL=wss://frontdesk-test-eyejq0fh.livekit.cloud



- **[LiveKit](https://livekit.io)** - Real-time communication infrastructure## 🔧 Configuration

- **[Google Gemini](https://ai.google.dev/)** - Advanced AI with multimodal capabilities

- **[Flask](https://flask.palletsprojects.com/)** - Lightweight web frameworkLIVEKIT_API_KEY=your_livekit_api_key```bash

- **[Bootstrap](https://getbootstrap.com/)** - Responsive UI components

- **[Chart.js](https://www.chartjs.org/)** - Beautiful data visualization### Environment Variables



---LIVEKIT_API_SECRET=your_livekit_api_secret# Run the LiveKit agent



## 📧 Support| Variable | Description | Example |



For questions, issues, or feature requests:|----------|-------------|---------|python agent.py

- Open an issue on GitHub

- Check existing documentation| `LIVEKIT_URL` | LiveKit server WebSocket URL | `wss://your-project.livekit.cloud` |

- Review troubleshooting section above

| `LIVEKIT_API_KEY` | LiveKit API key from dashboard | `APIxxxxxxxxx` |# Google Gemini API```

---

| `LIVEKIT_API_SECRET` | LiveKit API secret | `xxxxxxxxxxxxxxxxxx` |

<div align="center">

| `GOOGLE_API_KEY` | Google Gemini API key | `AIzaSyxxxxxxxxxxxxxxxxx` |GOOGLE_API_KEY=your_gemini_api_key

**Built with ❤️ using LiveKit and Google Gemini**



⭐ Star this repo if you find it helpful!

### Database Tables```## How It Works

</div>



- **supervisors**: User accounts, roles, passwords

- **help_requests**: Customer questions and supervisor answers

- **knowledge_base**: FAQ entries for AI responses**Where to get credentials:**### Knowledge Base System

- **registration_requests**: Pending supervisor registrations

- **session_logs**: Login history and activity tracking- LiveKit: Dashboard → Settings → API Keys- The AI agent checks the `knowledge_base` table for answers

- **user_activity**: Voice customer session analytics

- Gemini API: https://aistudio.google.com/app/apikey- Initial knowledge includes:

---

  - Business hours: "9 AM to 6 PM, Tuesday to Saturday"

## 🎯 Usage Guide

### 5. Initialize Database  - Location: "123 Beauty Lane"

### For Supervisors



1. **Login**: Navigate to `http://127.0.0.1:5001/login`

2. **View Dashboard**: See pending questions, stats, and charts```bash### Escalation Flow

3. **Answer Questions**: Click on a question card, type answer, click "Resolve"

4. **Manage Knowledge Base**: Add FAQ entries to improve AI responsespython database.py1. Customer asks a question through LiveKit chat

5. **Track Activity**: View customer voice session logs

```2. AI checks knowledge base for matching answer

### For Admins

3. If found: AI responds immediately

All supervisor features, plus:

- **Approve Registrations**: Review and approve new supervisor accountsThis creates `project.db` with:4. If not found: 

- **Manage Users**: Change roles, delete accounts

- **View All Activity**: See system-wide analytics- ✅ Default admin user: `admin` / `admin123`   - AI tells customer it will check with supervisor



### For Voice Customers- ✅ Default supervisor: `supervisor` / `super123`   - Question is logged in `help_requests` table as "Pending"



1. **Connect**: Use LiveKit Playground or phone system- ✅ Database tables for questions, knowledge base, users, activity logs   - Supervisor sees request in dashboard

2. **Speak Naturally**: Ask questions or request appointments

3. **Get Answers**: AI responds immediately or escalates to supervisor

4. **Receive Updates**: Hear supervisor answers within 3 seconds

---### Resolution & Learning

---

1. Supervisor views pending requests in dashboard

## 🔍 API Reference

## ⚡ Quick Start2. Supervisor types answer and clicks "Submit Answer"

### Dashboard Endpoints

3. System performs three actions:

| Method | Endpoint | Description | Auth Required |

|--------|----------|-------------|---------------|### Start the Dashboard Server   - Updates request status to "Resolved"

| GET | `/login` | Login page | No |

| POST | `/login` | Authenticate user | No |   - Adds Q&A pair to knowledge base (so AI learns)

| GET | `/logout` | End session | Yes |

| GET | `/` | Dashboard home | Yes |```bash   - Simulates sending text message to customer

| POST | `/register` | Create supervisor account | No |

| GET | `/pending-questions` | Get unanswered questions | Yes |python app.py

| POST | `/resolve-question/<id>` | Answer a question | Yes |

| GET | `/user-activity` | Get voice session logs | Yes |```## Database Tables

| GET | `/knowledge-base` | Get all FAQ entries | Yes |

| POST | `/knowledge-base` | Add FAQ entry | Yes (Admin) |

| DELETE | `/knowledge-base/<id>` | Delete FAQ entry | Yes (Admin) |

| GET | `/supervisors` | Get all users | Yes (Admin) |Dashboard available at: **http://localhost:5000**### knowledge_base

| POST | `/approve-supervisor/<id>` | Approve registration | Yes (Admin) |

- Stores questions and answers the AI has learned

### Voice Agent Functions

### Start the Voice Agent- Questions must be unique

- **search_knowledge_base(query)**: Search FAQ for answers

- **request_supervisor_help(question)**: Escalate to human supervisor

- **send_heartbeat(customer_id)**: Track customer activity

- **check_supervisor_answers(session, customer_id)**: Monitor and deliver answers```bash### help_requests



---python agent_voice.py start- Tracks all escalated questions



## 🐛 Troubleshooting```- Fields: customer ID, question, status, answer, timestamps



### Port Already in Use- Status can be: Pending, Resolved, or Unresolved



```bashAgent will connect to LiveKit and wait for customers.

# Kill process on port 8081

lsof -ti:8081 | xargs kill -9## Testing the System



# Or use the restart script### Test the Voice Agent

./restart_agent.sh

```### Test 1: Known Question



### Voice Agent Won't Start1. **Open LiveKit Playground**1. Start both agent.py and app.py



1. Check `.env` file has correct credentials   - Go to your LiveKit dashboard2. Connect to LiveKit chat

2. Verify virtual environment is activated

3. Ensure port 8081 is free   - Navigate to "Playground" or "Testing"3. Ask: "What are your hours?"

4. Check LiveKit credentials are valid

   - Connect with microphone enabled4. Expected: AI responds immediately with hours

### Dashboard Not Loading



1. Check Flask is running on port 5001

2. Clear browser cache2. **Start Talking**### Test 2: Unknown Question → Escalation

3. Verify database exists: `ls project.db`

4. Check console for JavaScript errors   - Agent will greet you immediately1. Ask: "Do you offer gift cards?"



### Customer Not Hearing Answers   - Ask: "What are your business hours?"2. Expected: AI says it will check with supervisor



1. Verify agent is running: `python agent_voice.py start`   - Ask: "I want to book an appointment tomorrow at 3pm"3. Check dashboard at http://localhost:5001

2. Check supervisor clicked "Resolve" (not just typed answer)

3. Ensure customer is still connected4. Expected: See new pending request

4. Check agent terminal for errors

3. **Watch Supervisor Dashboard**

### Database Errors

   - Login at http://localhost:5000### Test 3: Supervisor Response → Learning

```bash

# Reinitialize database   - See questions appear in "Questions Overview"1. In dashboard, answer the gift cards question

rm project.db

python database.py   - Type answer and click "Resolve"2. Expected: Request disappears (resolved)

```

   - Customer hears answer within 3 seconds!3. Ask the same question again in chat

---

4. Expected: AI now knows the answer!

## 🚀 Deployment

---

### Production Checklist

## Configuration

- [ ] Change default passwords in `database.py`

- [ ] Use environment variables for secrets## 🏗️ Architecture

- [ ] Enable HTTPS for dashboard

- [ ] Configure firewall rulesLiveKit credentials are stored in `.env`:

- [ ] Set up database backups

- [ ] Enable logging and monitoring```- URL: wss://frontdesk-test-eyejq0fh.livekit.cloud

- [ ] Use production WSGI server (Gunicorn)

- [ ] Configure LiveKit for production┌─────────────────┐- API Key and Secret are pre-configured

- [ ] Test voice quality on production network

│   Customer      │ ◄──── Voice ────► ┌──────────────────┐

### Recommended Hosting

│   (Browser)     │                   │   LiveKit Cloud  │## Troubleshooting

- **Dashboard**: AWS EC2, DigitalOcean, Heroku

- **Database**: AWS RDS, managed PostgreSQL└─────────────────┘                   └──────────────────┘

- **Voice Agent**: Cloud server with low latency to LiveKit

- **LiveKit**: LiveKit Cloud (already hosted)                                              │### Port Already in Use



---                                              │ WebSocketIf port 5001 is busy, edit `app.py` and change the port:



## 📈 Performance                                              ▼```python



### Voice Agent                                      ┌──────────────────┐app.run(debug=True, port=5002)  # Use different port



- **Response Time**: < 1 second for knowledge base queries                                      │  Voice Agent     │```

- **Escalation Time**: < 2 seconds to create supervisor request

- **Answer Delivery**: 3 seconds from supervisor resolution                                      │  (agent_voice.py)│

- **Concurrent Users**: Tested with 10+ simultaneous customers

                                      └──────────────────┘### Database Locked

### Dashboard

                                              │If you get "database is locked" errors:

- **Page Load**: < 500ms

- **Real-Time Updates**: 3-second polling interval                    ┌─────────────────────────┼─────────────────────────┐- Make sure you're not running multiple instances

- **Chart Rendering**: < 100ms with Chart.js

- **Database Queries**: < 50ms average                    │                         │                         │- Close and restart both agent.py and app.py



---                    ▼                         ▼                         ▼



## 🤝 Contributing            ┌───────────────┐        ┌───────────────┐        ┌───────────────┐### LiveKit Connection Issues



We welcome contributions! Please follow these steps:            │ Gemini API    │        │  SQLite DB    │        │ Background    │- Verify credentials in `.env` file



1. Fork the repository            │ (STT/TTS/LLM) │        │  (Questions)  │        │ Tasks         │- Check internet connection

2. Create a feature branch: `git checkout -b feature/amazing-feature`

3. Commit your changes: `git commit -m 'Add amazing feature'`            └───────────────┘        └───────────────┘        └───────────────┘- Ensure LiveKit room is active

4. Push to the branch: `git push origin feature/amazing-feature`

5. Open a Pull Request                                              │                         │



### Code Style                                              │                         │## Development Notes



- Follow PEP 8 for Python code                                              ▼                         ▼

- Use meaningful variable names

- Add comments for complex logic                                      ┌──────────────────┐    ┌──────────────────┐- Flask runs in debug mode for development

- Write docstrings for functions

- Test before submitting                                      │  Flask Dashboard │    │  Heartbeat       │- Database uses SQLite (file-based, no server needed)



---                                      │  (app.py)        │    │  Monitoring      │- Agent uses async/await for handling multiple chats



## 📝 License                                      └──────────────────┘    │  Answer Delivery │- Dashboard auto-refreshes every 10 seconds



This project is licensed under the MIT License - see the LICENSE file for details.                                              │                └──────────────────┘



---                                              │## Next Steps / Improvements



## 👥 Authors                                              ▼



- **Development Team** - Initial work and ongoing maintenance                                      ┌──────────────────┐- Add authentication for supervisor dashboard



---                                      │   Supervisor     │- Implement actual SMS/text notifications (using Twilio)



## 🙏 Acknowledgments                                      │   (Browser)      │- Add more sophisticated natural language matching



- **LiveKit** - For the amazing real-time communication platform                                      └──────────────────┘- Support multiple languages

- **Google Gemini** - For powerful multimodal AI capabilities

- **Silero** - For open-source voice activity detection```- Add analytics and reporting

- **Chart.js** - For beautiful data visualizations

- **Flask** - For the lightweight web framework- Implement chat history for customers



---### Data Flow



## 📞 Support1. **Customer Connects** → LiveKit establishes WebRTC connection

2. **Customer Speaks** → Gemini STT converts speech to text

For issues, questions, or suggestions:3. **AI Processes** → Gemini LLM generates response or escalates

4. **Response Delivery** → Gemini TTS synthesizes voice response

- Open an issue on GitHub5. **Escalation** → Function tool logs question to database

- Check the [QUICKSTART.md](QUICKSTART.md) for common setup issues6. **Supervisor Answers** → Dashboard updates database with answer

- Review troubleshooting section above7. **Real-Time Delivery** → Background monitor detects answer (3s poll)

8. **Voice Response** → Agent speaks supervisor's answer to customer

---

---

## 🗺️ Roadmap

## 📖 Usage Guide

### Upcoming Features

### For Customers

- [ ] Multi-language support (Hindi, Spanish, French)

- [ ] SMS/Email notifications for customers1. **Connect to Voice Agent**

- [ ] Advanced analytics with AI insights   - Use LiveKit Playground or integrated phone system

- [ ] Mobile app for supervisors   - Agent greets you automatically

- [ ] Voice biometrics for customer identification   

- [ ] Integration with calendar systems2. **Ask Questions**

- [ ] Payment processing for bookings   - Speak naturally: "What are your hours?"

- [ ] Customer satisfaction ratings   - Request services: "I need to book an appointment"

- [ ] Conversation recordings and playback   - AI responds immediately or escalates to supervisor

- [ ] AI training dashboard

3. **Wait for Escalated Answers**

---   - Agent will say: "Let me check with my supervisor"

   - Within seconds, you'll hear: "I've received an answer from my supervisor..."

<div align="center">   - Conversation continues naturally



**Made with ❤️ by the FrontDesk AI Team**### For Supervisors



[⬆ Back to Top](#-frontdesk-ai-voice-assistant)1. **Login to Dashboard**

   ```

</div>   URL: http://localhost:5000

   Default: supervisor / super123
   ```

2. **Monitor Questions**
   - Dashboard shows pending questions in real-time
   - Click on any question to view details

3. **Answer Questions**
   - Type your answer in the text field
   - Click "Resolve" button
   - Customer hears your answer within 3 seconds!

4. **Manage Knowledge Base**
   - Navigate to "Knowledge Base" section
   - Add/edit common questions and answers
   - AI learns from your responses

### For Administrators

1. **Login as Admin**
   ```
   URL: http://localhost:5000
   Default: admin / admin123
   ```

2. **Approve Supervisors**
   - View registration requests
   - Approve or reject new supervisors
   - Manage user roles

3. **View Analytics**
   - Customer activity timeline
   - Questions resolved per supervisor
   - Session duration and engagement metrics

4. **Manage System**
   - Edit knowledge base entries
   - View all questions and resolutions
   - Monitor system health

---

## 📊 Dashboard Features

### Main Dashboard
- **Active Questions Counter** - Real-time pending questions
- **Your Solved Questions** - Personal contribution metrics
- **User Activity Chart** - 24-hour customer engagement timeline
- **Recent Questions Grid** - Quick access to latest inquiries

### Questions Overview
- **Filter by Status** - All / Pending / Resolved / Delivered
- **Search Functionality** - Find specific questions
- **Quick Actions** - Answer and resolve from list view
- **Color-Coded Status** - Visual status indicators

### Knowledge Base Management
- **Add New Entries** - Create question-answer pairs
- **Edit Existing** - Update AI responses
- **Delete Entries** - Remove outdated information
- **Search & Filter** - Find specific topics

### Supervisor Management (Admin Only)
- **Registration Requests** - Approve new supervisors
- **Active Supervisors** - View all users
- **Role Management** - Assign admin/supervisor roles
- **User Activity** - Track login history

### Session Logs
- **Login History** - Track supervisor sessions
- **Activity Timeline** - Duration and timestamps
- **User Statistics** - Engagement metrics

---

## 🔌 API Reference

### Dashboard Endpoints

#### Authentication
```
POST /login
POST /register
GET /logout
```

#### Questions
```
GET /help-requests              # Get all questions
POST /help-requests/<id>/resolve # Answer a question
GET /knowledge-base             # Get all KB entries
POST /knowledge-base            # Create KB entry
PUT /knowledge-base/<id>        # Update KB entry
DELETE /knowledge-base/<id>     # Delete KB entry
```

#### Analytics
```
GET /user-activity              # Get customer voice sessions
GET /session-logs               # Get supervisor login history
GET /dashboard-data             # Get dashboard statistics
```

#### Supervisors (Admin Only)
```
GET /supervisors                # Get all supervisors
GET /registration-requests      # Get pending registrations
POST /approve-supervisor/<id>   # Approve registration
POST /reject-supervisor/<id>    # Reject registration
```

### Voice Agent Functions

#### Function Tools (Available to AI)

```python
@function_tool
def search_knowledge_base(query: str) -> str:
    """Search for answer in knowledge base"""
    
@function_tool  
def request_supervisor_help(
    customer_name: str,
    customer_phone: str, 
    question: str
) -> str:
    """Escalate question to human supervisor"""
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `LIVEKIT_URL` | LiveKit server WebSocket URL | `wss://your-project.livekit.cloud` |
| `LIVEKIT_API_KEY` | LiveKit API key | `APIxxxxxxxxxxxxx` |
| `LIVEKIT_API_SECRET` | LiveKit API secret | `secretxxxxxxxxxx` |
| `GOOGLE_API_KEY` | Google Gemini API key | `AIzaSyxxxxxxxxxx` |

### Voice Agent Settings

**File:** `agent_voice.py`

```python
# Gemini Model Configuration
MODEL = "gemini-2.0-flash-exp"
VOICE = "Puck"  # Options: Puck, Charon, Kore, Fenrir, Aoede

# Monitoring Intervals
HEARTBEAT_INTERVAL = 10  # seconds (customer activity tracking)
ANSWER_CHECK_INTERVAL = 3  # seconds (supervisor answer monitoring)
```

### Dashboard Settings

**File:** `app.py`

```python
# Flask Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
HOST = '0.0.0.0'
PORT = 5000
DEBUG = False  # Set to True for development
```

---

## 🐛 Troubleshooting

### Voice Agent Issues

**Problem:** Agent won't start - Port 8081 already in use

```bash
# Solution: Kill existing processes
lsof -ti:8081 | xargs kill -9
pkill -9 python
python agent_voice.py start
```

**Problem:** Gemini API quota exceeded

```
Solution: Check your Google AI Studio quota
- Visit: https://aistudio.google.com/app/apikey
- Verify billing is enabled
- Check rate limits
```

**Problem:** Customer can't hear agent

```
Solution: Check LiveKit connection
1. Verify LIVEKIT_URL in .env
2. Check API credentials
3. Ensure microphone permissions in browser
4. Test with LiveKit Playground first
```

### Dashboard Issues

**Problem:** Can't login to dashboard

```bash
# Solution: Reset database
python database.py
# Default credentials restored:
# admin / admin123
# supervisor / super123
```

**Problem:** Supervisor answers not delivered

```
Solution: Check voice agent is running
1. Ensure agent_voice.py is running
2. Check console logs for errors
3. Verify customer is still connected
4. Check database status: should be 'resolved'
```

**Problem:** User activity not showing

```
Solution: Customers must connect via voice
- Only voice sessions are tracked
- Check /user-activity endpoint returns data
- Ensure heartbeat task is running
```

### Database Issues

**Problem:** Database locked errors

```bash
# Solution: Close all connections
rm -f project.db-shm project.db-wal
# Restart both services
```

---

## 📁 Project Structure

```
frontdesk_project/
├── agent_voice.py              # Main voice agent (Gemini-powered)
├── app.py                      # Flask dashboard backend
├── database.py                 # Database schema and initialization
├── requirements.txt            # Python dependencies
├── restart_agent.sh            # Helper script to restart agent
├── .env                        # Environment variables (not in git)
├── .gitignore                  # Git ignore rules
├── project.db                  # SQLite database (auto-created)
│
├── dashboard/                  # Frontend files
│   ├── index.html             # Main dashboard page
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── login-history.html     # Session logs page
│   │
│   ├── images/                # Assets
│   │   ├── frontdesk.png      # Logo
│   │   └── favicon.png        # Favicon
│   │
│   └── static/                # CSS & JavaScript
│       ├── dashboard.css      # Legacy styles
│       ├── dashboard.js       # Dashboard logic
│       ├── dashboard-modern.css    # Modern UI styles
│       ├── dashboard-modern.js     # Modern UI logic
│       ├── login.css          # Login page styles
│       ├── login.js           # Login logic
│       ├── register.css       # Registration styles
│       ├── register.js        # Registration logic
│       ├── login-history.css  # Session log styles
│       ├── login-history.js   # Session log logic
│       ├── knowledge-modern.css    # KB styles
│       ├── supervisors-modern.css  # Supervisor page styles
│       ├── requests-modern.css     # Questions page styles
│       └── settings-modern.css     # Settings page styles
│
└── venv/                      # Virtual environment (not in git)
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `agent_voice.py` | Voice agent with Gemini AI, handles customer conversations |
| `app.py` | Flask web server, provides dashboard API endpoints |
| `database.py` | SQLite schema, creates tables and default users |
| `restart_agent.sh` | Bash script to restart agent (kills port 8081) |
| `requirements.txt` | Python package dependencies |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### Development Guidelines

- Follow PEP 8 style guide for Python
- Add docstrings to new functions
- Test voice agent thoroughly before PR
- Update README if adding new features

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **LiveKit** - Real-time communication platform
- **Google Gemini** - Multimodal AI capabilities
- **Silero VAD** - Voice activity detection
- **Flask** - Web framework
- **Chart.js** - Data visualization

---

## 📞 Support

Need help? Here's how to get support:

1. **Documentation** - Read this README thoroughly
2. **Issues** - Open a GitHub issue
3. **Discussions** - Join community discussions
4. **LiveKit Docs** - https://docs.livekit.io
5. **Gemini Docs** - https://ai.google.dev/gemini-api/docs

---

## 🎯 Roadmap


### Planned Features

- [ ] Multi-language support (Spanish, French, etc.)
- [ ] Voice emotion detection
- [ ] Call recording and playback
- [ ] SMS/Email notifications for supervisors
- [ ] Advanced analytics dashboard
- [ ] Mobile app for supervisors
- [ ] Calendar integration for appointments
- [ ] CRM integration (Salesforce, HubSpot)
- [ ] Custom voice training
- [ ] WebRTC direct connection (no LiveKit)

---

## 🔒 Security Notes

- **Never commit `.env` file** - Contains sensitive API keys
- **Change default passwords** - Update admin/supervisor credentials
- **Use HTTPS in production** - Secure dashboard with SSL
- **Rotate API keys regularly** - Update LiveKit and Gemini keys
- **Database backups** - Regularly backup `project.db`
- **Monitor API usage** - Track Gemini API quota and costs

---

## 📊 Performance Metrics

### Measured Performance

- **Agent Response Time:** ~500ms average
- **Supervisor Answer Delivery:** <3 seconds
- **Concurrent Customers:** Tested with 5+ simultaneous
- **Database Query Time:** <50ms average
- **Dashboard Load Time:** <1 second
- **Voice Quality:** HD audio (48kHz)

---

<div align="center">

**Made with ❤️ by Mohd Raza Khan**

[⬆ Back to Top](#-frontdesk-ai-voice-assistant)

</div>
# FrontDesk_AI_Voice_Assistant
