# 💻 Lappy Square — Premium Refurbished Laptop E-Commerce Platform

A production-ready, full-featured multi-page e-commerce platform built for **Lappy Square**, an Indian brand specializing in certified pre-owned and refurbished laptops. Benchmarked functionally against industry leaders like Renewfy India, but designed with an original, sophisticated **White Visual Identity** (#FFFFFF / #F7F8FA), custom typography, purposeful micro-animations, real PostgreSQL/SQLite database models, and an automated **Meta WhatsApp Cloud API** order notification engine.

---

## 🌟 Key Highlights & Architecture

- **Visual Theme:** Strict, modern **White Theme** (#FFFFFF background, #F7F8FA secondary background, #0F172A charcoal brand accent, #E8E8E8 subtle borders). No dark mode, no heavy glassmorphism or distracting gradients.
- **Next.js App Router (TypeScript):** Server Components by default for instantaneous SEO rendering, Client Components only where interactive state is required.
- **Database Architecture (Prisma ORM):** Fully normalized models including `User`, `Address`, `Brand`, `Category`, `Product`, `ProductImage`, `InventoryUnit`, `Order`, `OrderItem`, `PaymentTransaction`, `Coupon`, `Review`, `BlogPost`, `WhatsAppSetting`, `WhatsAppLog`, and `AuditLog`.
- **Zero-Setup Local Dev:** Configured with SQLite (`dev.db`) out-of-the-box for instant local testing, with 1-click migration to PostgreSQL for cloud deployment (Supabase, Neon, AWS RDS).
- **Authentication & RBAC:** HTTP-only JWT session authentication with strict server-side role-based authorization for `SUPER_ADMIN`, `ADMIN`, `CONTENT_MANAGER`, and `CUSTOMER`.
- **Meta WhatsApp Cloud API (Section 15):** Automated real-time WhatsApp order alerts dispatched to the business number upon order placement (COD) or payment verification (Razorpay). Includes idempotency protection, delivery logging, retry controls, and a customer "Ask on WhatsApp" pre-filled inquiry button.
- **E-Commerce Capabilities:**
  - Multi-faceted catalogue filtering (Brand, Price slider/tiers, RAM, SSD/HDD, Condition Grade, Processor, OS).
  - 4-Laptop side-by-side spec comparison table.
  - Interactive Product Detail Page with image gallery, zoom, PIN code delivery check, 45-point testing report, and battery health indicator.
  - Server-validated Cart, Coupons (`WELCOME10`, `LAPPY2000`), and multi-step Checkout.
  - Dual payment gateways: Cash on Delivery (COD) and Razorpay integration with signature verification.
  - Customer Accounts: Order tracking with invoice receipts, saved addresses, and persistent wishlists.
  - Lead Management: Dedicated inquiry pipelines for Sell Your Laptop, Exchange, Corporate Procurement, and General Contact.
  - Full Admin Panel with real-time dashboard analytics, product creation with specs snapshot, order fulfillment workflows, review moderation, and editorial blog CMS.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm** or **pnpm**

### 2. Installation & Setup

```bash
# Clone or navigate to the repository
cd "c:/Users/dell/Downloads/Lappy Square"

# Install dependencies (if not already installed)
npm install --legacy-peer-deps

# Push schema to database (SQLite creates dev.db automatically)
npm run db:push

# Seed the database with sample products, brands, blogs, and admin credentials
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Seed Accounts & Credentials

The seed script (`scripts/seed.mjs`) initializes the database with the following verified test credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@lappysquare.com` | `Admin@12345` | Full Admin Console (`/admin`), Settings, RBAC |
| **Demo Customer** | `rahul.sharma@example.com` | `Customer@12345` | Customer Account (`/account`), Orders, Wishlist |

> **Tip:** You can also use the one-click "Quick Fill Admin" or "Quick Fill Customer" buttons on the `/login` page for fast testing.

---

## 📱 WhatsApp Business Cloud API Integration (Section 15)

Lappy Square comes with an automated WhatsApp notification engine powered by the official **Meta WhatsApp Cloud API**.

### How It Works:
1. **Checkout Event:** When a customer completes an order:
   - For **Cash on Delivery**, a notification is dispatched immediately to the store's configured business number.
   - For **Online Payments (Razorpay)**, the notification is dispatched only after server-side cryptographic signature verification (`/api/payment/verify`).
2. **Notification Content:** Includes Order ID, Customer details, Item SKU & configuration, Subtotal, Applied coupons, Taxes, Final total, Shipping address, and direct Admin Order Link.
3. **Admin Settings (`/admin/whatsapp`):**
   - Toggle automated notifications ON/OFF.
   - Configure Business WhatsApp Number and Recipient Number.
   - Configure Meta Business Account ID, Phone Number ID, and Access Token.
   - Send test notifications to confirm connectivity.
   - Inspect live delivery logs with provider message IDs, payload snapshots, and 1-click retry for failed messages.

### Connecting Your Real Meta WhatsApp Cloud API Credentials:
1. Go to the [Meta for Developers Portal](https://developers.facebook.com/) and create a **Business App**.
2. Add the **WhatsApp** product to your app.
3. Under **WhatsApp > API Setup**, copy:
   - **Phone Number ID**
   - **WhatsApp Business Account ID**
   - **Permanent Access Token** (generated via System Users in Business Manager)
4. Enter these credentials into the **Admin Panel > WhatsApp Integration** (`/admin/whatsapp`) or set them in your `.env` file:
   ```env
   WHATSAPP_API_TOKEN="EAABw..."
   WHATSAPP_PHONE_NUMBER_ID="109876543210987"
   WHATSAPP_BUSINESS_ACCOUNT_ID="123456789012345"
   WHATSAPP_BUSINESS_NUMBER="+919876543210"
   ```
5. *(Development Simulation)*: If credentials are not configured, the engine safely runs in **Simulated Dev Mode** — it formats and logs the WhatsApp message to `WhatsAppLog` in the database, allowing you to preview the exact formatted message without failing the checkout.

---

## 💳 Payment Gateway (Razorpay)

To configure Razorpay for real transactions:
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Generate API Keys (Test Key & Secret for development).
3. Add them to `.env`:
   ```env
   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="your_secret_key"
   ```
4. For Cash on Delivery, orders are confirmed immediately with zero third-party dependencies required.

---

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma         # Database schema (23 relational models)
├── scripts/
│   └── seed.mjs              # Realistic Indian laptop store seeder
├── src/
│   ├── app/
│   │   ├── (public pages)
│   │   │   ├── page.tsx             # Homepage with editorial hero, brands, budget, use cases
│   │   │   ├── shop/                # Complete catalog with multi-filters
│   │   │   ├── product/[slug]/      # Comprehensive PDP with specs & WhatsApp button
│   │   │   ├── brands/[slug]/       # Brand dynamic pages (Apple, Dell, HP, Lenovo...)
│   │   │   ├── budget/[tier]/       # Budget category pages
│   │   │   ├── use/[slug]/          # Use-case category pages (Student, Business...)
│   │   │   ├── compare/             # 4-laptop side-by-side spec comparison
│   │   │   ├── cart/                # Cart with stock validation & coupon application
│   │   │   ├── checkout/            # Complete checkout (COD & Razorpay)
│   │   │   ├── order-success/       # Success page with invoice & confetti
│   │   │   ├── account/             # Profile, orders, and wishlist
│   │   │   ├── sell-your-laptop/    # Trade-in lead generation
│   │   │   ├── exchange/            # Exchange request form
│   │   │   ├── corporate-enquiry/   # Bulk enterprise procurement
│   │   │   └── blogs/[slug]/        # Tech guides and refurbished buying advice
│   │   ├── admin/                   # Full Protected Admin Console
│   │   │   ├── page.tsx             # Executive metrics & revenue analytics
│   │   │   ├── products/            # Product & inventory management
│   │   │   ├── orders/              # Fulfillment pipeline & invoice generation
│   │   │   ├── whatsapp/            # WhatsApp settings, logs, and retries
│   │   │   ├── coupons/             # Coupon & promo management
│   │   │   ├── enquiries/           # Lead management & status pipeline
│   │   │   ├── reviews/             # Customer review moderation
│   │   │   ├── blogs/               # Blog & editorial CMS
│   │   │   └── settings/            # Global store settings & announcement bar
│   │   └── api/                     # Next.js Server API endpoints
│   ├── components/
│   │   ├── layout/                  # Header, AnnouncementBar, Footer
│   │   ├── ui/                      # ProductCard, WhatsAppFloatingButton
│   │   └── home/                    # HeroBanner, BrandBar, BudgetSection, etc.
│   ├── context/
│   │   ├── CartContext.tsx          # Client-side persistent cart
│   │   ├── CompareContext.tsx       # Comparison list context
│   │   └── WishlistContext.tsx      # Wishlist context
│   └── lib/
│       ├── prisma.ts                # Prisma singleton instance
│       ├── auth.ts                  # JWT authentication & RBAC guards
│       └── whatsapp.ts              # Section 15 WhatsApp Cloud API integration
└── README.md
```

---

## 🚢 Production Deployment (Vercel / Cloud + PostgreSQL)

1. **Database:** Create a managed PostgreSQL database on [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).
2. Change the provider in `prisma/schema.prisma` from `sqlite` to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set your environment variables on Vercel:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `WHATSAPP_API_TOKEN` (optional)
   - `WHATSAPP_PHONE_NUMBER_ID` (optional)
   - `RAZORPAY_KEY_ID` (optional)
4. Deploy to Vercel via Git:
   ```bash
   vercel --prod
   ```

---

## 📄 License
Proprietary & Confidential — Developed for **Lappy Square**. All rights reserved.
