'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import api from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const isInCart = items.some(item => item.productId === product.id);
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    addItem(product, 1);
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!isWishlisted) {
        await api.addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.log('Wishlist requires login');
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-xl border border-gray-100 cursor-pointer overflow-hidden relative group hover:shadow-xl transition-all duration-300">
        {/* Badges */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded z-10">
            -{discount}%
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded z-10">
            NEW
          </div>
        )}
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full border border-gray-100 hover:bg-white z-10 transition-colors"
          title="Add to wishlist"
        >
          <Heart 
            className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`} 
          />
        </button>

        {/* Product Image Placeholder */}
        <div className="w-full h-44 bg-gray-50 flex items-center justify-center text-6xl">
          {product.emoji || '📦'}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <div className="text-[11px] text-gray-400 mb-1 leading-none">{product.brand}</div>
          <div className="text-xs font-medium line-clamp-2 h-8 mb-2 group-hover:text-[#CB11AB] transition-colors">
            {product.name}
          </div>
          
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-base font-extrabold text-[#CB11AB]">
              {product.price.toLocaleString('en')} ₽
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {product.oldPrice.toLocaleString('en')} ₽
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <span className="text-yellow-400">★</span>
            <span className="font-bold text-gray-600">{product.rating}</span>
            <span>· {product.reviewCount?.toLocaleString('en') || 0} reviews</span>
          </div>
        </div>

        {/* Hover Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-2 bg-gray-50 text-[11px] font-bold border-t border-gray-100 flex items-center justify-center gap-2 hover:bg-[#CB11AB] hover:text-white transition-all disabled:opacity-50"
        >
          <ShoppingCart className="w-3 h-3" />
          {isAddingToCart ? 'Added!' : isInCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;