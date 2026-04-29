# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ShopAuth** is a full-stack e-commerce app with a Django REST Framework backend and a React + Vite frontend, containerized with Docker Compose.

## Commands

### Docker (primary development workflow)

```bash
# Build and start all services
docker compose build
docker compose up

# Run Django management commands
docker compose run backend python manage.py migrate
docker compose run backend python manage.py createsuperuser
docker compose run backend python manage.py makemigrations

# View logs
docker compose logs backend
docker compose logs frontend
```

### Backend (without Docker)

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### Frontend (without Docker)

```bash
cd frontend/e2l
npm install
npm run dev     # starts Vite dev server on port 5174
npm run build
npm run lint
```

## Environment Setup

**`backend/.env`** (required):
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
DEFAULT_FROM_EMAIL=your@gmail.com
FRONTEND_URL=http://localhost:5174
```

**`frontend/e2l/.env`** (required):
```
VITE_API_URL=http://localhost:8001/api
```

**`frontend/e2l/.env.docker`** is used by Docker Compose for the frontend container (sets `VITE_API_URL` to the container-accessible backend URL).

## Architecture

### Backend (`backend/`)

Django project package is `crude2l/`. Three Django apps:

- **`user/`** — Custom user model (`CustomUser` extends `AbstractBaseUser`). Email is the `USERNAME_FIELD`. Includes UUID-based email verification (30-min expiry) and password reset tokens. Views live in `user/api/view.py`. Uses `UserViewSet` for CRUD + custom actions (`verify_email`, `resend_verification`, `me`), and standalone `APIView`s for login, forgot/reset password.

- **`rol/`** — Simple `Rol` model with two choices: `admin` and `user`. Referenced as FK on `CustomUser`.

- **`store/`** — All e-commerce models: `Category`, `Product`, `Cart`, `CartItem`, `Order`, `OrderItem`. Views in `store/api/views.py` use DRF `ViewSets` registered with a `DefaultRouter`. `CartViewSet` uses `get_or_create` to lazily create a cart per user. `AdminDashboardViewSet` has a custom `IsAdminRole` permission (checks `request.user.rol.name == 'admin'`).

URL layout (`crude2l/urls.py`):
- `/api/` → `user/api/urls.py` (UserViewSet + auth endpoints)
- `/api/login/` → `EmailLoginView`
- `/api/forgot-password/` / `/api/reset-password/` → standalone views
- `/api/store/` → `store/api/urls.py` (DefaultRouter for categories, products, cart, orders, admin)

JWT via `rest_framework_simplejwt`: access token lifetime is 60 minutes, passed as `Bearer` header.

### Frontend (`frontend/e2l/src/`)

React 19 + Vite + Tailwind CSS 4.

- **`api/api.js`** — Axios instance reading `VITE_API_URL` from env. Request interceptor attaches `Bearer <token>` from `localStorage`.
- **`context/AuthContext.jsx`** — Stores `user` state, reads JWT from `localStorage`. Exposes `login(token, userData?)`, `logout()`, `fetchUser()`, `isAuthenticated`.
- **`context/CartContext.jsx`** — Stores cart state + sidebar open/closed. All cart mutations call `storeService.js` and refresh local state from the server response.
- **`services/`** — Thin wrappers over the Axios instance: `authService.js` (auth calls) and `storeService.js` (store calls).
- **`pages/`** — `Store`, `Orders`, `AdminDashboard`.
- **`components/`** — Auth flow components in `FirtSteps/` (note the typo in the directory name), plus `ProductCard`, `CartSidebar`, etc.
- **`App.jsx`** — All routes defined here. Protected routes wrap children in `<PrivateRoute>`.

### Service Ports

| Service | Host port |
|---|---|
| Django API | 8001 |
| React dev server | 5174 |

CORS is configured to allow `http://localhost:5174` only.

## Key Design Notes

- `CustomUser.notshow` is a flag returned at login used by the frontend to conditionally show onboarding.
- `Cart` is one-to-one per user; checkout creates an `Order`, snapshots `unit_price` on `OrderItem`, decrements `Product.stock`, then clears the cart atomically.
- Email sending uses `transaction.on_commit` to avoid sending emails if the DB transaction rolls back.
- `IsAdminRole` custom DRF permission in `store/api/views.py` checks the `rol` FK — distinct from Django's built-in `is_staff`/`is_superuser` flags.
- Media files (product images) are served at `/media/` in development and stored in `backend/media/`.
