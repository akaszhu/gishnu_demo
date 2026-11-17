import React from 'react';
import { CheckCircle2, PackageCheck, Printer, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function OrderSuccessPage() {
  const { latestOrder, orders, navigate } = useStore();
  const order = latestOrder || orders[0];

  if (!order) {
    return (
      <main className="py-20 text-center">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="px-6 py-3 bg-[#0A2540] text-white rounded-lg text-sm font-semibold"
        >
          Return Home
        </button>
      </main>
    );
  }

  return (
    <main className="bg-[#FAFBF9] min-h-screen py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="text-center pb-8 border-b border-[#E2E8F0]">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#059669] mb-1">
            Order Confirmed
          </p>
          <h1 className="text-3xl font-semibold text-[#0A2540] mb-2">
            Thank you, {order.address.firstName}!
          </h1>
          <p className="text-sm text-[#475569]">
            Order <strong className="text-[#0A2540] tabular-nums">{order.id}</strong> has been received and queued for clinical dispatch.
          </p>
        </div>

        {/* Key Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-[#E2E8F0] text-sm">
          <div>
            <div className="text-xs text-[#64748B] mb-1">Order Placed</div>
            <div className="font-semibold text-[#0A2540]">{order.createdAt}</div>
          </div>
          <div>
            <div className="text-xs text-[#64748B] mb-1">Payment Method</div>
            <div className="font-semibold text-[#0A2540] uppercase">{order.paymentMethod}</div>
          </div>
          <div>
            <div className="text-xs text-[#64748B] mb-1">Estimated Delivery</div>
            <div className="font-semibold text-[#059669]">{order.estimatedDelivery}</div>
          </div>
        </div>

        {/* Shipping To */}
        <div className="py-6 border-b border-[#E2E8F0]">
          <h2 className="text-sm font-bold text-[#0A2540] font-sans mb-2">Delivering To</h2>
          <p className="text-sm text-[#475569]">
            {order.address.firstName} {order.address.lastName} · {order.address.phone}
          </p>
          <p className="text-sm text-[#475569]">
            {order.address.address1}
            {order.address.address2 ? `, ${order.address.address2}` : ''}, {order.address.city},{' '}
            {order.address.state} — {order.address.pinCode}
          </p>
          {order.address.gstin && (
            <p className="text-xs text-[#2563EB] mt-1 font-medium">
              GSTIN Invoice Requested: {order.address.gstin}
            </p>
          )}
        </div>

        {/* Items */}
        <div className="py-6 border-b border-[#E2E8F0]">
          <h2 className="text-sm font-bold text-[#0A2540] font-sans mb-4">Receipt Summary</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between gap-4 text-sm">
                <div>
                  <div className="font-semibold text-[#0A2540]">
                    {item.name} × {item.qty}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    {item.color} · Size {item.size}
                    {item.embroideryText ? ` · Embroidery: "${item.embroideryText}"` : ''}
                  </div>
                </div>
                <div className="font-bold text-[#0A2540] tabular-nums">
                  ₹{((item.unitPrice + item.embroideryFee) * item.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#F1F5F9] space-y-1.5 text-sm tabular-nums">
            <div className="flex justify-between text-[#475569]">
              <span>Subtotal</span>
              <span>₹{(order.subtotal + order.embroideryTotal).toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#059669]">
                <span>Discount ({order.discountCode})</span>
                <span>− ₹{order.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-[#475569]">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#0A2540] pt-2">
              <span>Total Paid</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 border border-[#CBD5E1] text-[#334155] hover:border-[#0A2540] text-xs font-semibold rounded-lg inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('track')}
              className="px-5 py-2.5 border border-[#0A2540] text-[#0A2540] hover:bg-[#F1F5F9] text-sm font-semibold rounded-lg inline-flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('shop', { category: '' })}
              className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
