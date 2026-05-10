# Traveloop
## 📋 Table of Contents
- [Overview](#-overview)
  
- [Key Features](#-key-features) 
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Authentication & Authorization](#-authentication--authorization)
- [Security](#-security)
- [Contributing](#-contributing)
---

## 📖 Overview

**Traveloop** is a full-stack travel planning and itinerary management platform designed for production environments. It provides end-to-end trip lifecycle management — from discovery and planning to budgeting, packing, journaling, and public sharing — all within a secure, scalable, and containerized architecture.

The platform is built on the **PERN stack** (PostgreSQL, Express, React, Node.js) with a service-oriented backend design, JWT-based authentication, role-based access control, and comprehensive admin analytics. It is fully containerized with Docker and deployable via Docker Compose or Kubernetes.

### Design Principles

- **Security-first**: JWT authentication, input validation, SQL injection prevention, XSS protection, rate limiting, and Helmet.js security headers.
- **Scalability**: Stateless API design, database connection pooling, and horizontal scaling readiness.
- **Maintainability**: Modular code structure, comprehensive test coverage, automated CI/CD, and semantic versioning.
- **Developer Experience**: One-command local setup, hot-reload development, clear documentation, and consistent code style.

---

## 🚀 Key Features

| Module | Capabilities |
|--------|-------------|
| **Trip Management** | Create, edit, duplicate, and archive trips. Attach destinations, dates, cover images, and metadata. |
| **Itinerary Builder** | Drag-and-drop day-by-day itinerary with time-slotted activities, location mapping, cost tracking, and real-time reordering. |
| **Financial Dashboard** | Category-based budget allocation, real-time expense logging, spending visualization with Recharts, and configurable budget threshold alerts. |
| **Packing Checklists** | Dynamic, trip-contextual packing lists with smart suggestions based on destination, season, and activity type. Progress tracking with completion metrics. |
| **Trip Journaling** | Rich-text per-day notes, photo attachments linked to activities, and journal export to PDF. |
| **Discovery & Search** | Curated destination catalog with multi-faceted filtering (budget, duration, season, activity type) and honest, non-affiliate recommendations. |
| **Public Sharing** | Generate unique public URLs for itineraries. Visitors can view, filter, and **one-click clone** ("Copy Trip") any shared trip into their own account. |
| **User Settings** | Profile management, notification preferences, account security (password change, session management). |
| **Admin Panel** | User management (list, enable/disable, delete), engagement analytics (DAU/MAU, registration trends), trip analytics (creation volume, popular destinations, clone rates), and financial aggregation. |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Web App    │  │  Mobile Web  │  │  Public Share│  │   Admin Panel  │  │
│  │   (React)    │  │  (Responsive)│  │   (Read-Only)│  │    (React)     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  │
└─────────┼─────────────────┼─────────────────┼──────────────────┼───────────┘
          │                 │                 │                  │
          └─────────────────┴─────────────────┴──────────────────┘
                                    │
                         HTTPS / REST API (JSON)
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│         (CORS, Rate Limiting, Request Logging, Helmet Security)              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SERVICE LAYER                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐  │
│  │   Auth     │ │   Trips    │ │ Itinerary  │ │  Finance   │ │  Admin    │  │
│  │  Service   │ │  Service   │ │  Service   │ │  Service   │ │  Service  │  │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬─────┘  │
│        └──────────────┴──────────────┴──────────────┴──────────────┘        │
│                              Express.js (Node.js)                            │
│                    JWT Middleware | Validation | Error Handling              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                         Sequelize ORM (Connection Pool)
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                      PostgreSQL 15+                                     │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │  │
│  │  │  Users  │ │  Trips  │ │Itinerary│ │Expenses │ │ Packing Items   │  │  │
│  │  │  Roles  │ │  Days   │ │Activities│ │ Budgets │ │     Notes       │  │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🛠 Technology Stack

### Backend
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | >= 18 LTS | JavaScript execution environment |
| Framework | Express.js | ^4.18 | REST API and HTTP server |
| Database | PostgreSQL | >= 15 | Relational data persistence |
| ORM | Sequelize | ^6.32 | Database modeling, migrations, queries |
| Authentication | jsonwebtoken | ^9.0 | JWT token generation and verification |
| Password Hashing | bcryptjs | ^2.4 | Secure password hashing (salt rounds: 12) |
| Validation | Joi | ^17.9 | Request body and parameter validation |
| Security | Helmet.js | ^7.0 | HTTP security headers |
| Rate Limiting | express-rate-limit | ^6.8 | API abuse prevention |
| Logging | Winston | ^3.10 | Structured application logging |
| Testing | Jest + Supertest | ^29.0 | Unit and integration testing |

### Frontend
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | ^18.2 | Component-based UI library |
| Routing | React Router | ^6.14 | Client-side SPA routing |
| HTTP Client | Axios | ^1.4 | API communication with interceptors |
| State Management | Context API + useReducer | Built-in | Global state without external dependencies |
| Styling | Tailwind CSS | ^3.3 | Utility-first CSS framework |
| Charts | Recharts | ^2.7 | Data visualization for finance and admin |
| Drag & Drop | React DnD | ^16.0 | Itinerary builder interaction |
| Forms | React Hook Form | ^7.45 | Performant form handling with validation |
| Dates | date-fns | ^2.30 | Date manipulation and formatting |
| Notifications | React Hot Toast | ^2.4 | Toast notification system |

### Infrastructure
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Containerization | Docker + Docker Compose | Consistent development and production environments |
| Web Server | Nginx (production) | Reverse proxy, static file serving, SSL termination |
| CI/CD | GitHub Actions | Automated testing, linting, and Docker image builds |
| Monitoring | Winston Logs + Health Check Endpoint | Application observability |

---

## 🔐 Authentication & Authorization

### JWT Token Strategy

Traveloop implements a **dual-token authentication system**:

- **Access Token**: Short-lived (7 days), signed with `JWT_SECRET`, included in `Authorization: Bearer <token>` header on every request.
- **Refresh Token**: Long-lived (30 days), signed with `JWT_REFRESH_SECRET`, stored securely and used to obtain new access tokens without re-authentication.

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| `user` | CRUD on own trips, itineraries, expenses, packing lists, notes, and profile. Can view public trips and copy them. |
| `admin` | All user permissions plus: user management, platform analytics, content moderation, and system configuration. |

### Security Middleware

- **Helmet.js**: Sets 11+ security headers including `Content-Security-Policy`, `X-Frame-Options`, and `Strict-Transport-Security`.
- **Rate Limiting**: 100 requests per minute per IP address to prevent brute-force and DDoS attacks.
- **Input Validation**: All request bodies and parameters validated via Joi schemas before reaching controllers.
- **SQL Injection Prevention**: All database queries use Sequelize parameterized queries — no raw string concatenation.
- **XSS Protection**: Output encoding for user-generated content; `Content-Security-Policy` restricts inline scripts.
- **Password Security**: bcrypt hashing with 12 salt rounds. Passwords never stored or logged in plaintext.

---



## 🔒 Security

### Security Checklist

- [x] JWT tokens with secure signing and expiry
- [x] bcrypt password hashing (salt rounds: 12)
- [x] Helmet.js security headers
- [x] CORS origin whitelist
- [x] Rate limiting on all endpoints
- [x] Input validation (Joi schemas)
- [x] SQL injection prevention (parameterized queries)
- [x] XSS output encoding
- [x] No sensitive data in logs
- [x] Environment-based configuration separation

---

## 🤝 Contributing

We welcome contributions from the community.

### Development Workflow

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature-name`
2. Ensure your code follows the existing style (ESLint + Prettier)
3. Write or update tests for new functionality
4. Ensure all tests pass: `npm test`
5. Commit with clear, descriptive messages following [Conventional Commits](https://www.conventionalcommits.org/)
6. Open a Pull Request with a detailed description of changes

### Commit Message Format

```
feat: add budget alert threshold configuration
fix: resolve race condition in token refresh
docs: update API endpoint documentation
test: add integration tests for expense controller
refactor: extract validation logic into middleware
```

---

<div align="center">
  <sub>Built with precision.</sub>
  <br>
  <sub><a href="https://github.com/yourorg/traveloop">Star this project</a> if you find it useful.</sub>
</div>
