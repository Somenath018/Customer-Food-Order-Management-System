// Realistic seed data for Customer Food Order Management System
import bcrypt from 'bcryptjs';

// Pre-hashed 'password123' for fast boot & offline compatibility
export const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

export const initialUsers = [
  {
    id: 'user_admin_01',
    name: 'Eleanor Vance (Admin)',
    email: 'admin@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'admin',
    phone: '+1 (555) 019-2831',
    address: 'Platform HQ, 100 Tech Blvd, New York, NY',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_customer_01',
    name: 'Sarah Jenkins',
    email: 'customer@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'customer',
    phone: '+1 (555) 432-8765',
    address: '742 Evergreen Terrace, Apt 4B, New York, NY',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_owner_01',
    name: 'Chef Marco Rossi',
    email: 'restaurant@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+1 (555) 789-0123',
    address: '142 Mulberry Street, Little Italy, New York, NY',
    avatar_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_driver_01',
    name: 'Alex Rivera (Rider)',
    email: 'driver@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'driver',
    phone: '+1 (555) 987-6543',
    address: 'Downtown Hub, New York, NY',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialRestaurants = [
  {
    id: 'rest_01',
    owner_id: 'user_rest_owner_01',
    name: 'Bella Italia Trattoria',
    description: 'Authentic stone-baked Neapolitan pizza, handmade fresh pasta, and traditional Italian desserts.',
    cuisine: 'Italian',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    address: '142 Mulberry Street, Little Italy, New York, NY',
    phone: '+1 (555) 789-0123',
    rating: 4.8,
    delivery_time_mins: 25,
    delivery_fee: 2.99,
    min_order: 15.00,
    is_open: true,
    is_approved: true,
    lat: 40.7192,
    lng: -73.9972
  },
  {
    id: 'rest_02',
    owner_id: 'user_admin_01',
    name: 'Burger & Brew Shack',
    description: 'Smash burgers made with prime Angus beef, brioche buns, loaded seasoned fries, and artisanal milkshakes.',
    cuisine: 'American',
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    address: '88 5th Avenue, Flatiron, New York, NY',
    phone: '+1 (555) 321-7654',
    rating: 4.7,
    delivery_time_mins: 20,
    delivery_fee: 1.99,
    min_order: 12.00,
    is_open: true,
    is_approved: true,
    lat: 40.7410,
    lng: -73.9897
  },
  {
    id: 'rest_03',
    owner_id: 'user_admin_01',
    name: 'Spice Symphony Indian Bistro',
    description: 'Rich slow-cooked aromatic curries, clay-oven tandoori grills, and fragrant saffron basmati biryanis.',
    cuisine: 'Indian',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    address: '150 E 50th Street, Midtown, New York, NY',
    phone: '+1 (555) 456-7890',
    rating: 4.9,
    delivery_time_mins: 35,
    delivery_fee: 3.49,
    min_order: 18.00,
    is_open: true,
    is_approved: true,
    lat: 40.7562,
    lng: -73.9723
  },
  {
    id: 'rest_04',
    owner_id: 'user_admin_01',
    name: 'Tokyo Zen Sushi & Ramen',
    description: 'Fresh sashimi, signature maki rolls, rich 24-hour tonkotsu broth ramen, and crispy gyoza.',
    cuisine: 'Japanese',
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    address: '224 W 35th St, Herald Square, New York, NY',
    phone: '+1 (555) 654-9870',
    rating: 4.6,
    delivery_time_mins: 30,
    delivery_fee: 3.99,
    min_order: 20.00,
    is_open: true,
    is_approved: true,
    lat: 40.7518,
    lng: -73.9912
  }
];

export const initialMenuItems = [
  // Bella Italia (rest_01)
  {
    id: 'menu_01_01',
    restaurant_id: 'rest_01',
    name: 'Margherita D.O.P. Pizza',
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fragrant sweet basil, and extra virgin olive oil.',
    price: 16.50,
    category: 'Pizza',
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_01_02',
    restaurant_id: 'rest_01',
    name: 'Truffle & Wild Mushroom Fettuccine',
    description: 'House-made pasta ribbons tossed in creamy black truffle butter with sautéed wild porcini mushrooms.',
    price: 21.00,
    category: 'Pasta',
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d62817ee?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 20
  },
  {
    id: 'menu_01_03',
    restaurant_id: 'rest_01',
    name: 'Classic Prosciutto & Arugula Pizza',
    description: 'Crispy thin crust with Fior di Latte, aged 24-month Parma prosciutto, baby wild arugula, shaved parmesan.',
    price: 19.50,
    category: 'Pizza',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_01_04',
    restaurant_id: 'rest_01',
    name: 'Handcrafted Tiramisu Classico',
    description: 'Espresso-soaked Savoiardi ladyfingers layered with rich mascarpone zabaglione and dusted with Belgian cocoa.',
    price: 9.00,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 5
  },

  // Burger & Brew Shack (rest_02)
  {
    id: 'menu_02_01',
    restaurant_id: 'rest_02',
    name: 'Double Truffle Smash Burger',
    description: 'Two smashed prime beef patties, melted sharp cheddar, caramelized onions, truffle aioli on toasted brioche.',
    price: 15.99,
    category: 'Burgers',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 12
  },
  {
    id: 'menu_02_02',
    restaurant_id: 'rest_02',
    name: 'Crispy Nashville Hot Chicken Burger',
    description: 'Buttermilk fried chicken breast dipped in cayenne oil, creamy coleslaw, house pickles, garlic mayo.',
    price: 14.50,
    category: 'Burgers',
    image_url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 14
  },
  {
    id: 'menu_02_03',
    restaurant_id: 'rest_02',
    name: 'Loaded Bacon & Cheddar Fries',
    description: 'Crispy shoestring golden fries smothered in house cheese sauce, crispy smoked bacon bits, and scallions.',
    price: 7.99,
    category: 'Sides',
    image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 8
  },
  {
    id: 'menu_02_04',
    restaurant_id: 'rest_02',
    name: 'Salted Caramel Pretzel Shake',
    description: 'Vanilla bean custard milkshake swirled with sea-salted caramel drizzle and crushed pretzel crust.',
    price: 6.50,
    category: 'Beverages',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 5
  },

  // Spice Symphony Indian Bistro (rest_03)
  {
    id: 'menu_03_01',
    restaurant_id: 'rest_03',
    name: 'Butter Chicken Grand Cru',
    description: 'Tender tandoor-roasted chicken simmered in a velvet tomato, honey, and fresh cream reduction.',
    price: 18.50,
    category: 'Curries',
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 18
  },
  {
    id: 'menu_03_02',
    restaurant_id: 'rest_03',
    name: 'Paneer Tikka Masala',
    description: 'Char-grilled cottage cheese cubes cooked in rich spiced bell pepper and onion gravy.',
    price: 16.99,
    category: 'Curries',
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_03_03',
    restaurant_id: 'rest_03',
    name: 'Royal Dum Dum Biryani',
    description: 'Fragrant aged basmati rice layered with spiced marinated meat, saffron milk, fried onions, served with raita.',
    price: 19.00,
    category: 'Rice & Biryani',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 22
  },
  {
    id: 'menu_03_04',
    restaurant_id: 'rest_03',
    name: 'Garlic Butter Naan (2 pcs)',
    description: 'Traditional tandoor clay-oven baked leavened flatbread brushed with garlic butter and fresh cilantro.',
    price: 4.50,
    category: 'Breads',
    image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 6
  },

  // Tokyo Zen Sushi (rest_04)
  {
    id: 'menu_04_01',
    restaurant_id: 'rest_04',
    name: 'Tokyo Tonkotsu Special Ramen',
    description: 'Rich 24-hour pork bone broth, tender chashu pork belly, soft-boiled ajitsuke tamago egg, menma bamboo, scallions.',
    price: 17.50,
    category: 'Ramen',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_04_02',
    restaurant_id: 'rest_04',
    name: 'Dragon Roll Signature Sushi (8 pcs)',
    description: 'Crispy shrimp tempura, cucumber inside, draped with avocado, BBQ unagi eel, tobiko, and unagi glaze.',
    price: 18.00,
    category: 'Sushi Rolls',
    image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_04_03',
    restaurant_id: 'rest_04',
    name: 'Pan-Seared Pork Gyoza (6 pcs)',
    description: 'Crispy bottom Japanese dumplings filled with minced pork, cabbage, ginger, scallions, with ponzu dipping sauce.',
    price: 8.50,
    category: 'Appetizers',
    image_url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 10
  }
];

export const initialOrders = [
  {
    id: 'ord_1001',
    customer_id: 'user_customer_01',
    customer_name: 'Sarah Jenkins',
    customer_phone: '+1 (555) 432-8765',
    restaurant_id: 'rest_01',
    restaurant_name: 'Bella Italia Trattoria',
    status: 'preparing',
    subtotal: 37.50,
    delivery_fee: 2.99,
    tax: 3.00,
    discount: 0.00,
    total: 43.49,
    delivery_address: '742 Evergreen Terrace, Apt 4B, New York, NY',
    special_instructions: 'Please ring bell 4B upon arrival.',
    driver_id: 'user_driver_01',
    driver_name: 'Alex Rivera',
    items: [
      {
        id: 'item_ord_1',
        menu_item_id: 'menu_01_01',
        name: 'Margherita D.O.P. Pizza',
        price: 16.50,
        quantity: 1,
        special_notes: 'Extra crispy crust'
      },
      {
        id: 'item_ord_2',
        menu_item_id: 'menu_01_02',
        name: 'Truffle & Wild Mushroom Fettuccine',
        price: 21.00,
        quantity: 1,
        special_notes: ''
      }
    ],
    payment: {
      id: 'pay_1001',
      transaction_id: 'TXN_MOCK_88291410',
      payment_method: 'card',
      payment_status: 'paid',
      amount: 43.49,
      card_last4: '4242',
      paid_at: new Date(Date.now() - 15 * 60000).toISOString()
    },
    delivery: {
      id: 'del_1001',
      delivery_status: 'accepted',
      current_lat: 40.7180,
      current_lng: -73.9950,
      estimated_arrival_mins: 18,
      assigned_at: new Date(Date.now() - 10 * 60000).toISOString()
    },
    placed_at: new Date(Date.now() - 20 * 60000).toISOString(),
    confirmed_at: new Date(Date.now() - 18 * 60000).toISOString(),
    preparing_at: new Date(Date.now() - 15 * 60000).toISOString()
  }
];

export const initialDrivers = [
  {
    id: 'user_driver_01',
    name: 'Alex Rivera',
    phone: '+1 (555) 987-6543',
    vehicle_type: 'E-Scooter',
    is_online: true,
    is_approved: true,
    rating: 4.9,
    current_lat: 40.7185,
    current_lng: -73.9960,
    total_deliveries: 142,
    today_earnings: 68.50
  }
];
