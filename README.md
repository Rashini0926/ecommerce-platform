# 🛒 ShopEase E-Commerce Platform

ShopEase is a **full-stack e-commerce web application** built with **React.js** and **Laravel**. It provides a complete online shopping workflow for customers while offering dedicated functionality for **sellers** and **administrators**.

The platform includes authentication, product management, cart and wishlist functionality, checkout, order tracking, seller inventory management, administrative controls, and a **demo payment gateway** for academic and development purposes.

---

## ✨ Key Features

### 👤 Customer

* User registration, login, and logout
* Password recovery and reset
* Profile management
* Password change
* Multiple saved delivery addresses
* Product browsing and search
* Product filtering
* Shopping cart management
* Wishlist management
* Checkout process
* Demo payment processing
* Order history
* Delivery tracking
* Product reviews
* User notifications

### 🏪 Seller

* Seller-specific dashboard
* Product creation, update, and deletion
* Inventory and stock management
* Order fulfillment queue
* Seller order management
* Seller analytics summary

### 🛡️ Admin

* Admin dashboard
* User management
* Seller approval
* User account suspension
* Category management
* Order management
* Shipping and delivery management
* Platform analytics summary

### 💳 Payments & Delivery

* Demo payment gateway for academic use
* Payment transaction status tracking
* Courier information management
* Tracking number management
* Shipping status updates
* Customer delivery tracking

> **Note:** The payment gateway is implemented for demonstration and academic purposes only. No real money is processed.

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Purpose                             |
| ------------ | ----------------------------------- |
| React.js     | User interface development          |
| Vite         | Frontend development and build tool |
| Bootstrap    | Responsive UI components            |
| CSS3         | Custom styling                      |
| React Router | Client-side routing                 |
| Axios        | REST API communication              |

### Backend

| Technology      | Purpose                        |
| --------------- | ------------------------------ |
| Laravel 12      | Backend framework              |
| PHP 8.2+        | Server-side programming        |
| REST API        | Frontend/backend communication |
| Laravel Sanctum | API authentication             |

### Database

| Technology | Purpose                            |
| ---------- | ---------------------------------- |
| MySQL      | Relational database                |
| XAMPP      | Local Apache and MySQL environment |

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Postman

---

## 📁 Project Structure

```text
ecommerce-platform/
│
├── frontend/              # React + Vite frontend application
├── backend/               # Laravel REST API
├── docs/                  # Project documentation
└── README.md              # Project documentation
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project, make sure the following software is installed:

* Node.js and npm
* PHP 8.2 or later
* Composer
* MySQL
* XAMPP
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/Rashini0926/ecommerce-platform.git
cd ecommerce-platform
```

---

## 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Create the environment file:

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

### Frontend Environment Configuration

Configure `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 3. Backend Setup

Open another terminal and navigate to the backend:

```bash
cd backend
```

Install Laravel dependencies:

```bash
composer install
```

Create the Laravel environment file:

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

---

## 4. Database Configuration

Start **Apache** and **MySQL** using the XAMPP Control Panel.

Create a new MySQL database:

```sql
CREATE DATABASE ecommerce_db;
```

Update the database configuration inside `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=
```

Run the database migrations:

```bash
php artisan migrate
```

Seed the database with demo data:

```bash
php artisan db:seed
```

Alternatively, for a clean database setup:

```bash
php artisan migrate:fresh --seed
```

> `migrate:fresh` deletes existing database tables before recreating them. Use it only when resetting local development data is acceptable.

---

## 5. Start the Backend

Run the Laravel development server:

```bash
php artisan serve
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

The API base URL is:

```text
http://127.0.0.1:8000/api
```

---

# 🔐 Demo Accounts

After running the database seeders, the following accounts can be used for testing:

| Role     | Email                   | Password      |
| -------- | ----------------------- | ------------- |
| Customer | `customer@shopease.com` | `password123` |
| Seller   | `seller@shopease.com`   | `password123` |
| Admin    | `admin@shopease.com`    | `password123` |

> These credentials are intended for local development and demonstration purposes only.

---

# 🔌 API Overview

ShopEase uses a REST API provided by the Laravel backend.

## Authentication

```text
POST   /api/register
POST   /api/login
POST   /api/forgot-password
POST   /api/reset-password
```

## Profile

```text
GET    /api/profile
PATCH  /api/profile
PATCH  /api/profile/password
```

## Products

```text
GET    /api/products
GET    /api/products/{id}
```

## Cart

```text
GET    /api/cart
POST   /api/cart
```

## Orders

```text
POST   /api/orders
GET    /api/orders/{id}/tracking
```

## Notifications

```text
GET    /api/notifications
```

## Admin

```text
GET    /api/admin/users
GET    /api/admin/reports/summary
```

## Seller

```text
GET    /api/seller/reports/summary
```

> This section highlights important endpoints and does not represent the complete API specification.

---

# 🔑 Authentication

The application uses **Laravel Sanctum** to protect authenticated API routes.

Protected requests from the React frontend are handled through the authentication mechanism configured by the backend. Role-based authorization is used to restrict functionality for:

```text
Customer
Seller
Admin
```

This ensures that users can access only the functionality permitted for their account role.

---

# 🛒 Core E-Commerce Flow

The primary customer workflow is:

```text
Register / Login
       ↓
Browse Products
       ↓
Search / Filter Products
       ↓
View Product
       ↓
Add to Cart / Wishlist
       ↓
Checkout
       ↓
Select Delivery Address
       ↓
Demo Payment
       ↓
Order Created
       ↓
Order Processing
       ↓
Shipping
       ↓
Delivery Tracking
       ↓
Order Completed
       ↓
Product Review
```

---

# 💳 Demo Payment Gateway

ShopEase includes a simulated payment gateway to demonstrate the checkout and payment workflow.

It supports:

* Payment request simulation
* Transaction status recording
* Successful payment scenarios
* Failed payment scenarios
* Order/payment association

**No actual banking or payment provider is connected, and no real financial transactions are performed.**

---

# 📦 Order & Delivery Management

Orders can progress through the application's fulfillment and shipping workflow.

Delivery information can include:

* Courier
* Tracking number
* Shipping status
* Delivery progress

Customers can view the tracking information associated with their orders.

---

# 🧪 Testing

## Backend Tests

Navigate to the backend:

```bash
cd backend
php artisan test
```

## Frontend Production Build

Navigate to the frontend:

```bash
cd frontend
npm run build
```

A successful build helps verify that the frontend is production-compilable.

---

# 🌿 Git Workflow

The project follows a feature-branch development workflow.

First, update the local `develop` branch:

```bash
git checkout develop
git pull origin develop
```

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Stage the relevant files:

```bash
git add <specific-files>
```

Commit the changes:

```bash
git commit -m "feat: describe the change"
```

Push the feature branch:

```bash
git push origin feature/your-feature
```

Create a **Pull Request** on GitHub to merge the reviewed changes into `develop`.

### Recommended Branch Naming

```text
feature/authentication
feature/product-management
feature/cart-checkout
feature/order-management
feature/payment-gateway
feature/admin-dashboard
feature/seller-dashboard
fix/login-validation
fix/cart-calculation
```

### Recommended Commit Convention

```text
feat: add shopping cart functionality
feat: implement checkout process
feat: add demo payment gateway
fix: resolve login validation issue
fix: correct cart total calculation
refactor: improve order service
docs: update project documentation
test: add authentication tests
```

---

# 🔒 Environment & Security

Sensitive and generated files should not be committed to Git.

Ensure the project's `.gitignore` excludes files and directories such as:

```text
.env
node_modules/
vendor/
dist/
storage/logs/*.log
```

Never commit:

* Database passwords
* API secrets
* Authentication tokens
* Production credentials
* Private keys

Use `.env.example` files to document the environment variables required to run the application.

---

# 📚 Development Notes

For local development, the application normally requires two development servers:

**Terminal 1 — Laravel**

```bash
cd backend
php artisan serve
```

**Terminal 2 — React**

```bash
cd frontend
npm run dev
```

Also ensure that **MySQL is running through XAMPP** before starting the backend.

---

# 🎯 Project Purpose

ShopEase was developed to demonstrate practical experience in:

* Full-stack web application development
* React frontend architecture
* Laravel REST API development
* API authentication and authorization
* Relational database design
* Role-based access control
* E-commerce workflows
* Payment workflow simulation
* Order and inventory management
* REST API integration
* Git-based collaborative development
* Software testing and debugging

---

# 📄 License

This project is developed for **educational, portfolio, and internship purposes**.

It is not intended to operate as a production payment or commercial e-commerce service without additional security, infrastructure, compliance, and payment-provider integration.

---

## 👩‍💻 Author

**Rashini Wijesinghe**

BSc (Hons) Information Technology Undergraduate

GitHub: https://github.com/Rashini0926
