import { store } from '../data/store.js';
import { v4 as uuidv4 } from 'uuid';

export const processMockPayment = (req, res) => {
  try {
    const { order_id, amount, payment_method, card_number, card_expiry, card_cvv, upi_id, bank_name } = req.body;

    if (!payment_method) {
      return res.status(400).json({ success: false, message: 'Payment method is required.' });
    }

    const validMethods = ['card', 'upi', 'netbanking', 'cod'];
    if (!validMethods.includes(payment_method)) {
      return res.status(400).json({ success: false, message: `Invalid payment method. Allowed: ${validMethods.join(', ')}` });
    }

    // Mock validation logic
    let cardLast4 = null;
    let upiHandle = null;

    if (payment_method === 'card') {
      const cleanCard = (card_number || '4242424242424242').replace(/\s+/g, '');
      cardLast4 = cleanCard.slice(-4);
    } else if (payment_method === 'upi') {
      upiHandle = upi_id || `${req.user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}@okaxis`;
    }

    const transactionId = `TXN_MOCK_${Math.floor(10000000 + Math.random() * 90000000)}`;
    const isPaid = payment_method !== 'cod';

    const paymentRecord = {
      id: `pay_${uuidv4().slice(0, 8)}`,
      order_id: order_id || null,
      transaction_id: transactionId,
      payment_method,
      payment_status: isPaid ? 'paid' : 'pending',
      amount: Number(amount) || 0,
      card_last4: cardLast4,
      upi_id: upiHandle,
      bank_name: payment_method === 'netbanking' ? (bank_name || 'HDFC Bank') : null,
      paid_at: isPaid ? new Date().toISOString() : null,
      receipt_url: `/api/payments/receipt/${transactionId}`
    };

    // If order_id was provided, update the order
    if (order_id) {
      const order = store.getOrderById(order_id);
      if (order) {
        order.payment = paymentRecord;
      }
    }

    res.json({
      success: true,
      message: isPaid ? 'Mock Payment cleared successfully! 🎉' : 'Order placed with Cash on Delivery (COD).',
      payment: paymentRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentReceipt = (req, res) => {
  try {
    const { identifier } = req.params; // orderId or transactionId
    const order = store.orders.find(o => o.id === identifier || o.payment?.transaction_id === identifier);

    if (!order || !order.payment) {
      return res.status(404).json({ success: false, message: 'Payment receipt not found.' });
    }

    res.json({
      success: true,
      receipt: {
        transaction_id: order.payment.transaction_id,
        order_id: order.id,
        restaurant_name: order.restaurant_name,
        customer_name: order.customer_name,
        items: order.items,
        amount: order.payment.amount,
        payment_method: order.payment.payment_method,
        payment_status: order.payment.payment_status,
        paid_at: order.payment.paid_at || 'Pending on delivery',
        card_last4: order.payment.card_last4,
        upi_id: order.payment.upi_id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
