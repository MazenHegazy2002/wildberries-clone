'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { name: 'Women', icon: '👗', slug: 'Women' },
  { name: 'Men', icon: '👔', slug: 'Men' },
  { name: 'Kids', icon: '🧸', slug: 'Kids' },
  { name: 'Footwear', icon: '👟', slug: 'Footwear' },
  { name: 'Home', icon: '🏠', slug: 'Home' },
  { name: 'Beauty', icon: '💄', slug: 'Beauty' },
  { name: 'Electronics', icon: '📱', slug: 'Electronics' },
  { name: 'Toys', icon: '🧩', slug: 'Toys' },
  { name: 'Appliances', icon: '🍳', slug: 'Appliances' },
  { name: 'Sports', icon: '⚽', slug: 'Sports' },
  { name: 'Books', icon: '📚', slug: 'Books' },
  { name: 'Food', icon: '🥗', slug: 'Food' },
];

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-[rgba(0,0,0,0.45)] z-[500] ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      />
      
      {/* Side Menu */}
      <div className={`fixed top-0 left-0 w-[310px] h-full bg-white z-[501] overflow-y-auto transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="bg-[#CB11AB] px-5 py-4 flex items-center justify-between">
          <span className="text-white text-base font-bold">☰ Menu</span>
          <button onClick={onClose} className="bg-none border-none text-white text-xl cursor-pointer">✕</button>
        </div>

        <div className="bg-[#f9f9f9] px-5 py-2 text-[11px] font-bold text-[#888] uppercase tracking-wide">Special</div>
        <Link href="/" onClick={onClose} className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]">
          <span className="text-xl">🎁</span> WB Club Discounts
        </Link>
        <Link href="/catalog" onClick={onClose} className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]">
          <span className="text-xl">🎀</span> Gift Cards
        </Link>
        <Link href="/catalog?category=Beauty" onClick={onClose} className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]">
          <span className="text-xl">💄</span> Beauty
        </Link>
        <Link href="/catalog?category=Home" onClick={onClose} className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]">
          <span className="text-xl">🏠</span> Home & Garden
        </Link>
        <Link href="/catalog" onClick={onClose} className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]">
          <span className="text-xl">✅</span> Brands
        </Link>
        <Link href="/catalog" onClick={onClose} className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]">
          <span className="text-xl">✈️</span> Travel
        </Link>

        <div className="bg-[#f9f9f9] px-5 py-2 text-[11px] font-bold text-[#888] uppercase tracking-wide">Categories</div>
        {categories.map((cat) => (
          <Link 
            key={cat.slug}
            href={`/catalog?category=${cat.slug}`}
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]"
          >
            <span className="text-xl">{cat.icon}</span> {cat.name}
            <span className="ml-auto text-[#bbb]">›</span>
          </Link>
        ))}

        <div className="bg-[#f9f9f9] px-5 py-2 text-[11px] font-bold text-[#888] uppercase tracking-wide">More</div>
        <Link href="/seller" onClick={onClose} className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]">
          <span className="text-xl">🏪</span> Become a Seller
        </Link>
        <Link href="/catalog" onClick={onClose} className="flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-[#f5f5f5] text-sm text-[#333] hover:bg-[#fdf0fb]">
          <span className="text-xl">🎯</span> Promotions
        </Link>
      </div>
    </>
  );
}