# 🚀 DEVCHAT — Developer Collaboration & AI Workspace

DEVCHAT is a **real-time developer collaboration platform** designed to provide a cohesive workspace with in-browser code execution, AI assistance, and direct messaging.

---

## 📌 What This Project Demonstrates

- Full-stack MERN application (MongoDB, Express, React, Node.js)
- Real-time communication using Socket.io
- In-browser code execution via WebContainers
- AI integration using Google Generative AI (Gemini)
- Redis for JWT token blacklisting (secure logout) and real-time operations

---

## ✨ Features

### 👤 User
- Register / Login
- Secure JWT Authentication
- Redis-backed token invalidation to ensure logged-out tokens cannot be reused

### 🛠️ Project Workspace
- Create and manage projects
- Invite users to collaborate
- Real-time group chat within projects
- Live File Tree and Explorer

### 🤖 AI Integration
- AI-powered coding assistant using Gemini API
- Generate code, get results, and solve developer queries within the chat

### ⚡ In-Browser Execution
- Run applications directly in the browser using WebContainers

---

## 🧰 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- Socket.io-client
- WebContainer API

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (ioredis)
- Socket.io
- Google Generative AI
- JWT & Bcrypt

---

## 🏗️ Architecture Overview

- **Frontend**: React SPA communicating via REST APIs and WebSockets.
- **Backend Core**: Express server handling business logic, authentication, and database operations.
- **Real-Time Layer**: Socket.io enabling live chat, file updates, and workspace syncing.
- **AI Service**: Express service integrated with Gemini for generating and processing AI queries.
- **Execution Service**: WebContainers loaded on the client-side to sandbox and run user code.

---

## 📁 Project Structure

```
DEVCHAT/
  ├── frontend/
  │   ├── src/
  │   │   ├── components/
  │   │   ├── screens/
  │   │   ├── context/
  │   │   └── config/
  └── backend/
      ├── controllers/
      ├── models/
      ├── routes/
      ├── services/
      └── db/
```

---

## ⚙️ Prerequisites

- Node.js (v18+)
- MongoDB
- Redis
- npm / yarn
- Google Gemini API Key

---

## 🚀 Setup & Run

### 1. Clone Repository

```bash
git clone https://github.com/Prashantbhati7/DEVCHAT.git
cd DEVCHAT
```

---

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

### 3. Setup Environment Variables

Create `.env` file in the `backend/` directory with the following configuration:

- MongoDB Connection URL
- PORT
- JWT_SECRET
- REDIS_URL
- GOOGLE_GEMINI_API_KEY (or similar AI API Key)

Create `.env` file in the `frontend/` directory if required by Vite for API base URLs.

---

### 4. Start Infrastructure

Ensure these are running locally or remotely:

- MongoDB Database
- Redis Server

---

### 5. Run Backend Server

```bash
cd backend
node server.js
```

---

### 6. Run Frontend Server

```bash
cd frontend
npm run dev
```

---

### 7. Open App

```
http://localhost:5173 
```
*(Default Vite port, may vary depending on your configuration)*

---

## ⚠️ Notes

- Both frontend and backend must run simultaneously.
- Redis server must be active for web-socket and caching operations.
- To use the AI features, a valid Gemini API key is configured properly.

---

## 👤 Author

**Prashant Bhati**


