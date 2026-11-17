import React, { useState } from 'react';
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryName } from '../types/store';

const NAV_LINKS: Array<{
  label: string;
  category: CategoryName | '';
  sublinks?: Array<{ label: string; category: CategoryName }>;
}> = [
  {
    label: 'Women',
    category: 'Women',
    sublinks: [
      { label: "All Women's Scrubs", category: 'Women' },
      { label: 'ecoflex™ 4-Way Stretch', category: 'Women' },
      { label: 'ecoflex™ Lite Mandarin', category: 'Women' },
      { label: 'Classic 5-Pocket V-Neck', category: 'Women' },
    ],
  },
  {
    label: 'Men',
    category: 'Men',
    sublinks: [
      { label: "All Men's Scrubs", category: 'Men' },
      { label: 'ecoflex™ 4-Way Stretch', category: 'Men' },
      { label: 'ecoflex™ Lite Mandarin', category: 'Men' },
      { label: 'Classic 6-Pocket V-Neck', category: 'Men' },
    ],
  },
  {
    label: 'Lab Coats',
    category: 'Lab Coats',
    sublinks: [
      { label: "Women's Chief Lab Coat", category: 'Lab Coats' },
      { label: "Men's Chief Lab Coat", category: 'Lab Coats' },
      { label: 'Campus Medical Apron', category: 'Lab Coats' },
    ],
  },
  {
    label: 'Stethoscopes',
    category: 'Stethoscopes',
    sublinks: [
      { label: '6sense Acoustic Stethoscope', category: 'Stethoscopes' },
      { label: '6sense Lite Student Model', category: 'Stethoscopes' },
    ],
  },
  {
    label: 'Accessories',
    category: 'Accessories',
    sublinks: [
      { label: 'AeroStep Clinical Clogs', category: 'Accessories' },
      { label: 'DRIFT Ward Jacket', category: 'Accessories' },
      { label: 'Pima Cotton Underscrubs', category: 'Accessories' },
      { label: 'Surgical Scrub Caps', category: 'Accessories' },
    ],
  },
];

export function Header() {
  const {
    page,
    selectedCategory,
    navigate,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    setCartDrawerOpen,
  } = useStore();

  const [bannerOpen, setBannerOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate('shop', { category: '' });
  };

  return (
    <>
      {bannerOpen && (
        <div className="bg-[#0A2540] text-white text-xs h-8 px-4 flex items-center justify-center relative">
          <p className="truncate font-medium tracking-wide">
            Get 12% Off with code <span className="font-bold text-[#93C5FD]">FLASH12</span>
            <span className="mx-2 opacity-40">·</span>
            Free delivery above ₹1,999
            <span className="hidden sm:inline">
              <span className="mx-2 opacity-40">·</span>
              COD &amp; Custom Embroidery available
            </span>
          </p>
          <button
            type="button"
            onClick={() => setBannerOpen(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 p-1 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8F0] h-16">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 -ml-2 text-[#0A2540] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                navigate('home');
              }}
              className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0A2540] whitespace-nowrap shrink-0 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#2563EB] rounded"
            >
              <span className="w-7 h-7 rounded-md bg-[#0A2540] text-white text-sm font-bold inline-flex items-center justify-center">
                T
              </span>
              <span>TRADE MEDS</span>
            </button>
          </div>

          {/* Zone 2: 5 Clean Single-Line Nav Links */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Primary categories"
          >
            {NAV_LINKS.map((item) => {
              const isActive = page === 'shop' && selectedCategory === item.category;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      navigate('shop', { category: item.category });
                    }}
                    className={`py-2 text-sm font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1 border-b-2 transition-colors duration-150 ${
                      isActive
                        ? 'text-[#0A2540] border-[#0A2540] font-semibold'
                        : 'text-[#475569] border-transparent hover:text-[#0A2540]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.sublinks && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                  </button>

                  {item.sublinks && hoveredNav === item.label && (
                    <div className="absolute left-0 top-full pt-1 w-64 z-50">
                      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3">
                        <div className="text-[11px] font-semibold text-[#64748B] px-2.5 py-1.5">
                          {item.label} Collection
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {item.sublinks.map((sub) => (
                            <button
                              key={sub.label}
                              type="button"
                              onClick={() => {
                                setHoveredNav(null);
                                setSearchQuery('');
                                navigate('shop', { category: sub.category });
                              }}
                              className="text-left px-2.5 py-2 text-sm text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0A2540] rounded-lg transition-colors"
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Zone 3: Utility Actions + Primary Bag CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search products"
              className="p-2.5 text-[#334155] hover:text-[#0A2540] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => navigate('wishlist')}
              aria-label="Saved wishlist"
              className="relative p-2.5 text-[#334155] hover:text-[#0A2540] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#0A2540] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('account')}
              aria-label="Clinician account and orders"
              className="hidden sm:inline-flex p-2.5 text-[#334155] hover:text-[#0A2540] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="ml-1 px-3.5 py-2 rounded-lg bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="tabular-nums bg-white/15 px-1.5 py-0.5 rounded text-xs">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Search Slide-Down Bar */}
        {searchOpen && (
          <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 shadow-sm">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-3xl mx-auto flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-[#64748B] shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scrubs, chief lab coats, 6sense stethoscopes, clogs..."
                className="flex-1 text-sm text-[#0A2540] placeholder:text-[#94A3B8] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#64748B] hover:text-[#0A2540]"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0A2540] text-white text-xs font-semibold rounded-md hover:bg-[#1E3A8A] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="p-1 text-[#64748B] hover:text-[#0A2540]"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/45"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-white w-80 max-w-[85vw] h-full flex flex-col p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <span className="font-extrabold text-lg text-[#0A2540]">TRADE MEDS</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2 text-[#475569] hover:bg-[#F1F5F9] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1 py-4">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate('shop', { category: '' });
                }}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0A2540] hover:bg-[#F1F5F9]"
              >
                Shop All Products
              </button>
              {NAV_LINKS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('shop', { category: item.category });
                  }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]"
                >
                  {item.label}
                </button>
              ))}
              <div className="my-2 border-t border-[#E2E8F0]" />
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate('bulk');
                }}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]"
              >
                Hospital &amp; College Bulk Orders
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate('track');
                }}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]"
              >
                Track Order
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate('account');
                }}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]"
              >
                Account &amp; Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
