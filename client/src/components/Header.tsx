'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import SideMenu from './SideMenu';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCartStore();
  const { isAuthenticated, user, logout } = useUserStore();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1c1032] text-[#ccc] text-[11px] py-1 px-5 flex justify-between items-center flex-wrap gap-1">
        <div>
          <Link href="/seller" className="text-[#bbb] hover:text-white mx-1.5 cursor-pointer">Sell on WB</Link>
          <span className="text-[#bbb] mx-1.5 cursor-pointer">Advertising</span>
          <span className="text-[#bbb] mx-1.5 cursor-pointer">Franchise</span>
          <span className="text-[#bbb] mx-1.5 cursor-pointer">Pickup Points</span>
          <span className="text-[#bbb] mx-1.5 cursor-pointer">Careers</span>
        </div>
        <span style={{ color: '#f9d8f5', fontWeight: 700 }}>Sale up to 70% — Today only!</span>
        <div className="flex gap-3 items-center">
          <span className="cursor-pointer">RUB ▼</span>
          <span className="cursor-pointer"> RU</span>
          <span className="cursor-pointer">Download App</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#CB11AB] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-5 py-1.5 flex items-center gap-2.5">
          <div className="text-[#f9d8f5] text-xs flex items-center gap-1.5 mr-1">
            <span>📍</span>
            <span>Cairo</span>
          </div>
          <Link href="/" className="text-white text-xl font-black cursor-pointer whitespace-nowrap tracking-tight">
            wild<b className="italic">berries</b>
          </Link>
          <button 
            className="bg-[rgba(255,255,255,0.2)] border-none text-white rounded-lg py-2 px-3 cursor-pointer text-lg flex-shrink-0"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
          <form onSubmit={handleSearch} className="flex-1 flex rounded-lg overflow-hidden max-w-[800px]">
            <input
              type="text"
              placeholder="Find on Wildberries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none px-4 py-2.5 text-sm"
            />
            <button type="button" className="bg-[#eee] border-none px-3 text-base cursor-pointer">📷</button>
          </form>
          <div className="flex gap-1 ml-auto">
            <Link href="/profile" className="bg-[rgba(255,255,255,0.15)] border-none text-white py-1.5 px-3.5 rounded-lg cursor-pointer text-xs whitespace-nowrap flex flex-col items-center gap-0.5">
              <span className="text-lg">📍</span>
              <span>Addresses</span>
            </Link>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link href="/admin/dashboard" className="bg-[rgba(255,255,255,0.15)] border-none text-white py-1.5 px-3.5 rounded-lg cursor-pointer text-xs whitespace-nowrap flex flex-col items-center gap-0.5">
                <span className="text-lg">⚙️</span>
                <span>Admin</span>
              </Link>
            )}
            {isAuthenticated && (user?.role === 'VENDOR' || user?.role === 'ADMIN') && (
              <Link href="/seller" className="bg-[rgba(255,255,255,0.15)] border-none text-white py-1.5 px-3.5 rounded-lg cursor-pointer text-xs whitespace-nowrap flex flex-col items-center gap-0.5">
                <span className="text-lg">🏪</span>
                <span>Seller</span>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="bg-[rgba(255,255,255,0.15)] border-none text-white py-1.5 px-3.5 rounded-lg cursor-pointer text-xs whitespace-nowrap flex flex-col items-center gap-0.5">
                <span className="text-lg">👤</span>
                <span>{user?.name || 'Profile'}</span>
              </div>
            ) : (
              <Link href="/auth" className="bg-[rgba(255,255,255,0.15)] border-none text-white py-1.5 px-3.5 rounded-lg cursor-pointer text-xs whitespace-nowrap flex flex-col items-center gap-0.5">
                <span className="text-lg">👤</span>
                <span>Sign In</span>
              </Link>
            )}
            <Link href="/cart" className="bg-[rgba(255,255,255,0.15)] border-none text-white py-1.5 px-3.5 rounded-lg cursor-pointer text-xs whitespace-nowrap flex flex-col items-center gap-0.5 relative">
              <span className="text-lg">🛒</span>
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff6b00] text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-[#1c1032] px-5 flex gap-0 overflow-x-auto scrollbar-hidden">
          <Link href="/catalog?category=Women" className="text-[#ff91e7] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-[#ff91e7]">Wibes</Link>
          <Link href="/catalog?category=Electronics" className="text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-transparent hover:text-white hover:border-[#CB11AB]">Electronics</Link>
          <Link href="/catalog?category=Men" className="text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-transparent hover:text-white hover:border-[#CB11AB]">Men</Link>
          <Link href="/catalog?category=Kids" className="text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-transparent hover:text-white hover:border-[#CB11AB]">Kids</Link>
          <Link href="/catalog?category=Home" className="text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-transparent hover:text-white hover:border-[#CB11AB]">Home</Link>
          <Link href="/catalog?category=Beauty" className="text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-transparent hover:text-white hover:border-[#CB11AB]">Beauty</Link>
          <Link href="/catalog?category=Sports" className="text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-transparent hover:text-white hover:border-[#CB11AB]">Sports</Link>
          <Link href="/catalog?category=Footwear" className="text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-transparent hover:text-white hover:border-[#CB11AB]">Footwear</Link>
          <Link href="/catalog" className="ml-auto text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap">CASHBACK</Link>
          <Link href="/seller" className="text-[#ccc] text-xs py-2 px-3 cursor-pointer whitespace-nowrap border-b-2 border-transparent hover:text-white hover:border-[#CB11AB]">Work at WB</Link>
        </div>
      </div>

      {/* Category Bar */}
      <div className="bg-white border-b border-[#e8e8e8] flex overflow-x-auto px-5 scrollbar-hidden">
        <Link href="/" className="text-[#CB11AB] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap border-b-2 border-[#CB11AB]">Home</Link>
        <Link href="/catalog?category=Women" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Women</Link>
        <Link href="/catalog?category=Men" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Men</Link>
        <Link href="/catalog?category=Kids" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Kids</Link>
        <Link href="/catalog?category=Electronics" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Electronics</Link>
        <Link href="/catalog?category=Home" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Home & Garden</Link>
        <Link href="/catalog?category=Beauty" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Beauty</Link>
        <Link href="/catalog?category=Sports" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Sports</Link>
        <Link href="/catalog?category=Footwear" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Footwear</Link>
        <Link href="/catalog?category=Appliances" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Appliances</Link>
        <Link href="/catalog?category=Toys" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">Toys</Link>
        <Link href="/catalog" className="text-[#444] text-[13px] font-medium py-2.5 px-3.5 cursor-pointer whitespace-nowrap hover:text-[#CB11AB]">All Categories</Link>
      </div>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}