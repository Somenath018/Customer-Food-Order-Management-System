-- PostgreSQL Schema for Customer Food Order Management System

-- Drop tables if needed
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('customer', 'restaurant', 'driver', 'admin')),
    phone VARCHAR(32),
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Restaurants table
CREATE TABLE restaurants (
    id VARCHAR(64) PRIMARY KEY,
    owner_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine VARCHAR(100) NOT NULL,
    image_url TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(32),
    rating NUMERIC(2,1) DEFAULT 4.5,
    delivery_time_mins INT DEFAULT 30,
    delivery_fee NUMERIC(6,2) DEFAULT 3.50,
    min_order NUMERIC(6,2) DEFAULT 10.00,
    is_open BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT TRUE,
    lat NUMERIC(9,6) DEFAULT 40.7128,
    lng NUMERIC(9,6) DEFAULT -74.0060,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Menu Items table
CREATE TABLE menu_items (
    id VARCHAR(64) PRIMARY KEY,
    restaurant_id VARCHAR(64) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(8,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    dietary VARCHAR(32) DEFAULT 'non-veg' CHECK (dietary IN ('veg', 'non-veg', 'vegan', 'gluten-free')),
    preparation_time_mins INT DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id VARCHAR(64) NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
    status VARCHAR(32) NOT NULL DEFAULT 'placed' CHECK (
        status IN ('placed', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled')
    ),
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(6,2) NOT NULL,
    tax NUMERIC(6,2) NOT NULL,
    discount NUMERIC(6,2) DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    customer_phone VARCHAR(32),
    special_instructions TEXT,
    driver_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    placed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    preparing_at TIMESTAMP WITH TIME ZONE,
    ready_at TIMESTAMP WITH TIME ZONE,
    out_for_delivery_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Create Order Items table
CREATE TABLE order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(64) REFERENCES menu_items(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(8,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    special_notes TEXT
);

-- Create Payments table (Mock & Gateway transactions)
CREATE TABLE payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    transaction_id VARCHAR(128) UNIQUE NOT NULL,
    payment_method VARCHAR(32) NOT NULL CHECK (payment_method IN ('card', 'upi', 'netbanking', 'cod')),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'failed', 'refunded')),
    amount NUMERIC(10,2) NOT NULL,
    card_last4 VARCHAR(4),
    upi_id VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Deliveries table (Tracking & Dispatch)
CREATE TABLE deliveries (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    driver_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delivery_status VARCHAR(32) NOT NULL DEFAULT 'assigned' CHECK (
        delivery_status IN ('assigned', 'accepted', 'picked_up', 'on_the_way', 'delivered')
    ),
    pickup_address TEXT,
    dropoff_address TEXT,
    current_lat NUMERIC(9,6),
    current_lng NUMERIC(9,6),
    estimated_arrival_mins INT DEFAULT 20,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    picked_up_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create Indexes for fast querying
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);
