import { request } from './apiClient';

export const customerApi = {
  // Authentication
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  register: (userData) =>
    request('/api/auth/register', {
      method: 'POST',
      body: { ...userData, role: 'customer' }
    }),

  getDemoUsers: () => request('/api/auth/demo-users'),

  getMe: () => request('/api/auth/me'),

  // Restaurants & Menu
  getRestaurants: (params = {}) => {
    const query = new URLSearchParams();
    if (params.cuisine && params.cuisine !== 'All') query.append('cuisine', params.cuisine);
    if (params.search) query.append('search', params.search);
    if (params.onlyOpen) query.append('onlyOpen', 'true');
    const queryString = query.toString();
    return request(`/api/restaurants${queryString ? `?${queryString}` : ''}`);
  },

  getRestaurantById: (id) => request(`/api/restaurants/${id}`),

  getMenuByRestaurant: (restaurantId) => request(`/api/menu/${restaurantId}`),

  // Orders
  createOrder: (orderData) =>
    request('/api/orders', {
      method: 'POST',
      body: orderData
    }),

  getOrders: (status) =>
    request(`/api/orders${status ? `?status=${status}` : ''}`),

  getOrderById: (orderId) => request(`/api/orders/${orderId}`),

  // Mock Payment Engine
  processMockPayment: (paymentData) =>
    request('/api/payments/process', {
      method: 'POST',
      body: paymentData
    }),

  getReceipt: (identifier) => request(`/api/payments/receipt/${identifier}`)
};
