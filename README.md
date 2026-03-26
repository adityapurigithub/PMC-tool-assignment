# Project Management & Collaboration Tool
A modern, full-stack Project Management application featuring a Kanban-style board, real-time filtering, and Role-Based Access Control (RBAC).

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js installed
*   MongoDB instance (Local or Atlas)

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with:
# PORT=5000
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# JWT_REFRESH_SECRET=your_refresh_secret
npm run swagger  # Regenerates API docs
npm run server
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 📁 Directory Structure
```text
AssignmentMERN2/
├── client/                # React (Vite) + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Reusable UI (Button, Modal, TaskBoard)
│   │   ├── context/       # State Management (Auth, Project, Task)
│   │   ├── pages/         # View layers (Dashboard, ProjectBoard)
│   │   └── services/       # Axios API config
├── server/                # Node.js + Express + Mongoose
│   ├── controllers/       # Business Logic
│   ├── models/            # Database Schemas
│   ├── routes/            # API Endpoints
│   └── middleware/        # JWT Auth & Error Handling
└── README.md
```

---

## ✨ Features
*   **Authentication:** JWT-based Login/Register with Refresh Token rotation.
*   **Project Workspaces:** Create, Filter, and Search workspaces.
*   **Kanban Board:** Drag-and-drop task management via `@hello-pangea/dnd`.
*   **Advanced Filtering:** Search tasks by Title, Priority, Assignee, or Due Date.
*   **Task History:** Detailed activity logs for every task modification.
*   **RBAC:** Admin vs. Member roles (Admins can delete projects and invite users).
*   **Premium UI:** Tailwind CSS v4, Feather Icons, and Responsive Design.
*   **API Docs:** Fully interactive Swagger UI **(Generated using swagger-autogen)**.

---

## 🛠️ Tech Stack
*   **Frontend:** React 18, Vite, Tailwind CSS, Context API.
*   **Backend:** Node.js, Express, MongoDB, Mongoose.
*   **Icons:** React Icons (Feather Icons).

---

## 📖 Notes

### Architecture Decisions
- **MERN Stack:** For rapid development and high scalability.
- **State Management:** React **Context API** was chosen over Redux for this scope to maintain code readability and reduce boilerplate overhead.
- **Security:** Implemented **JWT (Access + Refresh tokens)** stored in state and handled via Axios interceptors for a seamless, secure user session.
- **UI Architecture:** Use of **Atomic/Reusable components** (Button, Modal) to ensure consistency and minimize CSS duplication.

### Caching Strategy
- **Client Tier:** Vite-optimized asset bundling and basic browser caching.
- **API Tier:** Strategic MongoDB **Indexing** on frequently queried fields (e.g., `members.user`, `projectId`). 
- **Minimizing Payload:** Using Mongoose `select` and `populate` only for required fields to reduce network overhead.


## 📖 API Documentation
The API documentation is accessible via Swagger UI.
- **URL:** `http://localhost:5000/api-docs`
- **Method:** Automated generation using `swagger-autogen`. No manual JSDoc comments are required in the source code.
- **To Regenerate:** Run `npm run swagger` in the `server` directory.
