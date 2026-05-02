'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/types';

const defaultProducts: Product[] = [
  { id: '1', name: 'Electric Waffle Maker pro-847', brand: 'AHROR STORE', category: 'Appliances', price: 621, oldPrice: 16450, rating: 4.8, reviewCount: 2567, stock: 87, isSale: true, emoji: '🧇', description: 'Electric waffle maker with non-stick coating' },
  { id: '2', name: 'Samsung Galaxy S24 Ultra 256GB', brand: 'Samsung', category: 'Electronics', price: 89990, oldPrice: 112000, rating: 4.8, reviewCount: 1248, stock: 87, isSale: true, emoji: '📱' },
  { id: '3', name: "Nike Air Max 270 Women's", brand: 'Nike', category: 'Footwear', price: 7490, oldPrice: 11990, rating: 4.6, reviewCount: 3421, stock: 145, isSale: true, emoji: '👟' },
  { id: '4', name: "Women's Summer Floral Dress", brand: 'Zara', category: 'Women', price: 2990, oldPrice: 4590, rating: 4.5, reviewCount: 892, stock: 234, isNew: true, emoji: '👗' },
  { id: '5', name: 'Apple MacBook Air M2 13"', brand: 'Apple', category: 'Electronics', price: 89990, oldPrice: 109000, rating: 4.9, reviewCount: 2134, stock: 42, isSale: true, emoji: '💻' },
  { id: '6', name: 'COSRX Korean Skincare Set', brand: 'COSRX', category: 'Beauty', price: 3490, oldPrice: 4999, rating: 4.7, reviewCount: 5621, stock: 320, isNew: true, emoji: '🧴' },
  { id: '7', name: 'Xiaomi Robot Vacuum S10+', brand: 'Xiaomi', category: 'Appliances', price: 29990, oldPrice: 39999, rating: 4.7, reviewCount: 3201, stock: 56, isSale: true, emoji: '🤖' },
  { id: '8', name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", category: 'Men', price: 4290, oldPrice: 6999, rating: 4.6, reviewCount: 1876, stock: 98, isSale: true, emoji: '👖' },
  { id: '9', name: 'LEGO Technic Bugatti Chiron', brand: 'LEGO', category: 'Toys', price: 8990, oldPrice: 12490, rating: 4.9, reviewCount: 1245, stock: 67, isSale: true, emoji: '🧱' },
  { id: '10', name: 'Adidas Ultraboost 22', brand: 'Adidas', category: 'Sports', price: 9990, oldPrice: 14990, rating: 4.7, reviewCount: 2341, stock: 112, isSale: true, emoji: '🏃' },
  { id: '11', name: 'Chanel N°5 EDP 100ml', brand: 'Chanel', category: 'Beauty', price: 18990, oldPrice: 24000, rating: 4.9, reviewCount: 4321, stock: 45, isSale: true, emoji: '🌸' },
  { id: '12', name: 'Cybex Balios S Lux Stroller', brand: 'Cybex', category: 'Kids', price: 54990, oldPrice: 74990, rating: 4.8, reviewCount: 678, stock: 18, isSale: true, emoji: '🍼' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts({ limit: 12 });
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (error) {
      console.log('Using default products (API not available)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-8">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2d0045] via-[#CB11AB] to-[#ff91e7] rounded-xl h-60 flex items-center px-10 mb-8 cursor-pointer relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-white text-3xl font-extrabold mb-2">Wildberries Anniversary Sale</h1>
          <p className="text-pink-100 text-base mb-4">Up to 90% off on all categories. Limited time offer!</p>
          <button className="bg-white text-[#CB11AB] px-6 py-2 rounded-full font-bold text-sm">Shop Now</button>
        </div>
        <div className="absolute right-10 text-[110px] opacity-25 select-none">🎁</div>
      </section>

      {/* Promo Grid */}
      <section className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl p-5 h-28 flex flex-col justify-between cursor-pointer text-white">
          <h3 className="font-bold">Electronics</h3>
          <p className="text-xs opacity-70">Smartphones, laptops</p>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold inline-block w-fit">Up to -50%</span>
        </div>
        <div className="bg-gradient-to-br from-[#CB11AB] to-[#8B0063] rounded-xl p-5 h-28 flex flex-col justify-between cursor-pointer text-white">
          <h3 className="font-bold">Fashion</h3>
          <p className="text-xs opacity-70">Spring-Summer collection</p>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold inline-block w-fit">New</span>
        </div>
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl p-5 h-28 flex flex-col justify-between cursor-pointer text-white">
          <h3 className="font-bold">Home Appliances</h3>
          <p className="text-xs opacity-70">Kitchen essentials</p>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold inline-block w-fit">-30%</span>
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recommended for You</h2>
          <a href="/catalog" className="text-[#CB11AB] text-sm cursor-pointer">View all</a>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-2xl">⏳</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Popular Categories</h2>
          <a href="/catalog" className="text-[#CB11AB] text-sm cursor-pointer">All</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Women', icon: '👗', count: '2.4M' },
            { name: 'Men', icon: '👔', count: '1.8M' },
            { name: 'Kids', icon: '🧸', count: '1.2M' },
            { name: 'Electronics', icon: '📱', count: '890K' },
            { name: 'Home', icon: '🏠', count: '1.5M' },
            { name: 'Beauty', icon: '💄', count: '980K' },
          ].map((cat) => (
            <a key={cat.name} href={`/catalog?category=${cat.name}`} className="bg-white rounded-xl p-4 text-center cursor-pointer border border-gray-100 hover:border-[#CB11AB] transition-colors">
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium">{cat.name}</div>
              <div className="text-xs text-gray-400">{cat.count} products</div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}