import { initialUsers, initialRestaurants, initialMenuItems, initialOrders, initialDrivers } from '../config/seedData.js';
import { v4 as uuidv4 } from 'uuid';

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.restaurants = JSON.parse(JSON.stringify(initialRestaurants));
    this.menuItems = JSON.parse(JSON.stringify(initialMenuItems));
    this.orders = JSON.parse(JSON.stringify(initialOrders));
    this.drivers = JSON.parse(JSON.stringify(initialDrivers));
    this.payments = this.orders.map(o => o.payment).filter(Boolean);
  }

  // --- Users ---
  findUserById(id) {
    return this.users.find(u => u.id === id) || null;
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser(userData) {
    const newUser = {
      id: `user_${uuidv4().slice(0, 8)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password_hash: userData.password_hash,
      role: userData.role || 'customer',
      phone: userData.phone || '',
      address: userData.address || '',
      avatar_url: userData.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString()
    };
    this.users.push(newUser);

    // If driver role, also register in driver pool
    if (newUser.role === 'driver') {
      this.drivers.push({
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        vehicle_type: userData.vehicle_type || 'Bicycle / Scooter',
        is_online: true,
        is_approved: true,
        rating: 5.0,
        current_lat: 40.7128,
        current_lng: -74.0060,
        total_deliveries: 0,
        today_earnings: 0
      });
    }

    return newUser;
  }

  getAllUsers() {
    return this.users.map(({ password_hash, ...u }) => u);
  }

  // --- Restaurants ---
  getRestaurants({ cuisine, search, onlyOpen = false } = {}) {
    let list = this.restaurants.filter(r => r.is_approved);
    if (cuisine && cuisine !== 'All') {
      list = list.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q));
    }
    if (onlyOpen) {
      list = list.filter(r => r.is_open);
    }
    return list;
  }

  getRestaurantById(id) {
    return this.restaurants.find(r => r.id === id) || null;
  }

  getRestaurantByOwnerId(ownerId) {
    return this.restaurants.find(r => r.owner_id === ownerId) || null;
  }

  createRestaurant(data) {
    const newRest = {
      id: `rest_${uuidv4().slice(0, 8)}`,
      owner_id: data.owner_id,
      name: data.name,
      description: data.description || '',
      cuisine: data.cuisine || 'Multi-Cuisine',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      address: data.address,
      phone: data.phone || '',
      rating: 5.0,
      delivery_time_mins: data.delivery_time_mins || 30,
      delivery_fee: Number(data.delivery_fee) || 2.99,
      min_order: Number(data.min_order) || 10.00,
      is_open: true,
      is_approved: data.is_approved !== undefined ? data.is_approved : true,
      lat: data.lat || 40.7128,
      lng: data.lng || -74.0060,
      created_at: new Date().toISOString()
    };
    this.restaurants.push(newRest);
    return newRest;
  }

  updateRestaurant(id, updates) {
    const idx = this.restaurants.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.restaurants[idx] = { ...this.restaurants[idx], ...updates };
    return this.restaurants[idx];
  }

  deleteRestaurant(id) {
    const idx = this.restaurants.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.restaurants.splice(idx, 1);
    this.menuItems = this.menuItems.filter(m => m.restaurant_id !== id);
    return true;
  }

  // --- Menu Items ---
  getMenuByRestaurantId(restaurantId, onlyAvailable = false) {
    let items = this.menuItems.filter(m => m.restaurant_id === restaurantId);
    if (onlyAvailable) {
      items = items.filter(m => m.is_available);
    }
    return items;
  }

  getMenuItemById(itemId) {
    return this.menuItems.find(m => m.id === itemId) || null;
  }

  createMenuItem(restaurantId, data) {
    const newItem = {
      id: `menu_${uuidv4().slice(0, 8)}`,
      restaurant_id: restaurantId,
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      category: data.category || 'Main Course',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      is_available: data.is_available !== undefined ? data.is_available : true,
      dietary: data.dietary || 'non-veg',
      preparation_time_mins: data.preparation_time_mins || 15,
      created_at: new Date().toISOString()
    };
    this.menuItems.push(newItem);
    return newItem;
  }

  updateMenuItem(itemId, updates) {
    const idx = this.menuItems.findIndex(m => m.id === itemId);
    if (idx === -1) return null;
    this.menuItems[idx] = { ...this.menuItems[idx], ...updates };
    return this.menuItems[idx];
  }

  deleteMenuItem(itemId) {
    const idx = this.menuItems.findIndex(m => m.id === itemId);
    if (idx === -1) return false;
    this.menuItems.splice(idx, 1);
    return true;
  }

  // --- Orders ---
  createOrder({ customer, restaurant, items, subtotal, deliveryFee, tax, discount, total, deliveryAddress, customerPhone, specialInstructions, paymentInfo }) {
    const orderId = `ord_${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();

    const newPayment = {
      id: `pay_${uuidv4().slice(0, 8)}`,
      order_id: orderId,
      transaction_id: `TXN_MOCK_${Math.floor(10000000 + Math.random() * 90000000)}`,
      payment_method: paymentInfo?.method || 'card',
      payment_status: paymentInfo?.method === 'cod' ? 'pending' : 'paid',
      amount: total,
      card_last4: paymentInfo?.cardLast4 || (paymentInfo?.method === 'card' ? '4242' : null),
      upi_id: paymentInfo?.upiId || null,
      paid_at: paymentInfo?.method === 'cod' ? null : now
    };

    const newOrder = {
      id: orderId,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_phone: customerPhone || customer.phone || '',
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name,
      restaurant_address: restaurant.address,
      status: 'placed',
      subtotal: Number(subtotal),
      delivery_fee: Number(deliveryFee),
      tax: Number(tax),
      discount: Number(discount || 0),
      total: Number(total),
      delivery_address: deliveryAddress,
      special_instructions: specialInstructions || '',
      driver_id: null,
      driver_name: null,
      items: items.map(item => ({
        id: `item_${uuidv4().slice(0, 6)}`,
        menu_item_id: item.menu_item_id || item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        special_notes: item.special_notes || ''
      })),
      payment: newPayment,
      delivery: null,
      placed_at: now,
      confirmed_at: null,
      preparing_at: null,
      ready_at: null,
      out_for_delivery_at: null,
      delivered_at: null,
      cancelled_at: null
    };

    this.orders.unshift(newOrder);
    this.payments.push(newPayment);
    return newOrder;
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id) || null;
  }

  getOrders({ customerId, restaurantId, driverId, status } = {}) {
    let list = [...this.orders];
    if (customerId) list = list.filter(o => o.customer_id === customerId);
    if (restaurantId) list = list.filter(o => o.restaurant_id === restaurantId);
    if (driverId) list = list.filter(o => o.driver_id === driverId);
    if (status) list = list.filter(o => o.status === status);
    return list;
  }

  updateOrderStatus(orderId, status) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const now = new Date().toISOString();
    order.status = status;

    if (status === 'confirmed') order.confirmed_at = now;
    if (status === 'preparing') order.preparing_at = now;
    if (status === 'ready_for_pickup') {
      order.ready_at = now;
    }
    if (status === 'out_for_delivery') {
      order.out_for_delivery_at = now;
      if (order.delivery) {
        order.delivery.delivery_status = 'on_the_way';
      }
    }
    if (status === 'delivered') {
      order.delivered_at = now;
      if (order.payment && order.payment.payment_method === 'cod') {
        order.payment.payment_status = 'paid';
        order.payment.paid_at = now;
      }
      if (order.delivery) {
        order.delivery.delivery_status = 'delivered';
        order.delivery.delivered_at = now;
      }
      // Update driver completed deliveries & earnings
      if (order.driver_id) {
        const drv = this.drivers.find(d => d.id === order.driver_id);
        if (drv) {
          drv.total_deliveries = (drv.total_deliveries || 0) + 1;
          drv.today_earnings = (drv.today_earnings || 0) + (order.delivery_fee || 3.50);
        }
      }
    }
    if (status === 'cancelled') order.cancelled_at = now;

    return order;
  }

  // --- Deliveries ---
  getAvailableDeliveryOrders() {
    return this.orders.filter(o => o.status === 'ready_for_pickup' && !o.driver_id);
  }

  assignDriverToOrder(orderId, driverId) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const driver = this.drivers.find(d => d.id === driverId) || this.findUserById(driverId);
    if (!driver) return null;

    order.driver_id = driver.id;
    order.driver_name = driver.name;

    const rest = this.getRestaurantById(order.restaurant_id);

    order.delivery = {
      id: `del_${uuidv4().slice(0, 8)}`,
      order_id: order.id,
      driver_id: driver.id,
      driver_name: driver.name,
      driver_phone: driver.phone,
      delivery_status: 'accepted',
      pickup_address: rest?.address || order.restaurant_address || 'Restaurant',
      dropoff_address: order.delivery_address,
      current_lat: driver.current_lat || 40.7185,
      current_lng: driver.current_lng || -73.9960,
      estimated_arrival_mins: 15,
      assigned_at: new Date().toISOString()
    };

    return order;
  }

  updateDeliveryLocation(orderId, lat, lng) {
    const order = this.getOrderById(orderId);
    if (!order || !order.delivery) return null;

    order.delivery.current_lat = lat;
    order.delivery.current_lng = lng;

    const drv = this.drivers.find(d => d.id === order.driver_id);
    if (drv) {
      drv.current_lat = lat;
      drv.current_lng = lng;
    }

    return order.delivery;
  }

  // --- Drivers ---
  getDriverById(driverId) {
    return this.drivers.find(d => d.id === driverId) || null;
  }

  getAllDrivers() {
    return this.drivers;
  }

  toggleDriverOnline(driverId, isOnline) {
    const drv = this.drivers.find(d => d.id === driverId);
    if (drv) {
      drv.is_online = isOnline !== undefined ? isOnline : !drv.is_online;
      return drv;
    }
    return null;
  }

  // --- Admin Analytics & Stats ---
  getAdminStats() {
    const totalOrders = this.orders.length;
    const completedOrders = this.orders.filter(o => o.status === 'delivered');
    const activeOrders = this.orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    const grossMerchandiseValue = this.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const platformRevenue = grossMerchandiseValue * 0.15; // 15% commission
    const totalCustomers = this.users.filter(u => u.role === 'customer').length;
    const totalRestaurants = this.restaurants.length;
    const activeDrivers = this.drivers.filter(d => d.is_online).length;

    const ordersByStatus = {
      placed: this.orders.filter(o => o.status === 'placed').length,
      confirmed: this.orders.filter(o => o.status === 'confirmed').length,
      preparing: this.orders.filter(o => o.status === 'preparing').length,
      ready_for_pickup: this.orders.filter(o => o.status === 'ready_for_pickup').length,
      out_for_delivery: this.orders.filter(o => o.status === 'out_for_delivery').length,
      delivered: completedOrders.length,
      cancelled: this.orders.filter(o => o.status === 'cancelled').length
    };

    return {
      totalOrders,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      grossMerchandiseValue: Number(grossMerchandiseValue.toFixed(2)),
      platformRevenue: Number(platformRevenue.toFixed(2)),
      totalCustomers,
      totalRestaurants,
      activeDrivers,
      ordersByStatus,
      recentOrders: this.orders.slice(0, 8)
    };
  }
}

export const store = new DataStore();
