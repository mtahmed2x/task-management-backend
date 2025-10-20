# Real-Time Task Manager - Backend (Express.js)

This is the backend server for the Full-Stack Challenge. It's a robust Node.js application built with Express.js, Prisma, and Socket.IO to provide a secure REST API and real-time communication for a collaborative task manager.

## Features

- **RESTful API**: Clean, well-structured API for all task and user operations.
- **JWT Authentication**: Secure user registration and login with short-lived access tokens and long-lived, rotating refresh tokens.
- **CRUD for Tasks**: Protected endpoints for creating, reading, updating, and deleting tasks.
- **Real-time with Socket.IO**:
  - Authenticated socket connection.
  - Broadcasts task lock/unlock events to all connected clients.
  - Manages a list of online users.
- **Database Management**: Uses Prisma ORM for seamless interaction with a PostgreSQL database, including migrations and type safety.

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Authentication**: JSON Web Token (JWT)

---

## API Endpoints

- `POST /api/v1/auth/register`: Create a new user.
- `POST /api/v1/auth/login`: Log in and receive tokens.
- `POST /api/v1/auth/refresh`: Get a new access token using a refresh token.
- `POST /api/v1/auth/logout`: Invalidate a refresh token.
- `GET /api/v1/task`: Get all tasks (public).
- `POST /api/v1/task/create`: Create a new task (protected).
- `GET /api/v1/task/:id`: Get a single task (public).
- `PATCH /api/v1/task/update/:id`: Update a task (protected).
- `DELETE /api/v1/task/:id`: Delete a task (protected).

---

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- PostgreSQL database instance

### Setup & Run Instructions

1.  **Clone the repository:**

    ```bash
    git clone [Link to your Backend GitHub repo]
    cd real-time-task-manager-backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project.

4.  **Setup the Database:**
    Run the Prisma migration to set up your database schema.

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

---

## Live API

- **API Base URL:** `https://task-management-backend-pavs.onrender.com/api/v1`
