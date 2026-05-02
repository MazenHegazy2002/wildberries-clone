'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="text-center py-16">
          <div className="text-3xl animate-spin">⏳</div>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <h2 className="text-xl font-bold mb-3">My Orders</h2>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-gray-600 mb-2">No orders yet</h3>
          <p className="text-gray-400 mb-4">Your orders will appear here</p>
          <Link href="/catalog" className="inline-block bg-[#CB11AB] text-white px-6 py-3 rounded-lg font-bold">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      <h2 className="text-xl font-bold mb-3">My Orders</h2>
      
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-gray-400">Order #</span>
                <span className="font-bold ml-1">{order.id.slice(-8)}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              {order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center text-2xl">
                    {item.product?.emoji || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.product?.name}</div>
                    <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-bold">{item.price.toLocaleString()} ₽</div>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="text-xs text-gray-400">+{order.items.length - 3} more items</div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-sm">
                <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-lg font-bold text-[#CB11AB]">
                {order.total.toLocaleString()} ₽
              </div>
            </div>
            
            <Link 
              href={`/orders/${order.id}`}
              className="block text-center mt-3 py-2 border border-[#CB11AB] text-[#CB11AB] rounded-lg text-sm font-bold"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}