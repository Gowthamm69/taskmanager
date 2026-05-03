# Team Task Manager – Backend API

This project is a backend system designed to manage team workflows by organizing users, projects, and tasks under a controlled access system.

It focuses on solving a common problem in collaborative environments: tracking work, assigning responsibilities, and maintaining visibility over progress.

---

## What This Project Does

The system allows multiple users to work within shared projects while enforcing permissions based on their roles.

Instead of giving everyone the same control, it separates responsibilities:
- Admins manage users and projects
- Members work on assigned tasks

This creates a structured workflow similar to real-world team tools.

---

## Core Functionalities

### 1. User Access Control
Users can register and log in securely.  
However, access is not immediate for everyone:
- The first admin is automatically approved
- All other users must be approved by an admin before using the system

This prevents unauthorized access and simulates controlled onboarding.

---

### 2. Project Management
Each project acts as a workspace.

Inside a project:
- Members can collaborate
- Admins control access and structure
- Only authorized users can view or modify data

---

### 3. Task Management
Tasks are the core working units.

Each task includes:
- Title and description
- Status (progress tracking)
- Priority level
- Optional due date
- Assigned user

Tasks can be filtered and updated dynamically within a project.

---

### 4. Dashboard Insights
Instead of raw data, the system provides summarized insights:
- Total tasks
- Completed tasks
- Tasks in progress
- Overdue tasks

This helps users understand workload and progress quickly.

---

### 5. Admin Controls
Admins have additional capabilities:
- View all users
- Approve or reject new registrations
- Maintain system control

This introduces a hierarchy, making the system closer to real-world applications.

---

## How It Is Built

This backend is structured to keep responsibilities separated and maintainable.

- Express handles routing and API structure
- Prisma manages database interaction
- PostgreSQL stores structured relational data
- Middleware is used to enforce authentication and permissions

Instead of mixing logic everywhere, each part of the system has a defined role.

---

## Authentication Flow

1. User registers
2. Account may remain pending (if not first admin)
3. Admin approves the user
4. User logs in and receives a token
5. Token is required to access protected routes

---

### Configure environment
Create a `.env` file with:
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=5000


### Setup database
npm run dev


---

## API Structure

Main route groups:
- `/api/auth` → authentication
- `/api/projects` → project operations
- `/api/tasks` → task handling
- `/api/admin` → admin actions
- `/api/dashboard` → analytics

---

## Limitations

This project focuses on backend logic, so:
- No frontend interface is included
- No real-time updates
- Basic validation only

---

## What Can Be Improved

To make this production-level:
- Add real-time updates (WebSockets)
- Implement rate limiting and security layers
- Add logging and monitoring
- Write automated tests
- Build a frontend interface

---

## Author

Gowtham

## Running the Project

### Install dependencies
