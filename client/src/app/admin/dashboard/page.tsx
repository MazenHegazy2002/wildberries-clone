'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import api from '@/lib/api';

interface Analytics {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalVendors: number;
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
  topProducts: any[];
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useUserStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'vendors' | 'orders' | 'products'>('overview');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [analyticsRes, usersRes, vendorsRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/analytics', { headers }).then(r => r.json()).catch(() => ({})),
        fetch('/api/admin/users', { headers }).then(r => r.json()).catch(() => []),
        fetch('/api/admin/vendors', { headers }).then(r => r.json()).catch(() => []),
        fetch('/api/admin/orders', { headers }).then(r => r.json()).catch(() => []),
        fetch('/api/admin/products', { headers }).then(r => r.json()).catch(() => []),
      ]);

      setAnalytics(analyticsRes);
      setUsers(usersRes);
      setVendors(vendorsRes);
      setOrders(ordersRes);
      setProducts(productsRes);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      loadData();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleApproveVendor = async (vendorId: string, approved: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/vendors/${vendorId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved }),
      });
      loadData();
    } catch (error) {
      console.error('Failed to approve vendor:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/orders/${orderId}/status`, {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">Admin access required</p>
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
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <Link href="/profile" className="text-[#CB11AB] text-sm">← Back</Link>
      </div>

      {/* Stats Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black text-[#CB11AB]">{analytics.stats.totalRevenue.toLocaleString()} ₽</div>
            <div className="text-xs text-gray-400">Total Revenue</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black">{analytics.stats.totalOrders}</div>
            <div className="text-xs text-gray-400">Total Orders</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black">{analytics.stats.totalUsers}</div>
            <div className="text-xs text-gray-400">Total Users</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black">{analytics.stats.totalVendors}</div>
            <div className="text-xs text-gray-400">Vendors</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-black">{analytics.stats.averageOrderValue.toLocaleString()} ₽</div>
            <div className="text-xs text-gray-400">Avg Order</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['overview', 'users', 'vendors', 'orders', 'products'] as const).map(tab => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Orders by Status */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="font-bold mb-3">Orders by Status</h3>
            <div className="space-y-2">
              {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-sm">{status}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(status)}`}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="font-bold mb-3">Top Products</h3>
            <div className="space-y-2">
              {analytics.topProducts?.map((product: any) => (
                <div key={product.id} className="flex items-center gap-2">
                  <span className="text-2xl">{product.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium truncate">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.soldCount?.toLocaleString()} sold</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold mb-3">All Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2">Name</th>
                  <th className="text-left py-2 px-2">Email</th>
                  <th className="text-left py-2 px-2">Role</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-100">
                    <td className="py-2 px-2">{u.name}</td>
                    <td className="py-2 px-2">{u.email}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'VENDOR' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{u.role}</span>
                    </td>
                    <td className="py-2 px-2">
                      {u.role !== 'ADMIN' && (
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded px-2 py-1"
                        >
                          <option value="USER">USER</option>
                          <option value="VENDOR">VENDOR</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold mb-3">Vendor Applications</h3>
          <div className="space-y-3">
            {vendors.map(v => (
              <div key={v.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏪</span>
                  <div>
                    <div className="font-bold">{v.storeName}</div>
                    <div className="text-xs text-gray-400">
                      {v.productsCount} products · {v.ordersCount} orders · ★ {v.rating}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleApproveVendor(v.id, !v.approved)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                    v.approved ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {v.approved ? 'Revoke' : 'Approve'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold mb-3">All Orders</h3>
          <div className="space-y-2">
            {orders.map(order => (
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
            ))}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold mb-3">All Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map(product => (
              <div key={product.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="text-3xl mb-2">{product.emoji}</div>
                <div className="text-sm font-medium truncate">{product.name}</div>
                <div className="text-xs text-gray-400">{product.brand}</div>
                <div className="text-sm font-bold text-[#CB11AB]">{product.price.toLocaleString()} ₽</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}