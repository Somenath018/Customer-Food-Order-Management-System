import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useCart } from '../../context/CartContext';
import { Plus, Check, Star, Clock, Sparkles, Utensils } from 'lucide-react';

export const CategoryDishesSection = ({ selectedCategory, onSelectRestaurant }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getDishes({ category: selectedCategory })
      .then((res) => {
        if (isMounted && res && res.dishes) {
          setDishes(res.dishes);
        }
      })
      .catch((err) => {
        console.warn('Error fetching category dishes:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const handleAddToCart = (dish) => {
    const restaurantData = {
      id: dish.restaurant_id,
      name: dish.restaurant_name,
      rating: dish.restaurant_rating || 4.5,
      delivery_time_mins: dish.delivery_time_mins || 25,
      delivery_fee: dish.delivery_fee || 29
    };

    addToCart(dish, restaurantData);

    setAddedIds((prev) => new Set([...prev, dish.id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(dish.id);
        return next;
      });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="py-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
        <div className="w-5 h-5 border-2 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
        <span>Loading popular dishes...</span>
      </div>
    );
  }

  if (!dishes || dishes.length === 0) {
    return null;
  }

  const title =
    selectedCategory === 'All'
      ? 'Trending Dishes You Might Love'
      : `Popular ${selectedCategory === 'Rolls' ? 'Rolls & Wraps' : selectedCategory === 'Beverages' ? 'Shakes & Chai' : selectedCategory === 'Healthy' ? 'Healthy Bowls' : selectedCategory} Dishes`;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>{title}</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF5200]">
              {dishes.length} dishes
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Order delicious culinary specialties prepared by top local chefs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dishes.map((dish) => {
          const isJustAdded = addedIds.has(dish.id);
          const isVeg = dish.dietary === 'veg' || dish.dietary === 'vegan';

          return (
            <div
              key={dish.id}
              className="bg-white rounded-3xl p-3.5 border border-slate-200/80 hover:border-orange-200 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Dish Image Container */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Veg / Non-Veg Marker */}
                  <div className="absolute top-2 left-2 p-1 rounded-md bg-white/95 backdrop-blur-xs shadow-xs flex items-center justify-center">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    ></span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-xs text-white text-xs font-black">
                    ₹{dish.price}
                  </div>
                </div>

                {/* Dish Details */}
                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#FF5200] transition-colors line-clamp-1">
                  {dish.name}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Bottom Row: Restaurant Name & Add to Cart Button */}
              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectRestaurant && onSelectRestaurant(dish.restaurant_id)}
                  className="text-left cursor-pointer group/rest overflow-hidden"
                  title={`View ${dish.restaurant_name} menu`}
                >
                  <span className="text-[11px] text-slate-600 font-bold block truncate group-hover/rest:text-[#FF5200]">
                    {dish.restaurant_name}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                    <span>{Number(dish.restaurant_rating || 4.5).toFixed(1)}</span>
                    <span className="text-slate-400">• {dish.delivery_time_mins || 25}m</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCart(dish)}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shadow-xs cursor-pointer shrink-0 flex items-center space-x-1 ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-50 text-[#FF5200] hover:bg-[#FF5200] hover:text-white border border-orange-200'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>ADDED</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryDishesSection;
