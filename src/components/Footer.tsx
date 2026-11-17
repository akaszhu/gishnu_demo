import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Footer() {
  const { navigate, setSizeGuideOpen, showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      showToast('Please enter a valid clinical or personal email.');
      return;
    }
    showToast('Subscribed! Welcome code DOC10 sent to your inbox.');
    setEmail('');
  };

  return (
    <footer className="bg-[#0A2540] text-[#CBD5E1] pt-16 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-lg mb-4">
              <span className="w-7 h-7 rounded-md bg-white text-[#0A2540] text-sm font-bold inline-flex items-center justify-center">
                T
              </span>
              <span>TRADE MEDS</span>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8] max-w-xs">
              Clinical apparel and medical essentials engineered in India for doctors, nurses, residents, and medical students.
            </p>
            <p className="text-xs text-[#64748B] mt-4">
              Care in every detail · Mumbai &amp; Bengaluru
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'Women' })}
                  className="hover:text-white transition-colors"
                >
                  Women&apos;s Scrubs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'Men' })}
                  className="hover:text-white transition-colors"
                >
                  Men&apos;s Scrubs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'Lab Coats' })}
                  className="hover:text-white transition-colors"
                >
                  Chief Lab Coats
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'Stethoscopes' })}
                  className="hover:text-white transition-colors"
                >
                  6sense Stethoscopes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'Accessories' })}
                  className="hover:text-white transition-colors"
                >
                  Clinical Footwear &amp; Caps
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Support Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Services &amp; Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('bulk')}
                  className="hover:text-white transition-colors"
                >
                  Hospital &amp; College Bulk Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('track')}
                  className="hover:text-white transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Clinical Size Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('account')}
                  className="hover:text-white transition-colors"
                >
                  Clinician Account &amp; Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('wishlist')}
                  className="hover:text-white transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Clinician Dispatch
            </h4>
            <p className="text-sm text-[#94A3B8] mb-4">
              Receive early access to seasonal scrub colorways and institutional batch offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.name@hospital.org"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#93C5FD]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="px-3.5 py-2.5 bg-white text-[#0A2540] font-semibold rounded-lg hover:bg-[#E2E8F0] transition-colors inline-flex items-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 Trade Meds Apparel Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Free Delivery above ₹1,999</span>
            <span>7-Day Size Exchange</span>
            <span>256-Bit Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
