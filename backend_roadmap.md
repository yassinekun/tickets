# Backend & Database Implementation Roadmap

This document outlines the plan for building the backend and database for the macantik AFCON 2025 Ticket Platform.

## 1. System Architecture
- **Framework**: Node.js (TypeScript) + Express.
- **Database Driver**: `@neondatabase/serverless` (HTTP/WebSockets) for serverless environments.
- **Authentication**: **Neon Auth** (Managed Auth Service).
    - Supports separate flows for Users and Admins.
- **Database**: Neon PostgreSQL with strict role-based data isolation.
- **Payment Processing**: Simulated for Verification Fees (5 USD/Euro) and Alert Activation (3 USD/Euro).
- **Notifications**: Email Service for Alerts, Offer updates, and Verification confirmations.

### 🚨 Alert Engine & Fees
- **User Alert Creation**: $3 fee for a package of 5 alerts (Manual activation required).
- **Options**: Ticket Resale or Ticket Swap.
- **Admin Managed Status**: Alerts created as `Pending`. Activation follows payment confirmation.
- **Automated Scanning**: Worker compares active alerts with new market listings every 5 minutes.

## 2. Database Schema Design (Strict Isolation)

### Users Table (Fans & Sellers)
- `id` (UUID) - **Storage Key**: `auth_user`
- `email` (Unique)
- `password_hash`
- `full_name`
- `is_verified_seller` (boolean, default false)
- `verification_status` (Enum: `None`, `Pending`, `Verified`, `Rejected`)
- `verification_fee_paid` (boolean, default false)

### Admins Table (Staff Only)
- `id` (UUID) - **Storage Key**: `auth_admin`
- `email` (Unique)
- `password_hash`
- `admin_name`
- `access_level` (Enum: `Support`, `SuperAdmin`)

### Matches Table
- `id`
- `home_team`, `away_team`
- `stadium`, `city`
- `match_date`, `match_time`
- `group` (A-F)
- `phase` (Group Stage, Round of 16, Quarter-Finals, Semi-Finals, Final)
- `status` (Upcoming, In Progress, Finished)

### Tickets Table (Market Listings)
- `id` (UUID)
- `match_id` (FK)
- `seller_id` (FK -> Users)
- `category` (CAT 1 - CAT 3)
- `category` (CAT 1 - CAT 3)
- `quantity` (Number of tickets available)
- `status` (available, reserved, sold)

### Alerts Table
- `user_id` (FK -> Users)
- `match_id` (FK, nullable)
- `alert_type` (Enum: `SALE`, `SWAP`)
- `email_recipient` (String)
- `status` (Pending, Active, Expired)

### TicketSwaps Table
- `id` (UUID)
- `user_id` (FK -> Users)
- `offering_match_id` (FK -> Matches)
- `looking_for_match_id` (FK -> Matches)
- `offering_category`, `looking_for_category`
- `status` (Open, Matched, Completed)

## 5. Detailed Backend Implementation Plan

### Phase 1: Foundation & Authentication
- **Step 1.1: Neon Setup**: [COMPLETED]
    - Initialize project.
    - Provision **Neon Auth**.
    - Create `matches`, `tickets`, `alerts`, `swaps` tables.
- **Step 1.2: Backend Initialization**: [COMPLETED]
    - Setup `server/` with **TypeScript**.
    - Configure `@neondatabase/serverless` with connection string.
- **Step 1.3: Auth Implementation**: [IN PROGRESS]
    - Integrate Neon Auth (Better Auth) client on Frontend.
    - Implement Middleware to verify Neon Auth tokens on Backend.
    - Enforce Role-based access (User vs Admin).

### Phase 2: Marketplace Logic
- **Step 2.1: Ticket Listing**: Endpoint `POST /api/tickets` accepting `match_id`, `category`, `quantity`. Validates seller verification status.
- **Step 2.2: Match Separation**: Ensure `GET /api/matches/:id/tickets` filters strictly by `match_id`.

### Phase 3: Admin & Alert System
- **Step 3.1: Alert Creation**: User POSTs to `/api/alerts` -> defaults to `status: Pending`.
- **Step 3.2: Admin Verification Dashboard**:
    - Admin `GET /api/admin/alerts?status=Pending`.
    - Admin `POST /api/admin/alerts/:id/activate` (Use this after verifying payment).
- **Step 3.3: Automated Notification Worker**:
    - Cron job runs every 5-10 minutes.
    - Logic: `SELECT * FROM alerts WHERE status = 'Active'`.
    - For each alert, check `tickets` table for matches with `match_id` AND `status='available'` AND `quantity > 0`.
    - Send Email via SendGrid/Resend.
    - Log notification to avoid spamming.

### Phase 4: Dashboard Automation
- **Step 4.1: Today's Matches**:
    - Backend Endpoint: `GET /api/matches/today`.
    - Query: `SELECT * FROM matches WHERE match_date = CURRENT_DATE`.
    - Frontend: Call this endpoint on Dashboard mount to replace hardcoded data.

## 6. Next Steps
1. Initialize Neon PostgreSQL project.
2. Run migration scripts for the new schema (Quantity-based, No Price).
3. Build the User Auth API.

