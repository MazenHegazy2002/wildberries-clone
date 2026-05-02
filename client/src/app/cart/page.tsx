'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const total = getTotal();
  const discount = promoApplied ? total * 0.1 : 0;
  const delivery = total >= 999 ? 0 : 299;
  const finalTotal = total - discount + delivery;

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = items.find(i => i.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + delta);
    }
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <h2 className="text-xl font-bold mb-3">Shopping Cart</h2>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-bold text-gray-600 mb-2">Your cart is empty</h3>
          <p className="text-gray-400 mb-4">Browse our catalog to find products</p>
          <Link href="/catalog" className="inline-block bg-[#CB11AB] text-white px-6 py-3 rounded-lg font-bold">
            Go to Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      <h2 className="text-xl font-bold mb-3">Shopping Cart</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Cart Items */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">{items.length} items</h3>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#CB11AB]" />
              Select all
            </label>
          </div>

          {items.map(item => (
            <div key={item.id} className="flex gap-3.5 py-4 border-b border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                {item.product?.emoji || '📦'}
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-gray-400">{item.product?.brand}</div>
                <div className="text-sm font-medium mb-1">{item.product?.name}</div>
                <div className="text-xs text-gray-400 mb-2">
                  {item.product?.colors?.[0] || 'Default'} / {item.product?.sizes?.[0] || 'Standard'}
                </div>
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => handleQuantityChange(item.productId, -1)}
                    className="bg-gray-100 border border-gray-200 rounded-md w-8 h-8 cursor-pointer text-base flex items-center justify-center hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="text-base font-bold w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.productId, 1)}
                    className="bg-gray-100 border border-gray-200 rounded-md w-8 h-8 cursor-pointer text-base flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-base font-bold text-[#CB11AB]">
                  {((item.product?.price || 0) * item.quantity).toLocaleString()} ₽
                </span>
                {item.product?.oldPrice && (
                  <span className="text-[11px] text-gray-400 line-through">
                    {((item.product.oldPrice) * item.quantity).toLocaleString()} ₽
                  </span>
                )}
                <button 
                  onClick={() => removeItem(item.productId)}
                  className="bg-none border-none text-xs text-gray-400 cursor-pointer hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 sticky top-[120px] h-fit">
          <h3 className="text-base font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between text-sm mb-2.5">
            <span>Items ({items.length})</span>
            <span>{total.toLocaleString()} ₽</span>
          </div>
          <div className="flex justify-between text-sm mb-2.5">
            <span>Discount</span>
            <span className="text-green-600">{promoApplied ? `-${discount.toLocaleString()} ₽` : '—'}</span>
          </div>
          <div className="flex justify-between text-sm mb-2.5">
            <span>Delivery</span>
            <span className="text-green-600">{delivery === 0 ? 'Free' : `${delivery} ₽`}</span>
          </div>
          <div className="flex gap-2 mb-3.5">
            <input 
              type="text" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo code"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#CB11AB]"
            />
            <button 
              onClick={applyPromo}
              className="bg-[#CB11AB] text-white border-none rounded-lg px-4 py-2 text-xs cursor-pointer"
            >
              Apply
            </button>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-3 mb-2">
            <span>Total</span>
            <span className="text-[#CB11AB]">{finalTotal.toLocaleString()} ₽</span>
          </div>
          <Link 
            href="/checkout"
            className="block w-full py-4 bg-[#CB11AB] text-white border-none rounded-lg text-base font-bold text-center cursor-pointer hover:bg-[#9c0082]"
          >
            Checkout →
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2 justify-center">
            <span>🔒</span> Secure payment guaranteed
          </div>
        </div>
      </div>
    </main>
  );
}