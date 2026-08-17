# Job Application Tracker

A full-stack web app for tracking your job applications. Log jobs, update statuses, add notes, and manage your profile — all in one place.

**GitHub:** [https://github.com/SachinRay-09/Job-Application-Tracker.git](https://github.com/SachinRay-09/Job-Application-Tracker.git)

---

## Features

- User registration and login with JWT authentication (stored in HTTP-only cookies)
- Add job applications with job title, skills, link, status, and notes
- View all applications on the home dashboard
- Filter applications by status: `pending`, `interviewing`, `rejected`, `accepted`
- Update or delete existing applications
- Track total interviewing and accepted application counts
- Profile page to update personal info (name, age, occupation, tech stack, years of experience)
- Secure password hashing with bcryptjs
- Protected routes via JWT middleware

---

## Tech Stack

### Client
- React 19
- React Router v7
- Tailwind CSS v4
- Vite

### Server
- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcryptjs (password hashing)
- cookie-parser + CORS

---

## Project Structure

```
Job Application Tracker/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── pages/        # AuthPage, HomePage, ProfilePage
│       └── components/   # ApplicationForm, Card, NavigationTray
└── server/               # Express backend
    ├── controller/       # userController.js
    ├── model/            # User schema (with embedded applications)
    ├── routes/           # API routes
    ├── middleware/        # JWT auth middleware
    ├── utils/            # Token generation
    └── config/           # MongoDB connection
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### Server Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

```bash
npm run dev
```

### Client Setup

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173`. Make sure the server is running on the port specified in your `.env`.

---

## API Endpoints

All routes are prefixed with `/jobapptracker`.

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login |
| POST | `/logout` | No | Logout (clears cookie) |
| GET | `/applications` | Yes | Get all applications |
| POST | `/applications` | Yes | Add a new application |
| PATCH | `/applications` | Yes | Update an application |
| DELETE | `/applications` | Yes | Delete an application |
| POST | `/applications/filter` | Yes | Get applications by status |
| GET | `/applications/count` | Yes | Get interviewing/accepted counts |
| GET | `/user` | Yes | Get user profile data |
| PUT | `/user` | Yes | Update user profile |

---

## Application Status Values

- `pending` — Applied, awaiting response
- `interviewing` — Currently in interview process
- `accepted` — Offer received
- `rejected` — Application rejected
