'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadOrder(params.id as string);
    }
  }, [params.id]);

  const loadOrder = async (id: string) => {
    try {
      const data = await api.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
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

  const getStatusSteps = (status: string) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      name: step,
      complete: index <= currentIndex,
      current: index === currentIndex,
    }));
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

  if (!order) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <h2 className="text-xl font-bold mb-3">Order Not Found</h2>
        <Link href="/orders" className="text-[#CB11AB]">Back to Orders</Link>
      </main>
    );
  }

  const statusSteps = getStatusSteps(order.status);

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
        <Link href="/" className="text-[#CB11AB]">Home</Link>
        <span>›</span>
        <Link href="/orders" className="text-[#CB11AB]">Orders</Link>
        <span>›</span>
        <span className="text-gray-600">#{order.id.slice(-8)}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-gray-400">Order #</span>
          <span className="font-bold ml-1 text-lg">{order.id.slice(-8)}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Status Progress */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.name} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.complete ? 'bg-[#CB11AB] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.complete ? '✓' : index + 1}
                </div>
                <span className={`text-xs mt-1 ${step.complete ? 'text-[#CB11AB]' : 'text-gray-400'}`}>
                  {step.name}
                </span>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`w-12 h-0.5 mx-1 ${step.complete ? 'bg-[#CB11AB]' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <h3 className="font-bold mb-3">Items</h3>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center text-3xl">
                {item.product?.emoji || '📦'}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.product?.name}</div>
                <div className="text-xs text-gray-400">
                  {item.product?.brand} · Qty: {item.quantity}
                  {item.color && ` · ${item.color}`}
                  {item.size && ` · ${item.size}`}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{(item.price * item.quantity).toLocaleString()} ₽</div>
                <div className="text-xs text-gray-400">{item.price.toLocaleString()} ₽ each</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <h3 className="font-bold mb-3">Delivery</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Method</span>
            <span>{order.deliveryMethod || 'Pickup Point'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">City</span>
            <span>{order.city || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Address</span>
            <span>{order.address || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <h3 className="font-bold mb-3">Payment</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Method</span>
            <span>{order.paymentMethod || 'Card'}</span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold text-[#CB11AB]">{order.total.toLocaleString()} ₽</span>
        </div>
      </div>
    </main>
  );
}