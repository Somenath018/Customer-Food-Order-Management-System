import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'food_customer_cart';
const TAX_RATE = 0.08; // 8% platform tax matching backend config

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { restaurant: null, items: [], specialInstructions: '' };
    } catch {
      return { restaurant: null, items: [], specialInstructions: '' };
    }
  });

  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    pendingItem: null,
    pendingRestaurant: null
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  }, [cart]);

  // Add item with multi-restaurant conflict detection
  const addItem = (item, restaurant) => {
    if (cart.restaurant && cart.restaurant.id !== restaurant.id && cart.items.length > 0) {
      setConflictModal({
        isOpen: true,
        pendingItem: item,
        pendingRestaurant: restaurant
      });
      return false;
    }

    setCart(prev => {
      const existingIdx = prev.items.findIndex(i => (i.menu_item_id || i.id) === (item.menu_item_id || item.id));
      let newItems = [...prev.items];

      if (existingIdx >= 0) {
        newItems[existingIdx] = {
          ...newItems[existingIdx],
          quantity: newItems[existingIdx].quantity + 1
        };
      } else {
        newItems.push({
          id: item.id,
          menu_item_id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          dietary: item.dietary,
          image_url: item.image_url,
          special_notes: ''
        });
      }

      return {
        ...prev,
        restaurant: prev.restaurant || {
          id: restaurant.id,
          name: restaurant.name,
          delivery_fee: Number(restaurant.delivery_fee) || 2.99,
          address: restaurant.address,
          image_url: restaurant.image_url,
          lat: restaurant.lat,
          lng: restaurant.lng
        },
        items: newItems
      };
    });

    return true;
  };

  const updateQuantity = (itemId, quantity) => {
    setCart(prev => {
      if (quantity <= 0) {
        const remaining = prev.items.filter(i => (i.menu_item_id || i.id) !== itemId);
        return {
          ...prev,
          restaurant: remaining.length === 0 ? null : prev.restaurant,
          items: remaining
        };
      }

      const updated = prev.items.map(i => {
        if ((i.menu_item_id || i.id) === itemId) {
          return { ...i, quantity };
        }
        return i;
      });

      return { ...prev, items: updated };
    });
  };

  const removeItem = (itemId) => {
    updateQuantity(itemId, 0);
  };

  const clearCart = () => {
    setCart({
      restaurant: null,
      items: [],
      specialInstructions: ''
    });
    setConflictModal({ isOpen: false, pendingItem: null, pendingRestaurant: null });
  };

  const confirmSwitchRestaurant = () => {
    if (!conflictModal.pendingItem || !conflictModal.pendingRestaurant) return;
    const item = conflictModal.pendingItem;
    const rest = conflictModal.pendingRestaurant;

    setCart({
      restaurant: {
        id: rest.id,
        name: rest.name,
        delivery_fee: Number(rest.delivery_fee) || 2.99,
        address: rest.address,
        image_url: rest.image_url,
        lat: rest.lat,
        lng: rest.lng
      },
      items: [
        {
          id: item.id,
          menu_item_id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          dietary: item.dietary,
          image_url: item.image_url,
          special_notes: ''
        }
      ],
      specialInstructions: ''
    });

    setConflictModal({ isOpen: false, pendingItem: null, pendingRestaurant: null });
  };

  const dismissConflict = () => {
    setConflictModal({ isOpen: false, pendingItem: null, pendingRestaurant: null });
  };

  const setSpecialInstructions = (instructions) => {
    setCart(prev => ({ ...prev, specialInstructions: instructions }));
  };

  // Calculations
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = cart.restaurant ? Number(cart.restaurant.delivery_fee) || 2.99 : 0;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        restaurant: cart.restaurant,
        items: cart.items,
        specialInstructions: cart.specialInstructions,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        total,
        conflictModal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        confirmSwitchRestaurant,
        dismissConflict,
        setSpecialInstructions
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
