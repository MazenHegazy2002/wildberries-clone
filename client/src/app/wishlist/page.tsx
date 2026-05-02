'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';
import { WishlistItem, Product } from '@/types';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await api.removeFromWishlist(id);
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
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

  if (wishlist.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <h2 className="text-xl font-bold mb-3">Wishlist</h2>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-lg font-bold text-gray-600 mb-2">Wishlist is empty</h3>
          <p className="text-gray-400 mb-4">Save items you love</p>
          <Link href="/catalog" className="inline-block bg-[#CB11AB] text-white px-6 py-3 rounded-lg font-bold">
            Browse Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      <h2 className="text-xl font-bold mb-3">Wishlist</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {wishlist.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-3 border border-gray-100">
            <div className="w-full h-24 bg-gray-50 rounded-lg flex items-center justify-center text-4xl mb-2">
              {item.product?.emoji || '📦'}
            </div>
            <div className="text-[11px] text-gray-400">{item.product?.brand}</div>
            <div className="text-sm font-medium mb-1 line-clamp-2">{item.product?.name}</div>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-base font-bold text-[#CB11AB]">{item.product?.price?.toLocaleString()} ₽</span>
              {item.product?.oldPrice && (
                <span className="text-xs text-gray-400 line-through">{item.product.oldPrice.toLocaleString()} ₽</span>
              )}
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => item.product && handleAddToCart(item.product)}
                className="flex-1 bg-[#CB11AB] text-white text-xs py-2 rounded-lg font-bold"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => handleRemove(item.id)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-gray-400"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}