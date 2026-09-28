import { store } from '../data/store.js';
import { emitToRoom, emitGlobal } from '../sockets/socketManager.js';
import { config } from '../config/config.js';

export const createOrder = (req, res) => {
  try {
    const {
      restaurant_id,
      items,
      delivery_address,
      customer_phone,
      special_instructions,
      payment_method = 'card',
      card_number,
      upi_id
    } = req.body;

    if (req.user && req.user.is_restricted) {
      return res.status(403).json({
        success: false,
        message: 'Your customer account is currently restricted by platform administration. You cannot place orders.'
      });
    }

    if (!restaurant_id || !items || !items.length || !delivery_address) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID, at least one menu item, and delivery address are required.'
      });
    }

    const restaurant = store.getRestaurantById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    // Compute subtotal from items
    let subtotal = 0;
    const validatedItems = items.map(item => {
      const menuItem = store.getMenuItemById(item.menu_item_id || item.id);
      const price = menuItem ? Number(menuItem.price) : Number(item.price || 0);
      const qty = Number(item.quantity) || 1;
      subtotal += price * qty;
      return {
        menu_item_id: item.menu_item_id || item.id,
        name: menuItem ? menuItem.name : item.name,
        price,
        quantity: qty,
        special_notes: item.special_notes || ''
      };
    });

    const deliveryFee = Number(restaurant.delivery_fee) || config.deliveryFeeBase;
    const tax = Number((subtotal * config.taxRate).toFixed(2));
    const discount = 0;
    const total = Number((subtotal + deliveryFee + tax - discount).toFixed(2));

    const customer = req.user;

    const order = store.createOrder({
      customer,
      restaurant,
      items: validatedItems,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      deliveryAddress: delivery_address,
      customerPhone: customer_phone,
      specialInstructions: special_instructions,
      paymentInfo: {
        method: payment_method,
        cardLast4: card_number ? card_number.slice(-4) : '4242',
        upiId: upi_id
      }
    });

    // Real-Time Socket.io Broadcasting
    // 1. Notify Restaurant kitchen
    emitToRoom(`restaurant_${restaurant.id}`, 'order:created', {
      message: `New Order #${order.id.slice(-4).toUpperCase()} received!`,
      order
    });

    // 2. Notify Admin
    emitToRoom('admin_room', 'order:created', { order });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! 🎉',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = (req, res) => {
  try {
    const { role, id } = req.user;
    const { status } = req.query;

    let orders = [];
    if (role === 'customer') {
      orders = store.getOrders({ customerId: id, status });
    } else if (role === 'restaurant') {
      const rest = store.getRestaurantByOwnerId(id) || store.restaurants[0];
      orders = store.getOrders({ restaurantId: rest?.id, status });
    } else if (role === 'driver') {
      orders = store.getOrders({ driverId: id, status });
    } else if (role === 'admin') {
      orders = store.getOrders({ status });
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const order = store.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Valid values: ${validStatuses.join(', ')}` });
    }

    const updatedOrder = store.updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Real-Time Socket.io event emissions
    emitToRoom(`order_${id}`, 'order:status_changed', { order: updatedOrder, status });
    emitToRoom(`customer_${updatedOrder.customer_id}`, 'order:status_changed', { order: updatedOrder, status });
    emitToRoom(`restaurant_${updatedOrder.restaurant_id}`, 'order:status_changed', { order: updatedOrder, status });
    emitToRoom('admin_room', 'order:status_changed', { order: updatedOrder, status });

    // When order is ready for pickup, broadcast to available delivery pool
    if (status === 'ready_for_pickup') {
      emitToRoom('driver_pool', 'delivery:task_ready', {
        orderId: updatedOrder.id,
        restaurantName: updatedOrder.restaurant_name,
        restaurantAddress: updatedOrder.restaurant_address,
        dropoffAddress: updatedOrder.delivery_address,
        fee: updatedOrder.delivery_fee
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFeedback = (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating (1-5) is required.' });
    }

    const order = store.addOrderFeedback(id, { rating, comment });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully! Thank you.',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
