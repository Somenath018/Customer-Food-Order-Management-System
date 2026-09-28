import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const AVAILABLE_COUPONS = [
  { code: 'FOODIE50', description: '50% OFF up to ₹100', discountPercent: 50, maxDiscount: 100, minOrder: 199 },
  { code: 'TASTY30', description: '30% OFF up to ₹150 on orders above ₹299', discountPercent: 30, maxDiscount: 150, minOrder: 299 },
  { code: 'FREEDELIVERY', description: 'Free Delivery on all orders', freeDelivery: true, minOrder: 149 }
];

export const CartProvider = ({ children }) => {
  const { user, role } = useAuth();
  const isCustomer = Boolean(user && role === 'customer');

  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [conflictModal, setConflictModal] = useState(null);

  // Sync cart data specifically for the logged-in customer account
  useEffect(() => {
    if (isCustomer && user?.id) {
      try {
        const savedItems = localStorage.getItem(`foodie_cart_${user.id}`);
        const savedRest = localStorage.getItem(`foodie_cart_restaurant_${user.id}`);
        setItems(savedItems ? JSON.parse(savedItems) : []);
        setRestaurant(savedRest ? JSON.parse(savedRest) : null);
      } catch {
        setItems([]);
        setRestaurant(null);
      }
    } else {
      setItems([]);
      setRestaurant(null);
      setIsCartOpen(false);
      setAppliedCoupon(null);
    }
  }, [user?.id, isCustomer]);

  // Persist cart specifically for this logged-in customer
  useEffect(() => {
    if (isCustomer && user?.id) {
      localStorage.setItem(`foodie_cart_${user.id}`, JSON.stringify(items));
      localStorage.setItem(`foodie_cart_restaurant_${user.id}`, JSON.stringify(restaurant));
    }
  }, [items, restaurant, isCustomer, user?.id]);

  const safeSetIsCartOpen = (open) => {
    if (open && !isCustomer) {
      setIsCartOpen(false);
      return;
    }
    setIsCartOpen(open);
  };

  const addToCart = (foodItem, restData, customizations = {}) => {
    // Check if adding from a different restaurant
    if (restaurant && restaurant.id !== restData.id && items.length > 0) {
      setConflictModal({
        pendingItem: foodItem,
        newRestaurant: restData,
        customizations
      });
      return;
    }

    if (!restaurant) {
      setRestaurant(restData);
    }

    const itemKey = customizations && Object.keys(customizations).length > 0
      ? `${foodItem.id}_${JSON.stringify(customizations)}`
      : foodItem.id;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartKey === itemKey);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [
          ...prev,
          {
            ...foodItem,
            cartKey: itemKey,
            menu_item_id: foodItem.id,
            quantity: 1,
            customizations: customizations || {},
            restaurant_id: restData.id,
            restaurant_name: restData.name
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const resolveConflict = (replace) => {
    if (replace && conflictModal) {
      setItems([
        {
          ...conflictModal.pendingItem,
          cartKey: conflictModal.pendingItem.id,
          menu_item_id: conflictModal.pendingItem.id,
          quantity: 1,
          customizations: conflictModal.customizations || {},
          restaurant_id: conflictModal.newRestaurant.id,
          restaurant_name: conflictModal.newRestaurant.name
        }
      ]);
      setRestaurant(conflictModal.newRestaurant);
      setIsCartOpen(true);
    }
    setConflictModal(null);
  };

  const updateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartKey) => {
    setItems((prev) => {
      const remaining = prev.filter((item) => item.cartKey !== cartKey);
      if (remaining.length === 0) {
        setRestaurant(null);
        setAppliedCoupon(null);
      }
      return remaining;
    });
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    setAppliedCoupon(null);
    setSpecialInstructions('');
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  
  let deliveryFee = restaurant ? Number(restaurant.delivery_fee) || 2.99 : 2.99;
  if (appliedCoupon?.freeDelivery) {
    deliveryFee = 0;
  }

  const tax = Number((subtotal * 0.05).toFixed(2)); // 5% GST/Tax

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      const calcDiscount = (subtotal * appliedCoupon.discountPercent) / 100;
      discount = Math.min(calcDiscount, appliedCoupon.maxDiscount || calcDiscount);
    }
  }
  discount = Number(discount.toFixed(2));

  const total = Number(Math.max(0, subtotal + deliveryFee + tax - discount).toFixed(2));
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code) => {
    const coupon = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) {
      throw new Error('Invalid coupon code. Try FOODIE50 or TASTY30');
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      throw new Error(`Minimum order of ₹${coupon.minOrder} required for this coupon`);
    }
    setAppliedCoupon(coupon);
    return coupon;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        totalItemCount,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        appliedCoupon,
        specialInstructions,
        isCartOpen,
        conflictModal,
        setIsCartOpen,
        setSpecialInstructions,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        resolveConflict
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
