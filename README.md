# ShopEase E-Commerce Platform

## Tech Stack

### Frontend

- React.js
- Vite
- Bootstrap / CSS3
- React Router
- Axios

### Backend

- Laravel 12
- PHP 8.2+
- REST API
- Laravel Sanctum authentication

### Database

- MySQL
- XAMPP

### Development Tools

- Git and GitHub
- Visual Studio Code
- Postman

---

## Project Structure

```text
ecommerce-platform
├── frontend        # React application
├── backend         # Laravel REST API
├── docs            # Project documentation
└── README.md
```

---

## Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/Rashini0926/ecommerce-platform.git
cd ecommerce-platform
```

### 2. Frontend setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

`frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### 3. Backend setup

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

### 4. Database configuration

Start Apache and MySQL using XAMPP, then create the database:

```sql
CREATE DATABASE ecommerce_db;
```

Update `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seed demo data:

```bash
php artisan migrate
php artisan db:seed
```

### 5. Run Laravel

```bash
php artisan serve
```

Backend runs at `http://127.0.0.1:8000`.

### 6. Run the queue worker

Keep a second backend terminal open so queued email notifications are processed:

```bash
php artisan queue:work
```

Local email output is written through Laravel's `log` mailer. SMS messages use the safe demo log provider by default, so no external credentials or real messages are required.

```env
ORDER_EMAIL_NOTIFICATIONS=true
ORDER_SMS_NOTIFICATIONS=true
SMS_DRIVER=log
```

---

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@shopease.com | password123 |
| Seller | seller@shopease.com | password123 |
| Admin | admin@shopease.com | password123 |

---

## Implemented Features

### Authentication and customer features

- Registration, login, logout, password recovery
- Profile update and password change
- Saved delivery addresses
- Product browsing, search, filters, cart, wishlist, checkout
- Orders, delivery tracking, reviews and notifications

### Seller features

- Product CRUD and inventory management
- Seller fulfillment queue
- Seller analytics summary

### Admin features

- Order and shipping management
- User management, seller approval and account suspension
- Category management and analytics summary

### Payments and delivery

- Demo payment gateway for academic use; no real money is processed
- Payment transaction status tracking
- Courier, tracking number and shipping status management

### Notifications

- In-app order, payment and shipping notifications
- Queued email notifications with delivery status tracking
- Demo SMS notifications with masked phone numbers in application logs
- Per-channel delivery audit records for queued, sent, failed and skipped messages

---

## Important API Endpoints

```text
POST   /api/register
POST   /api/login
POST   /api/forgot-password
POST   /api/reset-password
GET    /api/profile
PATCH  /api/profile
PATCH  /api/profile/password

GET    /api/products
GET    /api/products/{id}
GET    /api/cart
POST   /api/cart
POST   /api/orders
GET    /api/orders/{id}/tracking
POST   /api/orders/{id}/payment/initiate
POST   /api/orders/{id}/payment/complete

GET    /api/notifications
PATCH  /api/notifications/{id}/read
PATCH  /api/notifications/read-all
GET    /api/admin/users
GET    /api/admin/reports/summary
GET    /api/seller/reports/summary
```

---

## Testing

```bash
cd backend
php artisan test

cd ../frontend
npm run build
```

---

## Git Workflow

```bash
git pull origin develop
git checkout -b feature/your-feature
git add <specific-files>
git commit -m "feat: describe the change"
git push origin feature/your-feature
```

Create a pull request to merge reviewed work into `develop`.

Do not commit `node_modules`, `.env`, build output, or local logs.

---

## License

This project is developed for educational and internship purposes.
