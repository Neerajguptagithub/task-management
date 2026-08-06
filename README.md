# TaskFlow — Employee Task Management System

A full-stack MERN application where **Admins** manage employees and assign tasks, and **Employees** view and update their assigned tasks.

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://task-management-phi-hazel.vercel.app |
| Backend API | https://task-management-m520.onrender.com/api |

**Admin Test Credentials:**
| Role | Email | Password |
|---|---|---|
| Admin | admin@gmail.com | Admin@123 |
| Employee | _(Create via Admin panel)_ | _(Set during creation)_ |

---

## Features

- JWT authentication via **httpOnly cookies** (XSS-safe)
- Role-based access control (Admin / Employee)
- Admin: Create, update, delete, assign tasks
- Admin: Create and delete employees
- Admin: Dashboard with real-time statistics
- Employee: View assigned tasks and update status
- Input validation on both frontend and backend
- Docker + docker-compose for one-command startup

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, TypeScript, Tailwind CSS, Redux Toolkit, React Router v6 |
| Backend | Node.js, Express.js, MongoDB + Mongoose |
| Auth | JWT + bcrypt (httpOnly cookies) |
| DevOps | Docker, docker-compose, nginx |

---

##  Project Structure

```
task-management/
├── backend/          # Express REST API
│   ├── src/
│   │   ├── config/       # MongoDB connection
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/    # Auth, validation, error handler
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── utils/         # ApiError, ApiResponse, generateToken
│   ├── server.js
│   ├── seed.js
│   └── Dockerfile
├── frontend/         # React SPA
│   ├── src/
│   │   ├── api/          # Axios calls
│   │   ├── app/          # Redux store
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Redux slices
│   │   ├── hooks/        # Typed Redux hooks
│   │   ├── layouts/      # App layout
│   │   ├── pages/        # Admin & Employee pages
│   │   ├── routes/       # Route guards
│   │   └── types/        # TypeScript interfaces
│   └── Dockerfile
├── docker-compose.yml
├── postman_collection.json
└── README.md
```

---

##  Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Docker & docker-compose (optional)

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Neerajguptagithub/task-management.git
cd task-management

# 2. Start all services (MongoDB + Backend + Frontend)
docker-compose up --build

# 3. Seed the admin account
docker exec taskflow-backend node seed.js

# 4. Open http://localhost
```

### Option 2: Manual Local Setup

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed admin account
npm run seed

# Start development server
npm run dev
# Backend runs on http://localhost:5000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

---

##  API Reference

### Base URL: `http://localhost:5000/api`

#### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login |
| POST | `/auth/logout` | Protected | Logout |
| GET | `/auth/me` | Protected | Get profile |

#### Admin (requires Admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Dashboard statistics |
| GET | `/admin/employees` | List employees |
| POST | `/admin/employees` | Create employee |
| DELETE | `/admin/employees/:id` | Delete employee |
| GET | `/admin/tasks` | List all tasks |
| POST | `/admin/tasks` | Create task |
| PUT | `/admin/tasks/:id` | Update task |
| DELETE | `/admin/tasks/:id` | Delete task |

#### Employee (requires Employee role)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/employee/tasks` | Get my tasks |
| PATCH | `/employee/tasks/:id/status` | Update task status |

---

##  Docker

```bash
# Build and start
docker-compose up --build

# Seed admin
docker exec taskflow-backend node seed.js

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

##  Environment Variables

### Backend (`.env`)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000
CLIENT_URL=http://localhost:5173
SEED_ADMIN_NAME=Admin User
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin@123
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## Postman Collection

Import `postman_collection.json` into Postman. Set the `baseUrl` variable to your API URL.
