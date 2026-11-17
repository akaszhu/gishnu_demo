import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronRight,
  Heart,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/catalog';
import { EmbroideryOption } from '../types/store';
import { ResilientImage } from '../components/ResilientImage';
import { ProductCard } from '../components/ProductCard';

export function ProductDetailPage() {
  const {
    selectedProductId,
    selectedProductColor,
    navigate,
    addToCart,
    wishlist,
    toggleWishlist,
    setSizeGuideOpen,
    customReviews,
    addReview,
    showToast,
  } = useStore();

  const product = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const initialColorObj =
    product.colors.find((c) => c.name === selectedProductColor) || product.colors[0];

  const [activeImage, setActiveImage] = useState(
    initialColorObj?.image || product.gallery[0] || product.image
  );
  const [selectedColor, setSelectedColor] = useState(initialColorObj?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[Math.min(1, product.sizes.length - 1)] || 'M'
  );
  const [qty, setQty] = useState(1);

  // Custom Embroidery state
  const [embEnabled, setEmbEnabled] = useState(false);
  const [embLine1, setEmbLine1] = useState('');
  const [embLine2, setEmbLine2] = useState('');
  const [embThread, setEmbThread] = useState<EmbroideryOption['threadColor']>('White');

  // Drill-down tabs
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'care'>('specs');

  // New review form
  const [revName, setRevName] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revHospital, setRevHospital] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');

  useEffect(() => {
    const matchedColor =
      product.colors.find((c) => c.name === selectedProductColor) || product.colors[0];
    setActiveImage(matchedColor?.image || product.gallery[0] || product.image);
    setSelectedColor(matchedColor?.name || 'Standard');
    setSelectedSize(product.sizes[Math.min(1, product.sizes.length - 1)] || 'M');
    setQty(1);
    setEmbEnabled(false);
    setEmbLine1('');
    setEmbLine2('');
    setActiveTab('specs');
  }, [product.id, selectedProductColor]);

  const isSaved = wishlist.includes(product.id);
  const allReviews = [...(customReviews[product.id] || []), ...product.reviews];
  const savings = product.oldPrice ? product.oldPrice - product.price : 0;
  const discountPct = product.oldPrice
    ? Math.round((savings / product.oldPrice) * 100)
    : 0;

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const buildEmbroideryPayload = (): EmbroideryOption | undefined => {
    if (!product.supportsEmbroidery || !embEnabled) return undefined;
    if (!embLine1.trim()) {
      showToast('Enter your name for chest embroidery or disable personalization.');
      return undefined;
    }
    return {
      enabled: true,
      line1: embLine1.trim(),
      line2: embLine2.trim(),
      threadColor: embThread,
    };
  };

  const handleAddToBag = () => {
    if (product.supportsEmbroidery && embEnabled && !embLine1.trim()) {
      showToast('Please enter Line 1 text for embroidery.');
      return;
    }
    addToCart(product.id, {
      color: selectedColor,
      size: selectedSize,
      qty,
      embroidery: buildEmbroideryPayload(),
      openDrawer: true,
    });
  };

  const handleBuyNow = () => {
    if (product.supportsEmbroidery && embEnabled && !embLine1.trim()) {
      showToast('Please enter Line 1 text for embroidery.');
      return;
    }
    addToCart(product.id, {
      color: selectedColor,
      size: selectedSize,
      qty,
      embroidery: buildEmbroideryPayload(),
      openDrawer: false,
    });
    navigate('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      showToast('Please enter your name and review comments.');
      return;
    }
    addReview(product.id, {
      author: revName.trim(),
      role: revRole.trim() || 'Medical Professional',
      hospital: revHospital.trim() || 'Verified Buyer',
      rating: revRating,
      title: revTitle.trim() || 'Shift-tested quality',
      comment: revComment.trim(),
    });
    setRevName('');
    setRevRole('');
    setRevHospital('');
    setRevTitle('');
    setRevComment('');
  };

  return (
    <main className="bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748B] mb-6 flex-wrap">
          <button type="button" onClick={() => navigate('home')} className="hover:text-[#0A2540]">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            type="button"
            onClick={() => navigate('shop', { category: product.category })}
            className="hover:text-[#0A2540]"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0A2540] font-medium">{product.name}</span>
        </nav>

        {/* Contiguous PDP Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Sticky Left Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F2F4F7] border border-[#E2E8F0]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0.5, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  <ResilientImage
                    src={activeImage}
                    alt={`${product.name} in ${selectedColor}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {product.gallery.length > 1 && (
              <div className="flex items-center gap-3 mt-4">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? 'border-[#0A2540] shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ResilientImage
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="lg:col-span-6">
            <div className="text-xs font-semibold text-[#2563EB] mb-2">
              {product.category} · {product.line}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-[#0A2540] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-3 text-sm mb-5">
              <div className="inline-flex items-center gap-1 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-[#0A2540] tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-[#CBD5E1]">|</span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('pdp-tabs')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[#475569] hover:text-[#0A2540] underline underline-offset-2 tabular-nums"
              >
                {(product.reviewCount + (customReviews[product.id]?.length || 0)).toLocaleString('en-IN')}{' '}
                verified reviews
              </button>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-[#E2E8F0] tabular-nums">
              <span className="text-3xl font-extrabold text-[#0A2540]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-base text-[#94A3B8] line-through">
                    ₹{product.oldPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-[#047857] bg-[#ECFDF5] px-2.5 py-1 rounded-md">
                    Save ₹{savings.toLocaleString('en-IN')} ({discountPct}% Off)
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-[#475569] leading-relaxed my-5">{product.description}</p>

            {/* Color Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-[#0A2540]">
                  Color: <span className="font-medium text-[#475569]">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => {
                  const active = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (c.image) {
                          setActiveImage(c.image);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium inline-flex items-center gap-2 transition-colors ${
                        active
                          ? 'border-[#0A2540] bg-[#F8FAFC] text-[#0A2540] font-semibold'
                          : 'border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-[#0A2540]">
                  Size: <span className="font-medium text-[#475569]">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-[#2563EB] font-semibold hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[52px] h-11 px-3 rounded-lg border text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-[#0A2540] text-white border-[#0A2540]'
                          : 'bg-white text-[#334155] border-[#CBD5E1] hover:border-[#0A2540]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Chest Embroidery Module */}
            {product.supportsEmbroidery && (
              <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <div>
                      <div className="text-sm font-bold text-[#0A2540]">
                        Add Custom Chest Embroidery (+₹199)
                      </div>
                      <div className="text-xs text-[#64748B]">
                        Personalize with your name, credentials, or department
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={embEnabled}
                    onChange={(e) => setEmbEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#0A2540]"
                  />
                </label>

                {embEnabled && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] mb-1">
                          Line 1 (Name)
                        </label>
                        <input
                          type="text"
                          maxLength={24}
                          value={embLine1}
                          onChange={(e) => setEmbLine1(e.target.value)}
                          placeholder="e.g. Dr. Priya Sharma"
                          className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] mb-1">
                          Line 2 (Specialty / Optional)
                        </label>
                        <input
                          type="text"
                          maxLength={24}
                          value={embLine2}
                          onChange={(e) => setEmbLine2(e.target.value)}
                          placeholder="e.g. Cardiology · MD"
                          className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#334155]">Thread:</span>
                        {(['White', 'Navy', 'Gold', 'Slate'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setEmbThread(t)}
                            className={`px-2.5 py-1 rounded text-xs font-medium border ${
                              embThread === t
                                ? 'bg-[#0A2540] text-white border-[#0A2540]'
                                : 'bg-white text-[#475569] border-[#CBD5E1]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {embLine1 && (
                        <div className="px-3 py-1.5 rounded bg-[#0A2540] text-white text-xs font-serif">
                          <div className={embThread === 'Gold' ? 'text-[#FCD34D]' : 'text-white'}>
                            {embLine1}
                          </div>
                          {embLine2 && (
                            <div className="text-[10px] opacity-80">{embLine2}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Primary Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center border border-[#CBD5E1] rounded-lg h-12">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-3.5 h-full text-[#334155] hover:bg-[#F1F5F9]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="px-3.5 h-full text-[#334155] hover:bg-[#F1F5F9]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToBag}
                className="flex-1 min-w-[160px] h-12 px-6 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-bold rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="h-12 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Save to wishlist"
                className={`h-12 w-12 rounded-lg border flex items-center justify-center transition-colors ${
                  isSaved
                    ? 'border-[#DC2626] text-[#DC2626] bg-[#FEF2F2]'
                    : 'border-[#CBD5E1] text-[#475569] hover:border-[#0A2540]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Key Highlights */}
            <ul className="space-y-2 mb-6">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-[#334155]">
                  <Check className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* Service Assurances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-[#E2E8F0] text-xs text-[#475569]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0A2540] shrink-0" />
                <span>Free delivery ₹1,999+</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#0A2540] shrink-0" />
                <span>7-day easy exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0A2540] shrink-0" />
                <span>COD &amp; GST invoice</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('stores')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#BFDBFE] text-xs font-semibold text-[#0A2540] inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                <span>Prefer trying before buying? Try In-Store at 8 Locations</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
            </div>
          </div>
        </div>

        {/* Drill-Down Specifications, Reviews & Care Tabs */}
        <section id="pdp-tabs" className="mt-16 pt-12 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] mb-8 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'specs'
                  ? 'border-[#0A2540] text-[#0A2540]'
                  : 'border-transparent text-[#64748B] hover:text-[#0A2540]'
              }`}
            >
              Fabric &amp; Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'reviews'
                  ? 'border-[#0A2540] text-[#0A2540]'
                  : 'border-transparent text-[#64748B] hover:text-[#0A2540]'
              }`}
            >
              Clinical Reviews ({allReviews.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('care')}
              className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'care'
                  ? 'border-[#0A2540] text-[#0A2540]'
                  : 'border-transparent text-[#64748B] hover:text-[#0A2540]'
              }`}
            >
              Wash &amp; Sterilization Care
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries({
                'Material Composition': product.specs.fabric,
                'Weight / Density': product.specs.weight,
                'Mobility & Flex': product.specs.stretch,
                'Pocket Architecture': product.specs.pockets,
                'Silhouette & Fit': product.specs.fit,
                'Laundry & Care': product.specs.care,
              }).map(([label, val]) => (
                <div
                  key={label}
                  className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <div className="text-xs font-semibold text-[#64748B] mb-1">{label}</div>
                  <div className="text-sm font-semibold text-[#0A2540]">{val}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-4">
                {allReviews.length === 0 ? (
                  <p className="text-sm text-[#64748B] py-6">
                    Be the first clinician to write a detailed shift review for this item.
                  </p>
                ) : (
                  allReviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="p-5 rounded-xl bg-[#FAFBF9] border border-[#E2E8F0]"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1 text-[#F59E0B]">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-[#64748B]">{rev.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0A2540] mb-1 font-sans">
                        {rev.title}
                      </h4>
                      <p className="text-sm text-[#475569] leading-relaxed mb-3">{rev.comment}</p>
                      <div className="text-xs text-[#64748B]">
                        <strong className="text-[#0A2540]">{rev.author}</strong> · {rev.role} ·{' '}
                        {rev.hospital}
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div className="lg:col-span-5">
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4"
                >
                  <h3 className="text-lg font-bold text-[#0A2540] font-sans">
                    Write a Clinical Review
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRevRating(n)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              n <= revRating
                                ? 'fill-[#F59E0B] text-[#F59E0B]'
                                : 'text-[#CBD5E1]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="Your Name (e.g. Dr. Rohan)"
                      className="px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="text"
                      value={revRole}
                      onChange={(e) => setRevRole(e.target.value)}
                      placeholder="Role (e.g. Resident)"
                      className="px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    value={revHospital}
                    onChange={(e) => setRevHospital(e.target.value)}
                    placeholder="Hospital / Medical College"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                  />
                  <input
                    type="text"
                    value={revTitle}
                    onChange={(e) => setRevTitle(e.target.value)}
                    placeholder="Review headline"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                  />
                  <textarea
                    rows={3}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="How did it perform on shift?"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Publish Review
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="max-w-3xl space-y-4 text-sm text-[#475569] leading-relaxed">
              <p>
                <strong className="text-[#0A2540]">Recommended Laundering:</strong>{' '}
                {product.specs.care}. Turn embroidered garments inside-out before machine washing to preserve stitch sheen.
              </p>
              <p>
                <strong className="text-[#0A2540]">Antimicrobial Longevity:</strong> The silver-ion antimicrobial treatment is bonded into the yarn core and remains effective past 100 standard wash cycles without harsh chlorine bleaching.
              </p>
              <p>
                <strong className="text-[#0A2540]">Exchange Policy:</strong> All non-embroidered garments can be exchanged or returned within 7 days of delivery with tags intact.
              </p>
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#E2E8F0]">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0A2540]">
                Complete your <em className="italic text-[#2563EB] font-normal">shift kit</em>
              </h2>
              <button
                type="button"
                onClick={() => navigate('shop', { category: product.category })}
                className="text-sm font-semibold text-[#2563EB] hover:underline"
              >
                View all in {product.category}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
