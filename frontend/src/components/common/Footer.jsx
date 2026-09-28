import React from 'react';
import { FoodieLogo } from './FoodieLogo';
import { Heart, ShieldCheck, Zap, Award, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="bg-white/10 p-2 rounded-2xl w-max">
              <FoodieLogo size="md" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Foodie is your neighborhood food ordering companion. Fresh meals delivered sizzling hot
              from your favorite kitchens straight to your doorstep in minutes.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Contactless & Safe Delivery</span>
            </div>
          </div>

          {/* Popular Cuisines */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Popular Cuisines</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-orange-400 transition cursor-pointer">Hyderabadi & Awadhi Biryani</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Woodfired Italian Pizzas</li>
              <li className="hover:text-orange-400 transition cursor-pointer">North Indian Curries & Naan</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Gourmet Juicy Burgers</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Asian Wok & Dimsums</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Artisan Desserts & Bakery</li>
            </ul>
          </div>

          {/* Delivery Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Delivery Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-orange-400 transition cursor-pointer">Bengaluru (Indiranagar, Koramangala)</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Delhi NCR (Connaught Place, CyberCity)</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Mumbai (Bandra, Powai, Juhu)</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Hyderabad (Hitec City, Jubilee Hills)</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Kolkata (Park Street, Salt Lake)</li>
            </ul>
          </div>

          {/* Foodie Promise & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">The Foodie Promise</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Superfast 30-min delivery guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-orange-400" />
                <span>Top rated hygiene certified kitchens</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Real-time GPS order & rider tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Foodie Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center space-x-1">
            <span>Engineered with passion for food lovers everywhere</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
