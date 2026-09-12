import { store } from '../data/store.js';
import { emitToRoom } from '../sockets/socketManager.js';

export const getAvailableDeliveries = (req, res) => {
  try {
    const availableOrders = store.getAvailableDeliveryOrders();
    res.json({
      success: true,
      count: availableOrders.length,
      orders: availableOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptDeliveryTask = (req, res) => {
  try {
    const { orderId } = req.params;
    const driverId = req.user.id;

    const order = store.assignDriverToOrder(orderId, driverId);
    if (!order) {
      return res.status(400).json({ success: false, message: 'Unable to accept order. Order may already be assigned or not found.' });
    }

    // Notify customer and restaurant that a driver is assigned
    emitToRoom(`order_${orderId}`, 'delivery:assigned', {
      orderId,
      driverName: req.user.name,
      driverPhone: req.user.phone,
      delivery: order.delivery
    });
    emitToRoom(`customer_${order.customer_id}`, 'delivery:assigned', {
      orderId,
      driverName: req.user.name,
      delivery: order.delivery
    });

    res.json({
      success: true,
      message: 'Delivery task accepted! 🛵',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDeliveryStage = (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // 'picked_up', 'on_the_way', 'delivered'

    const order = store.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    let orderStatus = order.status;
    if (status === 'picked_up' || status === 'on_the_way') {
      orderStatus = 'out_for_delivery';
    } else if (status === 'delivered') {
      orderStatus = 'delivered';
    }

    const updated = store.updateOrderStatus(orderId, orderStatus);
    if (updated && updated.delivery) {
      updated.delivery.delivery_status = status;
    }

    emitToRoom(`order_${orderId}`, 'order:status_changed', { order: updated, status: orderStatus });
    emitToRoom(`customer_${updated.customer_id}`, 'order:status_changed', { order: updated, status: orderStatus });

    res.json({
      success: true,
      message: `Delivery updated to ${status}.`,
      order: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDriverLocation = (req, res) => {
  try {
    const { orderId, lat, lng } = req.body;

    if (!orderId || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'orderId, lat, and lng are required.' });
    }

    const delivery = store.updateDeliveryLocation(orderId, Number(lat), Number(lng));
    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Active delivery not found for this order.' });
    }

    // Stream GPS coordinates directly to tracking customer
    emitToRoom(`order_${orderId}`, 'delivery:location_update', {
      orderId,
      lat: Number(lat),
      lng: Number(lng),
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Location updated.',
      delivery
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleDriverStatus = (req, res) => {
  try {
    const driverId = req.user.id;
    const { is_online } = req.body;

    const driver = store.toggleDriverOnline(driverId, is_online);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found.' });
    }

    res.json({
      success: true,
      message: `Driver status is now ${driver.is_online ? 'ONLINE' : 'OFFLINE'}.`,
      driver
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDriverDashboard = (req, res) => {
  try {
    const driverId = req.user.id;
    const driver = store.getDriverById(driverId) || {
      id: driverId,
      name: req.user.name,
      is_online: true,
      total_deliveries: 12,
      today_earnings: 45.00
    };

    const myOrders = store.getOrders({ driverId });
    const availableOrders = store.getAvailableDeliveryOrders();

    res.json({
      success: true,
      driver,
      activeDeliveries: myOrders.filter(o => o.status === 'out_for_delivery'),
      completedDeliveries: myOrders.filter(o => o.status === 'delivered'),
      availableOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
