# System Architecture

## Overview

This document describes the architecture of the Codeforces-like platform built with TypeScript and TurboRepo.

## Monorepo Structure

```
codeforces-platform/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/    # React components
│   │   │   └── lib/           # Utilities (API client, auth)
│   │   └── package.json
│   │
│   └── api/                    # Express Backend
│       ├── src/
│       │   ├── controllers/    # Request handlers
│       │   ├── routes/        # Route definitions
│       │   ├── middleware/    # Auth, error handling
│       │   └── index.ts       # Entry point
│       └── package.json
│
└── packages/
    ├── db/                     # Prisma Database
    │   ├── prisma/
    │   │   ├── schema.prisma   # Database schema
    │   │   └── seed.ts         # Seed script
    │   └── src/
    │       └── index.ts        # Prisma client export
    │
    ├── auth/                   # Authentication Utilities
    │   └── src/
    │       └── index.ts        # JWT & password hashing
    │
    ├── types/                  # Shared TypeScript Types
    │   └── src/
    │       └── index.ts        # Type definitions
    │
    └── config/                 # Shared Configurations
        ├── eslint/             # ESLint config
        └── tsconfig/           # TypeScript config
```

## Data Flow

### Authentication Flow

```
User → Frontend (Login) → API (/auth/login)
  → Verify Credentials → Generate JWT
  → Return Token → Store in localStorage
  → Use Token in API Requests (Authorization Header)
```

### Contest Flow

```
User → Frontend (/contests) → API (/api/contests)
  → Prisma Query → Database
  → Return Contests → Display in UI
```

### Submission Flow

```
User → Frontend (Submit Code) → API (/api/submissions)
  → Validate Request → Create Submission (PENDING)
  → Return Submission → Display Status
  → [Future: Queue for Execution] → Update Status
```

## Backend Architecture

### Pattern: Controller-Service-Repository

```
Route → Controller → Service → Repository (Prisma) → Database
```

**Example:**
- Route: `/api/contests` (GET)
- Controller: `contestController.getAll()`
- Service: (Direct Prisma calls in controller for simplicity)
- Repository: Prisma Client

### Middleware Stack

```
Request → CORS → JSON Parser → Routes → Auth Middleware → Controller → Error Handler → Response
```

### Authentication Middleware

1. **`authenticate`**: Verifies JWT token, adds user to request
2. **`requireAdmin`**: Checks if user has ADMIN role

## Frontend Architecture

### App Router Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page
├── login/                 # Authentication
├── register/
├── contests/              # Contest listing
│   └── [id]/             # Contest detail
├── challenges/
│   └── [id]/             # Challenge detail & submission
├── submissions/          # User submissions
└── admin/
    ├── dashboard/        # Admin dashboard
    └── contest/
        └── create/       # Create contest
```

### Client vs Server Components

- **Server Components**: Default in App Router (pages)
- **Client Components**: Forms, interactive UI (`'use client'`)

### State Management

- **Local State**: React `useState` for component state
- **Auth State**: localStorage for token/user
- **API State**: Fetch on mount with `useEffect`

## Database Schema

### Entity Relationship Diagram

```
User
  ├── id (PK)
  ├── email (unique)
  ├── username (unique)
  ├── password (hashed)
  ├── role (ADMIN | USER)
  └── submissions (1:N)

Contest
  ├── id (PK)
  ├── name
  ├── description
  ├── startTime
  ├── endTime
  ├── status (UPCOMING | LIVE | ENDED)
  └── challenges (1:N)

Challenge
  ├── id (PK)
  ├── contestId (FK → Contest)
  ├── title
  ├── description
  ├── difficulty
  ├── inputFormat
  ├── outputFormat
  ├── constraints
  ├── sampleInput
  ├── sampleOutput
  └── submissions (1:N)

Submission
  ├── id (PK)
  ├── userId (FK → User)
  ├── challengeId (FK → Challenge)
  ├── language
  ├── sourceCode
  ├── status (PENDING | ACCEPTED | WRONG_ANSWER | ...)
  └── submittedAt
```

## Security Architecture

### Authentication

- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcryptjs (10 rounds)
- **Token Storage**: localStorage (frontend)
- **Token Validation**: Middleware on protected routes

### Authorization

- **Role-Based Access Control (RBAC)**:
  - ADMIN: Full access
  - USER: Limited access (own submissions)

### Input Validation

- **Zod Schemas**: Request validation
- **Type Safety**: TypeScript strict mode
- **SQL Injection**: Protected by Prisma

## API Design

### RESTful Conventions

- `GET /api/resource` - List resources
- `GET /api/resource/:id` - Get resource
- `POST /api/resource` - Create resource
- `PUT /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

### Response Format

**Success:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

**Error:**
```json
{
  "error": "Error message",
  "details": {...}
}
```

## Deployment Considerations

### Environment Variables

**Backend:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `PORT`: Server port

**Frontend:**
- `NEXT_PUBLIC_API_URL`: Backend API URL

### Build Process

1. **Database**: Run migrations
2. **Backend**: `npm run build` → `dist/`
3. **Frontend**: `npm run build` → `.next/`
4. **Deploy**: Run production servers

### Scalability

- **Database**: PostgreSQL with proper indexing
- **API**: Stateless (can scale horizontally)
- **Frontend**: Static generation where possible
- **Future**: Add Redis for caching, queue for submissions

## Future Enhancements

1. **Code Execution Engine**: Queue-based system (Bull/BullMQ)
2. **Real-time Updates**: WebSockets for submission status
3. **Caching**: Redis for frequently accessed data
4. **File Storage**: S3 for test cases
5. **Monitoring**: Logging and error tracking
6. **Testing**: Unit and integration tests


