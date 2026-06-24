# 🛒 Sistema POS — Point of Sale System

A full-stack Point of Sale (POS) system built from scratch for retail businesses. Features a modern dark UI, real-time inventory management, sales processing, and detailed reporting.

**Live Demo:** [sistema-pos-orpin.vercel.app](https://sistema-pos-orpin.vercel.app)

> **Demo credentials:**
> - Email: `admin@pos.com`
> - Password: `admin123`

---

## ✨ Features

- 🔐 **Authentication** — JWT-based login with role-based access (Admin / Cashier)
- 📦 **Inventory Management** — Full CRUD for products with stock tracking and low-stock alerts
- 🛒 **Sales Screen** — Cart system with category filters, cash change calculator and printable receipt
- 📊 **Reports & Analytics** — Sales charts, top products, revenue by day and PDF export
- 👥 **User Management** — Create and manage cashiers and admins
- 🌙 **Dark / Light Mode** — User preference saved across sessions
- 🧾 **Sale History** — Paginated history with date filters
- 🖨️ **Printable Tickets** — Receipt modal with print support after each sale

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| Tailwind CSS v4 | Styling |
| React Router v7 | Navigation |
| Recharts | Data visualization |
| Axios | HTTP client |
| jsPDF + AutoTable | PDF generation |
| react-to-print | Receipt printing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API |
| Prisma ORM v5 | Database access |
| PostgreSQL | Database |
| JWT + bcrypt | Authentication |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Railway | Backend + Database hosting |
| GitHub | Version control |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- PostgreSQL database

### Backend Setup

```bash
cd pos-backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pos_db"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="30d"
PORT=3000
```

Run migrations and start:

```bash
npx prisma migrate dev
npm run dev
```

### Frontend Setup

```bash
cd pos-frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the dev server:

```bash
npm run dev
```

---

## 📁 Project Structure

```
pos-system/
├── pos-backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── routes/
│   └── server.js
└── pos-frontend/
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        └── services/
```

---

## 📸 Screenshots

### Login
![Login](https://i.imgur.com/placeholder.png)

### Dashboard
![Dashboard](https://i.imgur.com/placeholder.png)

### Sales Screen
![Sales](https://i.imgur.com/placeholder.png)

### Reports
![Reports](https://i.imgur.com/placeholder.png)

---

## 🗄️ Database Schema

```
User        — id, name, email, password, role, active
Product     — id, name, price, stock, category, active
Sale        — id, total, userId, createdAt
SaleItem    — id, quantity, unitPrice, saleId, productId
```

---

## 🔒 Role Permissions

| Feature | Admin | Cashier |
|---|---|---|
| Inventory | ✅ Full access | ✅ View only |
| Sales | ✅ | ✅ |
| Reports | ✅ | ✅ |
| Users | ✅ | ❌ |
| History | ✅ | ✅ |

---

## 👨‍💻 Author

**Walny Miguel Carreras Valencia**
Full Stack Developer — Dominican Republic

[![GitHub](https://img.shields.io/badge/GitHub-Waln13-black?logo=github)](https://github.com/Waln13)

---

## 📄 License

This project is licensed for portfolio and demonstration purposes.