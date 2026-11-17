import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

export function CartDrawer() {
  const {
    isCartDrawerOpen,
    setCartDrawerOpen,
    cart,
    cartCount,
    cartSubtotal,
    embroideryTotal,
    updateCartQty,
    removeFromCart,
    navigate,
  } = useStore();

  const freeShippingThreshold = 1999;
  const remaining = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-[1px]"
            onClick={() => setCartDrawerOpen(false)}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl z-10"
          >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#0A2540]" />
            <h2 className="text-lg font-bold text-[#0A2540] font-sans">
              Your Bag ({cartCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(false)}
            aria-label="Close bag"
            className="p-2 text-[#64748B] hover:text-[#0A2540] hover:bg-[#F1F5F9] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#334155] mb-1.5">
            <Truck className="w-4 h-4 text-[#2563EB] shrink-0" />
            {remaining === 0 ? (
              <span>You unlocked Free Express Clinical Delivery.</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">₹{remaining.toLocaleString('en-IN')}</strong> more for free shipping
              </span>
            )}
          </div>
          <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0A2540] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#CBD5E1] mb-3" />
              <p className="text-base font-semibold text-[#0A2540] mb-1">Your bag is empty</p>
              <p className="text-sm text-[#64748B] mb-6 max-w-xs">
                Explore shift-tested scrubs, chief lab coats, and 6sense acoustic stethoscopes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('shop', { category: '' });
                }}
                className="px-5 py-2.5 bg-[#0A2540] text-white text-sm font-semibold rounded-lg hover:bg-[#1E3A8A] transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.productId);
                if (!product) return null;
                const itemImg =
                  product.colors.find((c) => c.name === item.color)?.image || product.image;
                return (
                  <div key={item.key} className="py-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCartDrawerOpen(false);
                        navigate('product', { productId: product.id, color: item.color });
                      }}
                      className="w-20 aspect-[3/4] rounded-lg overflow-hidden bg-[#F1F5F9] shrink-0"
                    >
                      <ResilientImage
                        src={itemImg}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCartDrawerOpen(false);
                            navigate('product', { productId: product.id });
                          }}
                          className="text-left text-sm font-semibold text-[#0A2540] hover:text-[#2563EB] line-clamp-2"
                        >
                          {product.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          aria-label="Remove item"
                          className="text-[#94A3B8] hover:text-[#DC2626] p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-[#64748B] mt-1">
                        {item.color} · Size {item.size}
                      </p>

                      {item.embroidery?.enabled && (
                        <p className="text-xs text-[#2563EB] mt-1 font-medium">
                          Embroidery: &ldquo;{item.embroidery.line1}
                          {item.embroidery.line2 ? ` / ${item.embroidery.line2}` : ''}&rdquo; (+₹199)
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-[#CBD5E1] rounded-md">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.key, -1)}
                            aria-label="Decrease quantity"
                            className="p-1.5 text-[#334155] hover:bg-[#F1F5F9]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.key, 1)}
                            aria-label="Increase quantity"
                            className="p-1.5 text-[#334155] hover:bg-[#F1F5F9]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[#0A2540] tabular-nums">
                          ₹
                          {(
                            (product.price + (item.embroidery?.enabled ? 199 : 0)) *
                            item.qty
                          ).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#E2E8F0] bg-[#FAFBF9]">
            <div className="flex items-center justify-between text-sm text-[#475569] mb-1">
              <span>Subtotal</span>
              <span className="font-semibold text-[#0A2540] tabular-nums">
                ₹{(cartSubtotal + embroideryTotal).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mb-4">
              Apply promo code <span className="font-semibold text-[#0A2540]">FLASH12</span> at checkout for 12% off.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('cart');
                }}
                className="py-3 px-4 border border-[#0A2540] text-[#0A2540] text-sm font-semibold rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                View Bag
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('checkout');
                }}
                className="py-3 px-4 bg-[#0A2540] text-white text-sm font-semibold rounded-lg hover:bg-[#1E3A8A] transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
