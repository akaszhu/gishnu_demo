import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Plus, Star } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { navigate, addToCart, wishlist, toggleWishlist } = useStore();
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const isSaved = wishlist.includes(product.id);
  const selectedColor = product.colors[activeColorIdx] || product.colors[0];
  const displayImage = selectedColor?.image || product.image;
  const discountPct = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, {
      color: selectedColor?.name,
      size: product.sizes[Math.min(1, product.sizes.length - 1)],
      qty: 1,
      openDrawer: true,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article
      onClick={() =>
        navigate('product', { productId: product.id, color: selectedColor?.name })
      }
      className="group cursor-pointer flex flex-col bg-white rounded-xl border border-[#E2E8F0] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Studio Image Container */}
      <div className="relative aspect-[3/4] bg-[#F2F4F7] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayImage}
            initial={{ opacity: 0.65, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.65 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <ResilientImage
              src={displayImage}
              alt={`${product.name} in ${selectedColor?.name || ''}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </motion.div>
        </AnimatePresence>

        {product.tag && (
          <span className="absolute top-3 left-3 bg-white/95 text-[#0A2540] text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
            {product.tag}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center transition-colors shadow-xs ${
            isSaved ? 'text-[#DC2626]' : 'text-[#475569] hover:text-[#0A2540]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick-Add Bar (visible on touch, reveal-on-hover on desktop) */}
        <div className="absolute inset-x-3 bottom-3 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-3 bg-[#0A2540]/95 hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-colors backdrop-blur-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add · {selectedColor?.name}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
          <span>
            {product.category} · {product.line}
          </span>
          <span className="inline-flex items-center gap-1 text-[#0A2540] font-medium tabular-nums">
            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            {product.rating.toFixed(1)}
            <span className="text-[#94A3B8]">({product.reviewCount.toLocaleString('en-IN')})</span>
          </span>
        </div>

        <h3 className="text-sm font-semibold text-[#0A2540] leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="mt-auto pt-1">
          <div className="flex items-baseline flex-wrap gap-2 tabular-nums">
            <span className="text-base font-bold text-[#0A2540]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-xs text-[#94A3B8] line-through">
                  ₹{product.oldPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-bold text-[#047857] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                  {discountPct}% OFF
                </span>
              </>
            )}
          </div>

          {/* Interactive Color Swatches + Active Color Name */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 5).map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  aria-label={`Select color ${c.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColorIdx(idx);
                  }}
                  className={`w-4 h-4 rounded-full border transition-transform ${
                    idx === activeColorIdx
                      ? 'ring-2 ring-[#0A2540] ring-offset-1 scale-110 border-white'
                      : 'border-black/15 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#64748B] truncate max-w-[110px]">
              {selectedColor?.name}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
