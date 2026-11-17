import React from 'react';
import {
  ArrowRight,
  Building2,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  COLLECTIONS,
  HERO_IMAGE,
  INSTITUTIONS_SERVED,
  PRESS_MENTIONS,
  PRODUCTS,
  TESTIMONIALS,
  TRUST_STATS,
} from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';

export function HomePage() {
  const { navigate } = useStore();

  const featuredProducts = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]];

  return (
    <main>
      {/* 1. Hero Section */}
      <section className="relative min-h-[560px] lg:min-h-[640px] flex items-center bg-[#0A2540] overflow-hidden">
        <div className="absolute inset-0">
          <ResilientImage
            src={HERO_IMAGE}
            alt="Indian healthcare professionals wearing Trade Meds tailored clinical scrubs in a modern hospital corridor"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/92 via-[#0A2540]/65 to-[#0A2540]/15" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93C5FD] mb-4">
              Engineered for the Everyday Hero
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] mb-5">
              Care starts with <em className="italic text-[#BAE6FD] font-normal">what you wear.</em>
            </h1>
            <p className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed mb-8 max-w-lg">
              Shift-tested medical scrubs, chief lab coats, and precision acoustic stethoscopes built for 12-hour hospital duties.
            </p>
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => navigate('shop', { category: '' })}
                className="px-6 py-3.5 bg-white text-[#0A2540] hover:bg-[#E2E8F0] text-sm font-bold rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('shop', { category: 'Stethoscopes' })}
                className="px-6 py-3.5 border border-white/50 text-white hover:bg-white/10 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Explore Stethoscopes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quantitative Trust & Proof Strip */}
      <section className="bg-[#071B30] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="py-7 px-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[#94A3B8] font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop by Collection */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#0A2540]">
                Shop by <em className="italic text-[#2563EB] font-normal">collection</em>
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-xl">
                From 4-way stretch scrubs to dual-head stethoscopes — everything your clinical rotation demands.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('shop', { category: '' })}
              className="text-sm font-semibold text-[#0A2540] hover:text-[#2563EB] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <span>View all 15 essentials</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COLLECTIONS.map((col) => (
              <button
                key={col.title}
                type="button"
                onClick={() => navigate('shop', { category: col.category })}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F1F5F9] text-left transition-transform duration-200 hover:-translate-y-1 shadow-xs hover:shadow-lg"
              >
                <ResilientImage
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-[11px] font-medium text-[#CBD5E1] mb-1">
                    {col.count}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight font-sans">
                    {col.title}
                  </h3>
                  <p className="text-xs text-white/75 mt-1 line-clamp-1">{col.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Community Favourites */}
      <section className="py-16 sm:py-20 bg-[#F4F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#0A2540]">
                Community <em className="italic text-[#2563EB] font-normal">favourites</em>
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-2">
                Highest-rated uniforms and instruments trusted across ICU, OPD, and surgical wards.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('shop', { category: '' })}
              className="text-sm font-semibold text-[#0A2540] hover:text-[#2563EB] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <span>Shop full catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Trade Meds Fabric & Engineering Split */}
      <section className="bg-[#0A2540] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="px-4 sm:px-8 lg:px-12 py-16 lg:py-20 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#93C5FD] mb-3">
              The Trade Meds Standard
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-5">
              Made for 12-hour shifts.{' '}
              <em className="italic text-[#BAE6FD] font-normal">Lab-tested for real wards.</em>
            </h2>
            <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed mb-8 max-w-lg">
              Every ecoflex™ garment blends recycled performance yarns with silver-ion antimicrobial protection, fluid-repellent finishing, and 7 reinforced pockets — tested past 100 commercial hospital washes.
            </p>

            <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/15 mb-8 max-w-lg">
              <div>
                <div className="text-xl font-bold tabular-nums text-white">4-Way Flex</div>
                <p className="text-xs text-[#94A3B8] mt-1">360° mechanical recovery with zero bagging</p>
              </div>
              <div>
                <div className="text-xl font-bold tabular-nums text-white">6 PET Bottles</div>
                <p className="text-xs text-[#94A3B8] mt-1">Upcycled into every ecoflex™ scrub set</p>
              </div>
              <div>
                <div className="text-xl font-bold tabular-nums text-white">100+ Washes</div>
                <p className="text-xs text-[#94A3B8] mt-1">Colorfast &amp; zero-shrink verified</p>
              </div>
              <div>
                <div className="text-xl font-bold tabular-nums text-white">Custom Crest</div>
                <p className="text-xs text-[#94A3B8] mt-1">Precision chest embroidery in 48 hrs</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('shop', { category: 'Women' })}
                className="px-5 py-3 bg-white text-[#0A2540] hover:bg-[#E2E8F0] text-sm font-bold rounded-lg transition-colors"
              >
                Explore ecoflex™ Series
              </button>
              <button
                type="button"
                onClick={() => navigate('bulk')}
                className="px-5 py-3 border border-white/35 text-white hover:bg-white/10 text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Hospital Bulk Orders</span>
              </button>
            </div>
          </div>

          <div className="min-h-[360px] lg:min-h-full relative overflow-hidden">
            <ResilientImage
              src={HERO_IMAGE}
              alt="Clinicians walking through hospital corridor in tailored Trade Meds scrubs"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. Institutions Served + Clinician Testimonials (Claim-to-Proof Adjacency) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB] mb-2">
              Trusted Across Leading Medical Institutions
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#0A2540]">
              Worn &amp; loved by <em className="italic text-[#2563EB] font-normal">520+ medical teams</em>
            </h2>
          </div>

          {/* Institutional Trust Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
            {INSTITUTIONS_SERVED.map((inst) => (
              <div
                key={inst.name}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center flex flex-col justify-center"
              >
                <div className="text-sm font-bold text-[#0A2540] leading-tight">
                  {inst.name}
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">{inst.city}</div>
              </div>
            ))}
          </div>

          {/* Attributable Clinician Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <article
                key={t.id}
                className="p-6 rounded-xl bg-[#FAFBF9] border border-[#E2E8F0] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#F59E0B] mb-4" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#334155] leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-[#E2E8F0] shrink-0">
                      <ResilientImage
                        src={t.avatar}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0A2540] truncate">{t.name}</div>
                      <div className="text-xs text-[#64748B] truncate">
                        {t.role} · {t.hospital}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-[#2563EB] font-medium">
                    Verified buyer · {t.productRef}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 4-Column Service Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14 pt-12 border-t border-[#E2E8F0]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540] font-sans">Free Delivery Above ₹1,999</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  24-hour dispatch across 18,000+ Indian PIN codes with live shipment tracking.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540] font-sans">7-Day Easy Size Exchange</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Doorstep reverse pickup and instant size swap with zero restocking fee.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540] font-sans">UPI, Cards, COD &amp; 0% EMI</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Flexible payment methods including Cash on Delivery and GST clinic invoices.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540] font-sans">30-Day Acoustic Trial</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Test 6sense stethoscopes on live rounds for 30 days or return for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. In the News & Bulk Institutional Banner */}
      <section className="py-16 sm:py-20 bg-[#F4F6F9] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-semibold text-[#0A2540]">
                In the <em className="italic text-[#2563EB] font-normal">press</em>
              </h2>
              <p className="text-sm text-[#475569] mt-1">
                Coverage on India&apos;s shift toward ergonomic clinical workwear.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {PRESS_MENTIONS.map((item) => (
              <article
                key={item.source}
                className="bg-white p-6 rounded-xl border border-[#E2E8F0] flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-[#2563EB] font-semibold mb-2">
                    {item.source} · {item.date}
                  </div>
                  <h3 className="text-base font-bold text-[#0A2540] leading-snug mb-3 font-sans">
                    {item.headline}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{item.summary}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Institutional Bulk Orders Callout */}
          <div className="bg-[#0A2540] text-white rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#93C5FD] mb-2">
                Hospitals, Clinics &amp; Medical Colleges
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                Outfitting an entire medical department or graduating batch?
              </h3>
              <p className="text-sm text-[#CBD5E1]">
                Save up to 25% on orders of 15+ sets with complimentary hospital logo digitisation, name embroidery, and dedicated sizing kits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('bulk')}
                className="px-6 py-3 bg-white text-[#0A2540] hover:bg-[#E2E8F0] text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                Request Bulk Quote
              </button>
              <button
                type="button"
                onClick={() => navigate('track')}
                className="px-6 py-3 border border-white/35 text-white hover:bg-white/10 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Track Existing Order
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
