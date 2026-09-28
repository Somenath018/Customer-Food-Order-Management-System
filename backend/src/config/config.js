import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5050,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey_foodorder_2026_secure',
  jwtExpiresIn: '7d',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/food_order_db',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  platformCommissionRate: 0.15, // 15% platform commission
  deliveryFeeBase: 3.50,
  taxRate: 0.08 // 8% tax
};
