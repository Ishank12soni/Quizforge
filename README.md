# Quizforge – Industrial IoT Quiz Platform

A full-stack web-based quiz management and online assessment platform designed for the B.Tech Industrial Internet of Things (IoT) course.

Quizforge provides an interactive student quiz portal, automatic scoring, quiz history, performance tracking, and an administrative dashboard for managing quizzes and monitoring student performance.

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- React Router

### Backend

- Node.js
- Express.js
- PostgreSQL
- PostgreSQL `pg` package
- CORS

### Development Tools

- Git
- GitHub
- Visual Studio Code
- npm

---

## Project Architecture

Quizforge follows a separate frontend and backend architecture.

```text
Quizforge/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── package-lock.json
│
├── public/
├── README.md
├── package.json
└── .gitignore