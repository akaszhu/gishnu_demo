import React, { useState } from 'react';
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, PROMO_CODES } from '../data/catalog';
import { ResilientImage } from '../components/ResilientImage';

export function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    embroideryTotal,
    discountAmount,
    appliedPromo,
    applyPromo,
    removePromo,
    updateCartQty,
    removeFromCart,
    navigate,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const freeShippingThreshold = 1999;
  const shippingFee = cartSubtotal === 0 || cartSubtotal >= freeShippingThreshold ? 0 : 99;
  const grandTotal = Math.max(0, cartSubtotal + embroideryTotal - discountAmount + shippingFee);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromo(promoInput);
    setPromoMsg({ ok: res.ok, text: res.message });
    if (res.ok) setPromoInput('');
  };

  return (
    <main className="bg-[#FAFBF9] min-h-screen pb-20">
      <div className="bg-[#0A2540] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-white">Shopping Bag</h1>
          <p className="text-sm text-[#CBD5E1] mt-1">
            Review your clinical kit, embroidery details, and promo savings before checkout.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {cart.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-xl mx-auto mt-6">
            <ShoppingBag className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-[#0A2540] mb-2">Your shopping bag is empty</h2>
            <p className="text-sm text-[#64748B] mb-6">
              Add scrubs, lab coats, or a 6sense stethoscope to get started.
            </p>
            <button
              type="button"
              onClick={() => navigate('shop', { category: '' })}
              className="px-6 py-3 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Explore All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-[#2563EB] shrink-0" />
                {cartSubtotal >= freeShippingThreshold ? (
                  <span className="text-[#0A2540] font-medium">
                    Your order qualifies for <strong>Free Clinical Delivery</strong> across India.
                  </span>
                ) : (
                  <span className="text-[#334155]">
                    Add{' '}
                    <strong className="tabular-nums text-[#0A2540]">
                      ₹{(freeShippingThreshold - cartSubtotal).toLocaleString('en-IN')}
                    </strong>{' '}
                    more to unlock free shipping.
                  </span>
                )}
              </div>

              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.productId);
                if (!product) return null;
                const itemTotal =
                  (product.price + (item.embroidery?.enabled ? 199 : 0)) * item.qty;

                return (
                  <div
                    key={item.key}
                    className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-5"
                  >
                    <button
                      type="button"
                      onClick={() => navigate('product', { productId: product.id })}
                      className="w-24 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden bg-[#F1F5F9] shrink-0"
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => navigate('product', { productId: product.id })}
                            className="text-left text-base font-bold text-[#0A2540] hover:text-[#2563EB]"
                          >
                            {product.name}
                          </button>
                          <span className="text-base font-extrabold text-[#0A2540] tabular-nums shrink-0">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] mt-1">
                          {product.category} · {item.color} · Size {item.size}
                        </p>

                        {item.embroidery?.enabled && (
                          <div className="mt-2 inline-block px-2.5 py-1 rounded bg-[#EFF6FF] text-xs text-[#1D4ED8] font-medium">
                            Custom Embroidery ({item.embroidery.threadColor}): &ldquo;
                            {item.embroidery.line1}
                            {item.embroidery.line2 ? ` · ${item.embroidery.line2}` : ''}&rdquo; (+₹199)
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F1F5F9]">
                        <div className="inline-flex items-center border border-[#CBD5E1] rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.key, -1)}
                            aria-label="Decrease quantity"
                            className="p-2 text-[#334155] hover:bg-[#F1F5F9]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-bold tabular-nums">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.key, 1)}
                            aria-label="Increase quantity"
                            className="p-2 text-[#334155] hover:bg-[#F1F5F9]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          className="text-xs font-semibold text-[#DC2626] hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-[#0A2540] font-sans mb-4">
                Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h2>

              <div className="space-y-3 text-sm pb-4 border-b border-[#E2E8F0] tabular-nums">
                <div className="flex justify-between text-[#475569]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#0A2540]">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {embroideryTotal > 0 && (
                  <div className="flex justify-between text-[#475569]">
                    <span>Custom Embroidery</span>
                    <span className="font-semibold text-[#0A2540]">
                      ₹{embroideryTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#475569]">
                  <span>Delivery</span>
                  <span className="font-semibold text-[#059669]">
                    {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                  </span>
                </div>
                {appliedPromo && discountAmount > 0 && (
                  <div className="flex justify-between text-[#059669]">
                    <span>
                      Promo ({appliedPromo}){' '}
                      <button
                        type="button"
                        onClick={removePromo}
                        className="text-[11px] text-[#DC2626] underline ml-1"
                      >
                        Remove
                      </button>
                    </span>
                    <span className="font-semibold">
                      − ₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline py-4 tabular-nums">
                <span className="text-base font-bold text-[#0A2540]">Estimated Total</span>
                <span className="text-2xl font-extrabold text-[#0A2540]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handlePromoSubmit} className="mb-4">
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="FLASH12 or STUDENT15"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540] uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0A2540] text-xs font-bold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMsg && (
                  <p
                    className={`text-xs mt-1.5 ${
                      promoMsg.ok ? 'text-[#059669]' : 'text-[#DC2626]'
                    }`}
                  >
                    {promoMsg.text}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {Object.keys(PROMO_CODES).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => applyPromo(c)}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:border-[#0A2540]"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </form>

              <button
                type="button"
                onClick={() => navigate('checkout')}
                className="w-full py-3.5 px-5 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-bold rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('shop', { category: '' })}
                className="w-full mt-2.5 py-2.5 px-4 border border-[#CBD5E1] text-[#334155] hover:border-[#0A2540] text-sm font-semibold rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
