# 🛒 E-Commerce Platform

A modern, scalable full-stack e-commerce platform inspired by leading marketplace experiences.
This project focuses on building a complete online shopping ecosystem with customer, seller, and admin functionalities while maintaining original branding and implementation.

---

## 🚀 Project Overview

The E-Commerce Platform provides users with a seamless shopping experience including:

- User registration and authentication
- Product browsing and searching
- Shopping cart management
- Order processing
- Seller product management
- Admin management features
- Reviews and ratings
- Payment and delivery management
- Analytics and reporting

The system is developed using modern web technologies with a focus on scalability, security, and clean architecture.

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- JavaScript (ES6+)
- Bootstrap / CSS
- React Router
- Axios
- Context API

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt Password Hashing

### Database

- MySQL

### Development Tools

- Git & GitHub
- Postman
- Visual Studio Code
- npm
- GitHub Actions (CI/CD)

---

## 📂 Project Structure

```
ecommerce-platform
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── services
│   │   └── utils
│   │
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   │
│   └── package.json
│
├── docs
│
└── README.md
```

---

## ✨ Features

### 👤 Customer Module

- User Registration
- User Login
- JWT Authentication
- Customer Dashboard
- Product Browsing
- Product Search
- Shopping Cart
- Wishlist
- Order Tracking
- Product Reviews

### 🏪 Seller Module

- Seller Dashboard
- Add Products
- Update Products
- Manage Inventory
- View Orders
- Sales Reports

### 👨‍💻 Admin Module

- Admin Dashboard
- User Management
- Product Management
- Order Management
- System Reports
- Analytics

---

## 🔐 Authentication Flow

```
User
  |
  | Register / Login
  |
Backend API
  |
Password Encryption (bcrypt)
  |
JWT Token Generation
  |
Frontend Storage
  |
Protected Routes
```

---

## 🌿 Git Branch Strategy

We follow a feature-based branching strategy.

```
main
  |
develop
  |
  |-- feature/homepage
  |
  |-- feature/products
  |
  |-- feature/orders
  |
  |-- feature/admin
```

### Branch Naming Convention

```
feature/<feature-name>
```

Example:

```
feature/homepage
feature/product-management
feature/order-management
```

---

## 📝 Commit Convention

We follow meaningful commit messages.

Examples:

```
feat: add user registration API
feat: implement JWT authentication
fix: resolve login validation issue
refactor: improve API structure
docs: update README documentation
```

---

## ⚙️ Installation Guide

### Clone Repository

```bash
git clone https://github.com/Rashini0926/ecommerce-platform.git
```

### Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

### Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend root:

```
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_db

JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

## 🗄️ Database Setup

Create database:

```sql
CREATE DATABASE ecommerce_db;
```

Run the required SQL scripts (found in `/docs` or `/backend/src/config`) before starting the application.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description         |
|--------|-----------------------|----------------------|
| POST   | /api/auth/register     | Register user        |
| POST   | /api/auth/login        | Login user           |
| GET    | /api/auth/profile      | Get user profile     |

### Products

| Method | Endpoint             | Description             |
|--------|-----------------------|--------------------------|
| GET    | /api/products          | Get all products         |
| GET    | /api/products/:id      | Get single product       |
| POST   | /api/products          | Add new product (seller) |
| PUT    | /api/products/:id      | Update product           |
| DELETE | /api/products/:id      | Delete product           |

### Orders

| Method | Endpoint             | Description             |
|--------|-----------------------|--------------------------|
| POST   | /api/orders            | Place new order          |
| GET    | /api/orders/:id        | Get order details        |
| GET    | /api/orders/user/:id   | Get user's order history |

---

## 🧪 Testing

Testing tools:

- Postman API Testing
- Manual Testing
- Unit Testing
- Integration Testing

---

## 👥 Team Contribution

### Development Members

| Member    | Responsibility                  |
|-----------|----------------------------------|
| Member 1  | Authentication & Customer Module |
| Member 2  | Product Management               |
| Member 3  | Order Management                 |
| Member 4  | Admin Module                     |

---

## 📌 Development Progress

### Completed

- ✅ Project structure setup
- ✅ React frontend initialization
- ✅ Homepage UI
- ✅ Authentication UI
- ✅ JWT Authentication Backend
- ✅ User Registration API
- ✅ User Login API

### In Progress

- 🔄 Customer Dashboard Enhancement
- 🔄 Product Management
- 🔄 Order Management
- 🔄 Payment Integration

---

## 📸 Screenshots

*(Add application screenshots here)*

---

## 🔮 Future Improvements

- Online payment integration
- Email notifications
- Advanced recommendation system
- Mobile application
- Cloud deployment

---

## 📄 License

This project is developed for educational and internship purposes.

---

## 👨‍💻 Contributors

Developed by:

- Rashini Wijesinghe
- Team Members
