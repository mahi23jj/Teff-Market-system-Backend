# 🌾 TeffMarket Backend

A scalable RESTful API powering the **TeffMarket** platform, designed to connect farmers and buyers through a secure, modern marketplace. The backend provides role-based access, product and order management, market analytics, and authentication services while ensuring high performance and maintainability.

---

## ✨ Features

### 👨‍🌾 Farmer

* Manage farm profile
* Create, update, and delete products
* Manage inventory and pricing
* View incoming and completed orders
* Monitor market price trends
* Track sales performance

### 🛒 Customer

* Register and authenticate securely
* Browse and search products
* Place and manage orders
* View order history and status
* Manage personal profile

### 🛠️ Admin

* Manage farmers and customers
* Monitor marketplace activities
* Manage products and orders
* View platform analytics
* Monitor market price trends
* Maintain platform integrity

---

## 🚀 Core Features

* JWT Authentication & Authorization
* Role-Based Access Control (RBAC)
* Product Management
* Order Management
* User Management
* Market Price Analytics API
* Dashboard Statistics
* Secure Password Hashing
* Request Validation
* Global Error Handling
* Pagination, Filtering & Search
* RESTful API Architecture

---

## 🛠️ Tech Stack

| Category          | Technology      |
| ----------------- | --------------- |
| Runtime           | Node.js         |
| Framework         | Express.js      |
| Language          | TypeScript      |
| Database          | PostgreSQL      |
| ORM               | Prisma          |
| Authentication    | JWT             |
| Validation        | Zod             |
| Password Hashing  | bcrypt          |
| File Storage      | Cloudinary      |
| API Documentation | Swagger/OpenAPI |
| Logging           | Morgan          |
| Environment       | dotenv          |

---

## 📁 Project Structure

```text
src/
├── controllers/
├── services/
├── routes/
├── middleware/
├── validators/
├── prisma/
├── utils/
├── types/
├── config/
└── app.ts
```

---

## ⚙️ Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL
* npm

### Installation

```bash
git clone https://github.com/mahi23jj/Teff-Market-system-Backend.git

cd teffmarket-backend

npm install
```

Create a `.env` file and configure the required environment variables.

Run database migrations:

```bash
npx prisma migrate deploy
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

---

## 📌 Main Modules

* Authentication
* User Management
* Farmer Management
* Product Management
* Order Management
* Market Price Management
* Dashboard & Analytics
* File Upload
* Role & Permission Management

---

## 🔒 Security

* JWT-based authentication
* Role-based authorization
* Password hashing with bcrypt
* Request validation
* Centralized error handling
* Environment-based configuration
* Secure API design

---

## 📖 API Documentation

Interactive API documentation is available through **Swagger/OpenAPI** once the server is running.

---

## 🌍 Vision

TeffMarket aims to modernize agricultural commerce by providing a secure and transparent digital marketplace where farmers can reach more customers, buyers can purchase directly from trusted producers, and administrators can efficiently oversee the platform.

---

## 📄 License

This project is licensed under the MIT License.
