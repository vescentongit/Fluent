![image alt](https://github.com/vescentongit/Fluent-UI-UX-Prototype/blob/a36176be46ca42386cf32b9364f0713e84d3bc20/f9a376fa-352f-4be0-b101-031ebd5fcbd3.png)

Fluent's UI/UX Prototype for BORNEO HackWKND

Project Name : Fluent

Tagline : Be Fluent with money. Be Fluent with life.

Team Members :
Shaquille Nathan Kalevi,
Muhammad Orkhan,
Rafel Dzinnun Muhammad,
Bagas Anugerah Putra,
Muhammad Zaky Amani.

Brief Summary :
The adoption of digital payment has skyrocketed in recent years. However, financial literacy remains at a very low level, especially in ASEAN countries. Although e-wallets and Paylater services have become dominant and are frequently used by the public, users often do not understand basic concepts such as compound interest or emergency preparedness. This has created a significant disaster protection gap, where the average user lacks liquid emergency funds or sufficient insurance to cope with regional risks such as economic volatility. Fluent is an AI-based Financial Assistant app that shifts from passive expense tracking to active behavior training. By leveraging a “Personal Financial Digital Twin” model, Fluent builds long term resilience through real-time guidance and predictive simulation.

Figma Link :
https://www.figma.com/design/kYgjPVe9JtfbmOZ5Ec8Kq7/UI-UX-Fluent-Prototype?node-id=0-1&t=FXmHfsLf1KgkQkUo-1

Figma Prototype Link :
https://www.figma.com/proto/kYgjPVe9JtfbmOZ5Ec8Kq7/UI-UX-Fluent-Prototype?page-id=0%3A1&node-id=1-2&viewport=366%2C288%2C0.24&t=tnf9Ktaq9SZRc2lF-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2&show-proto-sidebar=1

Youtube Link :
https://www.youtube.com/watch?v=tXEP-t7kDLM

Fluent Report :
[Link to File](https://github.com/vescentongit/Fluent-UI-UX-Prototype/blob/47ba293079f1c23eae640d35fcf1fbc0f75e04bb/Fluent%20by%20blukutuk77.pdf)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native · Expo Go · i18next (9 languages) · shadcn/ui |
| Backend | FastAPI · Python 3.14 · uvicorn · SQLAlchemy |
| AI | Groq LLaMA 3.3-70B · Linear Regression · SSE Streaming |
| Database | NeonDB (PostgreSQL Serverless) |
| Auth | JWT · bcrypt |
| Tunnel | localtunnel |

---

## Prerequisites

Make sure you have the following installed before starting:

- [Node.js](https://nodejs.org/) v18 or higher
- [Python](https://www.python.org/) 3.10 or higher
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go) app on your phone (iOS or Android)
- A [Groq API key](https://console.groq.com/) (free)
- A [NeonDB](https://neon.tech/) account (free tier is enough)

---

## 1. Clone the Repository

```bash
git clone https://github.com/vescentongit/Fluent.git
cd Fluent
```

---

## 2. Backend Setup

### 2.1 Navigate to the backend folder

```bash
cd Fluent_Project/src/backend
```

### 2.2 Install Python dependencies

```bash
pip install -r requirements.txt
```

> If you encounter issues on Python 3.14, add `--break-system-packages`:
> ```bash
> pip install -r requirements.txt --break-system-packages
> ```

### 2.3 Create the environment file

Create a `.env` file inside `Fluent_Project/src/backend/`:

```env
DATABASE_URL=postgresql://your_neondb_connection_string
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_random_jwt_secret_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

**Where to get these values:**

- `DATABASE_URL` — Go to [NeonDB dashboard](https://console.neon.tech/), create a project, and copy the connection string. It looks like:
  ```
  postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
  ```
- `GROQ_API_KEY` — Go to [console.groq.com](https://console.groq.com/), create an account, and generate an API key.
- `SECRET_KEY` — Any random string, e.g. run `openssl rand -hex 32` in your terminal.

### 2.4 Set up the database

The database tables are created automatically on first run via SQLAlchemy. No manual migration needed.

### 2.5 Start the backend server

```bash
uvicorn main:app --port 8000 --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

---

## 3. Expose Backend with localtunnel

The Expo Go app on your phone needs a public URL to reach the backend. Open a **new terminal** and run:

```bash
npm install -g localtunnel
lt --port 8000
```

You will get a URL like:
```
your url is: https://something-random.loca.lt
```

> **Important:** Every time you restart localtunnel, the URL changes. You must update `BASE_URL` in `api.js` each time.

### 3.1 Unlock the tunnel on your phone

Open the tunnel URL in the **browser on your phone** (e.g. `https://something-random.loca.lt`). If a verification page appears, get the password by running:

```bash
curl https://loca.lt/mytunnelpassword
```

Enter that password in the browser. Do this **before** opening the Fluent app.

---

## 4. Frontend Setup

### 4.1 Navigate to the project root

```bash
cd Fluent_Project
```

### 4.2 Install Node dependencies

```bash
npm install
```

### 4.3 Update the API base URL

Open `src/services/api.js` and update `BASE_URL` with your localtunnel URL:

```javascript
const BASE_URL = 'https://your-tunnel-url.loca.lt'; // ← paste your URL here
```

> Add this header to avoid localtunnel verification issues on API calls:
> ```javascript
> headers: {
>   'Content-Type': 'application/json',
>   'bypass-tunnel-reminder': 'true',
>   ...
> }
> ```

### 4.4 Start the Expo development server

```bash
npx expo start --clear
```

### 4.5 Open on your phone

1. Make sure your phone and laptop are on the **same Wi-Fi network**
2. Open the **Expo Go** app on your phone
3. Scan the QR code shown in the terminal

---

## 5. API Endpoints Reference

Once the backend is running, all endpoints are available at `http://localhost:8000`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Login and get JWT token | No |
| GET | `/api/resilience` | Get Financial Resilience Score | Yes |
| POST | `/api/chat` | AI chatbot (SSE streaming) | Yes |
| GET | `/api/digital-twin` | 90-day financial forecast | Yes |
| GET | `/api/nudge/check` | Get behavioral nudges | Yes |
| GET | `/api/nudge/tips` | Get financial tips | Yes |
| PUT | `/user/update` | Update user financial profile | Yes |

### Example: Register a user

```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "password": "yourpassword",
    "monthly_income": 5000000,
    "total_savings": 2000000,
    "has_insurance": false
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "yourpassword"
  }'
```

---

## 6. Demo Account

A pre-seeded demo account is available for quick testing:

```
Email:    budi@demo.com
Password: password123
```

---

## 7. Project Structure

```
Fluent/
└── Fluent_Project/
    ├── App.js                    # Root app with providers
    ├── src/
    │   ├── navigation/
    │   │   └── AppNavigator.js   # All screen routes
    │   ├── context/
    │   │   ├── UserContext.js    # Global financial state
    │   │   ├── TransactionContext.js
    │   │   ├── ThemeContext.js
    │   │   └── LessonContext.js
    │   ├── screens/              # All app screens
    │   ├── services/
    │   │   ├── api.js            # All API calls (update BASE_URL here)
    │   │   └── i18n.js           # Multilingual setup
    │   ├── locales/
    │   │   ├── en.json           # English translations
    │   │   ├── id.json           # Bahasa Indonesia
    │   │   └── my.json           # Malay
    │   ├── utils/
    │   │   └── storage.js        # AsyncStorage mock for Expo Go
    │   ├── components/           # Reusable components
    │   └── assets/               # Images and icons
    └── backend/
        ├── main.py               # FastAPI app entry point
        ├── schemas.py            # Pydantic request/response models
        ├── requirements.txt      # Python dependencies
        ├── Procfile              # Railway deployment config
        └── ai/
            ├── auth.py           # JWT authentication
            ├── chatbot.py        # Groq LLaMA chatbot
            ├── database.py       # NeonDB connection
            ├── digital_twin.py   # 90-day forecast engine
            ├── models.py         # SQLAlchemy ORM models
            ├── nudgelogic.py     # Behavioral nudge rules
            ├── resilience_score.py # 4-pillar score algorithm
            └── prompts/
                └── systemPrompt.py # AI system prompt templates
```

---

## 8. Common Issues & Fixes

### "JSON Parse error: Unexpected character: I"
The localtunnel URL needs to be unlocked from your phone's browser. Open the tunnel URL in the browser, enter the password from `curl https://loca.lt/mytunnelpassword`, then try again.

### "Native module is null" (AsyncStorage)
This is expected in Expo Go. The project uses `src/utils/storage.js` as an in-memory mock. Make sure all imports use `'../utils/storage'` not `'@react-native-async-storage/async-storage'`.

### 401 Unauthorized on API calls
Your JWT token is stored in memory. If the app restarts, you need to log in again. Navigate back to the Login screen and sign in.

### "SSL connection has been closed unexpectedly"
NeonDB connection timed out. Restart the uvicorn server:
```bash
uvicorn main:app --port 8000 --reload
```

### 500 Internal Server Error on /signup
Check that your `DATABASE_URL` in `.env` is correct and the NeonDB instance is active. NeonDB free tier hibernates after inactivity — open your NeonDB dashboard to wake it up.

### localtunnel URL expired
Every `lt --port 8000` restart generates a new URL. Update `BASE_URL` in `src/services/api.js` and unlock the new URL in your phone's browser.

---

## 9. Running in Production (Railway)

The backend includes a `Procfile` for Railway deployment:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

To deploy:
1. Push to GitHub
2. Connect the repo to [Railway](https://railway.app/)
3. Set environment variables in Railway dashboard (same as `.env`)
4. Update `BASE_URL` in `api.js` to the Railway public URL

---

## 10. Team

| Name | Role |
|---|---|
| Nathan | Frontend — React Native, Expo, UI/UX |
| Zaky | Backend — FastAPI, NeonDB, REST API |
| Rafel | Backend — FastAPI, NeonDB, REST API |
| Orkhan | AI Engineer — Groq, Resilience Score, Digital Twin |
| Bagas | AI Engineer — Groq, Nudge Logic, System Prompts |

---

## License

Built for Borneo Hackwknd 26. All rights reserved by team blukutuk77.
