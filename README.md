# VaultFlow — Secure Double-Entry Banking & Immutable Ledger

> *"Your funds. Secured. Always flowing."*

![VaultFlow Banner](https://img.shields.io/badge/VaultFlow-FinTech-6366f1?style=for-the-badge&logo=shield&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v22+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📌 Overview

**VaultFlow** is a full-stack **double-entry ledger banking system** that demonstrates production-grade financial software engineering. Unlike typical CRUD banking demos, VaultFlow implements the core patterns used by real financial systems:

- **Immutable ledger entries** — every transaction creates permanent CREDIT + DEBIT records
- **ACID multi-document transactions** — atomic MongoDB sessions prevent partial writes
- **Idempotency protection** — duplicate requests are safely detected and resolved
- **Dynamic balance aggregation** — balances computed from the ledger in real-time via MongoDB pipelines
- **Total portfolio balance** — server-side aggregation across all accounts in a single API call

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | HTTP-only cookie + MongoDB token blacklist on logout |
| 💳 Multi-Account Support | Multiple ledger accounts per user, per-account balance tracking |
| 📊 Real-time Balance | Computed from ledger aggregate — never stored as a field |
| 💰 Portfolio Total | New endpoint aggregates total balance across all accounts |
| 🔁 Idempotent Transfers | UUID-keyed requests prevent double-spending on retries |
| ⚡ Atomic Transfers | MongoDB sessions — all-or-nothing double-entry commits |
| 📜 Immutable Audit Trail | Mongoose pre-hooks block ledger modification at model layer |
| 📧 Email Notifications | Nodemailer integration on transaction completion |
| 📱 Responsive UI | Mobile-first React + CSS Modules design system |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | v22+ | Runtime |
| Express | v5.x | REST API framework |
| MongoDB | Atlas | Document database |
| Mongoose | v9.x | ODM + schema validation |
| bcryptjs | v3.x | Password hashing |
| jsonwebtoken | v9.x | JWT auth tokens |
| Nodemailer | v9.x | Email notifications |
| cors | v2.x | CORS configuration |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | v19 | UI library |
| TypeScript | v6.x | Type safety |
| Vite | v8.x | Build tool & dev server |
| TanStack Query | v5.x | Server state management |
| React Router | v7.x | Client-side routing |
| Zustand | v5.x | Auth global state |
| Axios | v1.x | HTTP client |
| Framer Motion | v12.x | Animations |
| Lucide React | v1.x | Icons |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VaultFlow Architecture                  │
├─────────────────┬───────────────────┬───────────────────────┤
│   React SPA     │    Express API    │     MongoDB Atlas     │
│   (Frontend)    │    (Backend)      │     (Database)        │
├─────────────────┼───────────────────┼───────────────────────┤
│ • Vite + TSX    │ • REST Routes     │ • Users Collection    │
│ • TanStack Qry  │ • JWT Middleware  │ • Accounts Collection │
│ • Zustand Store │ • Controllers     │ • Transactions        │
│ • CSS Modules   │ • Session ACID    │ • Ledger Entries      │
│ • Framer Motion │ • Email Service   │ • Blacklisted Tokens  │
└─────────────────┴───────────────────┴───────────────────────┘
```

### The 10-Step Transfer Flow
```
1.  Validate request fields
2.  Check idempotency key (prevent duplicate processing)
3.  Verify both account statuses are ACTIVE
4.  Derive sender balance from ledger aggregate
5.  Check sufficient funds
6.  Create transaction record (PENDING)
7.  Write DEBIT ledger entry  ──┐
8.  Write CREDIT ledger entry ──┘  (inside MongoDB session)
9.  Mark transaction COMPLETED
10. Commit session + send email notification
```

---

## 📁 Folder Structure

```
VaultFlow/
├── backend/
│   ├── server.js                    # Entry point
│   └── src/
│       ├── app.js                   # Express setup + CORS
│       ├── config/                  # DB connection
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── account.controller.js
│       │   └── transaction.controller.js
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── models/
│       │   ├── user.model.js
│       │   ├── account.model.js     # getBalance() aggregation method
│       │   ├── transaction.model.js
│       │   ├── ledger.model.js      # Immutable (pre-hooks)
│       │   └── blackList.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── account.routes.js
│       │   └── transactions.routes.js
│       └── services/
│           └── email.service.js
│
└── frontend/
    ├── index.html
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── router/
        ├── store/                   # Zustand auth store
        ├── services/                # Axios API clients
        ├── types/                   # TypeScript interfaces
        ├── utils/                   # Format helpers
        ├── styles/                  # Global CSS + tokens
        ├── components/
        │   ├── layout/              # Sidebar, AppLayout
        │   ├── common/              # ProtectedRoute
        │   └── ui/                  # Button, Input, Badge, Skeleton
        └── features/
            ├── landing/             # Public landing page
            ├── auth/                # Login + Register
            ├── dashboard/           # Balance card + recent tx
            ├── accounts/            # Account list + Ledger
            ├── transactions/        # Send Money + Tx list
            ├── about/               # Portfolio About page
            └── faq/                 # FAQ accordion
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB instance)
- Gmail account (for Nodemailer — or any SMTP provider)

### Clone the Repository

```bash
git clone https://github.com/Vipinnagar169/VaultFlow.git
cd VaultFlow
```

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vaultflow
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend — no `.env` needed by default
Vite uses the proxy in dev mode. For production, set `VITE_API_URL`.

---

## 🔧 Installation

### Backend

```bash
cd backend
npm install
npm run dev      # nodemon server.js
```

Server starts at `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev      # vite dev server
```

App opens at `http://localhost:5173`

---

## 📡 API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + JWT cookie |
| POST | `/api/auth/logout` | Blacklist token |

### Accounts
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts/` | Create banking account |
| GET | `/api/accounts/` | Get all user accounts |
| GET | `/api/accounts/total-balance` | **Total portfolio balance** |
| GET | `/api/accounts/balance/:id` | Single account balance |
| GET | `/api/accounts/:id/ledger` | Immutable ledger entries |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/transactions/` | Create transfer (idempotent) |
| GET | `/api/transactions/account/:id` | List transactions (paginated) |
| GET | `/api/transactions/:id` | Transaction + ledger entries |
| POST | `/api/transactions/system/initial-funds` | System deposit (admin) |

---

## 🔮 Future Roadmap

- [ ] Webhook notifications for real-time transaction alerts
- [ ] Multi-currency support with live FX conversion
- [ ] Scheduled/recurring transfers
- [ ] PDF statement export
- [ ] Admin analytics dashboard
- [ ] Rate limiting + fraud detection middleware
- [ ] Redis caching for high-frequency balance reads
- [ ] Docker + CI/CD pipeline

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Vipin Nagar**  
Full-Stack Developer · Node.js · React · MongoDB

[![GitHub](https://img.shields.io/badge/GitHub-Vipinnagar169-181717?style=flat-square&logo=github)](https://github.com/Vipinnagar169/VaultFlow)

---

> Built with ❤️ to demonstrate production-grade fintech engineering patterns.  
> If this project helped you, please ⭐ the repository!
