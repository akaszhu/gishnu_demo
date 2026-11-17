import React, { useState } from 'react';
import { Building2, CheckCircle2, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const TIERS = [
  { qty: '15–49 Sets', discount: '12% Off', perks: 'Free hospital crest digitisation + size trial kit' },
  { qty: '50–199 Sets', discount: '18% Off', perks: 'Free custom department color-coding & name embroidery' },
  { qty: '200+ Sets', discount: '25% Off', perks: 'Dedicated account manager, GST net-30 billing & batch refills' },
];

export function BulkOrdersPage() {
  const { showToast } = useStore();
  const [institution, setInstitution] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [teamSize, setTeamSize] = useState('50–199 Sets');
  const [notes, setNotes] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      showToast('Please complete all required institutional contact fields.');
      return;
    }
    const ref = `BULK-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedRef(ref);
    showToast(`Institutional inquiry ${ref} submitted`);
  };

  return (
    <main className="bg-[#FAFBF9] min-h-screen pb-20">
      <div className="bg-[#0A2540] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#93C5FD] mb-2">
            Institutional Medical Uniforms
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white max-w-2xl">
            Outfit your entire hospital, clinic, or medical college cohort.
          </h1>
          <p className="text-sm sm:text-base text-[#CBD5E1] mt-3 max-w-2xl">
            Trusted by 520+ medical institutions across India for standardized department color-coding, precision crest embroidery, and rapid doorstep sizing kits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl font-semibold text-[#0A2540]">Volume Discount Tiers</h2>
          <div className="space-y-3">
            {TIERS.map((tier) => (
              <div
                key={tier.qty}
                className="p-5 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-base font-bold text-[#0A2540] tabular-nums">{tier.qty}</div>
                  <div className="text-xs text-[#64748B] mt-0.5">{tier.perks}</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-sm font-extrabold tabular-nums shrink-0">
                  {tier.discount}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
              <Sparkles className="w-5 h-5 text-[#2563EB] mb-2" />
              <div className="text-sm font-bold text-[#0A2540]">Logo Embroidery</div>
              <p className="text-xs text-[#64748B] mt-1">High-stitch hospital crests &amp; role tags</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
              <Ruler className="w-5 h-5 text-[#2563EB] mb-2" />
              <div className="text-sm font-bold text-[#0A2540]">On-Site Sizing Kit</div>
              <p className="text-xs text-[#64748B] mt-1">Sample sizes XS–3XL shipped before production</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
              <ShieldCheck className="w-5 h-5 text-[#2563EB] mb-2" />
              <div className="text-sm font-bold text-[#0A2540]">GST &amp; PO Ready</div>
              <p className="text-xs text-[#64748B] mt-1">Formal purchase orders &amp; tax invoices</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8">
          {submittedRef ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto mb-3" />
              <h2 className="text-2xl font-semibold text-[#0A2540] mb-2">
                Quote Request Received
              </h2>
              <p className="text-sm text-[#475569] mb-4">
                Reference <strong className="text-[#0A2540] tabular-nums">{submittedRef}</strong> has been assigned to our institutional team for <strong>{institution}</strong>.
              </p>
              <p className="text-xs text-[#64748B] mb-6">
                Expect a custom itemized quote and sizing trial schedule within 4 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="px-5 py-2.5 bg-[#0A2540] text-white text-sm font-semibold rounded-lg"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
                <Building2 className="w-4 h-4" />
                <span>Institutional Sales Desk</span>
              </div>
              <h2 className="text-2xl font-semibold text-[#0A2540]">Request a Bulk Quote</h2>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Hospital / Medical College / Clinic Name *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. St. John's Medical College Hospital"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Coordinator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Dr. / Procurement Lead"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Estimated Quantity *
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg bg-white"
                  >
                    <option>15–49 Sets</option>
                    <option>50–199 Sets</option>
                    <option>200–500 Sets</option>
                    <option>500+ Sets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@hospital.org"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Department Colors &amp; Embroidery Requirements
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 60 Navy ecoflex scrubs for ICU, 40 Chief Lab Coats with hospital crest..."
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-sm font-bold rounded-lg transition-colors"
              >
                Submit Institutional Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
