// Central API Client wrapper for fetch requests

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('food_delivery_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Parse JSON response
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: false, message: 'Invalid JSON response from server' };
  }

  if (response.status === 401) {
    // Unauthorized token expired
    if (!endpoint.includes('/api/auth/login')) {
      localStorage.removeItem('food_delivery_token');
      localStorage.removeItem('food_delivery_user');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
  }

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
