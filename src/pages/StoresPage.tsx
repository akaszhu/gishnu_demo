import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  Phone,
  Search,
  Sparkles,
} from 'lucide-react';
import { OFFLINE_STORES, StoreLocation } from '../data/stores';
import { useStore } from '../context/StoreContext';

export function StoresPage() {
  const { showToast, navigate } = useStore();
  const cities = ['All Cities', ...Array.from(new Set(OFFLINE_STORES.map((s) => s.city)))];

  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchText, setSearchText] = useState('');
  const [activeStore, setActiveStore] = useState<StoreLocation>(OFFLINE_STORES[0]);

  // Booking form state
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitDate, setVisitDate] = useState('2026-11-20');
  const [visitSlot, setVisitSlot] = useState('11:00 AM – 1:00 PM');
  const [visitItems, setVisitItems] = useState("ecoflex™ Scrub Set + Chief Lab Coat");
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const filteredStores = useMemo(() => {
    return OFFLINE_STORES.filter((store) => {
      const cityMatch = selectedCity === 'All Cities' || store.city === selectedCity;
      const q = searchText.trim().toLowerCase();
      const textMatch =
        !q ||
        store.city.toLowerCase().includes(q) ||
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.landmark.toLowerCase().includes(q) ||
        store.pinCode.includes(q);
      return cityMatch && textMatch;
    });
  }, [selectedCity, searchText]);

  const handleCopyAddress = (store: StoreLocation) => {
    const full = `${store.name}, ${store.address} (${store.pinCode})`;
    navigator.clipboard?.writeText(full).catch(() => {});
    showToast(`Copied ${store.city} store address`);
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitName.trim() || !visitPhone.trim()) {
      showToast('Please enter your name and mobile number to reserve a fitting.');
      return;
    }
    const ref = `FIT-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingRef(ref);
    showToast(`Fitting reserved at ${activeStore.city} (${ref})`);
  };

  return (
    <main className="bg-[#FAFBF9] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-[#0A2540] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#93C5FD] mb-2">
              Offline Experience Centres
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-white">
              Visit Trade Meds Near Your Hospital
            </h1>
            <p className="text-sm text-[#CBD5E1] mt-2 max-w-2xl">
              Try ecoflex™ stretch fabrics in person, test 6sense stethoscopes in our acoustic booth, or pick up same-day embroidered uniforms across 8 cities.
            </p>
          </div>
          <div className="text-xs text-[#CBD5E1] tabular-nums bg-white/10 px-4 py-3 rounded-xl shrink-0">
            <div className="font-bold text-white text-base">8 Locations Pan-India</div>
            <div>Walk-ins welcome · Open 7 days</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* City Filter & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setSelectedCity(city);
                  const first = OFFLINE_STORES.find(
                    (s) => city === 'All Cities' || s.city === city
                  );
                  if (first) {
                    setActiveStore(first);
                    setBookingRef(null);
                  }
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  selectedCity === city
                    ? 'bg-[#0A2540] text-white'
                    : 'bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#0A2540]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search city, hospital, or PIN..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
            />
          </div>
        </div>

        {/* Store List + Active Store Detail & Fitting Reservation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Store Cards */}
          <div className="lg:col-span-6 space-y-4">
            {filteredStores.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center">
                <p className="text-base font-semibold text-[#0A2540] mb-1">
                  No stores matched &ldquo;{searchText}&rdquo;
                </p>
                <p className="text-sm text-[#64748B] mb-4">
                  We deliver pan-India across 18,000+ PIN codes within 24–72 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchText('');
                    setSelectedCity('All Cities');
                  }}
                  className="px-4 py-2 bg-[#0A2540] text-white text-xs font-semibold rounded-lg"
                >
                  Show All 8 Stores
                </button>
              </div>
            ) : (
              filteredStores.map((store, idx) => {
                const isSelected = activeStore.id === store.id;
                return (
                  <motion.button
                    key={store.id}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    onClick={() => {
                      setActiveStore(store);
                      setBookingRef(null);
                    }}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-white border-[#0A2540] shadow-md'
                        : 'bg-white border-[#E2E8F0] hover:border-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-xs font-semibold text-[#2563EB]">
                          {store.city} · {store.badge}
                        </span>
                        <h2 className="text-base font-bold text-[#0A2540] font-sans mt-0.5">
                          {store.name}
                        </h2>
                      </div>
                      <MapPin
                        className={`w-5 h-5 shrink-0 ${
                          isSelected ? 'text-[#2563EB]' : 'text-[#94A3B8]'
                        }`}
                      />
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed">{store.address}</p>
                    <p className="text-xs text-[#059669] font-medium mt-1">{store.landmark}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-[#F1F5F9] text-xs text-[#64748B] tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {store.hours}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {store.phone}
                      </span>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Right Sticky Store Details + Reserve In-Store Fitting */}
          <motion.div
            key={activeStore.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24 space-y-6"
          >
            <div className="pb-5 border-b border-[#E2E8F0]">
              <div className="text-xs font-semibold text-[#2563EB] mb-1">
                {activeStore.city} Experience Centre · PIN {activeStore.pinCode}
              </div>
              <h2 className="text-2xl font-semibold text-[#0A2540]">{activeStore.name}</h2>
              <p className="text-sm text-[#475569] mt-2">{activeStore.address}</p>
              <p className="text-xs text-[#059669] font-semibold mt-1">{activeStore.landmark}</p>

              <div className="flex flex-wrap gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => handleCopyAddress(activeStore)}
                  className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:border-[#0A2540] inline-flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Address</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: '' })}
                  className="px-3.5 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-semibold text-[#0A2540]"
                >
                  Browse In-Stock Catalog
                </button>
              </div>
            </div>

            {/* Store Services */}
            <div>
              <h3 className="text-sm font-bold text-[#0A2540] font-sans mb-3">
                Available Services at This Location
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeStore.services.map((srv) => (
                  <div
                    key={srv}
                    className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 text-xs font-medium text-[#334155]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#64748B] mt-3">
                Most popular here: <strong className="text-[#0A2540]">{activeStore.popularFor}</strong>
              </p>
            </div>

            {/* Book In-Store Trial Form */}
            <div className="pt-5 border-t border-[#E2E8F0]">
              {bookingRef ? (
                <div className="p-5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-center">
                  <CheckCircle2 className="w-9 h-9 text-[#059669] mx-auto mb-2" />
                  <h4 className="text-base font-bold text-[#0A2540] font-sans">
                    In-Store Fitting Reserved ({bookingRef})
                  </h4>
                  <p className="text-xs text-[#334155] mt-1">
                    {activeStore.name} · {visitDate} ({visitSlot})
                  </p>
                  <p className="text-xs text-[#475569] mt-2">
                    We&apos;ve set aside <strong>{visitItems}</strong> in our trial room for {visitName}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingRef(null)}
                    className="mt-4 px-4 py-2 bg-[#0A2540] text-white text-xs font-semibold rounded-lg"
                  >
                    Modify Reservation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookVisit} className="space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540]">
                    <Calendar className="w-4 h-4 text-[#2563EB]" />
                    <span>Reserve a 15-Min Fit &amp; Embroidery Slot (Optional)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={visitName}
                      onChange={(e) => setVisitName(e.target.value)}
                      placeholder="Your Name (e.g. Dr. Sneha)"
                      className="px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="tel"
                      required
                      value={visitPhone}
                      onChange={(e) => setVisitPhone(e.target.value)}
                      placeholder="Mobile (+91 98XXX XXXXX)"
                      className="px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg tabular-nums"
                    />
                    <select
                      value={visitSlot}
                      onChange={(e) => setVisitSlot(e.target.value)}
                      className="px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg bg-white"
                    >
                      <option>11:00 AM – 1:00 PM</option>
                      <option>2:00 PM – 4:30 PM</option>
                      <option>5:00 PM – 7:30 PM</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={visitItems}
                    onChange={(e) => setVisitItems(e.target.value)}
                    placeholder="Items to keep ready in trial room"
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Reserve Free In-Store Fitting
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
