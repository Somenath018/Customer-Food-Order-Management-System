import { api } from './client';

export const deliveryApi = {
  login: (email, password) => api.login(email, password),
  getDemoUsers: () => api.getDemoUsers(),
  getMe: () => api.getMe(),
  updateProfile: (profileData) => api.updateProfile(profileData),
  getDashboard: () => api.getDriverDashboard(),
  toggleStatus: (is_online) => api.toggleDriverStatus(is_online),
  getAvailableDeliveries: () => api.getAvailableDeliveries(),
  acceptTask: (orderId) => api.acceptDelivery(orderId),
  updateStage: (orderId, status) => api.updateDeliveryStage(orderId, status),
  updateLocation: (orderId, lat, lng) => api.updateDriverLocation(orderId, lat, lng),
  getOrder: (orderId) => api.getOrderById(orderId),
  getOrdersList: (status) => api.getOrders(status)
};

export default deliveryApi;
