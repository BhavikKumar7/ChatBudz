# 💬 ChatBudz — Real-Time Full-Stack Chat Application

<p align="center">
  <strong>A secure, scalable, real-time chat application built using the MERN stack.</strong>
</p>

---

## 🚀 Overview

**ChatBudz** is a real-time messaging platform developed as a full-stack project with production-grade architecture.  
It features secure authentication, live communication using WebSockets, email workflows, cloud media handling, and a modern responsive UI.

This project demonstrates **real-world backend + frontend integration**, not just UI-level functionality.

---

## ✨ Core Features

### 🔐 Authentication & Security
- Custom **JWT-based authentication**
- Secure password hashing
- Protected routes (frontend & backend)
- API rate-limiting using **Arcjet**

### ⚡ Real-Time Messaging
- Real-time 1-to-1 chat using **Socket.io**
- Live **online / offline presence**
- **Typing indicators**

### 🔔 User Experience
- Notification & typing sounds (toggle supported)
- Clean, responsive UI
- Image sharing inside chats

### 📨 Email & Media
- Automated **welcome emails** on signup
- Email service powered by **Resend**
- Image uploads using **Cloudinary**

### 🧠 Architecture
- RESTful API using **Node.js & Express**
- **MongoDB** for persistent storage
- Global state management using **Zustand**
- Clean Git & GitHub workflow (branches, PRs, merges)

### 🚀 Deployment Ready
- Free-tier friendly deployment (Sevalla)
- Environment-based configuration

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- DaisyUI
- Zustand
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.io
- JWT
- Arcjet (Rate Limiting)
- Cloudinary
- Resend Email API

---

## 📁 Project Structure

```text
CHATBUDZ/
│
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── controllers/        # Business logic (auth, chat, users)
│   │   ├── emails/             # Email templates & Resend logic
│   │   ├── lib/                # DB connection, socket setup, helpers
│   │   ├── middleware/         # Auth, rate-limit, error handlers
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routes
│   │   └── server.js           # Backend entry point
│   │
│   ├── .env                    # Backend environment variables
│   ├── package.json
│   ├── package-lock.json
│   └── README.md               # (optional) Backend documentation
│
├── frontend/
│   ├── node_modules/
│   │
│   ├── public/
│   │   ├── sounds/             # Notification & typing sounds
│   │   ├── avatar.png
│   │   ├── login.png
│   │   ├── signup.png
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Axios, socket client, helpers
│   │   ├── pages/              # Route-level pages
│   │   ├── store/              # Zustand global stores
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── eslint.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── README.md               # (optional) Frontend documentation
│
├── .gitignore
├── package.json                # (optional) root scripts / monorepo
└── README.md                   # Main project README
```

---

## 🧪 Environment Variables

### Backend (`/backend/.env`)

```bash
PORT=3000
MONGO_URI=your_mongo_uri_here

NODE_ENV=development

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

---

## ▶️ Running the Application Locally

### 🔧 Start Backend

```bash
cd backend
npm install
npm run dev
```

### 💻 Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Access the application at:

```text
http://localhost:5173
```

---

## 📌 Future Enhancements

- Group chats
- Read receipts
- Message reactions
- End-to-end encryption
- Voice & video calling