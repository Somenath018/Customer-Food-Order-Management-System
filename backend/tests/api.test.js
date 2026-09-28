process.env.NODE_ENV = 'test';
import { httpServer } from '../src/server.js';
import { io as Client } from 'socket.io-client';

const TEST_PORT = 5055;
let baseUrl = `http://localhost:${TEST_PORT}`;

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const pass = (title) => console.log(`  ${colors.green}✔ PASS:${colors.reset} ${title}`);
const fail = (title, err) => {
  console.error(`  ${colors.red}✖ FAIL:${colors.reset} ${title}`);
  if (err) console.error(`    ${colors.red}${err.message || err}${colors.reset}`);
};

const request = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await res.json();
  return { status: res.status, data };
};

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`${colors.cyan}🧪 Starting Central Backend Automated Test Suite...${colors.reset}`);
  console.log(`======================================================\n`);

  await new Promise((resolve) => httpServer.listen(TEST_PORT, resolve));

  let passed = 0;
  let failed = 0;

  const test = async (title, fn) => {
    try {
      await fn();
      pass(title);
      passed++;
    } catch (err) {
      fail(title, err);
      failed++;
    }
  };

  let customerToken = '';
  let restaurantToken = '';
  let driverToken = '';
  let adminToken = '';
  let createdOrderId = '';

  // 1. Health check test
  await test('GET /api/health - Server health check & status', async () => {
    const res = await request('/api/health');
    if (res.status !== 200 || res.data.status !== 'healthy') {
      throw new Error(`Expected status 200 & healthy, got ${res.status}`);
    }
  });

  // 2. Auth & Demo Users test
  await test('GET /api/auth/demo-users - Retrieve 4-role demo users', async () => {
    const res = await request('/api/auth/demo-users');
    if (res.status !== 200 || !res.data.demoUsers || res.data.demoUsers.length < 4) {
      throw new Error('Failed to retrieve demo users for 4 roles');
    }

    const customer = res.data.demoUsers.find(u => u.role === 'customer');
    const restaurant = res.data.demoUsers.find(u => u.role === 'restaurant');
    const driver = res.data.demoUsers.find(u => u.role === 'driver');
    const admin = res.data.demoUsers.find(u => u.role === 'admin');

    customerToken = customer.token;
    restaurantToken = restaurant.token;
    driverToken = driver.token;
    adminToken = admin.token;
  });

  // 3. User Login test
  await test('POST /api/auth/login - Authenticate registered user', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'customer@foodsystem.com',
        password: 'password123'
      }
    });
    if (res.status !== 200 || !res.data.token) {
      throw new Error(`Login failed with status ${res.status}: ${res.data.message}`);
    }
  });

  // 4. Restaurant Listing test
  await test('GET /api/restaurants - Fetch restaurants list with menus', async () => {
    const res = await request('/api/restaurants');
    if (res.status !== 200 || !res.data.restaurants || res.data.restaurants.length === 0) {
      throw new Error('Failed to fetch restaurants');
    }
  });

  // 5. Menu Items by Restaurant test
  await test('GET /api/menu/:restaurantId - Fetch menu for Bella Italia', async () => {
    const res = await request('/api/menu/rest_01');
    if (res.status !== 200 || !res.data.menu || res.data.menu.length === 0) {
      throw new Error('Failed to fetch restaurant menu');
    }
  });

  // 6. Restaurant Owner - Add Menu Item test
  await test('POST /api/menu/:restaurantId - Restaurant Owner adds dish', async () => {
    const res = await request('/api/menu/rest_01', {
      method: 'POST',
      headers: { Authorization: `Bearer ${restaurantToken}` },
      body: {
        name: 'Chef Special Bruschetta',
        price: 8.99,
        category: 'Appetizers',
        description: 'Toasted ciabatta with heirloom tomatoes and balsamic glaze',
        dietary: 'veg'
      }
    });
    if (res.status !== 201 || !res.data.item) {
      throw new Error(`Failed to add dish: ${res.data.message}`);
    }
  });

  // 7. Customer - Place Order with Mock Payment test
  await test('POST /api/orders - Customer places order with Mock Card payment', async () => {
    const res = await request('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        restaurant_id: 'rest_01',
        items: [
          { id: 'menu_01_01', quantity: 2, special_notes: 'Extra crispy' },
          { id: 'menu_01_04', quantity: 1 }
        ],
        delivery_address: '123 Test Avenue, Suite 10, New York, NY',
        customer_phone: '+1 (555) 123-4567',
        payment_method: 'card',
        card_number: '4111222233334242'
      }
    });

    if (res.status !== 201 || !res.data.order) {
      throw new Error(`Order placement failed: ${res.data.message}`);
    }

    createdOrderId = res.data.order.id;
    if (res.data.order.payment.payment_status !== 'paid') {
      throw new Error('Mock payment should be automatically marked as paid');
    }
  });

  // 8. Mock Payment Processor endpoint test
  await test('POST /api/payments/mock-process - Process mock UPI payment', async () => {
    const res = await request('/api/payments/mock-process', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        payment_method: 'upi',
        upi_id: 'sarah@okaxis',
        amount: 32.50
      }
    });
    if (res.status !== 200 || !res.data.payment || !res.data.payment.transaction_id) {
      throw new Error('Mock UPI payment failed');
    }
  });

  // 9. Restaurant - Advance Order Status to Preparing & Ready
  await test('PATCH /api/orders/:id/status - Restaurant prepares and marks ready', async () => {
    // Preparing
    const prepRes = await request(`/api/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${restaurantToken}` },
      body: { status: 'preparing' }
    });
    if (prepRes.status !== 200 || prepRes.data.order.status !== 'preparing') {
      throw new Error('Failed to transition to preparing');
    }

    // Ready for pickup
    const readyRes = await request(`/api/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${restaurantToken}` },
      body: { status: 'ready_for_pickup' }
    });
    if (readyRes.status !== 200 || readyRes.data.order.status !== 'ready_for_pickup') {
      throw new Error('Failed to transition to ready_for_pickup');
    }
  });

  // 10. Delivery Driver - View Available Tasks & Accept
  await test('GET /api/deliveries/available & POST /api/deliveries/accept/:id - Driver accepts dispatch', async () => {
    const availRes = await request('/api/deliveries/available', {
      headers: { Authorization: `Bearer ${driverToken}` }
    });
    if (availRes.status !== 200 || availRes.data.orders.length === 0) {
      throw new Error('Driver could not see ready orders');
    }

    const acceptRes = await request(`/api/deliveries/accept/${createdOrderId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` }
    });
    if (acceptRes.status !== 200 || acceptRes.data.order.driver_id !== 'user_driver_01') {
      throw new Error('Driver failed to accept delivery task');
    }
  });

  // 11. Delivery Driver - Update live GPS coordinates & finish delivery
  await test('POST /api/deliveries/location & PATCH /api/deliveries/stage/:id - Live GPS & Delivered', async () => {
    const locRes = await request('/api/deliveries/location', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: {
        orderId: createdOrderId,
        lat: 40.7205,
        lng: -73.9930
      }
    });
    if (locRes.status !== 200) {
      throw new Error('Failed to update driver live GPS location');
    }

    const stageRes = await request(`/api/deliveries/stage/${createdOrderId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: { status: 'delivered' }
    });
    if (stageRes.status !== 200 || stageRes.data.order.status !== 'delivered') {
      throw new Error('Failed to mark delivery as completed');
    }
  });

  // 12. Admin - KPI Stats Overview
  await test('GET /api/admin/stats - Admin platform overview & metrics', async () => {
    const res = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !res.data.stats || res.data.stats.totalOrders === undefined) {
      throw new Error('Admin stats retrieval failed');
    }
    if (res.data.stats.grossMerchandiseValue <= 0) {
      throw new Error('GMV calculation is non-positive');
    }
  });

  // 13. Admin - List All Users & Drivers
  await test('GET /api/admin/users & GET /api/admin/drivers - Admin user governance', async () => {
    const usersRes = await request('/api/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const driversRes = await request('/api/admin/drivers', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (usersRes.status !== 200 || driversRes.status !== 200) {
      throw new Error('Admin failed to query user/driver directories');
    }
  });

  // 14. Restaurant Login & Business Verification test
  await test('POST /api/auth/restaurant-login - Restaurant partner login with compliance docs', async () => {
    const res = await request('/api/auth/restaurant-login', {
      method: 'POST',
      body: {
        restaurant_id: 'rest_01',
        password: 'password123',
        remember_me: true,
        fssai_license_no: '10021022000345',
        bank_account_no: '987654321012',
        bank_ifsc: 'HDFC0001234',
        bank_name: 'HDFC Bank',
        account_holder: 'Bella Italia Trattoria Pvt Ltd',
        gstin: '22AAAAA0000A1Z5',
        pan_number: 'ABCDE1234F'
      }
    });
    if (res.status !== 200 || !res.data.token || !res.data.restaurant) {
      throw new Error(`Restaurant login failed: ${res.data.message}`);
    }
    if (res.data.restaurant.gstin !== '22AAAAA0000A1Z5') {
      throw new Error('GSTIN document verification mapping failed');
    }
  });

  // 15. Restaurant Sales & Daily Earnings Analytics test
  await test('GET /api/restaurants/:id/analytics - Fetch daily earnings & weekly sales breakdown', async () => {
    const res = await request('/api/restaurants/rest_01/analytics');
    if (res.status !== 200 || !res.data.analytics) {
      throw new Error(`Analytics endpoint failed: ${res.data.message}`);
    }
    const { weeklySales, todayEarnings } = res.data.analytics;
    if (!Array.isArray(weeklySales) || weeklySales.length !== 7) {
      throw new Error('Weekly sales should return 7-day breakdown array');
    }
  });

  // 14. Socket.io Real-Time Connection test
  await test('Socket.io - Client connection, room subscription & broadcast', async () => {
    await new Promise((resolve, reject) => {
      const socket = Client(baseUrl, { transports: ['websocket', 'polling'] });
      socket.on('connect', () => {
        socket.emit('join', 'customer_user_customer_01');
      });
      socket.on('joined', (data) => {
        if (data.room === 'customer_user_customer_01') {
          socket.disconnect();
          resolve();
        } else {
          reject(new Error('Unexpected room join response'));
        }
      });
      socket.on('connect_error', (err) => reject(err));
      setTimeout(() => reject(new Error('Socket.io connection timed out')), 4000);
    });
  });

  console.log(`\n======================================================`);
  console.log(`${colors.cyan}Test Results:${colors.reset} ${passed} passed, ${failed} failed (${passed + failed} total)`);
  console.log(`======================================================\n`);

  httpServer.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  httpServer.close();
  process.exit(1);
});
