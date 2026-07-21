# Analyze Existing Banking Backend & Design a Production-Grade Interactive Frontend

## ROLE

Act as a senior FinTech Product Designer, UX Architect, Frontend
Engineer, and Full-Stack System Architect experienced in building secure
banking and digital payment applications.

## GOAL

I have built/am building a banking and transaction backend based on the
following reference project:

**Reference Video:**\
https://youtu.be/NQOAQP0mow0?si=GPfhDY7juf1YRb36

Before designing or coding anything, deeply analyze the backend
architecture, features, API requirements, data flow, and business logic.
Then design a complete, professional, interactive, and user-friendly
frontend that makes meaningful use of ALL important backend
capabilities.

## BACKEND CONTEXT

The backend includes:

### 1. Server Architecture

-   Node.js
-   Express.js
-   MongoDB Atlas
-   Controllers
-   Models
-   Routes
-   Services
-   Config
-   Environment variables

### 2. Authentication

-   User registration
-   Login
-   bcrypt password hashing
-   JWT authentication
-   Cookie-based session/auth management

### 3. Email Service

-   Nodemailer
-   Registration/transactional emails

### 4. Banking System

-   User accounts
-   Account balances
-   Transactions
-   Ledger-based credit/debit records
-   Immutable audit trail

### 5. Transaction System

-   Money transfers
-   Pending/Completed transaction states
-   Idempotency keys to prevent duplicate payments
-   MongoDB aggregation for balance calculation
-   Atomic database transactions/sessions

### 6. Deployment

-   Render
-   Environment variable management
-   Security practices

## PHASE 1 --- BACKEND ANALYSIS

First analyze the entire backend system.

Create a clear mapping:

**Backend Feature → Required API → Frontend Feature → UI Screen**

Identify: - What the user can actually do - Authentication flow -
Account flow - Transaction flow - Ledger flow - Email-related events -
Error scenarios - Pending/failed/completed transaction states -
Security-sensitive frontend behavior

Do NOT invent backend functionality that does not exist.

Clearly separate: - **A.** Features already supported by the backend -
**B.** Features requiring small backend changes - **C.** Future features
that would require new backend development

## PHASE 2 --- PRODUCT CONCEPT

Design this as a realistic modern digital banking/FinTech web
application.

The application should feel: - Professional - Trustworthy - Modern -
Minimal - Premium - Interactive - Easy for non-technical users

Avoid making it look like: - A college project - A generic admin
dashboard - A template copied from the internet - An over-animated
portfolio website

Research current FinTech UI/UX patterns before deciding the design
direction.

## PHASE 3 --- COMPLETE USER JOURNEY

Design the complete flow:

**Landing Page → Register → Login → Dashboard → Account Overview → Send
Money → Transaction Processing → Success/Failure/Pending State →
Transaction History → Transaction Details → Ledger/Account Activity →
Profile/Settings → Logout**

Also design: - Loading states - Empty states - Error states - Network
failures - Invalid transactions - Insufficient balance - Duplicate
payment protection - Session expiration

## PHASE 4 --- DASHBOARD

Design a useful dashboard containing only information supported by the
system.

Consider: - Available balance - Account information - Recent
transactions - Money sent/received - Transaction status - Quick Send
Money action - Recent account activity

Use professional cards, charts, micro-interactions, and visual hierarchy
without making the UI cluttered.

## PHASE 5 --- TRANSACTION EXPERIENCE

This is the most important frontend flow.

Design:

**Send Money → Enter recipient/details → Enter amount → Review
transaction → Confirm → Processing → Completed/Pending/Failed →
Receipt/Transaction Details**

Show how idempotency protection should work behind the UI so accidental
double-clicking cannot create duplicate transfers.

## PHASE 6 --- UI/UX DESIGN SYSTEM

Recommend: - Color palette with HEX codes - Typography - Font sizes -
Spacing system - Buttons - Cards - Forms - Tables - Charts - Icons -
Navigation - Sidebar/topbar - Toast notifications - Modal/dialog system

Include light/dark mode only if it genuinely improves the product.

## PHASE 7 --- INTERACTIONS & ANIMATIONS

Suggest professional micro-interactions such as: - Balance reveal/hide -
Transaction status animations - Skeleton loading - Button feedback -
Page transitions - Success confirmation - Hover states

Animations must improve usability, not distract users.

## PHASE 8 --- TECH STACK

Recommend the best frontend stack.

Prefer evaluating: - Next.js - React - TypeScript - Tailwind CSS -
shadcn/ui - Framer Motion - TanStack Query - Axios/Fetch - Recharts

Explain which technologies are actually necessary and avoid unnecessary
dependencies.

## PHASE 9 --- FRONTEND ARCHITECTURE

Provide a production-quality folder structure including:

-   `components/`
-   `pages/` or `app/`
-   `features/`
-   `services/`
-   `hooks/`
-   `lib/`
-   `types/`
-   `store/`
-   `utils/`

Explain: - API service layer - Authentication state - Protected routes -
Token/cookie handling - Error handling - Loading management - Form
validation

## PHASE 10 --- API INTEGRATION BLUEPRINT

For every screen specify:

**UI Screen → API endpoint required → HTTP method → Request → Response →
Frontend state update → Possible errors**

If exact endpoints cannot be determined from the provided information,
mark them as proposed endpoints rather than pretending they already
exist.

## PHASE 11 --- SECURITY

Analyze frontend security considerations for: - JWT - Cookies - XSS -
CSRF - Sensitive banking information - Token storage - Protected
routes - Transaction confirmation - Duplicate submissions

Do not expose sensitive information in localStorage if a safer
architecture is available.

## PHASE 12 --- RESPONSIVE DESIGN

The application must work professionally on: - Desktop - Tablet - Mobile

Explain how important screens adapt across breakpoints.

## PHASE 13 --- FINAL DELIVERABLE

Before generating code, provide:

1.  Backend Understanding
2.  Backend → Frontend Feature Mapping
3.  Missing Backend Requirements
4.  Product Concept
5.  Complete Sitemap
6.  User Flow
7.  Screen-by-Screen UI Specification
8.  Design System
9.  Recommended Tech Stack
10. Frontend Architecture
11. API Integration Plan
12. Security Strategy
13. Responsive Strategy
14. Development Roadmap

Then ask me to approve the architecture.

ONLY after approval, generate the frontend implementation step-by-step.

## FINAL OBJECTIVE

The result should be a genuinely useful, portfolio-worthy FinTech
application where the frontend is designed around the existing banking
backend---not a beautiful UI that ignores the actual backend
functionality.
