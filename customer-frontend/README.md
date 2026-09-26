# Customer Portal Frontend (`customer-frontend`)

A fast, responsive, and real-time customer food ordering application built with **React 19**, **Vite 8**, and **Tailwind CSS v4**.

## Features

- **Restaurant Exploration & Filtering**: Search across restaurant menus, filter by cuisine (Italian, American, Indian, Japanese, Mexican, Healthy) or tags (Open Now, Under 25m, Top Rated 4.8+).
- **Categorized Menu & Dietary Badges**: Starters, Mains, Desserts, and Beverages with Veg, Vegan, and Non-Veg indicators.
- **Cart Management**: Cart drawer with item quantities, price calculations (8% tax + delivery fee), and restaurant-conflict safeguards.
- **Mock Payment Gateway Simulator**: Realistic checkout with mock Card, UPI / QR Code, Net Banking, and Cash on Delivery (COD)—no real bank account linking required.
- **Live Real-Time Order Tracking**: 6-stage lifecycle progress timeline (`placed` ➔ `confirmed` ➔ `preparing` ➔ `ready_for_pickup` ➔ `out_for_delivery` ➔ `delivered`) connected via WebSockets.
- **Interactive Leaflet Map**: Real-time driver GPS tracking showing delivery rider moving from restaurant to customer drop-off.
- **Order History & Invoices**: View past orders, 1-click re-order, and digital invoice receipt with mock transaction ID.
- **1-Click Demo Customer Login**: Instant login as Sarah Jenkins (`customer@foodsystem.com`) for seamless testing.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
The app runs on `http://localhost:5173` and automatically proxies `/api` and `/socket.io` to the central backend on port `5000`.

### 3. Build for production
```bash
npm run build
```
