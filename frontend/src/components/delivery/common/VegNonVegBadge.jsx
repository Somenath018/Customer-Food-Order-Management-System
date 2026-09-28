import React from 'react';

/**
 * Standard Indian food safety Veg / Non-Veg badge (Green square/circle vs Red/Brown square/triangle)
 * Iconic to Swiggy, Zomato, and FSSAI standards.
 */
export const VegNonVegBadge = ({ isVeg, itemName = '', size = 'sm' }) => {
  // If isVeg is not explicitly passed, infer from item name
  let determinedVeg = isVeg;
  if (determinedVeg === undefined) {
    const nonVegKeywords = [
      'chicken',
      'mutton',
      'lamb',
      'beef',
      'pork',
      'fish',
      'prawn',
      'shrimp',
      'meat',
      'egg',
      'bacon',
      'pepperoni',
      'ham',
      'wings',
      'kebab',
      'tikka'
    ];
    const lower = itemName.toLowerCase();
    const isNonVeg = nonVegKeywords.some((kw) => lower.includes(kw));
    determinedVeg = !isNonVeg;
  }

  const dim = size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const dotDim = size === 'xs' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-1.5 h-1.5';

  if (determinedVeg) {
    return (
      <span
        title="Pure Vegetarian"
        className={`inline-flex items-center justify-center ${dim} rounded-xs border-1.5 border-emerald-500 bg-emerald-950/40 shrink-0`}
      >
        <span className={`${dotDim} rounded-full bg-emerald-500`}></span>
      </span>
    );
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center ${dim} rounded-xs border-1.5 border-rose-600 bg-rose-950/40 shrink-0`}
    >
      <span className={`${dotDim} rounded-full bg-rose-600`}></span>
    </span>
  );
};
