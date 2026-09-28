const API_BASE_URL = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('foodie_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('foodie_token', token);
    } else {
      localStorage.removeItem('foodie_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('foodie_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // --- Auth Endpoints ---
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  restaurantLogin(restaurantId, pin) {
    return this.request('/auth/restaurant-login', {
      method: 'POST',
      body: { restaurantId, pin }
    });
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  updateProfile(profileData) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: profileData
    });
  }

  getDemoUsers() {
    return this.request('/auth/demo-users');
  }

  // --- Restaurant Endpoints ---
  getRestaurants(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.cuisine && params.cuisine !== 'All') searchParams.append('cuisine', params.cuisine);
    if (params.search) searchParams.append('search', params.search);
    if (params.onlyOpen) searchParams.append('onlyOpen', 'true');
    const queryString = searchParams.toString();
    return this.request(`/restaurants${queryString ? `?${queryString}` : ''}`);
  }

  getDishes(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== 'All') searchParams.append('category', params.category);
    if (params.cuisine && params.cuisine !== 'All') searchParams.append('cuisine', params.cuisine);
    if (params.search) searchParams.append('search', params.search);
    if (params.onlyVeg) searchParams.append('onlyVeg', 'true');
    const queryString = searchParams.toString();
    return this.request(`/restaurants/dishes${queryString ? `?${queryString}` : ''}`);
  }

  getRestaurantById(id) {
    return this.request(`/restaurants/${id}`);
  }

  getMyRestaurant(restaurantId) {
    const query = restaurantId ? `?restaurantId=${restaurantId}` : '';
    return this.request(`/restaurants/my-restaurant${query}`);
  }

  updateRestaurant(id, updates) {
    return this.request(`/restaurants/${id}`, {
      method: 'PUT',
      body: updates
    });
  }

  toggleRestaurantOpen(id) {
    return this.request(`/restaurants/${id}/toggle-open`, {
      method: 'PATCH'
    });
  }

  // --- Menu Endpoints ---
  getMenu(restaurantId) {
    return this.request(`/menu/${restaurantId}`);
  }

  addMenuItem(restaurantId, itemData) {
    return this.request(`/menu/${restaurantId}`, {
      method: 'POST',
      body: itemData
    });
  }

  updateMenuItem(restaurantId, itemId, updates) {
    return this.request(`/menu/${restaurantId}/${itemId}`, {
      method: 'PUT',
      body: updates
    });
  }

  toggleMenuItem(restaurantId, itemId) {
    return this.request(`/menu/${restaurantId}/${itemId}/toggle`, {
      method: 'PATCH'
    });
  }

  deleteMenuItem(restaurantId, itemId) {
    return this.request(`/menu/${restaurantId}/${itemId}`, {
      method: 'DELETE'
    });
  }

  // --- Order Endpoints ---
  createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData
    });
  }

  getOrders(status) {
    const url = status ? `/orders?status=${status}` : '/orders';
    return this.request(url);
  }

  getOrderById(id) {
    return this.request(`/orders/${id}`);
  }

  updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: { status }
    });
  }

  submitFeedback(orderId, { rating, comment }) {
    return this.request(`/orders/${orderId}/feedback`, {
      method: 'POST',
      body: { rating, comment }
    });
  }

  // --- Delivery Endpoints ---
  getAvailableDeliveries() {
    return this.request('/deliveries/available');
  }

  acceptDelivery(orderId) {
    return this.request(`/deliveries/accept/${orderId}`, {
      method: 'POST'
    });
  }

  updateDeliveryStage(orderId, status) {
    return this.request(`/deliveries/stage/${orderId}`, {
      method: 'PATCH',
      body: { status }
    });
  }

  updateDriverLocation(orderId, lat, lng) {
    return this.request('/deliveries/location', {
      method: 'POST',
      body: { orderId, lat, lng }
    });
  }

  toggleDriverStatus(isOnline) {
    return this.request('/deliveries/toggle-status', {
      method: 'PATCH',
      body: { is_online: isOnline }
    });
  }

  getDriverDashboard() {
    return this.request('/deliveries/dashboard');
  }

  // --- Mock Payment Endpoints ---
  processMockPayment(paymentData) {
    return this.request('/payments/mock-process', {
      method: 'POST',
      body: paymentData
    });
  }

  getPaymentReceipt(identifier) {
    return this.request(`/payments/receipt/${identifier}`);
  }

  // --- Admin Endpoints ---
  getAdminStats() {
    return this.request('/admin/stats');
  }

  getAdminCustomers() {
    return this.request('/admin/customers');
  }

  getAdminUsers() {
    return this.request('/admin/customers');
  }

  toggleCustomerRestriction(customerId) {
    return this.request(`/admin/customers/${customerId}/toggle-restriction`, {
      method: 'PATCH'
    });
  }

  getAdminDrivers() {
    return this.request('/admin/drivers');
  }

  addDriverAdmin(driverData) {
    return this.request('/admin/drivers', {
      method: 'POST',
      body: driverData
    });
  }

  deleteDriverAdmin(driverId) {
    return this.request(`/admin/drivers/${driverId}`, {
      method: 'DELETE'
    });
  }
}

export const api = new ApiClient();
