import { request } from './apiClient';

export const deliveryApi = {
  // Authentication
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  getDemoUsers: () => request('/api/auth/demo-users'),

  getMe: () => request('/api/auth/me'),

  // Driver Dashboard & Status
  getDashboard: () => request('/api/deliveries/dashboard'),

  toggleStatus: (is_online) =>
    request('/api/deliveries/toggle-status', {
      method: 'PATCH',
      body: { is_online }
    }),

  // Deliveries & Dispatch
  getAvailableDeliveries: () => request('/api/deliveries/available'),

  acceptTask: (orderId) =>
    request(`/api/deliveries/accept/${orderId}`, {
      method: 'POST'
    }),

  updateStage: (orderId, status) =>
    request(`/api/deliveries/stage/${orderId}`, {
      method: 'PATCH',
      body: { status }
    }),

  updateLocation: (orderId, lat, lng) =>
    request('/api/deliveries/location', {
      method: 'POST',
      body: { orderId, lat, lng }
    }),

  // Orders
  getOrder: (orderId) => request(`/api/orders/${orderId}`),

  getOrdersList: (status) =>
    request(`/api/orders${status ? `?status=${status}` : ''}`)
};
