# 🏥 MediCore AI — Hospital Management System

> A fully advanced, AI-powered Hospital Management System with futuristic UI/UX, real-time monitoring, and startup-level features.

![MediCore AI](https://img.shields.io/badge/MediCore-AI%20Healthcare-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI, JWT secret, etc.
```

### 3. Seed Database (Optional)

```bash
cd backend
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medicore.com | admin123 |
| Doctor | doctor@medicore.com | doctor123 |
| Receptionist | reception@medicore.com | recep123 |

---

## 📁 Project Structure

```
Hospital Management/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── layout/       # Layout components (Sidebar, Header)
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand state management
│   │   ├── lib/              # Utilities and mock data
│   │   └── App.jsx           # Root component with routing
│   └── vite.config.js
│
├── backend/                  # Node.js + Express backend
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route handlers
│   ├── middleware/           # Auth & validation middleware
│   ├── scripts/              # Database seeder
│   └── server.js             # Main server entry point
│
└── README.md
```

---

## 🎯 Core Modules

| Module | Features |
|--------|----------|
| 🔐 Authentication | JWT, Role-based access, Demo accounts |
| 📊 Dashboard | Real-time stats, Charts, AI insights, Live feed |
| 👥 Patients | CRUD, Medical history, AI risk scoring, QR codes |
| 👨‍⚕️ Doctors | Profiles, Availability, Ratings, Status tracking |
| 📅 Appointments | Booking, Slot management, AI recommendations |
| 🚨 Emergency | SOS button, Ambulance dispatch, ICU tracking |
| 💰 Billing | Invoices, Insurance, PDF export, Payment tracking |
| 💊 Pharmacy | Inventory, Stock alerts, AI demand prediction |
| 🧪 Laboratory | Test booking, Reports, AI analysis |
| 🛏️ Beds | Real-time availability, Ward management |
| 📈 Analytics | Revenue charts, Patient trends, Performance |
| 🤖 AI Assistant | Chatbot, Symptom checker, Medicine interactions |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8** — Fast development
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Recharts** — Data visualization
- **Zustand** — State management
- **React Router v7** — Client-side routing
- **Lucide React** — Icon library

### Backend
- **Node.js** + **Express.js** — REST API
- **MongoDB** + **Mongoose** — Database
- **Socket.IO** — Real-time features
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Helmet** + **Rate Limiting** — Security

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

### Backend (Railway/Render)
```bash
# Set environment variables in your hosting platform
# Deploy backend/ directory
```

### Environment Variables Required
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key for JWT tokens
- `OPENAI_API_KEY` — For AI features (optional)
- `CLOUDINARY_*` — For file uploads (optional)

---

## 🔮 AI Features

- **Risk Score Prediction** — AI-calculated patient risk assessment
- **Symptom Checker** — AI-powered symptom analysis
- **Medicine Interaction** — Drug interaction detection
- **Demand Forecasting** — Pharmacy stock predictions
- **Health Insights** — AI-generated dashboard insights
- **AI Chatbot** — Healthcare assistant with voice support

---

## 📱 Responsive Design

The application is fully responsive and works on:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1024px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

---

## 🔒 Security Features

- JWT authentication with expiry
- Password hashing with bcrypt (12 rounds)
- Rate limiting on all API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Role-based access control

---

## 📄 License

MIT License — Built with ❤️ for modern healthcare
