# AI Challenge Generator

AI Challenge Generator is a full-stack web app that creates Python multiple-choice coding challenges with AI. Users sign in with Clerk, generate challenges by difficulty, answer them in the browser, and view their previous challenge history.

The project has two parts:

- `frontend/`: React 19 + Vite + Tailwind CSS + Clerk React
- `backend/`: FastAPI + SQLAlchemy + SQLite + Clerk Backend API + OpenAI

## Features

- Public landing page with sign-in and sign-up links
- Clerk authentication for protected pages
- AI-generated Python questions for `easy`, `medium`, and `hard` difficulty levels
- Multiple-choice answer UI with instant correct/incorrect feedback
- Explanation shown after answering a generated question
- Daily challenge quota stored per Clerk user
- Challenge history stored in SQLite and shown in the frontend
- Clerk webhook endpoint for creating quota records when new users are created

## Project Structure

```text
.
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── pyproject.toml
│   ├── database.db
│   └── src/
│       ├── app.py
│       ├── ai_generator.py
│       ├── utils.py
│       ├── prompts/
│       │   └── challenge_system_prompt.txt
│       ├── database/
│       │   ├── db.py
│       │   └── model.py
│       └── routes/
│           ├── challenge.py
│           └── webhooks.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
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

## How The App Works

The flow of the application is as follows:

```mermaid
flowchart TD

A[User opens React app] --> B[Clerk: Sign-in / Sign-up]

B --> C{Authenticated?}
C -- No --> B
C -- Yes --> D[Access protected pages]

D --> E[getToken() from Clerk]
E --> F[Send API request to FastAPI<br/>Authorization: Bearer <token>]

F --> G[Backend verifies Clerk token]

G --> H{Quota available?}
H -- No --> H1[Reject / Show quota limit]
H -- Yes --> I[Call OpenAI API<br/>Generate Python MCQ]

I --> J[Save challenge to SQLite]

J --> K[Return question + options]

K --> L[Frontend displays question]

L --> M[User selects answer]

M --> N[Frontend shows result + explanation]

## Prerequisites

Install these before running the project:

- Python `3.12` or newer
- Node.js and npm
- A Clerk application
- An OpenAI API key

Optional:

- `uv`, if you prefer using the Python project files in `backend/pyproject.toml` and `backend/uv.lock`
- A webhook forwarding tool such as ngrok or the Clerk CLI if you want to test Clerk webhooks locally

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create and activate a Python virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows PowerShell, activate it with:

```powershell
.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create the backend environment file at `backend/src/.env`:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
JWT_KEY=your_clerk_jwt_public_key
OPENAI_API_KEY=your_openai_api_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret
```

### Backend Environment Variables

`CLERK_SECRET_KEY`

Your Clerk backend secret key. The backend uses this to initialize the Clerk SDK.

`JWT_KEY`

The Clerk JWT public key used when authenticating incoming requests. This is passed to Clerk's `authenticate_request()` helper.

`OPENAI_API_KEY`

Your OpenAI API key. The backend uses this in `src/ai_generator.py` to generate challenge content.

`CLERK_WEBHOOK_SECRET`

The signing secret for the Clerk webhook endpoint. It is required by `POST /webhooks/clerk`.

## Run The Backend

From the `backend/` folder, run:

```bash
python server.py
```

The backend starts on:

```text
http://localhost:8000
```

Test that it is running:

```bash
curl http://localhost:8000/
```

Expected response:

```json
{"message":"Backend is running"}
```

The SQLite database is created automatically from the SQLAlchemy models. The current database file is:

```text
backend/database.db
```

## Frontend Setup

Open a second terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Create or update the frontend environment files.

For local development, use `frontend/.env` or `frontend/.env.development`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:8000
```

For production, use `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com
```

If your production build also needs the Clerk key from this file, include:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Frontend Environment Variables

`VITE_CLERK_PUBLISHABLE_KEY`

Your Clerk publishable key. The React app requires this before rendering the Clerk provider.

`VITE_API_URL`

The backend base URL. In local development this should usually be `http://localhost:8000`.

`VITE_DEBUG`

This exists in the local environment files but is not currently used by the source code.

## Run The Frontend

From the `frontend/` folder, run:

```bash
npm run dev
```

The frontend normally starts on:

```text
http://localhost:5173
```

Open that URL in your browser.

## Clerk Configuration

In your Clerk dashboard, configure the app so local development URLs are allowed.

Recommended local URLs:

```text
http://localhost:5173
http://localhost:5174
```

The backend currently allows authenticated requests from these authorized parties:

```text
http://localhost:5173
http://localhost:5174
https://full-stack-app-with-fastapi-react.onrender.com
```

The FastAPI CORS configuration currently allows:

```text
http://localhost:5173
https://full-stack-app-with-fastapi-react.onrender.com
```

If Vite starts on a different port, update the CORS `origins` list in `backend/src/app.py` and the Clerk authorized parties list in `backend/src/utils.py`.

## Clerk Webhook Setup

The backend has a Clerk webhook route:

```text
POST /webhooks/clerk
```

This endpoint listens for Clerk events. When the event type is `user.created`, the backend creates an initial challenge quota record for that user.

To configure it:

1. Open the Clerk dashboard.
2. Go to the webhook settings for your application.
3. Add an endpoint that points to your backend:

```text
https://your-backend-domain.com/webhooks/clerk
```

For local testing, expose your backend with a tunnel and use the tunnel URL:

```text
https://your-tunnel-url/webhooks/clerk
```

4. Subscribe to the `user.created` event.
5. Copy the webhook signing secret.
6. Put the value in `backend/src/.env` as `CLERK_WEBHOOK_SECRET`.

## API Routes

### Health Check

```text
GET /
```

Returns:

```json
{"message":"Backend is running"}
```

### Get Challenge Quota

```text
GET /api/quota
```

Requires a Clerk bearer token.

Returns the current user's remaining challenge quota and reset date.

### Generate Challenge

```text
POST /api/generate-challenge
```

Requires a Clerk bearer token.

Request body:

```json
{
  "difficulty": "easy"
}
```

Valid difficulty values used by the frontend:

```text
easy
medium
hard
```

Returns a generated challenge:

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

If the user has no quota left, the backend returns a quota error.

### Get Challenge History

```text
GET /api/history
```

Requires a Clerk bearer token.

Returns all challenges created by the current user:

```json
{
  "challenges": []
}
```

### Clerk Webhook

```text
POST /webhooks/clerk
```

Verifies the Clerk webhook signature and creates a quota record when a new Clerk user is created.

## Frontend Pages

`/`

Landing page with links to sign in and sign up.

`/sign-in/*`

Clerk sign-in page.

`/sign-up/*`

Clerk sign-up page.

`/generate`

Protected page where signed-in users can generate AI Python challenges.

`/history`

Protected page where signed-in users can review previously generated challenges.

## Database Models

The backend uses SQLite through SQLAlchemy.

### Challenge

Stores each generated challenge.

Important fields:

- `difficulty`
- `created_by`
- `title`
- `options`
- `correct_answer_id`
- `explanation`
- `date_created`

### ChallengeQuota

Stores each user's available quota.

Important fields:

- `user_id`
- `quota_remaining`
- `last_reset_date`

New quota records default to `50` remaining challenges. When a quota is reset after 24 hours, the code currently resets it to `10`.

## OpenAI Challenge Generation

The backend prompt is stored in:

```text
backend/src/prompts/challenge_system_prompt.txt
```

The AI generator asks OpenAI to return JSON with this shape:

```json
{
  "title": "Question title",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_answer_id": 0,
  "explanation": "Why the answer is correct"
}
```

If AI generation fails, the backend returns a fallback Python list question so the app can still respond.

## Useful Commands

Backend:

```bash
cd backend
source .venv/bin/activate
python server.py
```

Frontend:

```bash
cd frontend
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

Lint frontend:

```bash
cd frontend
npm run lint
```

Preview production frontend build:

```bash
cd frontend
npm run preview
```

## Troubleshooting

### Frontend says the Clerk publishable key is missing

Make sure this variable exists in the frontend environment file:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Then restart the Vite dev server.

### Frontend cannot reach the backend

Check `VITE_API_URL`.

For local development:

```env
VITE_API_URL=http://localhost:8000
```

Also confirm the backend is running:

```bash
curl http://localhost:8000/
```

### Browser shows a CORS error

Make sure the frontend URL is listed in `backend/src/app.py`.

For example, if Vite runs on `http://localhost:5174`, add it to the `origins` list.

### API returns authentication errors

Check these values in `backend/src/.env`:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
JWT_KEY=your_clerk_jwt_public_key
```

Also check the authorized parties in `backend/src/utils.py`. They must match the frontend URL used in the browser.

### Webhook returns `CLERK_WEBHOOK_SECRET not set`

Add the webhook signing secret to `backend/src/.env`:

```env
CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret
```

Restart the backend after changing the environment file.

### OpenAI generation fails

Check:

- `OPENAI_API_KEY` exists in `backend/src/.env`
- the API key is valid
- the OpenAI account has access to the configured model

The app has a fallback challenge, so generation failures may still return a basic Python question.

## Development Notes

- The backend loads environment variables with `python-dotenv`.
- The frontend only exposes environment variables prefixed with `VITE_`.
- The backend currently runs on port `8000`.
- The Vite frontend normally runs on port `5173`.
- The database tables are created automatically when `backend/src/database/model.py` is imported.
- Keep secret values out of git. Do not commit real `.env` files.
