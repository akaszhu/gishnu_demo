import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  COLLECTIONS,
  HERO_IMAGE,
  HERO_SLIDES,
  INSTITUTIONS_SERVED,
  PRESS_MENTIONS,
  PRODUCTS,
  TESTIMONIALS,
  TRUST_STATS,
} from '../data/catalog';
import { OFFLINE_STORES } from '../data/stores';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';

export function HomePage() {
  const { navigate, addToCart, applyPromo, recentlyViewed } = useStore();

  const [heroIdx, setHeroIdx] = useState(0);

  const [testiIdx, setTestiIdx] = useState(0);
  const [testiDir, setTestiDir] = useState<1 | -1>(1);

  const [showcaseCat, setShowcaseCat] = useState<
    'Bestsellers' | 'Women' | 'Men' | 'Lab Coats' | 'Stethoscopes' | 'Accessories'
  >('Bestsellers');
  const [bundleTrack, setBundleTrack] = useState<'Women' | 'Men'>('Women');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3200);
    return () => clearTimeout(timer);
  }, [heroIdx]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTestiDir(1);
      setTestiIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [testiIdx]);

  const currentSlide = HERO_SLIDES[heroIdx] || HERO_SLIDES[0];
  const showcaseProducts =
    showcaseCat === 'Bestsellers'
      ? [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]]
      : PRODUCTS.filter((p) => p.category === showcaseCat).slice(0, 4);

  const bundleItems = [
    bundleTrack === 'Women' ? PRODUCTS[0] : PRODUCTS[1],
    PRODUCTS[3],
    PRODUCTS[11],
  ];
  const bundleOriginalMrp = bundleItems.reduce((s, p) => s + (p.oldPrice || p.price), 0);
  const bundleSaleSum = bundleItems.reduce((s, p) => s + p.price, 0);
  const bundleAfterPromo = Math.round(bundleSaleSum * 0.88);
  const recentProducts = recentlyViewed
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p))
    .slice(0, 4);

  const handleAddBundle = () => {
    bundleItems.forEach((p, idx) => {
      addToCart(p.id, {
        qty: 1,
        openDrawer: idx === bundleItems.length - 1,
      });
    });
    applyPromo('FLASH12');
  };

  const visibleTestimonials = [0, 1, 2].map(
    (offset) => TESTIMONIALS[(testiIdx + offset) % TESTIMONIALS.length]
  );

  const stepHero = (delta: number) => {
    setHeroIdx((prev) => (prev + delta + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const stepTestimonials = (delta: 1 | -1) => {
    setTestiDir(delta);
    setTestiIdx((prev) => (prev + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <main>
      {/* 1. Hero Carousel Slides */}
      <section className="relative min-h-[560px] lg:min-h-[640px] flex flex-col justify-between bg-[#0A2540] overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0.4, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.4 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <ResilientImage
                src={currentSlide.image}
                alt={currentSlide.alt}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/92 via-[#0A2540]/65 to-[#0A2540]/15" />
        </div>

        {/* Left & Right Slide Arrows */}
        <button
          type="button"
          onClick={() => stepHero(-1)}
          aria-label="Previous hero slide"
          className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => stepHero(1)}
          aria-label="Next hero slide"
          className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white items-center justify-center transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93C5FD] mb-4">
                {currentSlide.eyebrow}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] mb-5">
                {currentSlide.titlePrefix}{' '}
                <em className="italic text-[#BAE6FD] font-normal">
                  {currentSlide.titleHighlight}
                </em>
              </h1>
              <p className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed mb-8 max-w-lg">
                {currentSlide.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() =>
                    navigate(currentSlide.primaryCta.page, {
                      category: currentSlide.primaryCta.category,
                    })
                  }
                  className="px-6 py-3.5 bg-white text-[#0A2540] hover:bg-[#E2E8F0] text-sm font-bold rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap shrink-0"
                >
                  <span>{currentSlide.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    'category' in currentSlide.secondaryCta
                      ? navigate(currentSlide.secondaryCta.page, {
                          category: currentSlide.secondaryCta.category,
                        })
                      : navigate(currentSlide.secondaryCta.page)
                  }
                  className="px-6 py-3.5 border border-white/50 text-white hover:bg-white/10 text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  {currentSlide.secondaryCta.page === 'stores' && (
                    <MapPin className="w-4 h-4" />
                  )}
                  <span>{currentSlide.secondaryCta.label}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Minimal Slide Dots */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full flex items-center justify-center sm:justify-start gap-2">
          {HERO_SLIDES.map((slide, idx) => {
            const active = idx === heroIdx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setHeroIdx(idx)}
                aria-label={`View slide ${idx + 1}: ${slide.shortLabel}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  active ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
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
            {COLLECTIONS.map((col, idx) => (
              <motion.button
                key={col.title}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.24, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
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
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Community Favourites */}
      <section className="py-16 sm:py-20 bg-[#F4F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
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
              onClick={() =>
                navigate('shop', {
                  category: showcaseCat === 'Bestsellers' ? '' : showcaseCat,
                })
              }
              className="text-sm font-semibold text-[#0A2540] hover:text-[#2563EB] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <span>Shop full catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
            {(
              ['Bestsellers', 'Women', 'Men', 'Lab Coats', 'Stethoscopes', 'Accessories'] as const
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setShowcaseCat(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  showcaseCat === cat
                    ? 'bg-[#0A2540] text-white'
                    : 'bg-white text-[#475569] border border-[#E2E8F0] hover:text-[#0A2540]'
                }`}
              >
                {cat === 'Bestsellers' ? 'All Bestsellers' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseProducts.map((product, idx) => (
              <motion.div
                key={`${showcaseCat}-${product.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Complete 3-Piece Shift Bundle Builder */}
          <div className="mt-12 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-xs">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complete Shift Bundle · Save with FLASH12</span>
                </span>
                <div className="inline-flex p-0.5 bg-[#F1F5F9] rounded-lg text-xs">
                  {(['Women', 'Men'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setBundleTrack(g)}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                        bundleTrack === g ? 'bg-white text-[#0A2540] shadow-xs' : 'text-[#64748B]'
                      }`}
                    >
                      {g}&apos;s Kit
                    </button>
                  ))}
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-[#0A2540]">
                {bundleTrack}&apos;s Complete 12-Hour Rotation Kit
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bundleItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate('product', { productId: item.id })}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E8F0] hover:border-[#0A2540] text-left transition-colors"
                  >
                    <div className="w-11 h-14 rounded-lg overflow-hidden bg-[#E2E8F0] shrink-0">
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0A2540] truncate">{item.name}</div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-72 shrink-0 p-5 rounded-xl bg-[#FAFBF9] border border-[#E2E8F0] space-y-3 tabular-nums">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#64748B]">MRP Total</span>
                <span className="text-sm text-[#94A3B8] line-through">
                  ₹{bundleOriginalMrp.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-[#0A2540]">Bundle + FLASH12</span>
                <span className="text-2xl font-extrabold text-[#0A2540]">
                  ₹{bundleAfterPromo.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-xs font-bold text-[#047857] bg-[#ECFDF5] px-2.5 py-1 rounded-md text-center">
                Total Savings: ₹{(bundleOriginalMrp - bundleAfterPromo).toLocaleString('en-IN')} + Free Shipping
              </div>
              <button
                type="button"
                onClick={handleAddBundle}
                className="w-full py-3 px-4 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Full 3-Piece Kit</span>
              </button>
            </div>
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

          {/* Attributable Clinician Testimonials Carousel */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-xs font-semibold text-[#64748B] tabular-nums">
                Showing verified clinical feedback · Slide {testiIdx + 1} of {TESTIMONIALS.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepTestimonials(-1)}
                  aria-label="Previous clinician testimonials"
                  className="w-9 h-9 rounded-lg border border-[#CBD5E1] hover:border-[#0A2540] text-[#0A2540] flex items-center justify-center transition-colors bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepTestimonials(1)}
                  aria-label="Next clinician testimonials"
                  className="w-9 h-9 rounded-lg border border-[#CBD5E1] hover:border-[#0A2540] text-[#0A2540] flex items-center justify-center transition-colors bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={testiIdx}
                  initial={{ opacity: 0, x: testiDir > 0 ? 24 : -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: testiDir > 0 ? -24 : 24 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {visibleTestimonials.map((t, cardPos) => (
                    <article
                      key={t.id}
                      className={`p-6 rounded-xl bg-[#FAFBF9] border border-[#E2E8F0] flex flex-col justify-between ${
                        cardPos > 0 ? 'hidden md:flex' : 'flex'
                      }`}
                    >
                      <div>
                        <div
                          className="flex items-center gap-1 text-[#F59E0B] mb-4"
                          aria-label={`${t.rating} out of 5 stars`}
                        >
                          {Array.from({ length: t.rating }).map((_, idx2) => (
                            <Star key={idx2} className="w-4 h-4 fill-current" />
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
                            <div className="text-sm font-bold text-[#0A2540] truncate">
                              {t.name}
                            </div>
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
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTestiDir(idx >= testiIdx ? 1 : -1);
                    setTestiIdx(idx);
                  }}
                  aria-label={`Show testimonial ${idx + 1}: ${t.name}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === testiIdx
                      ? 'w-7 bg-[#0A2540]'
                      : 'w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                  }`}
                />
              ))}
            </div>
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

      {/* 8. Offline Experience Centres Preview */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB] mb-2">
                Offline Experience Centres
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#0A2540]">
                Try fabrics &amp; fits <em className="italic text-[#2563EB] font-normal">near your hospital</em>
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-2xl">
                Walk into any of our 8 clinical fitting studios for express embroidery, live stethoscope acoustic testing, and instant size exchanges.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('stores')}
              className="text-sm font-semibold text-[#0A2540] hover:text-[#2563EB] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <span>View all 8 store locations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {OFFLINE_STORES.slice(0, 3).map((store, idx) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.24, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-xl bg-[#FAFBF9] border border-[#E2E8F0] flex flex-col justify-between hover:border-[#94A3B8] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-semibold text-[#2563EB]">
                        {store.city} · {store.badge}
                      </span>
                      <h3 className="text-base font-bold text-[#0A2540] font-sans mt-0.5">
                        {store.name}
                      </h3>
                    </div>
                    <MapPin className="w-5 h-5 text-[#2563EB] shrink-0" />
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed mt-2">{store.address}</p>
                  <p className="text-xs font-medium text-[#059669] mt-1.5">{store.landmark}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#64748B] tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {store.hours}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {store.phone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('stores')}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#0A2540] text-xs font-semibold text-[#0A2540] transition-colors"
                  >
                    Book Free In-Store Fitting
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('stores')}
              className="px-6 py-3 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-bold rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>View All 8 Store Locations &amp; Book Fitting</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. Recently Viewed Products */}
      {recentProducts.length > 0 && (
        <section className="py-14 bg-[#F4F6F9] border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#0A2540]">
                  Recently <em className="italic text-[#2563EB] font-normal">viewed</em>
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Pick up right where you left off.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('shop', { category: '' })}
                className="text-xs sm:text-sm font-semibold text-[#0A2540] hover:text-[#2563EB] inline-flex items-center gap-1"
              >
                <span>Browse all</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map((product) => (
                <ProductCard key={`recent-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
