'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';
import { Product, Review } from '@/types';

const defaultProducts: Record<string, Product> = {
  '1': { id: '1', name: 'Electric Waffle Maker pro-847', brand: 'AHROR STORE', category: 'Appliances', subcategory: 'Kitchen Appliances', price: 621, oldPrice: 16450, discount: 96, rating: 4.8, reviewCount: 2567, soldCount: 34521, stock: 87, isSale: true, article: '677539715', model: 'pro-847', seller: 'AHROR STORE', sellerRating: 4.8, description: 'Electric waffle maker with non-stick coating for crispy Vienna-style waffles. Fast heating, easy cleaning, compact size. Perfect for quick breakfasts. Anti-burn surface.', specs: [['Article', '677539715'], ['Model', 'pro-847'], ['Power supply', 'Mains'], ['Power', '350 W'], ['Control', 'Mechanical'], ['Warranty', '12 months']], images: ['🧇', '🍽️', '⚡', '📦'], colors: ['Red', 'Black', 'White'], sizes: ['Standard'], emoji: '🧇' },
  '2': { id: '2', name: 'Samsung Galaxy S24 Ultra 256GB', brand: 'Samsung', category: 'Electronics', price: 89990, oldPrice: 112000, discount: 20, rating: 4.8, reviewCount: 1248, stock: 87, isSale: true, emoji: '📱', seller: 'Samsung Official', sellerRating: 4.9, description: 'Galaxy S24 Ultra with 200MP camera, S Pen, and AI features.' },
  '3': { id: '3', name: "Nike Air Max 270 Women's", brand: 'Nike', category: 'Footwear', price: 7490, oldPrice: 11990, discount: 38, rating: 4.6, reviewCount: 3421, stock: 145, isSale: true, emoji: '👟', seller: 'Nike Store', sellerRating: 4.7, description: 'Iconic Air Max with 270° Air unit for maximum comfort.' },
  '4': { id: '4', name: "Women's Summer Floral Dress", brand: 'Zara', category: 'Women', price: 2990, oldPrice: 4590, discount: 35, rating: 4.5, reviewCount: 892, stock: 234, isNew: true, emoji: '👗', seller: 'Zara Official', sellerRating: 4.6, description: 'Elegant floral dress perfect for summer occasions.' },
  '5': { id: '5', name: 'Apple MacBook Air M2 13"', brand: 'Apple', category: 'Electronics', price: 89990, oldPrice: 109000, discount: 17, rating: 4.9, reviewCount: 2134, stock: 42, isSale: true, emoji: '💻', seller: 'Apple Premium', sellerRating: 4.9, description: 'Supercharged by M2 chip. Fanless design. All-day battery life.' },
  '6': { id: '6', name: 'COSRX Korean Skincare Set', brand: 'COSRX', category: 'Beauty', price: 3490, oldPrice: 4999, discount: 30, rating: 4.7, reviewCount: 5621, stock: 320, isNew: true, emoji: '🧴', seller: 'Korean Beauty', sellerRating: 4.8, description: 'Complete 10-step Korean skincare routine for glowing skin.' },
  '7': { id: '7', name: 'Xiaomi Robot Vacuum S10+', brand: 'Xiaomi', category: 'Appliances', price: 29990, oldPrice: 39999, discount: 25, rating: 4.7, reviewCount: 3201, stock: 56, isSale: true, emoji: '🤖', seller: 'Xiaomi Official', sellerRating: 4.8, description: 'Smart robot vacuum with LDS navigation and auto-empty station.' },
  '8': { id: '8', name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", category: 'Men', price: 4290, oldPrice: 6999, discount: 39, rating: 4.6, reviewCount: 1876, stock: 98, isSale: true, emoji: '👖', seller: "Levi's Official", sellerRating: 4.7, description: 'Classic slim fit jeans with stretch comfort.' },
  '9': { id: '9', name: 'LEGO Technic Bugatti Chiron', brand: 'LEGO', category: 'Toys', price: 8990, oldPrice: 12490, discount: 28, rating: 4.9, reviewCount: 1245, stock: 67, isSale: true, emoji: '🧱', seller: 'LEGO Official', sellerRating: 4.9, description: 'Detailed replica of the Bugatti Chiron with moving parts.' },
  '10': { id: '10', name: 'Adidas Ultraboost 22', brand: 'Adidas', category: 'Sports', price: 9990, oldPrice: 14990, discount: 33, rating: 4.7, reviewCount: 2341, stock: 112, isSale: true, emoji: '🏃', seller: 'Adidas Store', sellerRating: 4.7, description: 'Premium running shoes with Boost cushioning technology.' },
  '11': { id: '11', name: 'Chanel N°5 EDP 100ml', brand: 'Chanel', category: 'Beauty', price: 18990, oldPrice: 24000, discount: 21, rating: 4.9, reviewCount: 4321, stock: 45, isSale: true, emoji: '🌸', seller: 'Chanel Boutique', sellerRating: 4.9, description: 'The iconic fragrance for women since 1921.' },
  '12': { id: '12', name: 'Cybex Balios S Lux Stroller', brand: 'Cybex', category: 'Kids', price: 54990, oldPrice: 74990, discount: 27, rating: 4.8, reviewCount: 678, stock: 18, isSale: true, emoji: '🍼', seller: 'Cybex Official', sellerRating: 4.8, description: 'Premium stroller with one-hand fold and all-terrain wheels.' },
};

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [activeTab, setActiveTab] = useState('desc');
  const { addItem } = useCartStore();

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    const id = params.id as string;
    try {
      const p = await api.getProductById(id);
      setProduct(p);
      
      const r = await api.getProductReviews(id);
      setReviews(r);
    } catch (error) {
      const p = defaultProducts[id];
      if (p) setProduct(p);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity);
      window.location.href = '/cart';
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="text-center">
          <div className="animate-spin text-3xl">⏳</div>
          <p className="text-gray-400 mt-2">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">Product not found</h2>
          <Link href="/catalog" className="text-[#CB11AB]">Back to catalog</Link>
        </div>
      </main>
    );
  }

  const images = product.images || [product.emoji || '📦'];
  const colors = product.colors || ['Default'];
  const sizes = product.sizes || ['Standard'];

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        <Link href="/" className="text-[#CB11AB]">Home</Link>
        <span>›</span>
        <Link href={`/catalog?category=${product.category}`} className="text-[#CB11AB]">{product.category}</Link>
        <span>›</span>
        <span className="text-gray-600">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          <div className="bg-white rounded-xl p-8 border border-gray-100 flex items-center justify-center text-[100px] mb-3">
            {images[selectedColor % images.length]}
          </div>
          <div className="flex gap-2">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedColor(idx)}
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl border-2 ${selectedColor === idx ? 'border-[#CB11AB]' : 'border-gray-100'}`}
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="text-xs text-gray-400 mb-1">
            {product.article && `Article: ${product.article}`} {product.model && `· Model: ${product.model}`}
          </div>
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex text-yellow-400 text-base">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="font-bold">{product.rating}</span>
            <span className="text-[#CB11AB] text-sm" onClick={() => setActiveTab('reviews')}>
              · {product.reviewCount?.toLocaleString() || 0} reviews
            </span>
            <span className="text-gray-400 text-xs">· {product.soldCount?.toLocaleString() || 0} sold</span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black text-[#CB11AB]">{product.price.toLocaleString()} ₽</span>
            {product.oldPrice && (
              <>
                <span className="text-gray-400 line-through text-sm">{product.oldPrice.toLocaleString()} ₽</span>
                <span className="text-green-600 font-bold text-sm">-{product.discount || Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
              </>
            )}
          </div>

          {product.discount && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold inline-block mb-3">
              ✓ Great price
            </span>
          )}

          {/* Colors */}
          {colors.length > 1 && colors[0] !== 'Default' && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-600 mb-2">Color:</div>
              <div className="flex gap-2">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`px-3 py-2 rounded-lg text-sm border ${selectedColor === idx ? 'border-[#CB11AB] bg-[#fdf0fb] text-[#CB11AB]' : 'border-gray-200'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 1 && sizes[0] !== 'Standard' && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-600 mb-2">Size:</div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(idx)}
                    className={`px-3 py-2 rounded-lg text-sm border ${selectedSize === idx ? 'border-[#CB11AB] bg-[#fdf0fb] text-[#CB11AB]' : 'border-gray-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 text-lg">−</button>
            <span className="font-bold text-lg min-w-[24px] text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-gray-200 text-lg">+</button>
            <span className="text-xs text-gray-400">In stock: {product.stock}</span>
          </div>

          <button onClick={handleAddToCart} className="w-full bg-[#CB11AB] text-white py-3.5 rounded-xl text-base font-bold mb-2">
            🛒 Add to Cart
          </button>
          <button onClick={handleBuyNow} className="w-full bg-[#fdf0fb] text-[#CB11AB] py-3 rounded-xl text-base font-bold border border-[#CB11AB] mb-2">
            Buy Now
          </button>
          <button className="w-full border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm mb-4">
            ❤️ Save to Wishlist
          </button>

          {/* Delivery */}
          <div className="bg-gray-50 rounded-lg p-3.5 mb-4">
            <div className="text-sm flex items-center gap-2.5 mb-2">
              <span>📦</span>
              <span><b>Tomorrow delivery</b> — free from 999 ₽</span>
            </div>
            <div className="text-sm flex items-center gap-2.5 mb-2">
              <span>🏪</span>
              <span>Pickup from <b>3,845</b> points</span>
            </div>
            <div className="text-sm flex items-center gap-2.5">
              <span>↩️</span>
              <span>Return within <b>21 days</b></span>
            </div>
          </div>

          {/* Seller */}
          <div className="border border-gray-100 rounded-lg p-3 flex items-center gap-2.5">
            <span className="text-2xl">🏪</span>
            <div>
              <div className="font-semibold text-sm">{product.seller}</div>
              <div className="text-xs text-gray-400">Seller rating: <span className="text-yellow-400">★</span> <b>{product.sellerRating}</b></div>
            </div>
            <Link href={`/catalog?seller=${product.seller}`} className="ml-auto text-[#CB11AB] text-xs">All products →</Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 mt-4">
        <div className="flex border-b-2 border-gray-100 overflow-x-auto">
          {['Description', 'Specs', 'Reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-5 py-3 text-sm font-medium ${activeTab === tab.toLowerCase() ? 'text-[#CB11AB] border-b-2 border-[#CB11AB]' : 'text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'desc' && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          )}

          {activeTab === 'specs' && product.specs && (
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-3 font-medium text-gray-600">{spec[0]}</td>
                    <td className="py-2 px-3">{spec[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center gap-5 mb-4">
                <div>
                  <div className="text-4xl font-black">{product.rating}</div>
                  <div className="flex text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</div>
                  <div className="text-xs text-gray-400">{product.reviewCount?.toLocaleString()} reviews</div>
                </div>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((review, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 bg-[#CB11AB] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.userName?.[0] || 'U'}
                        </div>
                        <div className="font-semibold text-sm">{review.userName}</div>
                        <div className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                          {review.isPinned && <span className="bg-[#fdf0fb] text-[#CB11AB] px-2 py-0.5 rounded-full">Pinned</span>}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex text-yellow-400 text-sm mb-1">{'★'.repeat(review.rating)}</div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">💬</div>
                  <div>No reviews yet</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}