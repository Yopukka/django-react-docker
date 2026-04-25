# 🛒 ShopAuth — Full Stack E-Commerce with Auth System

A full stack e-commerce application built with **Django REST Framework** and **React**, featuring a complete authentication system with email verification, role-based access control, and a fully functional shopping cart.

---

## 📸 Screenshots

> _Coming soon_

---

## 🚀 Features

### Authentication & Security
- JWT-based login with access and refresh tokens
- User registration with **email verification** (30-minute expiry)
- **Forgot password** flow with secure token-based reset link
- Password validation (uppercase, lowercase, numbers, symbols)
- Temporary email domain blocking
- Resend verification with 2-minute cooldown

### Role-Based Access
- **Admin** — access to admin dashboard with inventory and order management
- **User** — standard user access to the store

### Store & Shopping Cart
- Product listing with **category filters** and **keyword search**
- Real-time stock tracking with low-stock warnings
- Persistent shopping cart per user
- Slide-in cart sidebar with quantity controls
- Checkout flow with shipping address and order notes
- Order history with status tracking

### Admin Dashboard
- Summary cards: total products, out of stock, low stock, total orders, pending orders
- Low stock product alerts
- Recent orders with inline status management (pending → confirmed → shipped → delivered → cancelled)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 6, Django REST Framework |
| Authentication | JWT (SimpleJWT) |
| Database | SQLite (dev) |
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Containerization | Docker, Docker Compose |
| Email | SMTP (Gmail) |

---

## 📁 Project Structure

```
ShopAuth/
├── backend/
│   ├── crude2l/          # Django project settings & URLs
│   ├── user/             # Auth app — register, login, verify, reset
│   ├── rol/              # Roles app
│   └── store/            # Store app — products, cart, orders
├── frontend/
│   └── e2l/
│       └── src/
│           ├── api/          # Axios instance
│           ├── context/      # AuthContext, CartContext
│           ├── services/     # API service functions
│           ├── pages/        # Store, Orders, AdminDashboard
│           └── components/   # ProductCard, CartSidebar, etc.
└── docker-compose.yml
```

---

## ⚙️ Getting Started

### Prerequisites
- Docker & Docker Compose installed

### 1. Clone the repository

```bash
git clone https://github.com/yopukka/ShopAuth.git
cd ShopAuth
```

### 2. Configure environment variables

Create `backend/.env` with your values:

```env
EMAIL_BACKEND=*******
EMAIL_HOST=********
EMAIL_PORT=**********
EMAIL_USE_TLS=******
EMAIL_USE_SSL=****
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
DEFAULT_FROM_EMAIL=your_email@gmail.com
FRONTEND_URL=http://localhost:******
```

Create `frontend/e2l/.env`:
```env
VITE_API_URL=http://localhost:****/api
```

### 3. Build and run

```bash
docker compose build
docker compose up
```

### 4. Run migrations and create superuser

```bash
docker compose run backend python manage.py migrate
docker compose run backend python manage.py createsuperuser
```

### 5. Access the app

| Service | URL |
|---|---|
| Frontend | http://localhost:***** |
| Backend API | http://localhost:****/api |
| Django Admin | http://localhost:****/admin |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/` | Register |
| POST | `/api/login/` | Login → returns JWT |
| POST | `/api/user/verify-email/` | Verify email with token |
| POST | `/api/user/resend-verification/` | Resend verification email |
| POST | `/api/forgot-password/` | Request password reset |
| POST | `/api/reset-password/` | Reset password with token |

### Store
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/store/products/` | List products (supports `?category=` and `?search=`) |
| GET | `/api/store/categories/` | List categories |
| GET | `/api/store/cart/` | Get user cart |
| GET | `/api/store/orders/` | List user orders |
| POST | `/api/store/cart/add/` | Add item to cart |
| POST | `/api/store/orders/checkout/` | Place order |
| PATCH | `/api/store/cart/update/{id}/` | Update item quantity |
| DELETE | `/api/store/cart/remove/{id}/` | Remove item |
| DELETE | `/api/store/cart/clear/` | Clear cart |



### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/store/admin/dashboard/` | Dashboard summary |
| PATCH | `/api/store/admin/orders/{id}/status/` | Update order status |

---

## 👤 Author

**yopukka** — [github.com/yopukka](https://github.com/yopukka)

---

## 📄 License

MIT