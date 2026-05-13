# 🚀 AI Challenge Generator

![License](https://img.shields.io/badge/License-MIT-lightgrey)
![Backend](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![Frontend](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)
![OpenAI](https://img.shields.io/badge/OpenAI-API-black?logo=openai)
![Auth](https://img.shields.io/badge/Auth-Clerk-orange)
![Deploy](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)

> A full-stack AI-powered platform that generates Python multiple-choice coding challenges using OpenAI, with authentication, history tracking, and user quota management.


## Table of Contents
- [Live Tech Stack & Resources](#-live-tech-stack--resources)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Application Flow](#-application-flow)
- [Requirements](#-requirements)
- [Backend Setup](#-backend-setup)
- [Run Backend](#-run-backend)
- [Frontend Setup](#-frontend-setup)
- [Run Frontend](#-run-frontend)
- [Deployment (Render)](#-deployment-render)
- [Clerk Configuration](#-clerk-configuration)
- [API Endpoints](#-api-endpoints)
- [OpenAI Integration](#-openai-integration)
- [Database](#-database)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🔗 Live Tech Stack & Resources

- 🤖 OpenAI API Platform: https://platform.openai.com/  
- 🔐 Clerk Authentication: https://go.clerk.com/naBxpyl  
- 🚀 Deployment Platform (Render): https://render.com/  

---

## ✨ Key Features

### 🧠 AI-Powered Learning
- Generates Python multiple-choice questions using OpenAI
- Difficulty levels: `easy`, `medium`, `hard`
- Structured JSON responses with validation
- Fallback system for reliability

### 🔐 Authentication & Security
- Clerk authentication (sign in / sign up)
- Protected routes (frontend)
- Secure backend token verification

### 📊 User System
- Per-user quota management
- Automatic quota creation via Clerk webhooks
- Daily quota reset mechanism

### 📚 Learning Experience
- Instant feedback after answering questions
- Detailed explanations for each answer
- Personal challenge history tracking

---

## 📁 Project Structure

```text
.
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── database.db
│   └── src/
│       ├── app.py
│       ├── ai_generator.py
│       ├── utils.py
│       ├── prompts/
│       │   └── challenge_system_prompt.txt
│       ├── database/
│       │   ├── model.py
│       │   └── db.py
│       └── routes/
│           ├── challenge.py
│           └── webhooks.py
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── auth/
│       ├── challenge/
│       ├── history/
│       ├── layout/
│       ├── pages/
│       └── utils/
└── README.md
```

## 🔄 Application Flow

1. User logs in via Clerk 🔐  
2. Frontend receives JWT token  
3. Token is sent to backend API  
4. Backend verifies token via Clerk  
5. User quota is checked  
6. OpenAI generates a challenge 🧠  
7. Challenge is stored in SQLite  
8. Frontend renders MCQ(Multiple Choice Questions) interface  
9. User result is saved to history 📊  

## ⚙️ Requirements

- Python `3.12` or newer
- Node.js (LTS recommended)
- Clerk account
- OpenAI API key
- uv Python package manager

Install uv:

```bash
pip install uv
```

## 🔧 Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Environment Variables:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret
```

## ▶️ Run Backend

```bash
uv run ./server.py
```

The backend runs at:

```text
http://localhost:8000
```

API Docs:

```text
http://localhost:8000/docs
http://localhost:8000/redoc
```

## 💻 Frontend Setup

```bash
cd frontend
npm install
```

Environment Variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=http://localhost:8000
```

For production deployment, create or update `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com
```
## ▶️ Run Frontend

```bash
npm run dev
```
Frontend runs at:

```text
http://localhost:5173
```

## 🚀 Deployment (Render)

### Backend (FastAPI)

```bash
pip install -r requirements.txt
uv run server.py
```

### Frontend (Static Site)

```bash
npm install && npm run build
```

## 🔐 Clerk Configuration

### Allowed Origins

```text
http://localhost:5173
http://localhost:5174
https://your-frontend-domain.com
```
## 🔌 API Endpoints

### Get Quota

```text
GET /api/quota
```
### Generate Challenge

```text
POST /api/generate-challenge
```
### Get History

```text
GET /api/history
```

## 🤖 OpenAI Integration

- **Model:** `gpt-4.1-nano`  
- **Platform:** https://platform.openai.com/  

**Prompt location:**
```text
backend/src/prompts/challenge_system_prompt.txt
```

## 🗄️ Database

- **Database:** SQLite (database.db) 
- **ORM:** SQLAlchemy  

**Tables:**
- challenges
- challenge_quotas

## 📈 Future Improvements
- 🏆 Leaderboard system
- 🧪 Code execution sandbox
- 🌍 Multi-language support
- 🎮 Gamification system
- 📊 Advanced analytics dashboard

## 👨‍💻 Author
Built as a full-stack AI engineering project using:
**React · FastAPI · OpenAI · Clerk · SQLite · Render**

