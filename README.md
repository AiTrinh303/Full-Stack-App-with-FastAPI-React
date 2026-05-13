# AI Challenge Generator

AI Challenge Generator is a full-stack application that generates Python multiple-choice challenges using AI. Users can sign in with Clerk, generate challenges based on difficulty level, answer questions, view explanations, and review their challenge history.

The project consists of two main parts:

- `frontend/`: React + Vite + Tailwind CSS + Clerk React
- `backend/`: FastAPI + SQLAlchemy + SQLite + Clerk Backend API + OpenAI

## Table of Contents

- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [Requirements](#requirements)
- [Backend Setup](#backend-setup)
- [Run Backend](#run-backend)
- [Frontend Setup](#frontend-setup)
- [Run Frontend](#run-frontend)
- [Clerk Configuration](#clerk-configuration)
- [Backend API](#backend-api)
- [Database](#database)
- [Troubleshooting](#troubleshooting)

## Key Features

- Public landing page at `/`
- Sign in and sign up with Clerk
- Protected routes for `/generate` and `/history`
- Generate Python questions using OpenAI with difficulty levels:
  - `easy`
  - `medium`
  - `hard`
- Display multiple-choice questions and answer options
- Show correct/incorrect feedback after answering
- Save generated challenges into SQLite
- Display challenge history per user
- Manage per-user challenge quota
- Clerk webhook integration for automatic quota creation

## Project Structure

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

## Application Flow

1. The user opens the React frontend.
2. The user signs in or signs up using Clerk.
3. Clerk provides an authentication token to the frontend.
4. The frontend sends requests to the backend using `fetch` with the following header:

```text
Authorization: Bearer <clerk_token>
```

5. The backend verifies the token using the Clerk Backend API.
6. The backend extracts the `user_id` from the Clerk token.
7. When the user generates a challenge, the backend checks the user's quota.
8. If quota is available, the backend calls OpenAI to generate a challenge.
9. The challenge is saved into SQLite.
10. The frontend displays the question, options, and explanation after the user selects an answer.

## Requirements

Required:

- Python `3.12` or newer
- Node.js and npm
- A Clerk account and Clerk application
- OpenAI API key
- uv (Python package & runner)

If `uv` is not installed, run:

```bash
pip install uv
```

## Backend Setup

Go to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment on Linux/macOS:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the file `backend/src/.env`:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret
```

### Backend Environment Variables

#### `CLERK_SECRET_KEY`

Clerk secret key used by the backend. The file `backend/src/utils.py` uses this variable to initialize the Clerk SDK client.

#### `OPENAI_API_KEY`

OpenAI API key. The file `backend/src/ai_generator.py` uses this key to generate challenges using the `gpt-4.1-nano` model.

#### `CLERK_WEBHOOK_SECRET`

Clerk webhook signing secret. The file `backend/src/routes/webhooks.py` uses this variable to verify incoming Clerk webhook requests.

## Run Backend

From the `backend/` directory:

```bash
uv run ./server.py
```

The backend will run at:

```text
http://localhost:8000
```

API documentation is available at:

```text
http://localhost:8000/docs
http://localhost:8000/redoc
```

## Frontend Setup

Open a second terminal and go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create or update `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Create or update `frontend/.env.development`:

```env
VITE_API_URL=http://localhost:8000
```

For production deployment, create or update `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Frontend Environment Variables

#### `VITE_CLERK_PUBLISHABLE_KEY`

Clerk publishable key. The file `frontend/src/auth/ClerkProviderWithRoutes.jsx` requires this variable to render the Clerk provider.

#### `VITE_API_URL`

Backend base URL. The file `frontend/src/utils/app.js` uses this variable for API requests with the `/api` prefix.

## Run Frontend

From the `frontend/` directory:

```bash
npm run dev
```

By default, Vite usually runs at:

```text
http://localhost:5173
```

Open this URL in your browser.

## Clerk Configuration

In the Clerk dashboard, configure the following for local development.

Add these URLs to Clerk allowed origins / authorized parties:

```text
http://localhost:5173
http://localhost:5174
```

The backend currently verifies requests against authorized parties defined in `backend/src/utils.py`:

```text
http://localhost:5173
http://localhost:5174
https://add-your-deployment-link-frontend
```

FastAPI CORS currently allows origins configured in `backend/src/app.py`:

```text
http://localhost:5173
https://add-your-deployment-link-frontend
```

## Clerk Webhook

The backend includes the webhook endpoint:

```text
POST /webhooks/clerk
```

This endpoint receives events from Clerk. When the event type is `user.created`, the backend automatically creates a quota record for the new user.

### Setup Steps

1. Open the Clerk dashboard.
2. Navigate to the Webhooks section.
3. Create a new endpoint:

```text
https://your-backend-domain.com/webhooks/clerk
```

For local testing, use ngrok or another tunnel tool:

```text
https://your-tunnel-url/webhooks/clerk
```

4. Subscribe to the `user.created` event.
5. Copy the webhook signing secret.
6. Add it to `backend/src/.env`:

```env
CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret
```

## Backend API

All challenge APIs are mounted with the `/api` prefix.

### Get Quota

```text
GET /api/quota
```

Requires Clerk authentication.

Example response when quota exists:

```json
{
  "id": 1,
  "user_id": "user_xxx",
  "quota_remaining": 49,
  "last_reset_date": "2026-05-13T12:00:00"
}
```

If the user does not yet have a quota record:

```json
{
  "user_id": "user_xxx",
  "quota_remaining": 0,
  "last_reset_date": "2026-05-13T12:00:00"
}
```

When the user generates their first challenge, the backend automatically creates a quota if it does not exist.

### Generate Challenge

```text
POST /api/generate-challenge
```

Requires Clerk authentication.

Request body:

```json
{
  "difficulty": "easy"
}
```

Supported difficulty values:

```text
easy
medium
hard
```

Response:

```json
{
  "id": 1,
  "difficulty": "easy",
  "title": "Question title",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_answer_id": 0,
  "explanation": "Why the answer is correct",
  "timestamp": "2026-05-13T12:00:00"
}
```

If quota is exceeded, the backend throws a quota error and the frontend displays:

```text
Daily quota exceeded
```

### Get Challenge History

```text
GET /api/history
```

Requires Clerk authentication.

Response:

```json
{
  "challenges": [
    {
      "id": 1,
      "difficulty": "easy",
      "created_by": "user_xxx",
      "title": "Question title",
      "options": "[\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"]",
      "correct_answer_id": 0,
      "explanation": "Why the answer is correct",
      "date_created": "2026-05-13T12:00:00"
    }
  ]
}
```

### Clerk Webhook

```text
POST /webhooks/clerk
```

This endpoint does not use the `/api` prefix. It verifies webhook signatures using `CLERK_WEBHOOK_SECRET`.

## Frontend Routes

### `/`

Landing page.

### `/sign-in/*`

Clerk sign-in page.

### `/sign-up/*`

Clerk sign-up page.

### `/generate`

Challenge generation page. This route is protected using `ProtectedLayout`.

### `/history`

Challenge history page. This route is also protected using `ProtectedLayout`.

## Database

The backend uses SQLite with SQLAlchemy.

Current database file:

```text
backend/database.db
```

Tables are defined in:

```text
backend/src/database/model.py
```

### `challenges` Table

Stores generated challenges.

Main columns:

- `id`
- `difficulty`
- `date_created`
- `created_by`
- `title`
- `options`
- `correct_answer_id`
- `explanation`

### `challenge_quotas` Table

Stores user quota information.

Main columns:

- `id`
- `user_id`
- `quota_remaining`
- `last_reset_date`

Default value for `quota_remaining` is `50`.

Inside `reset_quota_if_needed()`, if more than 24 hours have passed, the quota resets to `10`.

## OpenAI Challenge Generation

AI challenge generation file:

```text
backend/src/ai_generator.py
```

System prompt location:

```text
backend/src/prompts/challenge_system_prompt.txt
```

The backend expects OpenAI to return JSON in the following format:

```json
{
  "title": "Question title",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_answer_id": 0,
  "explanation": "Why the answer is correct"
}
```

If OpenAI fails or returns an invalid response, the backend falls back to a default Python `append()` question.

## Common Commands

Run backend using `uv`:

```bash
cd backend
uv run python server.py
```

Run frontend:

```bash
cd frontend
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

## Development Notes

- The backend loads environment variables using `python-dotenv`.
- The frontend can only access environment variables prefixed with `VITE_`.
- The backend runs on port `8000` by default.
- Vite runs on port `5173` by default.
- `frontend/src/layout/Layout.jsx` no longer exists in the current source code; routing now uses `ProtectedLayout.jsx`.
- Never commit real secrets inside `.env` files.