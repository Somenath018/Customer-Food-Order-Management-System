import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Bike,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  X,
  AlertTriangle,
  Lock
} from 'lucide-react';

export const AdminDashboard = ({ onBackToCustomer }) => {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('overview'); // 'overview' | 'drivers' | 'customers'

  // Modal for adding a new delivery partner
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [driverFormData, setDriverFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicle_type: 'Motorcycle'
  });
  const [addingDriver, setAddingDriver] = useState(false);
  const [driverModalError, setDriverModalError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, custRes, driversRes] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAdminCustomers().catch(() => null),
        api.getAdminDrivers().catch(() => null)
      ]);

      if (statsRes?.stats) setStats(statsRes.stats);
      if (custRes?.customers) setCustomers(custRes.customers);
      if (driversRes?.drivers) setDrivers(driversRes.drivers);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Customer account restriction toggle
  const handleToggleRestriction = async (customerId) => {
    try {
      const res = await api.toggleCustomerRestriction(customerId);
      if (res && res.customer) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customerId ? { ...c, is_restricted: res.customer.is_restricted } : c))
        );
      }
    } catch (err) {
      alert(`Customer status update failed: ${err.message}`);
    }
  };

  // Add delivery partner
  const handleCreateDriver = async (e) => {
    e.preventDefault();
    setDriverModalError('');
    setAddingDriver(true);

    try {
      const res = await api.addDriverAdmin(driverFormData);
      if (res && res.driver) {
        setDrivers((prev) => [...prev, res.driver]);
        setIsAddDriverOpen(false);
        setDriverFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          vehicle_type: 'Motorcycle'
        });
      }
    } catch (err) {
      setDriverModalError(err.message || 'Failed to register delivery partner');
    } finally {
      setAddingDriver(false);
    }
  };

  // Delete delivery partner
  const handleDeleteDriver = async (driverId, driverName) => {
    if (!window.confirm(`Are you sure you want to remove delivery partner "${driverName}"?`)) {
      return;
    }

    try {
      await api.deleteDriverAdmin(driverId);
      setDrivers((prev) => prev.filter((d) => d.id !== driverId));
    } catch (err) {
      alert(`Failed to remove delivery partner: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-black text-slate-700">Loading Platform Administration Console...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Foodie Platform Administration</h2>
            <p className="text-xs text-slate-500">
              Customer governance and delivery fleet dispatch management
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onBackToCustomer && (
            <button
              onClick={onBackToCustomer}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition cursor-pointer border border-purple-200 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer View</span>
            </button>
          )}
          <button
            onClick={fetchAdminData}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales (GMV)</span>
            <div className="text-2xl font-black text-slate-900">₹{stats.grossMerchandiseValue}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Total Platform Orders</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Commission</span>
            <div className="text-2xl font-black text-purple-700">₹{stats.platformRevenue}</div>
            <span className="text-[10px] text-purple-600 font-bold">15% Take Rate</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="text-2xl font-black text-slate-900">{stats.totalOrders}</div>
            <span className="text-[10px] text-blue-600 font-bold">{stats.activeOrders} active right now</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ecosystem Active</span>
            <div className="text-2xl font-black text-slate-900">
              {drivers.length} Drivers • {customers.length} Users
            </div>
            <span className="text-[10px] text-slate-500 font-bold">Platform Superadmin Console</span>
          </div>
        </div>
      )}

      {/* Admin Tabs - Exclusively Allowed Permissions */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-xs font-black uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Platform Status' },
          { id: 'drivers', label: `Delivery Fleet (${drivers.length})` },
          { id: 'customers', label: `Customer Accounts (${customers.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            className={`px-4 py-2 rounded-2xl transition cursor-pointer ${
              activeAdminTab === tab.id
                ? 'bg-purple-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Overview */}
      {activeAdminTab === 'overview' && stats?.ordersByStatus && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="p-4 rounded-3xl bg-white border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
                  {status.replace(/_/g, ' ')}
                </span>
                <div className="text-2xl font-black text-slate-900">{count}</div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-3xl bg-purple-50/60 border border-purple-200 text-xs text-purple-950 space-y-2">
            <span className="font-extrabold uppercase tracking-wider text-purple-900 block">
              🛡️ Administrative Policy & Scope
            </span>
            <p className="text-slate-600 leading-relaxed">
              Per platform security guidelines, Administrative permissions are strictly scoped to:
              (1) Adding and removing delivery partners, and (2) Auditing customer accounts and applying order restrictions when necessary. Restaurant menus, operational details, and partner credentials remain managed directly by individual restaurant managers.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Delivery Fleet Governance (Add Delivery Partners, Delete Delivery Partners) */}
      {activeAdminTab === 'drivers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Delivery Fleet Partners</h3>
              <p className="text-xs text-slate-500">
                Manage registered delivery riders. Only platform administrators can register or delete fleet members.
              </p>
            </div>
            <button
              onClick={() => setIsAddDriverOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Delivery Partner</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Rider Name</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Duty Status</th>
                  <th className="p-3">Deliveries</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{d.name}</td>
                    <td className="p-3">{d.vehicle_type || 'Motorcycle'}</td>
                    <td className="p-3 font-mono">{d.phone || '—'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          d.is_online
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {d.is_online ? 'ON DUTY' : 'OFF DUTY'}
                      </span>
                    </td>
                    <td className="p-3 font-black text-slate-900">{d.total_deliveries || 0}</td>
                    <td className="p-3">★ {d.rating || 5.0}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteDriver(d.id, d.name)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition cursor-pointer flex items-center space-x-1 ml-auto"
                        title="Delete delivery partner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Customer Governance (View Customer Profiles, Restrict / Unrestrict) */}
      {activeAdminTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Customer Accounts</h3>
            <p className="text-xs text-slate-500">
              Audit customer profiles, addresses, and restrict accounts engaging in fraudulent or abusive ordering behavior.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Primary Address</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{c.name}</td>
                    <td className="p-3 font-mono text-slate-600">{c.email}</td>
                    <td className="p-3 font-mono text-slate-600">{c.phone || '—'}</td>
                    <td className="p-3 max-w-[200px] truncate text-slate-600">{c.address || '—'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          c.is_restricted
                            ? 'bg-rose-100 text-rose-700 font-bold'
                            : 'bg-emerald-100 text-emerald-800 font-bold'
                        }`}
                      >
                        {c.is_restricted ? 'RESTRICTED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleRestriction(c.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          c.is_restricted
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        {c.is_restricted ? 'Unrestrict' : 'Restrict Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Delivery Partner */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bike className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">Add New Delivery Partner</h3>
              </div>
              <button
                onClick={() => setIsAddDriverOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="p-5 space-y-3.5">
              {driverModalError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                  {driverModalError}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={driverFormData.name}
                  onChange={(e) => setDriverFormData({ ...driverFormData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Login Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.driver@foodsystem.com"
                  value={driverFormData.email}
                  onChange={(e) => setDriverFormData({ ...driverFormData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Password for driver app login"
                  value={driverFormData.password}
                  onChange={(e) => setDriverFormData({ ...driverFormData, password: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={driverFormData.phone}
                  onChange={(e) => setDriverFormData({ ...driverFormData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Vehicle Type
                </label>
                <select
                  value={driverFormData.vehicle_type}
                  onChange={(e) => setDriverFormData({ ...driverFormData, vehicle_type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 outline-none cursor-pointer"
                >
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Scooter">Scooter / Activa</option>
                  <option value="E-Scooter / Bike">Electric EV Bike</option>
                  <option value="Bicycle">Bicycle</option>
                </select>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddDriverOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDriver}
                  className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  {addingDriver ? 'Registering...' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
