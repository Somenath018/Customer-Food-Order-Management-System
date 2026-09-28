# Foodie - Full-Stack Food Order & Delivery Management System

A full-stack food delivery application inspired by modern platforms like Swiggy and Zomato, featuring real-time WebSockets (`Socket.io`), multi-role architecture, and interactive Leaflet map GPS tracking.

---

## 🚀 System Architecture & Quick Start

```
   ┌────────────────────────────────────────────────────────┐
   │             CENTRAL BACKEND (Port 5050)                │
   │  Express.js • REST APIs • Socket.io WebSockets Engine  │
   │  In-Memory / PostgreSQL Store • Mock Payment Gateway   │
   └───────────────────────────▲────────────────────────────┘
                               │
                ┌──────────────┴───────────────┐
                │     FOODIE MAIN WEB APP      │
                │         (Port 5173)          │
                │  • Default: Customer View    │
                │  • Restaurant Partner Portal │
                │  • Delivery Partner Fleet    │
                │  • Platform Admin Console    │
                │  • Secure Multi-Account Auth │
                └──────────────────────────────┘
```

### 1. Start the Central Backend (Port 5050)
```bash
# From workspace root:
npm run start:backend
# Or dev auto-reload:
npm run dev:backend
```
Backend health check: `http://localhost:5050/api/health`

### 2. Start the Foodie Main Web Portal (Port 5173)
```bash
# In a new terminal:
npm run start:frontend
```
Opens at: `http://localhost:5173`
Features:
- **Default Customer View**: Opens directly to customer restaurants and popular dishes. Search, 9 cuisine categories (Biryani, Pizza, Burgers, North Indian, Chinese, Rolls, Desserts, Healthy Bowls, Shakes & Chai) with real menus and matching restaurants, cart, checkout, live Leaflet tracking.
- **Normal Role Options**: Role switcher banner allows switching between **Customer**, **Restaurant Partner**, and **Delivery Partner**. Clicking Restaurant Partner or Delivery Partner requires authentication and opens that account's role dashboard inside the same web application.
- **Separate Admin Dashboard**: Platform superadmin dashboard accessible via the Admin Portal for platform metrics, restaurant approval toggles, and user management.
- **Delivery Partner Ecosystem**: Embedded shift toggle, task feed with audio alerts, live GPS map navigation, 4-stage trip flow, COD tracking, and earnings ledger.

### 3. Run Automated Backend Test Suite
```bash
npm run test:backend
```
Runs 14 automated tests covering auth, demo accounts, restaurant CRUD, order creation, mock payment processing, delivery lifecycle, admin stats, and WebSockets.

---

## 👥 Demo Test Accounts (1-Click Login Supported)

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Customer** | Priya Sharma | `customer@foodsystem.com` | `password123` |
| **Restaurant Partner** | Marco Rossi (Spice Garden) | `restaurant@foodsystem.com` | `password123` |
| **Delivery Partner** | Arjun Kumar (Hero Splendor) | `driver@foodsystem.com` | `password123` |
| **Platform Admin** | Superadmin Chief | `admin@foodsystem.com` | `password123` |

---

## 🌟 Key Features by Role

### 1. Customer
- **Location Selector**: GPS auto-detect simulation and saved addresses (Home, Work, Other).
- **Search & Filter Engine**: Instant text search, Pure Veg toggle, 4.0+ rating, fast delivery (&lt;30m), open now, and multi-criteria sorting (Relevance, Delivery Time, Rating, Price).
- **Category Carousel**: Biryani, Pizza, Burgers, North Indian, Chinese, Rolls, Desserts, Healthy Bowls, and Drinks.
- **Restaurant Details & Menu**: Categorized dishes, veg/non-veg badges, dish photos, bestsellers, and price tags.
- **Customizations & Cart**: Add-on choices (extra cheese, dips, spice level, cooking instructions), promo coupon discounts (`FOODIE50`, `TASTY30`, `FREEDELIVERY`), and bill breakdown.
- **Mock Payment Gateway**: Credit/Debit Cards, UPI (GPay, PhonePe, Paytm, QR simulation), Net Banking, and COD.
- **Real-Time Order Tracking**: 5-step progress pipeline with Socket.io updates, Leaflet map with restaurant, customer, and live driver GPS markers, driver contact card, and invoice.
- **History & Reviews**: Past orders list, re-order button, and 5-star rating & feedback review modal.

### 2. Restaurant Partner
- **Store Status**: 1-click Open / Closed toggle synced to backend.
- **Live Kitchen Orders Board**: Sound chime alert on incoming orders, tabbed views (`All`, `New Incoming`, `Preparing`, `Ready for Pickup`, `Completed`), and status transition actions (`Accept`, `Start Cooking`, `Mark Ready for Pickup`).
- **Menu Management (CRUD)**: Add dish with image, edit prices/descriptions, delete dishes, and toggle in-stock / out-of-stock.
- **Restaurant Profile**: Update restaurant name, cuisine, address, delivery fee, and prep time.
- **Sales Analytics**: Gross revenue, total orders, and average ticket size.

### 3. Delivery Partner
- **Task Feed**: Available dispatches with 45s countdown timer and chime alert.
- **Live GPS Navigation**: Interactive Leaflet map with simulated rider movement and coordinate streaming.
- **Trip Lifecycle**: Checklist verification at pickup, COD cash collection at delivery, and celebration payout modal.
- **Profile Editing**: Edit rider details, vehicle type, and primary delivery hub.
