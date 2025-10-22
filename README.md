<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12&height=200&section=header&text=FrontDesk%20AI&fontSize=72&fontAlignY=35&animation=twinkling&desc=Your%2024/7%20Intelligent%20Voice%20Receptionist&descAlignY=55&descSize=16" alt="banner"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=26&duration=2500&pause=800&color=6366F1&center=true&vCenter=true&width=700&lines=AI-Powered+Voice+Assistant;Real-Time+Supervisor+Escalation;Built+with+Flask%2C+LiveKit%2C+and+Gemini" alt="typing" />

<br/>

<p>
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white"/>
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white"/>
  <img src="https://img.shields.io/badge/LiveKit-Voice-FF5E5B?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Gemini-2.0-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge"/>
  
</p>

[Features](#-features) • [Quick Start](#-quick-start) • [Dashboard](#-dashboard) • [API](#-api)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="900" alt="hero-gif">

</div>

---

## 🌟 Overview

FrontDesk AI is a voice-first receptionist that answers common questions and escalates anything tricky to a human supervisor in seconds.

```mermaid
graph LR
    A[📞 Customer] -->|Voice| B[🤖 AI Agent]
    B -->|Knows| C[✅ Instant Response]
    B -->|Needs Help| D[👨‍💼 Supervisor]
    D -->|Guides| B
    B -->|Delivers| A
    
    style A fill:#667eea,stroke:#4f46e5,color:#fff
    style B fill:#f093fb,stroke:#f5576c,color:#fff
    style C fill:#4facfe,stroke:#00f2fe,color:#fff
    style D fill:#43e97b,stroke:#38f9d7,color:#fff
```

---

## ✨ Features

- 🎙️ Natural voice conversations (LiveKit + Gemini)
- 🚀 Instant answers from a built-in knowledge base
- 📈 Dashboard with charts, activity, and recent questions
- 📚 CRUD for knowledge base (add, edit, delete)
- 🔐 Auth with roles: Admin and Supervisor
- 🔔 Escalations with real-time supervisor flow

```mermaid
sequenceDiagram
    participant C as Customer
    participant AI as AI Agent
    participant KB as Knowledge Base
    participant S as Supervisor
    C->>AI: Ask question
    AI->>KB: Search answer
    alt Found
        KB-->>AI: Return answer
        AI-->>C: Respond
    else Not found
        AI-->>S: Escalate
        S-->>AI: Provide answer
        AI-->>KB: Save for future
        AI-->>C: Deliver
    end
```

---

## 🚀 Quick Start

> macOS example shown; adapt paths if different.

```bash
# 1) Clone
git clone https://github.com/mohdrazakhan/FrontDesk_AI_Voice_Assistant.git
cd FrontDesk_AI_Voice_Assistant/frontdesk_project

# 2) Create and activate venv
python3 -m venv venv
source venv/bin/activate

# 3) Install deps
pip install -r requirements.txt

# 4) Configure environment
# If you have an example file, copy it; otherwise create .env manually
# LIVEKIT_URL=...  LIVEKIT_API_KEY=...  LIVEKIT_API_SECRET=...
# GOOGLE_API_KEY=...  FLASK_SECRET_KEY=...

# 5) Initialize database
python database.py

# 6) Run
python app.py            # Dashboard at http://127.0.0.1:5001
python agent.py dev      # In another terminal: start the voice agent
```

Default demo accounts (change after first login):

| Role | Username | Password |
|------|----------|----------|
| 👑 Admin | admin | admin123 |
| 👨‍💼 Supervisor | supervisor | super123 |

---

## 🎨 Dashboard

The web dashboard includes:

- Overview metrics and charts (Chart.js)
- Knowledge Base manager (add/edit/delete)
- Requests with quick answers and bookmarks
- User management for supervisors (Admin)

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/213760697-1dc03683-ba49-42f5-a9f0-c9f3b8f6f9c4.gif" width="700" alt="dashboard-gif">
</div>

---

## 🔌 API

Minimal reference of key endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Login user |
| POST | `/register` | Register supervisor |
| GET | `/logout` | Logout |
| GET | `/check-auth` | Session check |
| GET | `/requests` | List help requests |
| POST | `/answer_request` | Submit answer |
| GET | `/knowledge_base` | List KB entries |
| POST | `/knowledge_base/add` | Add entry |
| PUT | `/knowledge_base/<id>` | Update entry |
| DELETE | `/knowledge_base/<id>` | Delete entry |

---

## 🐛 Troubleshooting

- Port 5001 busy → change `app.run(port=5002)` or free the port.
- DB locked → close SQLite viewers and restart the app.
- Agent not connecting → verify `.env` LiveKit and Google keys.

---

## 📝 License

MIT — free for commercial and personal use.

---

<div align="center">

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="480" alt="thanks">

### Built with ❤️ to make support effortless

If this project helps you, please ⭐ the repo.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" alt="footer"/>

</div>
