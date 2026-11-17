import React, { useState } from 'react';
import { Heart, Package, Truck, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';

export function WishlistPage() {
  const { wishlist, navigate } = useStore();
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <main className="bg-[#FAFBF9] min-h-screen pb-20">
      <div className="bg-[#0A2540] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-white">Saved Wishlist</h1>
          <p className="text-sm text-[#CBD5E1] mt-1">
            Clinical essentials saved for your next rotation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {savedProducts.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-lg mx-auto mt-6">
            <Heart className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <h2 className="text-2xl font-semibold text-[#0A2540] mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-[#64748B] mb-6">
              Tap the heart icon on any scrub, lab coat, or stethoscope to save it here.
            </p>
            <button
              type="button"
              onClick={() => navigate('shop', { category: '' })}
              className="px-6 py-3 bg-[#0A2540] text-white text-sm font-semibold rounded-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export function AccountPage() {
  const { orders, wishlist, navigate, showToast } = useStore();
  const [name, setName] = useState('Dr. Priya Sharma');
  const [specialty, setSpecialty] = useState('Critical Care & ICU');
  const [hospital, setHospital] = useState('Apollo Hospitals, Bengaluru');
  const [email, setEmail] = useState('dr.priya.sharma@apollohospitals.org');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Clinician profile preferences saved');
  };

  return (
    <main className="bg-[#FAFBF9] min-h-screen pb-20">
      <div className="bg-[#0A2540] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">{name}</h1>
              <p className="text-sm text-[#CBD5E1]">
                {specialty} · {hospital}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs tabular-nums">
            <div className="px-4 py-2 rounded-lg bg-white/10">
              <div className="text-[#93C5FD]">Orders</div>
              <div className="text-base font-bold text-white">{orders.length}</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/10">
              <div className="text-[#93C5FD]">Saved Items</div>
              <div className="text-base font-bold text-white">{wishlist.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Preferences */}
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-[#0A2540] font-sans pb-3 border-b border-[#E2E8F0]">
            Clinician Profile &amp; Embroidery Defaults
          </h2>
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Department / Specialty
            </label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Hospital / Medical College
            </label>
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Save Profile
          </button>
        </form>

        {/* Past Orders */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#0A2540]">Order History</h2>
            <button
              type="button"
              onClick={() => navigate('track')}
              className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Shipment</span>
            </button>
          </div>

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-sm font-bold text-[#0A2540] tabular-nums">
                    {order.id}
                  </span>
                  <span className="text-xs text-[#64748B]">· {order.createdAt}</span>
                </div>
                <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-md">
                  {order.status}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#334155]">
                    <span>
                      {item.name} ({item.color}, {item.size}) × {item.qty}
                    </span>
                    <span className="font-semibold text-[#0A2540] tabular-nums">
                      ₹{((item.unitPrice + item.embroideryFee) * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                <span>Payment: {order.paymentMethod.toUpperCase()}</span>
                <span className="text-sm font-extrabold text-[#0A2540] tabular-nums">
                  Total: ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
