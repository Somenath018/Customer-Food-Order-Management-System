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

export const listAllCustomers = (req, res) => {
  try {
    const customers = store.getCustomers();
    res.json({
      success: true,
      count: customers.length,
      customers,
      users: customers // alias for backwards compatibility
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCustomerRestriction = (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = store.toggleCustomerRestriction(id);

    if (!updatedCustomer) {
      return res.status(404).json({ success: false, message: 'Customer account not found.' });
    }

    res.json({
      success: true,
      message: `Customer account is now ${updatedCustomer.is_restricted ? 'RESTRICTED' : 'ACTIVE'}.`,
      customer: updatedCustomer
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

export const addDeliveryPartnerAdmin = (req, res) => {
  try {
    const { name, email, password, phone, vehicle_type } = req.body;
    const result = store.addDriver({ name, email, password, phone, vehicle_type });

    res.status(201).json({
      success: true,
      message: 'Delivery partner registered successfully.',
      driver: result.driver,
      user: result.user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDeliveryPartnerAdmin = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = store.deleteDriver(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Delivery partner not found.' });
    }

    res.json({
      success: true,
      message: 'Delivery partner deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
