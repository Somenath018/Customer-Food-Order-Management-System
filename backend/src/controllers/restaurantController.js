import { store } from '../data/store.js';

export const getAllRestaurants = (req, res) => {
  try {
    const { cuisine, search, onlyOpen } = req.query;
    const restaurants = store.getRestaurants({
      cuisine,
      search,
      onlyOpen: onlyOpen === 'true'
    });
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRestaurantById = (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = store.getRestaurantById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const menu = store.getMenuByRestaurantId(id);

    res.json({
      success: true,
      restaurant: {
        ...restaurant,
        menu
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyRestaurant = (req, res) => {
  try {
    const ownerId = req.user.id;
    let restaurant = store.getRestaurantByOwnerId(ownerId);

    // If owner doesn't have a linked restaurant yet, return first or create default
    if (!restaurant) {
      restaurant = store.restaurants[0];
    }

    const menu = store.getMenuByRestaurantId(restaurant.id);
    const activeOrders = store.getOrders({ restaurantId: restaurant.id });

    res.json({
      success: true,
      restaurant: {
        ...restaurant,
        menu,
        activeOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRestaurant = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const restaurant = store.getRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    // Role check: Admin or the owner
    if (req.user.role !== 'admin' && restaurant.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this restaurant.' });
    }

    const updated = store.updateRestaurant(id, updates);
    res.json({ success: true, message: 'Restaurant updated successfully.', restaurant: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleOpenStatus = (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = store.getRestaurantById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const updated = store.updateRestaurant(id, { is_open: !restaurant.is_open });
    res.json({
      success: true,
      message: `Restaurant is now ${updated.is_open ? 'OPEN' : 'CLOSED'}.`,
      is_open: updated.is_open
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
