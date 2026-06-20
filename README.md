# 🔍 RepoScout

Find open-source projects and beginner-friendly issues based on your skills. Built for developers who want to start contributing to open source but don't know where to begin.

## Features

- **Skill-based discovery** — set your tech stack and get matched repos and issues
- **Good first issues** — curated beginner-friendly GitHub issues filtered by your skills
- **Bookmarks** — save repositories you want to contribute to
- **GitHub OAuth** — sign in with GitHub or register with email/password
- **Trending repos** — browse trending repositories by language

## Tech Stack

**Frontend**

- React 19 + Vite
- React Router v7
- Axios

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- GitHub OAuth

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [GitHub OAuth App](https://github.com/settings/developers) for GitHub login

### 1. Clone the repo

```bash
git clone https://github.com/sid551/repoScout.git
cd repoScout
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reposcout
JWT_SECRET=your_jwt_secret_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
# from project root
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

## Deployment

### Backend → Render

1. Create a new Web Service on [Render](https://render.com)
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from the backend `.env` above
6. Set `FRONTEND_URL` to your Vercel domain

### Frontend → Vercel

1. Import the repo on [Vercel](https://vercel.com)
2. Set root directory to the project root
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://your-render-service.onrender.com/api`

## Project Structure

```
repoScout/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Repositories.jsx
│   │   ├── Issues.jsx
│   │   ├── Bookmarks.jsx
│   │   ├── Skills.jsx
│   │   └── Login.jsx
│   └── services/
│       └── api.js
├── index.html
└── vite.config.js
```

## License

MIT
