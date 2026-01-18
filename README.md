# Me-API-PLAYGROUND

A full-stack developer portfolio application that exposes a personal API. Built to demonstrate CRUD operations, database management, and modern frontend integration.

## 🚀 Live Links
- **Frontend (Portfolio UI):** [https://portfolio-arunkumarsingh.vercel.app/](https://portfolio-arunkumarsingh.vercel.app/)
- **Backend API:** [https://me-api-playground-wk7r.onrender.com](https://me-api-playground-wk7r.onrender.com)
- **Resume:** [https://drive.google.com/file/d/1HHSo9FZGhOKQO60D53l19Ozo-bccutfj/view?usp=drive_link](https://drive.google.com/file/d/1HHSo9FZGhOKQO60D53l19Ozo-bccutfj/view?usp=drive_link)

## 🛠 Architecture
- **Frontend:** React + Vite + Tailwind CSS (Glassmorphism UI)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via Prisma ORM) on Render/Neon
- **Hosting:** Vercel (Client) & Render (Server)

## ⚙️ Setup Instructions
1. Clone the repo.
2. Install dependencies: `npm install` (root) and `cd client && npm install`.
3. Set up `.env` with `DATABASE_URL`.
4. Run migrations: `npx prisma migrate dev`.
5. Seed data: `node prisma/seed.js`.
6. Start: `npm run dev` (client) and `node index.js` (server).

## 📡 API Endpoints
- `GET /profile` - Returns full portfolio data.
- `GET /projects` - Returns all projects.
- `GET /search?q=React` - Filters projects by title or skill.
- `GET /health` - Server status check.

## ⚠️ Known Limitations
- The backend is hosted on Render's free tier, so it may take 50 seconds to "wake up" after inactivity.
