import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Ruler, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const SCRUB_SIZES_IN = [
  { size: 'XS', chest: '34–35', waist: '26–27', hip: '35–36', length: '26.5' },
  { size: 'S', chest: '36–37', waist: '28–29', hip: '37–38', length: '27.0' },
  { size: 'M', chest: '38–40', waist: '30–32', hip: '39–41', length: '27.5' },
  { size: 'L', chest: '41–43', waist: '33–35', hip: '42–44', length: '28.5' },
  { size: 'XL', chest: '44–46', waist: '36–38', hip: '45–47', length: '29.0' },
  { size: '2XL', chest: '47–50', waist: '39–42', hip: '48–51', length: '29.5' },
  { size: '3XL', chest: '51–54', waist: '43–46', hip: '52–55', length: '30.0' },
];

function toCmRange(rangeStr: string) {
  return rangeStr
    .split('–')
    .map((n) => Math.round(parseFloat(n) * 2.54))
    .join('–');
}

export function SizeGuideModal() {
  const { isSizeGuideOpen, setSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  return (
    <AnimatePresence>
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
            onClick={() => setSizeGuideOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] mb-1">
              <Ruler className="w-4 h-4" />
              <span>Clinical Fit Specification</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#0A2540]">
              Scrubs &amp; Lab Coat Size Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(false)}
            aria-label="Close size guide"
            className="p-2 text-[#64748B] hover:text-[#0A2540] hover:bg-[#F1F5F9] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between my-4">
          <p className="text-sm text-[#475569]">
            Body measurements below. If between sizes, choose the larger size for a relaxed shift fit.
          </p>
          <div className="inline-flex p-1 bg-[#F1F5F9] rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                unit === 'in' ? 'bg-white text-[#0A2540] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Inches
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                unit === 'cm' ? 'bg-white text-[#0A2540] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
          <table className="w-full text-left text-sm tabular-nums">
            <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#475569] border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest ({unit})</th>
                <th className="py-3 px-4">Waist ({unit})</th>
                <th className="py-3 px-4">Hip ({unit})</th>
                <th className="py-3 px-4">Top Length ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {SCRUB_SIZES_IN.map((row) => (
                <tr key={row.size} className="hover:bg-[#FAFBF9]">
                  <td className="py-3 px-4 font-bold text-[#0A2540]">{row.size}</td>
                  <td className="py-3 px-4 text-[#334155]">
                    {unit === 'in' ? row.chest : toCmRange(row.chest)}
                  </td>
                  <td className="py-3 px-4 text-[#334155]">
                    {unit === 'in' ? row.waist : toCmRange(row.waist)}
                  </td>
                  <td className="py-3 px-4 text-[#334155]">
                    {unit === 'in' ? row.hip : toCmRange(row.hip)}
                  </td>
                  <td className="py-3 px-4 text-[#334155]">
                    {unit === 'in' ? row.length : toCmRange(row.length)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 p-4 bg-[#F8FAFC] rounded-xl text-xs text-[#475569] space-y-1">
          <p className="font-semibold text-[#0A2540]">7-Day Zero-Hassle Size Exchange</p>
          <p>
            Need a different fit? Request a free doorstep size swap within 7 days of delivery on all unwashed, non-embroidered garments.
          </p>
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
