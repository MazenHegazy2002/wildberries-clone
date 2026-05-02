'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';

interface SellerAnalytics {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalSold: number;
    averageOrderValue: number;
  };
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: any[];
}

export default function SellerDashboard() {
  const { user, isAuthenticated } = useUserStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'settings'>('overview');
  const [analytics, setAnalytics] = useState<SellerAnalytics | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'VENDOR' || user?.role === 'ADMIN')) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [dashboardRes, ordersRes, productsRes, settingsRes] = await Promise.all([
        fetch('/api/seller/dashboard', { headers }).then(r => r.json()).catch(() => ({})),
        fetch('/api/seller/orders', { headers }).then(r => r.json()).catch(() => []),
        fetch('/api/seller/products', { headers }).then(r => r.json()).catch(() => []),
        fetch('/api/seller/settings', { headers }).then(r => r.json()).catch(() => ({})),
      ]);

      setAnalytics(dashboardRes);
      setOrders(ordersRes);
      setProducts(productsRes);
      setSettings(settingsRes);
    } catch (error) {
      console.error('Failed to load seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/seller/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/seller/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      alert('Settings saved!');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isAuthenticated || (user?.role !== 'VENDOR' && user?.role !== 'ADMIN')) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">Seller access required</p>
          <Link href="/" className="text-[#CB11AB]">Go to Home</Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="text-center py-16">
          <div className="text-3xl animate-spin">⏳</div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Seller Dashboard</h2>
        <Link href="/profile" className="text-[#CB11AB] text-sm">← Back</Link>
      </div>

      {/* Stats Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black text-[#CB11AB]">{analytics.stats.totalRevenue.toLocaleString()} ₽</div>
            <div className="text-xs text-gray-400">Revenue</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black">{analytics.stats.totalOrders}</div>
            <div className="text-xs text-gray-400">Orders</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black">{analytics.stats.totalProducts}</div>
            <div className="text-xs text-gray-400">Products</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black">{analytics.stats.totalSold.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Sold</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black">{analytics.stats.averageOrderValue.toLocaleString()} ₽</div>
            <div className="text-xs text-gray-400">Avg Order</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['overview', 'orders', 'products', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === tab ? 'bg-[#CB11AB] text-white' : 'bg-white text-gray-500 border border-gray-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && analytics && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold mb-3">Orders by Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-black">{count}</div>
                <div className="text-xs text-gray-400 capitalize">{status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold mb-3">Your Orders</h3>
          <div className="space-y-2">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No orders yet</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <div className="font-bold">Order #{order.id.slice(-8)}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.total.toLocaleString()} ₽
                    </div>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className={`px-2 py-1 rounded-lg text-sm font-bold ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Your Products</h3>
            <button className="bg-[#CB11AB] text-white px-3 py-1.5 rounded-lg text-sm font-bold">
              + Add Product
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map(product => (
              <div key={product.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="text-3xl mb-2">{product.emoji}</div>
                <div className="text-sm font-medium truncate">{product.name}</div>
                <div className="text-sm font-bold text-[#CB11AB]">{product.price.toLocaleString()} ₽</div>
                <div className="text-xs text-gray-400">Stock: {product.stock}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && settings && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold mb-3">Store Settings</h3>
          <div className="space-y-3 max-w-md">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Description</label>
              <textarea
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Logo Emoji</label>
              <input
                type="text"
                value={settings.logo || ''}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={handleSaveSettings}
              className="w-full bg-[#CB11AB] text-white py-2 rounded-lg font-bold"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </main>
  );
}