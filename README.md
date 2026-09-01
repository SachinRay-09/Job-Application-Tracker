# Job Application Tracker

A full-stack web app to track your job applications. Log jobs, update statuses, add notes, and manage your profile — all in one place.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Auth:** JWT via HTTP-only cookies

## Project Structure

```
├── client/       # React frontend (Vite)
└── server/       # Express backend
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)

### Backend

```bash
cd server
npm install
# create .env (see Environment Variables below)
npm run dev
```

### Frontend

```bash
cd client
npm install
# create .env (see Environment Variables below)
npm run dev
```

## API Routes

All routes are prefixed with `/jobapptracker`.

| Method | Path                            | Auth | Description                  |
|--------|---------------------------------|------|------------------------------|
| POST   | `/register`                     | No   | Register a new user          |
| POST   | `/login`                        | No   | Login and receive a cookie   |
| POST   | `/logout`                       | No   | Clear auth cookie            |
| GET    | `/api/user/data`                | Yes  | Get profile data             |
| POST   | `/api/user/updateData`          | Yes  | Update profile               |
| GET    | `/api/user/allApplicationData`  | Yes  | Get all applications         |
| POST   | `/api/user/specificapplicationData` | Yes | Get applications by status |
| POST   | `/api/user/addData`             | Yes  | Add a new application        |
| POST   | `/api/user/updateApplication`   | Yes  | Update an application        |
| POST   | `/api/user/deleteApplication`   | Yes  | Delete an application        |

## License

MIT
