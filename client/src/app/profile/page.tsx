'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Address } from '@/types';

interface ProfilePageProps {}

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      setName(userData.name || '');
      setPhone(userData.phone || '');
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await api.updateProfile({ name, phone });
      setUser(updated);
      alert('Profile updated!');
    } catch (error) {
      alert('Failed to update profile');
    }
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

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-4">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-5">
        {/* Sidebar */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="w-16 h-16 bg-[#CB11AB] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="text-center font-bold mb-1">{user?.name || 'User'}</div>
          <div className="text-center text-xs text-gray-400 mb-4">{user?.phone || 'No phone'}</div>
          
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-2 py-2 rounded-lg text-sm flex items-center gap-2.5 ${activeTab === 'orders' ? 'bg-[#fdf0fb] text-[#CB11AB]' : ''}`}
            >
              <span>📦</span> My Orders
            </button>
            <button 
              onClick={() => { setActiveTab('addresses'); loadAddresses(); }}
              className={`w-full text-left px-2 py-2 rounded-lg text-sm flex items-center gap-2.5 ${activeTab === 'addresses' ? 'bg-[#fdf0fb] text-[#CB11AB]' : ''}`}
            >
              <span>📍</span> Addresses
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-2 py-2 rounded-lg text-sm flex items-center gap-2.5 ${activeTab === 'settings' ? 'bg-[#fdf0fb] text-[#CB11AB]' : ''}`}
            >
              <span>⚙️</span> Settings
            </button>
            <Link href="/wishlist" className="w-full text-left px-2 py-2 rounded-lg text-sm flex items-center gap-2.5">
              <span>❤️</span> Wishlist
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          {activeTab === 'orders' && (
            <div>
              <h3 className="font-bold mb-3">My Orders</h3>
              <Link href="/orders" className="block text-center py-8 border border-gray-100 rounded-lg">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-gray-400 text-sm">View all orders</div>
              </Link>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h3 className="font-bold mb-3">My Addresses</h3>
              {addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">📍</div>
                  <div>No addresses yet</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map(addr => (
                    <div key={addr.id} className="p-3 border border-gray-100 rounded-lg">
                      <div className="font-bold">{addr.type}</div>
                      <div className="text-sm text-gray-400">{addr.city}, {addr.street} {addr.building}</div>
                      {addr.apartment && <div className="text-sm text-gray-400">Apt: {addr.apartment}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="font-bold mb-3">Account Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ''}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
                  />
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="w-full bg-[#CB11AB] text-white py-2 rounded-lg font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;