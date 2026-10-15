# 🚚 Courier & Delivery Management System

A full-stack web application for managing courier and delivery operations.
Built with **HTML5, CSS3, JavaScript, jQuery, Node.js, Express.js, and MySQL**.

---

## 📋 Project Overview

**Project #22 — Courier & Delivery Management System**

| Assessment | Marks |
|---|---|
| Practical 01 — Core System | 30 |
| Practical 02 — Enhancement | 20 |
| Final Viva + Demo | 10 |
| **Total** | **60** |

---

## ✅ Practical 01 Features (Core System)

| Requirement | Implementation |
|---|---|
| **HTML** | Semantic HTML5, forms, tables, structured pages |
| **CSS** | Responsive Flexbox/Grid layout, media queries |
| **JavaScript** | DOM manipulation, events, dynamic interactions |
| **Validation & DOM** | Client-side form validation, real-time error display |
| **jQuery & AJAX** | jQuery effects, AJAX data loading for all modules |
| **Node.js & Express** | REST API server with routes and controllers |
| **MySQL & CRUD** | Full CRUD for Parcels, Customers, Staff, Deliveries |

### Core Modules:
- 📦 **Parcels CRUD** — Create, read, update, delete parcels with auto tracking numbers
- 👥 **Customers CRUD** — Manage sender/receiver customer records
- 🛵 **Delivery Staff CRUD** — Manage delivery personnel and vehicles
- 🗺️ **Deliveries CRUD** — Assign parcels to staff, track assignments

---

## ✅ Practical 02 Features (Enhancement)

| Requirement | Implementation |
|---|---|
| **Authentication** | Login/logout with session management |
| **Security** | bcrypt password hashing, protected routes, input validation |
| **Enhancement Features** | Reports, search/filter, tracking history, dashboard stats |
| **UI Improvements** | Responsive dashboard, status charts, progress bars |
| **Payment Workflow** | Mock payment system with transaction IDs |
| **Documentation** | README + enhancement details |

### Enhancement Modules:
- 🔐 **Authentication** — Admin login with bcrypt password hashing
- 🔒 **Protected Routes** — All admin routes require authentication
- 💳 **Payment Workflow** — Mock payment with auto price calculation
- 📍 **Parcel Tracking** — Public tracking page with timeline history
- 📊 **Reports & Dashboard** — Stats, charts, delivery/payment reports
- 🔍 **Search & Filter** — Real-time search with AJAX on all modules

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), jQuery 3.7
- **Backend:** Node.js, Express.js
- **Database:** MySQL 8
- **Auth:** express-session, bcryptjs
- **Other:** dotenv, mysql2

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16+)
- MySQL Server
- npm

### Step 1 — Install Dependencies
```bash
npm install
```

### Step 2 — Configure Database
Edit `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=courier_db
SESSION_SECRET=courier_secret_key_2024
PORT=3000
```

### Step 3 — Import Database
Open MySQL and run:
```sql
SOURCE database/schema.sql;
```
Or via phpMyAdmin: import `database/schema.sql`

### Step 4 — Start the Server
```bash
node server.js
```

### Step 5 — Open in Browser
```
http://localhost:3000
```

---

## 🔐 Login Credentials

| Username | Password | Role |
|---|---|---|
| admin | password | Admin |

---

## 📁 Project Structure

```
CourierSystem/
├── server.js              # Express server entry point
├── package.json           # Dependencies
├── .env                   # Environment variables
├── config/
│   └── db.js              # MySQL connection pool
├── middleware/
│   └── auth.js            # Authentication middleware
├── routes/
│   ├── auth.js            # Login/logout routes
│   ├── customers.js       # Customer CRUD routes
│   ├── parcels.js         # Parcel CRUD + tracking routes
│   ├── staff.js           # Staff CRUD routes
│   ├── deliveries.js      # Delivery CRUD routes
│   └── payments.js        # Payment + reports routes
├── controllers/
│   ├── authController.js      # Login, logout, session
│   ├── customerController.js  # Customer CRUD logic
│   ├── parcelController.js    # Parcel CRUD + tracking logic
│   ├── staffController.js     # Staff CRUD logic
│   ├── deliveryController.js  # Delivery CRUD logic
│   └── paymentController.js   # Payment + reports logic
├── public/
│   ├── css/style.css      # Main stylesheet
│   ├── js/app.js          # Shared JS utilities
│   ├── login.html         # Login page
│   ├── dashboard.html     # Admin dashboard
│   ├── parcels.html       # Parcel management
│   ├── customers.html     # Customer management
│   ├── staff.html         # Staff management
│   ├── deliveries.html    # Delivery management
│   ├── payments.html      # Payment workflow
│   ├── reports.html       # Reports & analytics
│   └── track.html         # Public parcel tracking
└── database/
    └── schema.sql         # Database schema + sample data
```

---

## 📊 Database Schema

| Table | Purpose |
|---|---|
| `admins` | Admin user accounts (hashed passwords) |
| `customers` | Customer records (senders/recipients) |
| `delivery_staff` | Delivery personnel |
| `parcels` | Parcel details with tracking numbers |
| `deliveries` | Parcel-to-staff assignments |
| `payments` | Payment records with transaction IDs |
| `tracking_history` | Parcel status change history |

---

## 💰 Payment Price Calculation

| Parcel Type | Base Price | Per kg |
|---|---|---|
| Package / Document | LKR 250 | LKR 50 |
| Fragile | LKR 250 | LKR 80 |
| Perishable | LKR 250 | LKR 100 |

---

## 🔗 API Endpoints

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/session` — Check session

### Parcels
- `GET /api/parcels` — Get all (search, status filter)
- `GET /api/parcels/:id` — Get one
- `GET /api/parcels/track/:trackingNumber` — Public tracking
- `POST /api/parcels` — Create
- `PUT /api/parcels/:id` — Update
- `DELETE /api/parcels/:id` — Delete

### Customers
- `GET /api/customers` — Get all (search)
- `POST /api/customers` — Create
- `PUT /api/customers/:id` — Update
- `DELETE /api/customers/:id` — Delete

### Staff
- `GET /api/staff` — Get all
- `POST /api/staff` — Create
- `PUT /api/staff/:id` — Update
- `DELETE /api/staff/:id` — Delete

### Deliveries
- `GET /api/deliveries` — Get all
- `POST /api/deliveries` — Assign delivery
- `PUT /api/deliveries/:id` — Update status
- `DELETE /api/deliveries/:id` — Remove assignment

### Payments
- `GET /api/payments` — Get all payments
- `POST /api/payments` — Create payment record
- `PUT /api/payments/:id/process` — Process (mock) payment
- `GET /api/payments/reports` — Dashboard stats & reports

---

## 📈 Enhancement Report (Practical 02)

### Changes Made Over Practical 01:

1. **Authentication System**
   - Admin login with username/password
   - bcrypt password hashing (salt rounds: 10)
   - Session-based authentication
   - Logout functionality

2. **Security Improvements**
   - All API routes protected with `isAuthenticated` middleware
   - Input validation on both client and server side
   - SQL injection prevention via parameterized queries
   - HTTP-only session cookies

3. **Payment Workflow**
   - Auto-calculated pricing based on weight and parcel type
   - Transaction ID generation
   - Mock payment processing simulation
   - Payment status tracking (Pending → Paid)

4. **Tracking System**
   - Unique tracking numbers (e.g., CDS-1234-2024)
   - Timeline history for each status change
   - Public tracking page (no login required)

5. **Reports & Dashboard**
   - Live statistics (total parcels, revenue, staff)
   - Status distribution charts
   - Monthly revenue bar charts
   - Printable delivery and payment reports

6. **UI Enhancements**
   - Responsive mobile sidebar
   - Toast notification system
   - Loading spinners
   - Status color-coded badges
   - Modal dialogs for CRUD operations

---

*Submitted for CA — Practical 01 & Practical 02*
1. schema.sql import பண்ணு
2. npm install பண்ணு  
3. node server.js பண்ணு
→ Done! Project running