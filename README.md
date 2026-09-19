# Project LOOP — AI-Powered Customer Feedback Intelligence Platform

Project LOOP is a full-stack customer feedback intelligence platform designed to
collect, analyze, and visualize customer feedback using AI-assisted analysis.

---

## 1. Key Features

- **Multi-Channel Feedback Ingestion:** Collect customer feedback from different sources.
- **Workspace Management:** Keep workspace data isolated.
- **Role-Based Access Control (RBAC):**
  - **ADMIN:** Full platform management access
  - **ANALYST:** Analytics and feedback analysis
  - **VIEWER:** Read-only access
- **Customer Feedback Inbox:** View and manage feedback.
- **AI-Powered Analysis:** Analyze feedback using Hugging Face AI.
- **Themes & Trends:** Identify recurring customer concerns.
- **Ask LOOP:** Ask questions about customer feedback.
- **Reports:** Generate feedback insights.
- **CSV Upload:** Import feedback data through CSV files.
- **Responsive UI:** Designed for desktop and mobile devices.
- **Dark / Light Mode:** Switch between interface themes.

---

## 2. Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js | Frontend application |
| TypeScript | Type-safe development |
| Tailwind CSS | UI styling |
| Recharts | Data visualization |
| Node.js | Backend runtime |
| Express.js | REST API |
| PostgreSQL | Database |
| Prisma | Database ORM |
| Hugging Face | AI-powered analysis |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File upload |
| csv-parser | CSV processing |
| Git & GitHub | Version control |

---

## 3. System Architecture

```text
User
  ↓
Next.js Frontend
  ↓
Express.js REST API
  ↓
PostgreSQL + Prisma
  ↓
Hugging Face AI

Project Workflow

Customer Feedback
       ↓
Feedback Ingestion
       ↓
Backend API
       ↓
PostgreSQL Database
       ↓
AI-Assisted Analysis
       ↓
Sentiment + Themes + Insights
       ↓
Dashboard / Reports / Ask LOOP
