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

export const getDishes = (req, res) => {
  try {
    const { cuisine, category, search, onlyVeg } = req.query;
    const dishes = store.getDishes({
      category: category || cuisine,
      search,
      onlyVeg: onlyVeg === 'true'
    });
    res.json({ success: true, count: dishes.length, dishes });
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
    const { restaurantId } = req.query;

    let restaurant = null;

    // If role is restaurant partner, strictly lock to their assigned restaurant
    if (req.user.role === 'restaurant') {
      if (req.user.restaurant_id) {
        restaurant = store.getRestaurantById(req.user.restaurant_id);
      }
      if (!restaurant) {
        restaurant = store.getRestaurantByOwnerId(ownerId);
      }
    } else if (req.user.role === 'admin') {
      if (restaurantId) {
        restaurant = store.getRestaurantById(restaurantId);
      }
    }

    if (!restaurant) {
      restaurant = store.getRestaurantByOwnerId(ownerId) || (restaurantId ? store.getRestaurantById(restaurantId) : store.restaurants[0]);
    }

    const menu = store.getMenuByRestaurantId(restaurant.id);
    const activeOrders = store.getOrders({ restaurantId: restaurant.id });

    // Only platform admin gets the list of all restaurants; restaurant partner only gets their own
    const allRestaurants = req.user.role === 'admin'
      ? store.restaurants.map(r => ({
          id: r.id,
          name: r.name,
          cuisine: r.cuisine,
          address: r.address,
          rating: r.rating
        }))
      : [{
          id: restaurant.id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          address: restaurant.address,
          rating: restaurant.rating
        }];

    res.json({
      success: true,
      restaurant: {
        ...restaurant,
        menu,
        activeOrders
      },
      allRestaurants
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
