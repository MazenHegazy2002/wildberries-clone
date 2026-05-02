import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1c1032] text-[#999] py-8 px-5 mt-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <h4 className="text-white text-[13px] font-bold mb-3">Shop</h4>
          <Link href="/catalog?category=Women" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Women</Link>
          <Link href="/catalog?category=Men" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Men</Link>
          <Link href="/catalog?category=Kids" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Kids</Link>
          <Link href="/catalog?category=Electronics" className="block text-[12px] text-[#882] mb-1.5 cursor-pointer hover:text-white">Electronics</Link>
          <Link href="/catalog?category=Home" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Home</Link>
        </div>
        <div className="col-span-1">
          <h4 className="text-white text-[13px] font-bold mb-3">Help</h4>
          <Link href="/profile" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">My Orders</Link>
          <Link href="/profile" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Returns</Link>
          <Link href="/profile" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Delivery</Link>
          <Link href="/profile" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Payment</Link>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Support</span>
        </div>
        <div className="col-span-1">
          <h4 className="text-white text-[13px] font-bold mb-3">Company</h4>
          <Link href="/seller" className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Sell on WB</Link>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">About Us</span>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Careers</span>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Press</span>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Contacts</span>
        </div>
        <div className="col-span-1">
          <h4 className="text-white text-[13px] font-bold mb-3">Follow Us</h4>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">VKontakte</span>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Telegram</span>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">YouTube</span>
          <span className="block text-[12px] text-[#888] mb-1.5 cursor-pointer hover:text-white">Instagram</span>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-5 pt-4 border-t border-[#2a2a3a] flex items-center justify-between text-[11px] text-[#555] flex-wrap gap-2">
        <span>© 2024 WildBerries Clone. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className="cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}