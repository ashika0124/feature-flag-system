# Multi-Tenant Feature Flag Management System

A SaaS-style Feature Flag Management System built using **Node.js**, **Express.js**, and **PostgreSQL** that allows organizations to manage feature rollouts independently.

## Features

### Super Admin

* Login using static credentials
* Create organizations
* View all organizations

### Organization Admin

* Sign up under an organization
* Login using email and password
* Create feature flags
* Enable or disable feature flags
* Delete feature flags
* Manage only their organization's features

### End User

* Login to their organization account
* Check whether a feature is enabled or disabled for their organization

---

## System Architecture

```text
Super Admin Frontend
        |
        |
        v
+------------------+
|   Node.js API    |
|   Express.js     |
+------------------+
        |
        |
        v
+------------------+
|   PostgreSQL DB  |
+------------------+
        ^
        |
        |
Admin Frontend ---- User Frontend
```

---

## Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* bcryptjs

### Frontend

* HTML
* CSS
* JavaScript

### Database

* PostgreSQL

---

## Project Structure

```text
feature-flag-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── schema.sql
│   └── .env
│
├── super-admin/
│   └── index.html
│
├── admin/
│   └── index.html
│
└── user/
    └── index.html
```

---

## Database Tables

### Organizations

Stores tenant information.

### Users

Stores users and their roles:

* super_admin
* org_admin
* end_user

### Feature Flags

Stores organization-specific feature toggles.

---

## API Endpoints

### Super Admin APIs

| Method | Endpoint                         | Description           |
| ------ | -------------------------------- | --------------------- |
| POST   | `/api/super-admin/login`         | Login                 |
| POST   | `/api/super-admin/organizations` | Create organization   |
| GET    | `/api/super-admin/organizations` | Get all organizations |

### Organization Admin APIs

| Method | Endpoint                   | Description   |
| ------ | -------------------------- | ------------- |
| POST   | `/api/org-admin/signup`    | Signup        |
| POST   | `/api/org-admin/login`     | Login         |
| GET    | `/api/org-admin/flags`     | Get all flags |
| POST   | `/api/org-admin/flags`     | Create flag   |
| PUT    | `/api/org-admin/flags/:id` | Update flag   |
| DELETE | `/api/org-admin/flags/:id` | Delete flag   |

### End User APIs

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| POST   | `/api/end-user/login`      | Login                |
| POST   | `/api/end-user/check-flag` | Check feature status |

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd feature-flag-system
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

Create `.env` inside backend:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/feature_flag_db
JWT_SECRET=your_secret_key
SUPER_ADMIN_EMAIL=admin@system.com
SUPER_ADMIN_PASSWORD=admin123
PORT=5000
```

### Create Database

```bash
createdb feature_flag_db
```

Run schema:

```bash
psql -U postgres -d feature_flag_db -f schema.sql
```

---

## Running the Application

### Start Backend

```bash
cd backend
npm start
```

### Start Super Admin Frontend

```bash
cd super-admin
npx http-server -p 3001
```

### Start Admin Frontend

```bash
cd admin
npx http-server -p 3002
```

### Start User Frontend

```bash
cd user
npx http-server -p 3003
```

---

## Test Flow

### Super Admin

1. Login using static credentials.
2. Create an organization.
3. Copy organization ID.

### Organization Admin

1. Signup using organization ID.
2. Login.
3. Create and manage feature flags.

### End User

1. Login.
2. Enter feature key.
3. Check feature availability.

---

## Security Features

* JWT Authentication
* Password hashing using bcrypt
* Role-based access control
* Organization level isolation
* Token expiration support

---

## Future Improvements

* Percentage based rollout support
* User segmentation
* Audit logs
* Feature flag analytics
* Redis caching
* Docker deployment
* Kubernetes support

---

## Author

Ashika Jaiswal

Backend Developer | Java | Spring Boot | Node.js
