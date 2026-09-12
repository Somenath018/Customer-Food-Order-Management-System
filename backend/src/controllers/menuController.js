import { store } from '../data/store.js';

export const getMenuByRestaurant = (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { onlyAvailable } = req.query;

    const items = store.getMenuByRestaurantId(restaurantId, onlyAvailable === 'true');
    res.json({ success: true, count: items.length, menu: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMenuItem = (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, price, description, category, image_url, dietary, is_available } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Dish name and price are required.' });
    }

    const newItem = store.createMenuItem(restaurantId, {
      name,
      price: Number(price),
      description,
      category,
      image_url,
      dietary,
      is_available
    });

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully.',
      item: newItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMenuItem = (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    const updated = store.updateMenuItem(itemId, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully.',
      item: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleItemAvailability = (req, res) => {
  try {
    const { itemId } = req.params;
    const item = store.getMenuItemById(itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    const updated = store.updateMenuItem(itemId, { is_available: !item.is_available });
    res.json({
      success: true,
      message: `Dish is now ${updated.is_available ? 'Available' : 'Out of Stock'}.`,
      item: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMenuItem = (req, res) => {
  try {
    const { itemId } = req.params;
    const success = store.deleteMenuItem(itemId);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    res.json({ success: true, message: 'Menu item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
