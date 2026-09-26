import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Bike,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  FileCheck,
  Phone,
  Mail,
  LogOut,
  Sparkles
} from 'lucide-react';
import { formatPhone } from '../../utils/formatters';

export const ProfileView = () => {
  const { user, driver, logout } = useAuth();

  const riderName = user?.name || driver?.name || 'Alex Rivera';
  const riderEmail = user?.email || 'driver@foodsystem.com';
  const riderPhone = user?.phone || driver?.phone || '+1 (555) 987-6543';
  const vehicleType = driver?.vehicle_type || 'E-Scooter (Zero Emission)';
  const rating = driver?.rating || 4.9;
  const totalTrips = driver?.total_deliveries || 142;

  const documents = [
    { name: 'Government Photo ID', status: 'Verified', date: 'Exp: 2028' },
    { name: "Driver's License / Permit", status: 'Verified', date: 'Active' },
    { name: 'Vehicle Commercial Insurance', status: 'Verified', date: 'Exp: Dec 2026' },
    { name: 'Insulated Thermal Delivery Bag', status: 'Inspected', date: 'Approved' }
  ];

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <div className="bg-dark-800 border border-dark-700 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <img
              src={
                user?.avatar_url ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
              }
              alt={riderName}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-rider-500 shadow-xl shadow-rider-500/20"
            />
            <span className="absolute -bottom-1 -right-1 bg-rider-500 text-white p-1 rounded-full border-2 border-dark-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
              <h3 className="text-xl font-extrabold text-white">{riderName}</h3>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rider-500/20 text-rider-400 border border-rider-500/40 w-max mx-auto sm:mx-0">
                <Sparkles className="w-3 h-3" />
                <span>Top Partner</span>
              </span>
            </div>

            <div className="space-y-1 text-xs text-gray-400 pt-1">
              <p className="flex items-center justify-center sm:justify-start space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>{riderEmail}</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start space-x-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span>{formatPhone(riderPhone)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-dark-700/80 text-center">
          <div className="p-2 bg-dark-900/60 rounded-xl border border-dark-700/60">
            <div className="flex items-center justify-center space-x-1 text-amber-400 font-extrabold text-base">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{rating}</span>
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">Rating</div>
          </div>

          <div className="p-2 bg-dark-900/60 rounded-xl border border-dark-700/60">
            <div className="text-emerald-400 font-extrabold text-base">98.4%</div>
            <div className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">On-Time</div>
          </div>

          <div className="p-2 bg-dark-900/60 rounded-xl border border-dark-700/60">
            <div className="text-blue-400 font-extrabold text-base">{totalTrips}</div>
            <div className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">Total Trips</div>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-5 shadow space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center space-x-2">
          <Bike className="w-4 h-4 text-rider-400" />
          <span>Registered Delivery Vehicle</span>
        </h4>
        <div className="p-3 rounded-xl bg-dark-900/60 border border-dark-700 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-white">{vehicleType}</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Reg Plate: NY-RID-9921</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Verified Partner Documents */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-5 shadow space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-rider-400" />
          <span>Compliance & Verified Documents</span>
        </h4>
        <div className="space-y-2">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{doc.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-gray-500">{doc.date}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-bold text-[10px]">
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 border border-rose-500/30 font-bold text-xs transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out from Rider Portal</span>
      </button>
    </div>
  );
};
