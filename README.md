# Renlo Backend - Premium Real Estate Management Platform

Welcome to the backend infrastructure of **Renlo**, a high-end property rental and management system designed for seamless interactions between tenants, owners, and administrators (BigBoss).

![Renlo Architecture](https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js/npm
- MongoDB (Local or Atlas)
- environment variables configured in `.env`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd renlo-backend

# Install dependencies
bun install
```

### Running the App

```bash
# Development mode with watch (Bun)
bun run dev

# Build the project
bun run build

# Start production server
bun run start
```

---

## 🛠 Tech Stack

| Category       | Technology            |
| :------------- | :-------------------- |
| **Runtime**    | Bun / Node.js         |
| **Framework**  | Express.js (v5.x)     |
| **Language**   | TypeScript            |
| **Database**   | MongoDB with Mongoose |
| **Validation** | Zod                   |
| **Security**   | Helmet, CORS, JWT     |
| **Logging**    | Pino                  |

---

## 🏛 Architecture & Coding Practices

We follow a **Modular Architecture** pattern, ensuring high maintainability and scalability.

### Folder Structure

- `src/module/<feature>/`: Self-contained modules containing routes, controllers, services, and models.
- `src/middleware/`: Global and feature-specific middlewares (auth, roles, validation).
- `src/utils/`: Shared utility functions (async handlers, API response wrappers).
- `src/config/`: Configuration files (DB connection, Env variables).
- `src/constant/`: Global constants and enums.

### Coding Patterns

- **Async Error Handling**: Using a custom `asyncHandler` wrapper to eliminate try-catch boilerplate.
- **Validation**: Request bodies and params are validated using **Zod** schemas before reaching controllers.
- **Consistent Responses**: All API responses follow a unified structure using the `ApiResponse` class.
- **Type Safety**: Strictly typed interfaces for database models and request/response cycles.

---

## 👥 User Roles & Relationships

The system defines three distinct roles with a hierarchical relationship:

### 1. 👑 BIGBOSS (Administrator)

- **Relationship**: Oversees the entire platform.
- **Capabilities**: Can manage all users, review and approve any listing, view all visit schedules, and manage platform-wide settings.
- **Goal**: Ensure platform integrity and quality control.

### 2. 🏠 OWNER (Property Owner/Manager)

- **Relationship**: Owns or manages listings.
- **Capabilities**: Create and update listings, manage incoming visit requests, schedule viewings, and initiate lease agreements.
- **Goal**: Rent out properties efficiently.

### 3. 👤 TENANT (Prospective Renter)

- **Relationship**: Browses and applies for properties.
- **Capabilities**: Search listings, request visits, mark visits as completed, and provide decisions (Accept/Reject) on properties.
- **Goal**: Find and secure a rental home.

---

## 🔄 Core Business Flows

### 1. Property Listing Flow

`Draft` → `Review` (by BigBoss) → `Published`

- Owners submit listings as drafts or for review.
- BigBoss approves or rejects (with reasons) to make them public.

### 2. Visit Management Flow

`Requested` → `Scheduled` → `Visited` → `Decision`

- **Tenant**: Requests a visit.
- **Owner**: Schedules a date/time or cancels.
- **Tenant**: Marks as "Visited" after physical inspection.
- **Tenant**: Submits a "Decision" (Interested/Not Interested).

### 3. Lease & Move-In Flow

`Document Upload` → `Agreement Signing` → `Inventory Audit` → `Completed`

- A structured workflow to handle the transition from a positive visit to a signed lease.

---

## 🛣 API Route Overview

| Module      | Endpoint       | Roles          | Description                        |
| :---------- | :------------- | :------------- | :--------------------------------- |
| **Auth**    | `/api/auth`    | Public         | Registration, Login, Refresh Token |
| **Visit**   | `/api/visit`   | All            | Tracking property visits           |
| **Listing** | `/api/listing` | All            | Browsing and managing properties   |
| **Lease**   | `/api/lease`   | Owner / Tenant | Managing move-in workflows         |
| **User**    | `/api/user`    | BigBoss        | Management of user profiles        |

