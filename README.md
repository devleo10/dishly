# Dishly - Full-Stack Role-Based Food Ordering Application

A production-ready full-stack food ordering application built with Elysia (Bun) and Next.js, featuring role-based access control for Admins, Managers, and Members.

## Features

- **Role-Based Access Control**: Admin, Manager, and Member roles with specific permissions
- **Restaurant Management**: Browse restaurants and menu items
- **Order Management**: Create, view, and cancel orders (based on role)
- **Payment Methods**: Manage payment methods (Admin only)
- **Checkout**: Process orders with payment (Admin and Manager only)

## Tech Stack

- **Backend**: Elysia (Bun runtime), Drizzle ORM, PostgreSQL, JWT
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Query

## Prerequisites

- [Bun](https://bun.sh/) installed
- [Node.js](https://nodejs.org/) (for frontend, or use Bun)
- [Docker](https://www.docker.com/) and Docker Compose

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd dishly
```

### 2. Start PostgreSQL database

```bash
docker-compose up -d
```

### 3. Setup Backend

```bash
cd backend
bun install
cp .env.example .env
# Edit .env with your configuration
bun run db:migrate
bun run start:dev
```

The backend will run on `http://localhost:3001`

### 4. Setup Frontend

```bash
cd frontend
npm install  # or bun install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev  # or bun run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://dishly:dishly123@localhost:5432/dishly_db
JWT_SECRET=your-secret-key-here
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
dishly/
├── backend/          # Elysia API
├── frontend/         # Next.js app
├── docker-compose.yml
└── README.md
```

## API Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile
- `GET /restaurants` - List all restaurants
- `GET /restaurants/:id` - Get restaurant details
- `GET /restaurants/:id/menu-items` - Get menu items for restaurant
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/cancel` - Cancel order (Admin/Manager only)
- `POST /checkout` - Process checkout (Admin/Manager only)
- `GET /payment-methods` - List payment methods
- `POST /payment-methods` - Add payment method (Admin only)
- `PATCH /payment-methods/:id` - Update payment method (Admin only)
- `DELETE /payment-methods/:id` - Delete payment method (Admin only)

## Role Permissions

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| View restaurants & menu | ✅ | ✅ | ✅ |
| Create order | ✅ | ✅ | ✅ |
| Checkout & pay | ✅ | ✅ | ❌ |
| Cancel order | ✅ | ✅ | ❌ |
| Manage payment methods | ✅ | ❌ | ❌ |

## License

© Slooze. All Rights Reserved.


