import { store } from '../data/store.js';

export const getAdminOverview = (req, res) => {
  try {
    const stats = store.getAdminStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listAllUsers = (req, res) => {
  try {
    const users = store.getAllUsers();
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listAllRestaurantsAdmin = (req, res) => {
  try {
    const restaurants = store.restaurants;
    res.json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleRestaurantApproval = (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = store.getRestaurantById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const updated = store.updateRestaurant(id, { is_approved: !restaurant.is_approved });
    res.json({
      success: true,
      message: `Restaurant approval status: ${updated.is_approved ? 'APPROVED' : 'SUSPENDED'}`,
      restaurant: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listAllDriversAdmin = (req, res) => {
  try {
    const drivers = store.getAllDrivers();
    res.json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
