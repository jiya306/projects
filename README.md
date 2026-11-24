# SalonFlow — Full-Stack Salon Management System

> **Tagline:** Your Beauty. Your Time. Your Salon.  
> **Aesthetic:** Warm editorial minimalism (`#F9F7F3` Cream Background) with custom Light Blue brand identity (`#7CCBEE`).

---

## 🌟 Architecture & Product Highlights

SalonFlow is an enterprise-grade digital platform engineered for high-end salons and multi-station studios. It unifies a consumer-facing digital storefront with a full suite of back-office salon operations:

- **Customer Booking Platform:** 5-step interactive wizard with real-time stylist availability conflict checks, buffer time management, and dynamic coupon validation.
- **Role-Based Studio OS:** Dedicated role views for `ADMIN`, `SALON_OWNER`, `RECEPTIONIST`, `STYLIST`, and `CUSTOMER`.
- **Complete REST APIs:** 15 modular RESTful controllers mounted on Express with JWT bearer authentication, bcrypt password hashing, and centralized error logging.
- **Mongoose MongoDB Schemas:** 15 collections with compound indexes for instant double-booking prevention, automated loyalty tier recalculations, and low-stock alerts.
- **Embedded Persistence:** Out-of-the-box support for both local/remote MongoDB and automated embedded memory MongoDB server with full realistic Indian salon seeding.

---

## 🔑 Seeded Demo Login Accounts

Each of the following 5 accounts is pre-seeded into MongoDB with realistic permissions, historical appointments, and profiles. You can also click any role button directly in the **1-Click Demo Switcher** panel on the Login page:

| Role | Email | Password | Name & Profile |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@salonflow.demo` | `Admin@123` | Vikramaditya Roy (Full Studio Control) |
| **Salon Owner** | `owner@salonflow.demo` | `Owner@123` | Kavita Chawla (Financial & Revenue Management) |
| **Receptionist** | `reception@salonflow.demo` | `Reception@123` | Tanvi Saxena (Desk, Check-ins & Bookings) |
| **Stylist** | `stylist@salonflow.demo` | `Stylist@123` | Rohan Mehra (Vidal Sassoon Master Stylist) |
| **Customer** | `customer@salonflow.demo` | `Customer@123` | Meera Nambiar (Platinum VIP Guest) |

---

## 🎨 Design System & Color Palette

The entire system strictly complies with the editorial light blue design specification:

- **Primary Brand Accent (Light Blue):** `#7CCBEE`
- **Primary Hover / Deep Blue:** `#42A9D8`
- **Light Blue Glow / Highlights:** `#B8E7FA`
- **Main Background (Warm Cream):** `#F9F7F3`
- **Bone Surface (Dividers / Cards):** `#F3F0E8`
- **White Card Surfaces:** `#FFFFFF`
- **Dark Surface:** `#202020`
- **Deep Black:** `#000000`
- **Success Indicator:** `#2B9A66`
- **Subtle Border:** `rgba(32, 32, 32, 0.12)`
- **Typography:**
  - Display Headlines: `Bricolage Grotesque`
  - Body & Form Controls: `Inter`
  - Technical Codes & Dates: `JetBrains Mono`

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript, Mongoose, MongoDB, JWT (`jsonwebtoken`), `bcryptjs`, `morgan`, `cors`.
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router 7, Recharts.

---

## 🚀 How to Run the Application

### 1. Start the Backend API Server
```bash
cd server
pnpm install
pnpm dev
# Server boots on http://localhost:5000
# Automatically connects to MongoDB and seeds 110+ appointments, 30 products, 8 stylists, and 30 customer profiles!
```

### 2. Start the Frontend Client
```bash
cd client
pnpm install
pnpm dev
# Web application available on http://localhost:5173
```

---

## 📚 REST API Reference

### Authentication
- `POST /api/auth/register` — Register new user & customer profile
- `POST /api/auth/login` — Sign in and issue 7-day JWT token
- `POST /api/auth/logout` — Revoke session
- `GET /api/auth/me` — Current authenticated user payload & role
- `POST /api/auth/forgot-password` — Password reset trigger

### Appointments & Availability
- `GET /api/appointments` — Filterable by date, status, stylist, guest
- `GET /api/appointments/:id` — Detailed appointment view
- `POST /api/appointments` — Multi-step reservation with conflict detection
- `PATCH /api/appointments/:id/status` — Status workflow (`PENDING` ➔ `CONFIRMED` ➔ `CHECKED_IN` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CANCELLED`)
- `GET /api/appointments/availability` — Real-time slot engine with buffer times

### Customers CRM
- `GET /api/customers` — List customers with tier filter and search
- `GET /api/customers/:id` — Complete guest dossier with visit history, loyalty points, and payments
- `POST /api/customers` — Create new customer
- `PUT /api/customers/:id` — Update profile
- `DELETE /api/customers/:id` — Remove profile

### Staff & Stylists
- `GET /api/staff` — Active stylists list, ratings, and specializations
- `GET /api/staff/:id` — Individual profile
- `GET /api/staff/:id/performance` — Real-time revenue generated, appointments count, commissions earned

### Service Catalog
- `GET /api/services` — Categorized service catalog with INR pricing & duration
- `POST /api/services` — Add new service
- `PUT /api/services/:id` — Update price, duration, active status
- `DELETE /api/services/:id` — Delete service

### Inventory & Stock
- `GET /api/products` — Product stock levels, SKUs, and low-stock alerts
- `POST /api/products` — Catalog new product
- `POST /api/inventory/stock-in` — Restock inventory transaction
- `POST /api/inventory/stock-out` — Record usage in services
- `GET /api/inventory/transactions` — Full inventory audit log

### Billing & Invoices
- `GET /api/payments/invoices` — List GST tax invoices
- `GET /api/payments/invoices/:id` — Single invoice view
- `POST /api/payments` — Record payment & generate official invoice
- `GET /api/payments` — Settlement records

### Promotions & Coupons
- `GET /api/promotions` — Active promotional discount codes
- `POST /api/promotions/validate` — Live coupon code validation engine

### Analytics
- `GET /api/analytics/dashboard` — Live studio KPI overview
- `GET /api/analytics/revenue` — 30-day revenue trajectory and category distribution
- `GET /api/analytics/customers` — Guest retention rate and tier breakdown
- `GET /api/analytics/staff` — Revenue per stylist
