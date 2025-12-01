# Blog Api

## Getting Started

### Prerequisites
- Node.js
- pnpm
- PostgreSQL

### Installation

1. Clone the repository.
2. Install dependencies from both `frontend` and `backend` folders:
   ```bash
   pnpm install
   ```

### Configuration

#### Backend
1. Create a `.env` file in the `backend` directory based on `.env.template`.
2. Fill in the following variables:
   - `PORT`: Port for the backend server (default: 3000).
   - `DATABASE_URL`: PostgreSQL connection string.
   - `FRONTEND_URL`: URL of the frontend application (e.g., http://localhost:5173).
   - `SECRET`: Secret key for JWT signing.
   - `ADMIN_USERNAME`: Username for the initial admin account.
   - `ADMIN_PASSWORD`: Password for the initial admin account.

#### Frontend
1. Create a `.env` file in the `frontend` directory based on `.env.template`.
2. Fill in the `VITE_BACKEND_URL` (e.g., http://localhost:3000).

### Database Setup
Run the following command from the backend folder to run migrations:
```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### Create Admin User
To create the initial admin user defined in your environment variables:
```bash
pnpm createAdmin
```

### Running the Application

#### Backend
Start the backend server from the backend folder:
```bash
pnpm dev
```

#### Frontend
Start the frontend development server from the frontend folder:
```bash
pnpm dev
```

## Features

### Backend
- **REST API**: Built with Express.js.
- **Authentication**: Secure JWT-based authentication using Passport.js.
- **Database**: PostgreSQL database managed with Prisma ORM.
- **CRUD on posts and comments*: Create, read, update, and delete comments/posts with authentication 

### Frontend
- **Modern UI**: Built with React and Vite.
- **Styling**: Styled with TailwindCSS and an emerald accent.
- **Routing**: Client-side routing with React Router.
- **Admin Dashboard**: Admin dashboard to delete, edit, and create posts
- **Authentication**: Admins can delete and edit all comments, and can also access protected routes like the admin dashboard
