## SecTrack: Lightweight SIEM Dashboard

A full-stack project simulating a lightweight Security Information and Event Management (SIEM) dashboard.

---

### 🔧 Tech Stack

**Frontend**

- React
- Tailwind CSS

**Backend**

- Node.js
- Express

**Database**

- PostgreSQL (via Prisma or Sequelize ORM)

**Authentication**

- JSON Web Tokens (JWT)

**Stretch Goals**

- WebSocket-based live updates
- Python microservice for log parsing
- MITRE ATT&CK tactic tagging
- Google OAuth2 login

---

### 📁 File Structure

```
sectrack/
├── client/                 # React + Tailwind frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
│
├── server/                 # Node.js + Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/             # Sequelize or Prisma schemas
│   ├── middleware/
│   └── index.js
│
├── parser/ (optional)      # Python microservice for log parsing
│   └── log_parser.py
│
├── .env
├── README.md
└── docker-compose.yml (optional)
```

---

### ✅ Core Features

- User registration/login with JWT
- Log ingestion and tagging (from JSON files or API sim)
- Alert viewer with filtering, pagination, search
- Dashboard metrics (e.g. # of alerts per MITRE tactic)
- CRUD for alerts/logs

---

### 🧠 Stretch Goals

- Role-based access control (Admin vs Analyst)
- Log ingestion via cron job
- Live alert feed with WebSocket (Socket.io)
- Python log parser for simulated logs
- MITRE ATT&CK visualization (heatmap or tactic table)

---

### 📦 Project Setup (Coming Next)

- [ ] Backend `npm init`, Express server scaffold
- [ ] Frontend Vite + Tailwind setup
- [ ] PostgreSQL schema and initial dummy data
- [ ] Authentication (JWT)
- [ ] Basic log ingestion + alert API
- [ ] React dashboard UI
