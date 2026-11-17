import React, { useState } from 'react';
import { CheckCircle2, Package, Search, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

import { OrderRecord } from '../types/store';

const STAGES = ['Confirmed', 'Embroidery & QC', 'Dispatched', 'Out for Delivery'] as const;

export function TrackOrderPage() {
  const { orders } = useStore();
  const [queryId, setQueryId] = useState(orders[0]?.id || 'TM-2026-849201');
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(orders[0] ?? null);
  const [notFound, setNotFound] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = queryId.trim().toUpperCase();
    const match = orders.find((o) => o.id.toUpperCase() === cleaned);
    if (match) {
      setActiveOrder(match);
      setNotFound(false);
    } else {
      setActiveOrder(null);
      setNotFound(true);
    }
  };

  const stageIndex = activeOrder ? STAGES.indexOf(activeOrder.status) : -1;

  return (
    <main className="bg-[#FAFBF9] min-h-screen pb-20">
      <div className="bg-[#0A2540] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#93C5FD] mb-2">
            Real-Time Dispatch Status
          </p>
          <h1 className="text-3xl font-semibold text-white">Track Your Order</h1>
          <p className="text-sm text-[#CBD5E1] mt-1">
            Enter your Trade Meds Order ID to check embroidery, quality check, and courier milestones.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <form
          onSubmit={handleLookup}
          className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              placeholder="Enter Order ID (e.g. TM-2026-849201)"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540] uppercase tabular-nums"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Track Shipment
          </button>
        </form>

        {/* Quick Order Chips */}
        {orders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
            <span>Recent orders:</span>
            {orders.slice(0, 4).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setQueryId(o.id);
                  setActiveOrder(o);
                  setNotFound(false);
                }}
                className={`px-2.5 py-1 rounded-md border tabular-nums font-medium ${
                  activeOrder?.id === o.id
                    ? 'bg-[#0A2540] text-white border-[#0A2540]'
                    : 'bg-white text-[#334155] border-[#E2E8F0]'
                }`}
              >
                {o.id}
              </button>
            ))}
          </div>
        )}

        {notFound && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center">
            <p className="text-base font-semibold text-[#0A2540] mb-1">
              No order matched &ldquo;{queryId}&rdquo;
            </p>
            <p className="text-sm text-[#64748B]">
              Check your confirmation email or select one of your recent order IDs above.
            </p>
          </div>
        )}

        {activeOrder && (
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
              <div>
                <div className="text-xs font-semibold text-[#2563EB] mb-1">
                  Order {activeOrder.id}
                </div>
                <h2 className="text-xl font-bold text-[#0A2540] font-sans">
                  Current Status: {activeOrder.status}
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Placed on {activeOrder.createdAt} · Estimated arrival: {activeOrder.estimatedDelivery}
                </p>
              </div>
              <div className="text-left sm:text-right tabular-nums">
                <div className="text-xs text-[#64748B]">Order Total</div>
                <div className="text-xl font-extrabold text-[#0A2540]">
                  ₹{activeOrder.total.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* 4-Stage Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {STAGES.map((stage, idx) => {
                const completed = idx <= stageIndex;
                const Icon =
                  idx === 0
                    ? CheckCircle2
                    : idx === 1
                    ? Sparkles
                    : idx === 2
                    ? Package
                    : Truck;
                return (
                  <div
                    key={stage}
                    className={`p-4 rounded-xl border ${
                      completed
                        ? 'border-[#0A2540] bg-[#F8FAFC]'
                        : 'border-[#E2E8F0] opacity-55'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mb-2 ${
                        completed ? 'text-[#059669]' : 'text-[#94A3B8]'
                      }`}
                    />
                    <div className="text-sm font-bold text-[#0A2540]">{stage}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">
                      {completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Items */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#0A2540] font-sans mb-3">
                Items in Shipment
              </h3>
              <div className="space-y-2.5">
                {activeOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm py-2 border-b border-[#F1F5F9] last:border-none"
                  >
                    <div>
                      <span className="font-semibold text-[#0A2540]">
                        {item.name} × {item.qty}
                      </span>
                      <span className="block text-xs text-[#64748B]">
                        {item.color} · Size {item.size}
                        {item.embroideryText ? ` · Embroidery: "${item.embroideryText}"` : ''}
                      </span>
                    </div>
                    <span className="font-bold text-[#0A2540] tabular-nums">
                      ₹{((item.unitPrice + item.embroideryFee) * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
