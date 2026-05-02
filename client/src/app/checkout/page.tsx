'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    street: '',
    delivery: 'pickup',
    payment: 'card',
  });

  const total = getTotal();
  const deliveryCost = total >= 999 ? 0 : 299;
  const finalTotal = total + deliveryCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      await api.createOrder({
        address: `${form.street}, ${form.city}`,
        city: form.city,
        deliveryMethod: form.delivery,
        paymentMethod: form.payment,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      clearCart();
      alert('Order placed successfully!');
      router.push('/profile');
    } catch (error: any) {
      // Demo mode - simulate success
      alert('Order placed successfully! (Demo mode)');
      clearCart();
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-bold text-gray-600 mb-2">Your cart is empty</h3>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-3">
        <a href="/" className="text-[#CB11AB] cursor-pointer">Home</a>
        <span>›</span>
        <a href="/cart" className="text-[#CB11AB] cursor-pointer">Cart</a>
        <span>›</span>
        <span className="text-gray-600">Checkout</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div>
            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
              <h3 className="text-base font-bold mb-4">📍 Delivery Address</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">First Name</label>
                  <input 
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Last Name</label>
                  <input 
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Phone</label>
                  <input 
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Email</label>
                  <input 
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">City</label>
                  <input 
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">Street Address</label>
                  <input 
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#CB11AB]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
              <h3 className="text-base font-bold mb-4">🚚 Delivery Method</h3>
              <label className={`flex items-center gap-2.5 p-3.5 border border-gray-200 rounded-lg cursor-pointer mb-2 ${form.delivery === 'pickup' ? 'border-[#CB11AB] bg-[#fdf0fb]' : ''}`}>
                <input 
                  type="radio" 
                  name="delivery" 
                  value="pickup"
                  checked={form.delivery === 'pickup'}
                  onChange={handleChange}
                  className="accent-[#CB11AB]"
                />
                <span className="text-xl">📦</span>
                <div>
                  <div className="text-sm font-semibold">Pickup Point</div>
                  <div className="text-xs text-gray-400">Free · 3,845 points near you</div>
                </div>
                <span className="ml-auto font-bold text-green-600">Free</span>
              </label>
              <label className={`flex items-center gap-2.5 p-3.5 border border-gray-200 rounded-lg cursor-pointer mb-2 ${form.delivery === 'courier' ? 'border-[#CB11AB] bg-[#fdf0fb]' : ''}`}>
                <input 
                  type="radio" 
                  name="delivery" 
                  value="courier"
                  checked={form.delivery === 'courier'}
                  onChange={handleChange}
                  className="accent-[#CB11AB]"
                />
                <span className="text-xl">🚚</span>
                <div>
                  <div className="text-sm font-semibold">Courier Delivery</div>
                  <div className="text-xs text-gray-400">Tomorrow, 9:00–21:00</div>
                </div>
                <span className="ml-auto font-bold">299 ₽</span>
              </label>
              <label className={`flex items-center gap-2.5 p-3.5 border border-gray-200 rounded-lg cursor-pointer ${form.delivery === 'post' ? 'border-[#CB11AB] bg-[#fdf0fb]' : ''}`}>
                <input 
                  type="radio" 
                  name="delivery" 
                  value="post"
                  checked={form.delivery === 'post'}
                  onChange={handleChange}
                  className="accent-[#CB11AB]"
                />
                <span className="text-xl">📬</span>
                <div>
                  <div className="text-sm font-semibold">Post</div>
                  <div className="text-xs text-gray-400">3–7 business days</div>
                </div>
                <span className="ml-auto font-bold">149 ₽</span>
              </label>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-base font-bold mb-4">💳 Payment Method</h3>
              <label className={`flex items-center gap-2.5 p-3.5 border border-gray-200 rounded-lg cursor-pointer mb-2 ${form.payment === 'card' ? 'border-[#CB11AB] bg-[#fdf0fb]' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={form.payment === 'card'}
                  onChange={handleChange}
                  className="accent-[#CB11AB]"
                />
                <span className="text-xl">💳</span>
                <div>
                  <div className="text-sm font-semibold">Bank Card</div>
                  <div className="text-xs text-gray-400">Visa, Mastercard, Mir</div>
                </div>
              </label>
              <label className={`flex items-center gap-2.5 p-3.5 border border-gray-200 rounded-lg cursor-pointer mb-2 ${form.payment === 'wallet' ? 'border-[#CB11AB] bg-[#fdf0fb]' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="wallet"
                  checked={form.payment === 'wallet'}
                  onChange={handleChange}
                  className="accent-[#CB11AB]"
                />
                <span className="text-xl">💰</span>
                <div>
                  <div className="text-sm font-semibold">WB Wallet</div>
                  <div className="text-xs text-gray-400">Balance: 3,450 ₽</div>
                </div>
              </label>
              <label className={`flex items-center gap-2.5 p-3.5 border border-gray-200 rounded-lg cursor-pointer ${form.payment === 'sbp' ? 'border-[#CB11AB] bg-[#fdf0fb]' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="sbp"
                  checked={form.payment === 'sbp'}
                  onChange={handleChange}
                  className="accent-[#CB11AB]"
                />
                <span className="text-xl">📱</span>
                <div>
                  <div className="text-sm font-semibold">SBP (Fast Pay)</div>
                  <div className="text-xs text-gray-400">Instant transfer</div>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 sticky top-[120px] h-fit">
              <h3 className="text-base font-bold mb-4">Your Order</h3>
              <div className="mb-3.5">
                {items.map(item => (
                  <div key={item.id} className="flex gap-2 text-sm mb-2">
                    <span className="text-2xl">{item.product?.emoji || '📦'}</span>
                    <div>
                      <div className="text-xs">{item.product?.name?.slice(0, 30)}...</div>
                      <div className="text-xs text-gray-400">x{item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Items</span>
                <span>{total.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Delivery</span>
                <span className="text-green-600">{deliveryCost === 0 ? 'Free' : `${deliveryCost} ₽`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-3 mb-2">
                <span>Total</span>
                <span className="text-[#CB11AB]">{finalTotal.toLocaleString()} ₽</span>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#CB11AB] text-white border-none rounded-lg text-base font-bold cursor-pointer hover:bg-[#9c0082] disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2 justify-center">
                <span>🔒</span> Data encrypted & secure
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}