# ShopEase E-Commerce Platform

Full-stack marketplace application for customers, sellers, and administrators.

## Stack

- Frontend: React, Vite, Bootstrap, Axios
- Backend: Laravel 12, Sanctum REST API
- Database: MySQL

## Main features

- Customer registration, login, password recovery, profile management
- Products, category filters, cart, wishlist, checkout, orders, and reviews
- Demo card-payment flow for academic use; no real money is processed
- Shipping/tracking, persistent notifications, seller fulfillment
- Admin orders, users, seller approval, and analytics summaries

## Local setup

### Backend

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Configure MySQL credentials in `backend/.env` before running migrations.

### Frontend

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

`frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@shopease.com | password123 |
| Seller | seller@shopease.com | password123 |
| Admin | admin@shopease.com | password123 |

## Testing

```powershell
cd backend
php artisan test

cd ..\frontend
npm run build
```

## Notes

`node_modules`, build output, local logs, and `.env` files must not be committed. Use small, focused commits and merge reviewed work into `develop`.
