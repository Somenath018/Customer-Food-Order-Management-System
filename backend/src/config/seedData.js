// Realistic seed data for Customer Food Order Management System
import bcrypt from 'bcryptjs';

// Pre-hashed 'password123' for fast boot & offline compatibility
export const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

export const initialUsers = [
  // 1. Single Admin Account
  {
    id: 'user_admin_01',
    name: 'Eleanor Vance (Platform Admin)',
    email: 'admin@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'admin',
    phone: '+1 (555) 019-2831',
    address: 'Platform HQ, Indiranagar, Bengaluru',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  // 2. Customer Account
  {
    id: 'user_customer_01',
    name: 'Sarah Jenkins',
    email: 'customer@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'customer',
    phone: '+91 98765 43210',
    address: 'Flat 402, Palm Heights, Koramangala 5th Block, Bengaluru',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    is_restricted: false
  },
  // 3. 10 Existing Restaurant Managers / Owners
  {
    id: 'user_rest_01',
    name: 'Nawab Farooq (Manager)',
    email: 'biryani@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98451 22334',
    address: '77 Royal Enclave, Indiranagar, Bengaluru',
    restaurant_id: 'rest_biryani_01',
    avatar_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_owner_01',
    name: 'Chef Marco Rossi (Manager)',
    email: 'restaurant@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98452 78901',
    address: '142 Mulberry Street, Little Italy, Bengaluru',
    restaurant_id: 'rest_01',
    avatar_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_02',
    name: 'Dan Miller (Manager)',
    email: 'burger@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98453 32176',
    address: '88 5th Avenue, Koramangala 4th Block, Bengaluru',
    restaurant_id: 'rest_02',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_03',
    name: 'Chef Harpal Singh (Manager)',
    email: 'spicesymphony@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98454 45678',
    address: '150 Outer Ring Road, Bellandur, Bengaluru',
    restaurant_id: 'rest_03',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_04',
    name: 'Master Chen (Manager)',
    email: 'goldendragon@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98455 65432',
    address: '42 Church Street, Central Bengaluru',
    restaurant_id: 'rest_chinese_01',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_05',
    name: 'Anirban Mukherjee (Manager)',
    email: 'kolkatarolls@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98456 99887',
    address: '19 Jyoti Nivas College Road, Koramangala',
    restaurant_id: 'rest_rolls_01',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_06',
    name: 'Chloe Laurent (Manager)',
    email: 'sweetindulgence@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98457 11223',
    address: '104 100 Feet Road, HAL 2nd Stage, Indiranagar',
    restaurant_id: 'rest_desserts_01',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_07',
    name: 'Maya Sen (Manager)',
    email: 'greenbowl@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98458 44556',
    address: '33 Sarjapur Main Road, HSR Layout Sector 1',
    restaurant_id: 'rest_healthy_01',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_08',
    name: 'Raghavan Iyer (Manager)',
    email: 'chaipoint@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98459 77889',
    address: '12 80 Feet Road, 7th Block, Koramangala',
    restaurant_id: 'rest_beverages_01',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_rest_09',
    name: 'Kenji Sato (Manager)',
    email: 'tokyozen@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'restaurant',
    phone: '+91 98450 65498',
    address: '224 Brigade Road, Ashok Nagar, Bengaluru',
    restaurant_id: 'rest_04',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  },
  // 4. 4 Existing Delivery Partners
  {
    id: 'user_driver_01',
    name: 'Alex Rivera',
    email: 'driver@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'driver',
    phone: '+91 98765 00001',
    address: 'Downtown Delivery Hub, Bengaluru',
    vehicle_type: 'E-Scooter / Bike',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_driver_02',
    name: 'Arjun Kumar',
    email: 'arjun.driver@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'driver',
    phone: '+91 98765 00002',
    address: 'Indiranagar Delivery Hub, Bengaluru',
    vehicle_type: 'Hero Splendor Bike',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_driver_03',
    name: 'Vikram Singh',
    email: 'vikram.driver@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'driver',
    phone: '+91 98765 00003',
    address: 'Koramangala Fleet Center, Bengaluru',
    vehicle_type: 'Honda Activa Scooter',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_driver_04',
    name: 'Priya Nair',
    email: 'priya.driver@foodsystem.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'driver',
    phone: '+91 98765 00004',
    address: 'HSR Layout Delivery Hub, Bengaluru',
    vehicle_type: 'Electric EV Bike',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialRestaurants = [
  // 1. Biryani
  {
    id: 'rest_biryani_01',
    owner_id: 'user_rest_01',
    manager_pin: '1001',
    manager_password: 'darbar123',
    name: 'Royal Biryani Darbar',
    description: 'Slow-cooked authentic Dum Biryanis infused with royal saffron, pure desi ghee, and hand-ground spices.',
    cuisine: 'Biryani, North Indian, Mughlai',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    address: '77 Royal Enclave, Indiranagar, Bengaluru',
    phone: '+91 98451 22334',
    rating: 4.9,
    delivery_time_mins: 30,
    delivery_fee: 29,
    min_order: 199,
    is_open: true,
    is_approved: true,
    lat: 12.9784,
    lng: 77.6408
  },
  // 2. Pizza
  {
    id: 'rest_01',
    owner_id: 'user_rest_owner_01',
    manager_pin: '1002',
    manager_password: 'bella123',
    name: 'Bella Italia Woodfire Trattoria',
    description: 'Authentic stone-baked Neapolitan pizza, handmade fresh pasta, and traditional Italian desserts.',
    cuisine: 'Pizza, Italian, Continental',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    address: '142 Mulberry Street, Little Italy, Bengaluru',
    phone: '+91 98452 78901',
    rating: 4.8,
    delivery_time_mins: 25,
    delivery_fee: 39,
    min_order: 249,
    is_open: true,
    is_approved: true,
    lat: 12.9352,
    lng: 77.6245
  },
  // 3. Burgers
  {
    id: 'rest_02',
    owner_id: 'user_rest_02',
    manager_pin: '1003',
    manager_password: 'burger123',
    name: 'Burger & Brew Shack',
    description: 'Smash burgers made with juicy patties, golden brioche buns, loaded seasoned fries, and artisanal shakes.',
    cuisine: 'Burgers, American, Fast Food',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    address: '88 5th Avenue, Koramangala 4th Block, Bengaluru',
    phone: '+91 98453 32176',
    rating: 4.7,
    delivery_time_mins: 20,
    delivery_fee: 19,
    min_order: 149,
    is_open: true,
    is_approved: true,
    lat: 12.9340,
    lng: 77.6200
  },
  // 4. North Indian
  {
    id: 'rest_03',
    owner_id: 'user_rest_03',
    manager_pin: '1004',
    manager_password: 'spice123',
    name: 'Spice Symphony North Indian Bistro',
    description: 'Rich slow-cooked dal makhani, velvety butter chicken, clay-oven tandoori grills, and fragrant saffron biryanis.',
    cuisine: 'North Indian, Curries, Mughlai',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    address: '150 Outer Ring Road, Bellandur, Bengaluru',
    phone: '+91 98454 45678',
    rating: 4.9,
    delivery_time_mins: 35,
    delivery_fee: 29,
    min_order: 199,
    is_open: true,
    is_approved: true,
    lat: 12.9260,
    lng: 77.6762
  },
  // 5. Chinese
  {
    id: 'rest_chinese_01',
    owner_id: 'user_rest_04',
    manager_pin: '1005',
    manager_password: 'dragon123',
    name: 'Golden Dragon Wok & Dimsums',
    description: 'Wok-tossed noodles, fiery Schezwan chicken, crystal dumplings, and authentic Pan-Asian delicacies.',
    cuisine: 'Chinese, Asian, Noodles',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    address: '42 Church Street, Central Bengaluru',
    phone: '+91 98455 65432',
    rating: 4.7,
    delivery_time_mins: 28,
    delivery_fee: 25,
    min_order: 179,
    is_open: true,
    is_approved: true,
    lat: 12.9750,
    lng: 77.6050
  },
  // 6. Rolls & Wraps
  {
    id: 'rest_rolls_01',
    owner_id: 'user_rest_05',
    manager_pin: '1006',
    manager_password: 'rolls123',
    name: 'Kolkata Kathi Rolls & Wraps Co.',
    description: 'Crispy flaky paratha rolls filled with tender tikka, crunchy onions, tangy mint chutney, and secret spices.',
    cuisine: 'Rolls & Wraps, Fast Food, Street Food',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    address: '19 Jyoti Nivas College Road, Koramangala 5th Block',
    phone: '+91 98456 99887',
    rating: 4.6,
    delivery_time_mins: 18,
    delivery_fee: 15,
    min_order: 120,
    is_open: true,
    is_approved: true,
    lat: 12.9348,
    lng: 77.6189
  },
  // 7. Desserts
  {
    id: 'rest_desserts_01',
    owner_id: 'user_rest_06',
    manager_pin: '1007',
    manager_password: 'sweet123',
    name: 'Sweet Indulgence & Belgian Waffles',
    description: 'Gourmet artisanal cheesecakes, warm fudge brownies, Belgian waffles, and traditional shahi sweets.',
    cuisine: 'Desserts, Bakery, Sweets',
    image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80',
    address: '104 100 Feet Road, HAL 2nd Stage, Indiranagar',
    phone: '+91 98457 11223',
    rating: 4.8,
    delivery_time_mins: 22,
    delivery_fee: 20,
    min_order: 150,
    is_open: true,
    is_approved: true,
    lat: 12.9710,
    lng: 77.6410
  },
  // 8. Healthy Bowls
  {
    id: 'rest_healthy_01',
    owner_id: 'user_rest_07',
    manager_pin: '1008',
    manager_password: 'green123',
    name: 'Green Bowl Co. & Salads',
    description: 'Nutrient-rich protein power bowls, Mediterranean salads, fresh avocado toasts, and superfood smoothies.',
    cuisine: 'Healthy Bowls, Salads, Continental',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    address: '33 Sarjapur Main Road, HSR Layout Sector 1',
    phone: '+91 98458 44556',
    rating: 4.7,
    delivery_time_mins: 25,
    delivery_fee: 25,
    min_order: 199,
    is_open: true,
    is_approved: true,
    lat: 12.9120,
    lng: 77.6520
  },
  // 9. Shakes & Chai
  {
    id: 'rest_beverages_01',
    owner_id: 'user_rest_08',
    manager_pin: '1009',
    manager_password: 'chai123',
    name: 'Chai Point & Thick Shake Studio',
    description: 'Steaming hot kulhad ginger chai, Belgian chocolate thickshakes, cold brew frappes, and bun maska.',
    cuisine: 'Shakes & Chai, Beverages, Cafe',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    address: '12 80 Feet Road, 7th Block, Koramangala',
    phone: '+91 98459 77889',
    rating: 4.8,
    delivery_time_mins: 15,
    delivery_fee: 15,
    min_order: 99,
    is_open: true,
    is_approved: true,
    lat: 12.9360,
    lng: 77.6255
  },
  // 10. Japanese / Asian Ramen & Rolls
  {
    id: 'rest_04',
    owner_id: 'user_rest_09',
    manager_pin: '1010',
    manager_password: 'tokyo123',
    name: 'Tokyo Zen Sushi & Ramen House',
    description: 'Signature maki rolls, rich 24-hour tonkotsu ramen, crispy gyoza dumplings, and Japanese appetizers.',
    cuisine: 'Japanese, Chinese, Asian',
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    address: '224 Brigade Road, Ashok Nagar, Bengaluru',
    phone: '+91 98450 65498',
    rating: 4.6,
    delivery_time_mins: 30,
    delivery_fee: 35,
    min_order: 250,
    is_open: true,
    is_approved: true,
    lat: 12.9698,
    lng: 77.6080
  }
];

export const initialMenuItems = [
  // --- 1. Royal Biryani Darbar (rest_biryani_01) ---
  {
    id: 'menu_biryani_01',
    restaurant_id: 'rest_biryani_01',
    name: 'Royal Hyderabadi Dum Chicken Biryani',
    description: 'Slow-cooked marinated chicken layered with long-grain basmati, saffron, fried onions, served with mirchi ka salan and raita.',
    price: 320,
    category: 'Biryani',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 20
  },
  {
    id: 'menu_biryani_02',
    restaurant_id: 'rest_biryani_01',
    name: 'Lucknowi Mutton Dum Biryani (Awadhi)',
    description: 'Tender baby mutton pieces simmered in fragrant yakhni gravy and steamed with saffron basmati rice.',
    price: 440,
    category: 'Biryani',
    image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 25
  },
  {
    id: 'menu_biryani_03',
    restaurant_id: 'rest_biryani_01',
    name: 'Shahi Subz Paneer Dum Biryani',
    description: 'Fresh malai paneer cubes and garden vegetables tossed in brown onion masala, cooked on slow dum.',
    price: 270,
    category: 'Biryani',
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 18
  },
  {
    id: 'menu_biryani_04',
    restaurant_id: 'rest_biryani_01',
    name: 'Tandoori Murgh Tikka (6 Pcs)',
    description: 'Succulent boneless chicken chunks marinated in mustard oil, Kashmiri degi mirch, and hung curd, char-grilled.',
    price: 290,
    category: 'North Indian',
    image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 15
  },

  // --- 2. Bella Italia Trattoria (rest_01) ---
  {
    id: 'menu_01_01',
    restaurant_id: 'rest_01',
    name: 'Margherita D.O.P. Woodfired Pizza',
    description: 'San Marzano Italian tomato sauce, fresh buffalo mozzarella, aromatic sweet basil, extra virgin olive oil.',
    price: 349,
    category: 'Pizza',
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_01_02',
    restaurant_id: 'rest_01',
    name: 'Farmhouse Garden Veggie Pizza',
    description: 'Crisp bell peppers, button mushrooms, black olives, jalapenos, and melted double mozzarella.',
    price: 389,
    category: 'Pizza',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_01_03',
    restaurant_id: 'rest_01',
    name: 'Pepperoni & Smoked Chicken Feast Pizza',
    description: 'Spicy pepperoni slices, smoked barbecue chicken breast, caramelized onions, and Italian herbs.',
    price: 449,
    category: 'Pizza',
    image_url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 18
  },
  {
    id: 'menu_01_04',
    restaurant_id: 'rest_01',
    name: 'Truffle & Wild Mushroom Fettuccine',
    description: 'House-made pasta ribbons tossed in creamy black truffle butter with sautéed wild porcini mushrooms.',
    price: 399,
    category: 'Pizza',
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d62817ee?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 20
  },
  {
    id: 'menu_01_05',
    restaurant_id: 'rest_01',
    name: 'Handcrafted Tiramisu Classico',
    description: 'Espresso-soaked Savoiardi ladyfingers layered with rich mascarpone zabaglione and dusted with Belgian cocoa.',
    price: 249,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 5
  },

  // --- 3. Burger & Brew Shack (rest_02) ---
  {
    id: 'menu_02_01',
    restaurant_id: 'rest_02',
    name: 'Double Truffle Smash Burger',
    description: 'Two smashed prime beef patties, melted sharp cheddar, caramelized onions, truffle aioli on toasted brioche.',
    price: 289,
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
    price: 259,
    category: 'Burgers',
    image_url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 14
  },
  {
    id: 'menu_02_03',
    restaurant_id: 'rest_02',
    name: 'Crispy Cheesy Veggie Supreme Burger',
    description: 'Golden spiced potato and corn patty, melted pepperjack cheese, lettuce, tomato, house secret sauce.',
    price: 199,
    category: 'Burgers',
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 10
  },
  {
    id: 'menu_02_04',
    restaurant_id: 'rest_02',
    name: 'Loaded Cheddar & Jalapeno Fries',
    description: 'Crispy golden shoestring fries smothered in warm cheese sauce, diced jalapenos, and scallions.',
    price: 159,
    category: 'Burgers',
    image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 8
  },
  {
    id: 'menu_02_05',
    restaurant_id: 'rest_02',
    name: 'Salted Caramel Pretzel Thickshake',
    description: 'Vanilla custard thick milkshake swirled with sea-salted caramel drizzle and crushed pretzel crust.',
    price: 179,
    category: 'Beverages',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 5
  },

  // --- 4. Spice Symphony North Indian Bistro (rest_03) ---
  {
    id: 'menu_03_01',
    restaurant_id: 'rest_03',
    name: 'Butter Chicken Grand Cru',
    description: 'Tender tandoor-roasted chicken simmered in a velvety tomato, honey, and fresh cream reduction.',
    price: 360,
    category: 'North Indian',
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 18
  },
  {
    id: 'menu_03_02',
    restaurant_id: 'rest_03',
    name: 'Dal Makhani Bukhara (24hr Slow Cook)',
    description: 'Whole black lentils slow-cooked overnight with churned white butter, tomatoes, and aromatic fenugreek.',
    price: 290,
    category: 'North Indian',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 12
  },
  {
    id: 'menu_03_03',
    restaurant_id: 'rest_03',
    name: 'Paneer Tikka Butter Masala',
    description: 'Char-grilled cottage cheese cubes cooked in rich spiced bell pepper and cashew tomato gravy.',
    price: 310,
    category: 'North Indian',
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_03_04',
    restaurant_id: 'rest_03',
    name: 'Royal Dum Dum Biryani',
    description: 'Fragrant aged basmati rice layered with spiced marinated meat, saffron milk, and caramelized onions.',
    price: 350,
    category: 'Biryani',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 22
  },
  {
    id: 'menu_03_05',
    restaurant_id: 'rest_03',
    name: 'Garlic Butter Naan (2 pcs)',
    description: 'Traditional tandoor clay-oven baked leavened flatbread brushed with garlic butter and fresh cilantro.',
    price: 80,
    category: 'North Indian',
    image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 6
  },

  // --- 5. Golden Dragon Wok & Dimsums (rest_chinese_01) ---
  {
    id: 'menu_chinese_01',
    restaurant_id: 'rest_chinese_01',
    name: 'Schezwan Chilli Garlic Hakka Noodles',
    description: 'Wok-tossed noodles with shredded vegetables, fiery red chilli oil, roasted garlic, and scallions.',
    price: 240,
    category: 'Chinese',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 14
  },
  {
    id: 'menu_chinese_02',
    restaurant_id: 'rest_chinese_01',
    name: 'Crispy Kung Pao Chicken with Peanuts',
    description: 'Tender chicken tossed with dried red chillies, crunchy bell peppers, roasted peanuts in sweet-spicy sauce.',
    price: 320,
    category: 'Chinese',
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 16
  },
  {
    id: 'menu_chinese_03',
    restaurant_id: 'rest_chinese_01',
    name: 'Steamed Veg Crystal Dimsums (6 Pcs)',
    description: 'Translucent steamed dumplings filled with water chestnuts, bok choy, exotic mushrooms, with spicy dip.',
    price: 260,
    category: 'Chinese',
    image_url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 12
  },
  {
    id: 'menu_chinese_04',
    restaurant_id: 'rest_chinese_01',
    name: 'Classic Veg Fried Rice & Manchurian Bowl',
    description: 'Fragrant jasmine rice wok-tossed with scallions, served with vegetable Manchurian balls in rich soy gravy.',
    price: 270,
    category: 'Chinese',
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 15
  },

  // --- 6. Kolkata Kathi Rolls & Wraps Co. (rest_rolls_01) ---
  {
    id: 'menu_rolls_01',
    restaurant_id: 'rest_rolls_01',
    name: 'Double Egg Chicken Kathi Roll',
    description: 'Egg-coated flaky laccha paratha wrapped around juicy marinated chicken tikka, sliced onions, and green chutney.',
    price: 180,
    category: 'Rolls',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 10
  },
  {
    id: 'menu_rolls_02',
    restaurant_id: 'rest_rolls_01',
    name: 'Paneer Tikka Masala Frankie Roll',
    description: 'Char-grilled cottage cheese cubes with spicy onion-capsicum relish wrapped in a crisp butter paratha.',
    price: 160,
    category: 'Rolls',
    image_url: 'https://images.unsplash.com/photo-1648838779698-c44dca5bc1a0?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 10
  },
  {
    id: 'menu_rolls_03',
    restaurant_id: 'rest_rolls_01',
    name: 'Mutton Boti Kebab Kathi Roll',
    description: 'Tender spiced boneless mutton chunks wrapped in egg paratha with shredded cabbage and lime zest.',
    price: 230,
    category: 'Rolls',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 12
  },
  {
    id: 'menu_rolls_04',
    restaurant_id: 'rest_rolls_01',
    name: 'Mediterranean Falafel Hummus Wrap',
    description: 'Crispy chickpea falafel patties, creamy tahini garlic hummus, pickled cucumbers rolled in warm flatbread.',
    price: 170,
    category: 'Rolls',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 8
  },

  // --- 7. Sweet Indulgence & Belgian Waffles (rest_desserts_01) ---
  {
    id: 'menu_desserts_01',
    restaurant_id: 'rest_desserts_01',
    name: 'Warm Belgian Chocolate Brownie Sundae',
    description: 'Gooey walnut dark chocolate brownie served with vanilla bean ice cream, hot fudge, and roasted nuts.',
    price: 199,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 6
  },
  {
    id: 'menu_desserts_02',
    restaurant_id: 'rest_desserts_01',
    name: 'New York Baked Berry Cheesecake',
    description: 'Velvety cream cheese filling on a crumbly graham cracker base, topped with wild blueberry compote.',
    price: 249,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 5
  },
  {
    id: 'menu_desserts_03',
    restaurant_id: 'rest_desserts_01',
    name: 'Nutella Loaded Crispy Belgian Waffle',
    description: 'Golden crispy malted waffle drenched with warm Nutella spread, white chocolate chips, and fresh banana slices.',
    price: 219,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 10
  },
  {
    id: 'menu_desserts_04',
    restaurant_id: 'rest_desserts_01',
    name: 'Royal Shahi Gulab Jamun with Rabdi (2 pcs)',
    description: 'Warm mawa gulab jamuns soaked in saffron cardamom syrup, served over thick chilled rabdi.',
    price: 159,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 5
  },

  // --- 8. Green Bowl Co. & Salads (rest_healthy_01) ---
  {
    id: 'menu_healthy_01',
    restaurant_id: 'rest_healthy_01',
    name: 'Quinoa High-Protein Power Bowl',
    description: 'Organic red quinoa, spiced roasted chickpeas, avocado, baby spinach, cherry tomatoes, tahini lime dressing.',
    price: 290,
    category: 'Healthy',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 10
  },
  {
    id: 'menu_healthy_02',
    restaurant_id: 'rest_healthy_01',
    name: 'Mediterranean Falafel & Hummus Salad Bowl',
    description: 'Herbed falafels, kalamata olives, diced cucumbers, feta cheese, mixed greens with olive oil vinaigrette.',
    price: 270,
    category: 'Healthy',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 10
  },
  {
    id: 'menu_healthy_03',
    restaurant_id: 'rest_healthy_01',
    name: 'Smoked Chicken & Avocado Salad Bowl',
    description: 'Grilled smoked chicken breast slices, Hass avocado, hard-boiled eggs, crisp lettuce, Dijon mustard dressing.',
    price: 330,
    category: 'Healthy',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 12
  },
  {
    id: 'menu_healthy_04',
    restaurant_id: 'rest_healthy_01',
    name: 'Cold-Pressed Green Glow Detox Juice',
    description: 'Fresh spinach, celery, green apple, cucumber, ginger, and lemon with zero added sugar.',
    price: 140,
    category: 'Beverages',
    image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 5
  },

  // --- 9. Chai Point & Thick Shake Studio (rest_beverages_01) ---
  {
    id: 'menu_beverages_01',
    restaurant_id: 'rest_beverages_01',
    name: 'Kulhad Adrak Elaichi Chai (Serves 2)',
    description: 'Freshly brewed aromatic tea infused with crushed ginger root and green cardamom, served in clay kulhads.',
    price: 110,
    category: 'Beverages',
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 8
  },
  {
    id: 'menu_beverages_02',
    restaurant_id: 'rest_beverages_01',
    name: 'Ferrero Rocher Deluxe Thick Milkshake',
    description: 'Rich chocolate milkshake blended with Ferrero Rocher pralines, hazelnut spread, and whipped cream.',
    price: 210,
    category: 'Beverages',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 6
  },
  {
    id: 'menu_beverages_03',
    restaurant_id: 'rest_beverages_01',
    name: 'Belgian Dark Chocolate Iced Frappe',
    description: 'Double espresso blended with premium Belgian dark chocolate ganache, cold milk, and crushed ice.',
    price: 180,
    category: 'Beverages',
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 6
  },
  {
    id: 'menu_beverages_04',
    restaurant_id: 'rest_beverages_01',
    name: 'Mumbai Bun Maska with Tutti Frutti',
    description: 'Fresh soft sweet pav bun generously spread with chilled butter, paired best with hot chai.',
    price: 70,
    category: 'Beverages',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'veg',
    preparation_time_mins: 4
  },

  // --- 10. Tokyo Zen Sushi & Ramen (rest_04) ---
  {
    id: 'menu_04_01',
    restaurant_id: 'rest_04',
    name: 'Tokyo Tonkotsu Special Ramen',
    description: 'Rich 24-hour pork bone broth, tender chashu pork belly, soft-boiled ajitsuke tamago egg, menma bamboo, scallions.',
    price: 380,
    category: 'Chinese',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_04_02',
    restaurant_id: 'rest_04',
    name: 'Dragon Roll Signature Sushi (8 Pcs)',
    description: 'Crispy shrimp tempura, cucumber inside, draped with avocado, BBQ unagi eel, tobiko, and unagi glaze.',
    price: 420,
    category: 'Rolls',
    image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format&fit=crop&q=80',
    is_available: true,
    dietary: 'non-veg',
    preparation_time_mins: 15
  },
  {
    id: 'menu_04_03',
    restaurant_id: 'rest_04',
    name: 'Pan-Seared Pork Gyoza (6 Pcs)',
    description: 'Crispy bottom Japanese dumplings filled with minced pork, cabbage, ginger, scallions, with ponzu dipping sauce.',
    price: 250,
    category: 'Chinese',
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
    restaurant_id: 'rest_biryani_01',
    restaurant_name: 'Royal Biryani Darbar',
    status: 'preparing',
    subtotal: 610,
    delivery_fee: 29,
    tax: 30,
    discount: 0,
    total: 669,
    delivery_address: '742 Evergreen Terrace, Apt 4B, Koramangala',
    special_instructions: 'Please provide extra salan and raita.',
    driver_id: 'user_driver_01',
    driver_name: 'Alex Rivera',
    items: [
      {
        id: 'item_ord_1',
        menu_item_id: 'menu_biryani_01',
        name: 'Royal Hyderabadi Dum Chicken Biryani',
        price: 320,
        quantity: 1,
        special_notes: 'Medium spicy'
      },
      {
        id: 'item_ord_2',
        menu_item_id: 'menu_biryani_04',
        name: 'Tandoori Murgh Tikka (6 Pcs)',
        price: 290,
        quantity: 1,
        special_notes: ''
      }
    ],
    payment: {
      id: 'pay_1001',
      transaction_id: 'TXN_MOCK_88291410',
      payment_method: 'card',
      payment_status: 'paid',
      amount: 669,
      card_last4: '4242',
      paid_at: new Date(Date.now() - 15 * 60000).toISOString()
    },
    delivery: {
      id: 'del_1001',
      delivery_status: 'accepted',
      current_lat: 12.9345,
      current_lng: 77.6205,
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
    phone: '+91 98765 00001',
    vehicle_type: 'E-Scooter / Bike',
    is_online: true,
    is_approved: true,
    rating: 4.9,
    current_lat: 12.9345,
    current_lng: 77.6205,
    total_deliveries: 142,
    today_earnings: 1280
  },
  {
    id: 'user_driver_02',
    name: 'Arjun Kumar',
    phone: '+91 98765 00002',
    vehicle_type: 'Hero Splendor Bike',
    is_online: true,
    is_approved: true,
    rating: 4.8,
    current_lat: 12.9784,
    current_lng: 77.6408,
    total_deliveries: 98,
    today_earnings: 840
  },
  {
    id: 'user_driver_03',
    name: 'Vikram Singh',
    phone: '+91 98765 00003',
    vehicle_type: 'Honda Activa Scooter',
    is_online: true,
    is_approved: true,
    rating: 4.7,
    current_lat: 12.9340,
    current_lng: 77.6200,
    total_deliveries: 115,
    today_earnings: 950
  },
  {
    id: 'user_driver_04',
    name: 'Priya Nair',
    phone: '+91 98765 00004',
    vehicle_type: 'Electric EV Bike',
    is_online: true,
    is_approved: true,
    rating: 4.9,
    current_lat: 12.9120,
    current_lng: 77.6520,
    total_deliveries: 86,
    today_earnings: 760
  }
];
