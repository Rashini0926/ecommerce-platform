# 🛒 E-Commerce Platform

## 🚀 Tech Stack
### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
### Backend
- Laravel 12
- PHP 8.2+
- Laravel REST API
- Laravel Sanctum Authentication
### Database
- MySQL
- XAMPP
### Development Tools
- Git & GitHub
- VS Code
- Postman
---
# 📁 Project Structure
```
ecommerce-platform
│
├── frontend        # React application
│
├── backend         # Laravel API backend
│
├── docs            # Documentation
│
└── README.md
```
---
# ⚙️ Installation Guide
## 1. Clone Repository
```bash
git clone https://github.com/Rashini0926/ecommerce-platform.git
```
Go inside project:
```bash
cd ecommerce-platform
```
---
# Frontend Setup
Navigate:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Run frontend:
```bash
npm run dev
```
Frontend runs on:
```
http://localhost:5173
```
---
# Backend Setup (Laravel)
Navigate:
```bash
cd backend
```
Install PHP dependencies:
```bash
composer install
```
Create environment file:
```bash
copy .env.example .env
```
Generate application key:
```bash
php artisan key:generate
```
---
# Database Configuration
Start XAMPP:
- Apache ✅
- MySQL ✅
Create database:
```
ecommerce_db
```
Update `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=
```
Run migrations:
```bash
php artisan migrate
```
---
# Run Laravel Server
```bash
php artisan serve
```
Backend runs on:
```
http://127.0.0.1:8000
```
---
# 🔐 Authentication Features
Implemented:
- User Registration
- User Login
- Password Encryption
- Token Authentication
- Customer Profile
API Endpoints:
```
POST /api/register
POST /api/login
GET /api/profile
POST /api/logout
```
---
# 👥 Team Modules
## Customer Module
- User authentication
- Customer dashboard
- Profile management
## Product Management
- Product CRUD operations
- Product browsing
- Product details
## Order Management
- Create orders
- View orders
- Manage order status
---
# 🌿 Git Branch Strategy
Main branches:
```
main
develop
```
Feature branches:
```
feature/homepage
feature/authentication
feature/products
feature/orders
```
---
# 👩‍💻 Development Workflow
Before starting work:
```bash
git pull origin develop
```
Create feature branch:
```bash
git checkout -b feature/your-feature
```
After completing:
```bash
git add .
git commit -m "your message"
git push origin feature/your-feature
```
Create Pull Request on GitHub.
---
# 🧪 API Testing
Recommended tool:
Postman
Test:
- Authentication APIs
- Product APIs
- Order APIs
---
# 📌 Current Progress
✅ React frontend setup  
✅ Laravel backend setup  
✅ MySQL connection  
✅ API routing configured  
⬜ Authentication API  
⬜ Product Management  
⬜ Order Management  
⬜ Frontend API Integration  
---
# 👨‍💻 Contributors
- Rashini Wijesinghe
- Team Members
---
# 📄 License
This project is developed for educational and internship purposes.
