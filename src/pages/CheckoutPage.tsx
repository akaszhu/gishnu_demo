import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  ShieldCheck,
  Smartphone,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/catalog';
import { PaymentMethod, ShippingAddress } from '../types/store';

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Delhi NCR',
  'Tamil Nadu',
  'Telangana',
  'Kerala',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Uttar Pradesh',
  'Punjab',
  'Other',
];

export function CheckoutPage() {
  const {
    cart,
    cartSubtotal,
    embroideryTotal,
    discountAmount,
    appliedPromo,
    placeOrder,
    navigate,
    showToast,
  } = useStore();

  const [address, setAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    gstin: '',
  });

  const [needGst, setNeedGst] = useState(false);
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  // Payment method sub-inputs
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm'>('GPay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [emiTenure, setEmiTenure] = useState<'3' | '6'>('3');
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <main className="bg-[#FAFBF9] min-h-screen py-16 px-4">
        <div className="max-w-lg mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-semibold text-[#0A2540] mb-2">Your bag is empty</h1>
          <p className="text-sm text-[#64748B] mb-6">
            Add medical apparel or stethoscopes before proceeding to payment.
          </p>
          <button
            type="button"
            onClick={() => navigate('shop', { category: '' })}
            className="px-6 py-3 bg-[#0A2540] text-white text-sm font-semibold rounded-lg"
          >
            Return to Shop
          </button>
        </div>
      </main>
    );
  }

  const baseShipping = cartSubtotal >= 1999 ? 0 : 99;
  const shippingFee = deliverySpeed === 'express' ? 149 : baseShipping;
  const grandTotal = Math.max(0, cartSubtotal + embroideryTotal - discountAmount + shippingFee);

  const fillDemoDetails = () => {
    setAddress({
      firstName: 'Aarav',
      lastName: 'Kulkarni',
      email: 'dr.aarav.kulkarni@hospitalmail.in',
      phone: '+91 98204 51120',
      address1: '402, Lotus Doctors Residency, Parel',
      address2: 'Near KEM Hospital Gate 3',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400012',
      gstin: '',
    });
    setUpiId('aarav.kulkarni@okhdfcbank');
    showToast('Sample clinician shipping details filled');
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !address.firstName.trim() ||
      !address.email.trim() ||
      !address.phone.trim() ||
      !address.address1.trim() ||
      !address.city.trim() ||
      address.pinCode.trim().length < 6
    ) {
      showToast('Please complete all required shipping fields and a 6-digit PIN code.');
      return;
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      showToast('Enter your UPI ID (e.g. name@okicici) or choose another payment method.');
      return;
    }

    if (paymentMethod === 'card' && (cardNumber.replace(/\s/g, '').length < 12 || !cardExpiry || !cardCvv)) {
      showToast('Please enter valid card details.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const orderItems = cart.map((item) => {
        const p = PRODUCTS.find((x) => x.id === item.productId)!;
        const embFee = item.embroidery?.enabled ? 199 : 0;
        return {
          productId: p.id,
          name: p.name,
          image: p.image,
          color: item.color,
          size: item.size,
          qty: item.qty,
          unitPrice: p.price,
          embroideryFee: embFee,
          embroideryText: item.embroidery?.enabled
            ? `${item.embroidery.line1}${item.embroidery.line2 ? ` · ${item.embroidery.line2}` : ''}`
            : undefined,
        };
      });

      const estimated =
        deliverySpeed === 'express'
          ? 'Within 48 Hours (Express Air)'
          : '3–5 Business Days';

      setSubmitting(false);
      placeOrder({
        items: orderItems,
        subtotal: cartSubtotal,
        embroideryTotal,
        discountCode: appliedPromo || undefined,
        discountAmount,
        shippingFee,
        total: grandTotal,
        deliverySpeed,
        paymentMethod,
        address,
        estimatedDelivery: estimated,
      });
    }, 650);
  };

  return (
    <main className="bg-[#FAFBF9] min-h-screen pb-20">
      <div className="bg-[#0A2540] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate('cart')}
              className="text-xs text-[#93C5FD] hover:text-white inline-flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shopping Bag</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Secure Checkout &amp; Payment
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
            <Lock className="w-4 h-4 text-[#10B981]" />
            <span>256-Bit SSL Encrypted Clinical Payment Gateway</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleCheckoutSubmit}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Address, Delivery & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Shipping Information */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-bold text-[#0A2540] font-sans">
                1. Clinician &amp; Delivery Address
              </h2>
              <button
                type="button"
                onClick={fillDemoDetails}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Fill Demo Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.firstName}
                  onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                  placeholder="Dr. Aarav"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.lastName}
                  onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                  placeholder="Kulkarni"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="doctor@hospital.org"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Mobile Number (for SMS updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="+91 98204 51120"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Hospital / Clinic / Flat &amp; Street *
                </label>
                <input
                  type="text"
                  required
                  value={address.address1}
                  onChange={(e) => setAddress({ ...address, address1: e.target.value })}
                  placeholder="Building, Ward / Department, Street"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Landmark / Campus (Optional)
                </label>
                <input
                  type="text"
                  value={address.address2}
                  onChange={(e) => setAddress({ ...address, address2: e.target.value })}
                  placeholder="Area, Campus Gate"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Mumbai"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">State *</label>
                <select
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:border-[#0A2540]"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={address.pinCode}
                  onChange={(e) =>
                    setAddress({ ...address, pinCode: e.target.value.replace(/\D/g, '') })
                  }
                  placeholder="400012"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg tabular-nums focus:outline-none focus:border-[#0A2540]"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={needGst}
                  onChange={(e) => setNeedGst(e.target.checked)}
                  className="accent-[#0A2540]"
                />
                <span>Claim Hospital / Clinic GST Input Tax Credit (GST Invoice)</span>
              </label>
              {needGst && (
                <input
                  type="text"
                  value={address.gstin || ''}
                  onChange={(e) => setAddress({ ...address, gstin: e.target.value.toUpperCase() })}
                  placeholder="Enter 15-character GSTIN (e.g. 27AABCT1332L1Z7)"
                  className="mt-2.5 w-full sm:w-80 block px-3.5 py-2 text-xs border border-[#CBD5E1] rounded-lg uppercase"
                />
              )}
            </div>
          </section>

          {/* 2. Delivery Speed */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#0A2540] font-sans pb-4 mb-4 border-b border-[#E2E8F0]">
              2. Delivery Speed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliverySpeed('standard')}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  deliverySpeed === 'standard'
                    ? 'border-[#0A2540] bg-[#F8FAFC]'
                    : 'border-[#E2E8F0] hover:border-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#0A2540]">Standard Delivery</span>
                  <span className="text-xs font-bold text-[#059669] tabular-nums">
                    {baseShipping === 0 ? 'Free' : `₹${baseShipping}`}
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">3–5 Business Days via BlueDart</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliverySpeed('express')}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  deliverySpeed === 'express'
                    ? 'border-[#0A2540] bg-[#F8FAFC]'
                    : 'border-[#E2E8F0] hover:border-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#0A2540]">Priority Clinical Air</span>
                  <span className="text-xs font-bold text-[#0A2540] tabular-nums">₹149</span>
                </div>
                <p className="text-xs text-[#64748B]">Guaranteed 24–48 hr priority dispatch</p>
              </button>
            </div>
          </section>

          {/* 3. Payment Method */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#0A2540] font-sans pb-4 mb-4 border-b border-[#E2E8F0]">
              3. Payment Method
            </h2>

            <div className="space-y-3">
              {/* UPI */}
              <div
                className={`rounded-xl border p-4 transition-colors ${
                  paymentMethod === 'upi' ? 'border-[#0A2540] bg-[#F8FAFC]' : 'border-[#E2E8F0]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#2563EB]" />
                    <div>
                      <div className="text-sm font-bold text-[#0A2540]">
                        UPI Instant Pay (GPay, PhonePe, Paytm)
                      </div>
                      <div className="text-xs text-[#64748B]">Zero convenience fee · Instant approval</div>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'upi' ? 'border-[#0A2540]' : 'border-[#CBD5E1]'
                    }`}
                  >
                    {paymentMethod === 'upi' && (
                      <span className="w-2 h-2 rounded-full bg-[#0A2540]" />
                    )}
                  </span>
                </button>

                {paymentMethod === 'upi' && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-3">
                    <div className="flex gap-2">
                      {(['GPay', 'PhonePe', 'Paytm'] as const).map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setUpiApp(app)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${
                            upiApp === app
                              ? 'bg-[#0A2540] text-white border-[#0A2540]'
                              : 'bg-white text-[#475569] border-[#CBD5E1]'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder={`Enter ${upiApp} UPI ID (e.g. doctor@okhdfcbank)`}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0A2540]"
                    />
                  </div>
                )}
              </div>

              {/* Card */}
              <div
                className={`rounded-xl border p-4 transition-colors ${
                  paymentMethod === 'card' ? 'border-[#0A2540] bg-[#F8FAFC]' : 'border-[#E2E8F0]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#2563EB]" />
                    <div>
                      <div className="text-sm font-bold text-[#0A2540]">
                        Credit / Debit Card (VISA, Mastercard, RuPay)
                      </div>
                      <div className="text-xs text-[#64748B]">3D Secure OTP verified</div>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-[#0A2540]' : 'border-[#CBD5E1]'
                    }`}
                  >
                    {paymentMethod === 'card' && (
                      <span className="w-2 h-2 rounded-full bg-[#0A2540]" />
                    )}
                  </span>
                </button>

                {paymentMethod === 'card' && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="Card Number (e.g. 4532 8901 2245 7710)"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg tabular-nums"
                      />
                    </div>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg tabular-nums"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="CVV"
                      className="px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg tabular-nums"
                    />
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on Card"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Net Banking */}
              <div
                className={`rounded-xl border p-4 transition-colors ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#0A2540] bg-[#F8FAFC]'
                    : 'border-[#E2E8F0]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <Landmark className="w-5 h-5 text-[#2563EB]" />
                    <div>
                      <div className="text-sm font-bold text-[#0A2540]">Net Banking</div>
                      <div className="text-xs text-[#64748B]">HDFC, ICICI, SBI, Axis, Kotak</div>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'netbanking' ? 'border-[#0A2540]' : 'border-[#CBD5E1]'
                    }`}
                  >
                    {paymentMethod === 'netbanking' && (
                      <span className="w-2 h-2 rounded-full bg-[#0A2540]" />
                    )}
                  </span>
                </button>

                {paymentMethod === 'netbanking' && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-wrap gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra'].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${
                            selectedBank === bank
                              ? 'bg-[#0A2540] text-white border-[#0A2540]'
                              : 'bg-white text-[#475569] border-[#CBD5E1]'
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* No-Cost EMI */}
              <div
                className={`rounded-xl border p-4 transition-colors ${
                  paymentMethod === 'emi' ? 'border-[#0A2540] bg-[#F8FAFC]' : 'border-[#E2E8F0]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod('emi')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                    <div>
                      <div className="text-sm font-bold text-[#0A2540]">
                        0% No-Cost EMI (3 or 6 Months)
                      </div>
                      <div className="text-xs text-[#64748B]">
                        Starting ₹{Math.round(grandTotal / 6).toLocaleString('en-IN')}/mo
                      </div>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'emi' ? 'border-[#0A2540]' : 'border-[#CBD5E1]'
                    }`}
                  >
                    {paymentMethod === 'emi' && (
                      <span className="w-2 h-2 rounded-full bg-[#0A2540]" />
                    )}
                  </span>
                </button>

                {paymentMethod === 'emi' && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] grid grid-cols-2 gap-3">
                    {(['3', '6'] as const).map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setEmiTenure(months)}
                        className={`p-3 rounded-lg border text-left ${
                          emiTenure === months
                            ? 'bg-[#0A2540] text-white border-[#0A2540]'
                            : 'bg-white text-[#334155] border-[#CBD5E1]'
                        }`}
                      >
                        <div className="text-xs font-bold">{months} Months @ 0% p.a.</div>
                        <div className="text-sm font-extrabold tabular-nums mt-0.5">
                          ₹{Math.round(grandTotal / Number(months)).toLocaleString('en-IN')}/mo
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cash on Delivery */}
              <div
                className={`rounded-xl border p-4 transition-colors ${
                  paymentMethod === 'cod' ? 'border-[#0A2540] bg-[#F8FAFC]' : 'border-[#E2E8F0]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#059669]" />
                    <div>
                      <div className="text-sm font-bold text-[#0A2540]">
                        Cash / UPI on Delivery (COD)
                      </div>
                      <div className="text-xs text-[#64748B]">
                        Pay at your hospital desk or doorstep upon delivery
                      </div>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-[#0A2540]' : 'border-[#CBD5E1]'
                    }`}
                  >
                    {paymentMethod === 'cod' && (
                      <span className="w-2 h-2 rounded-full bg-[#0A2540]" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <aside className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-[#0A2540] font-sans pb-4 mb-4 border-b border-[#E2E8F0]">
            Order Summary
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 pb-4 border-b border-[#E2E8F0]">
            {cart.map((item) => {
              const p = PRODUCTS.find((x) => x.id === item.productId);
              if (!p) return null;
              return (
                <div key={item.key} className="flex justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0A2540] truncate">{p.name}</p>
                    <p className="text-xs text-[#64748B]">
                      {item.color} · Size {item.size} × {item.qty}
                      {item.embroidery?.enabled ? ' · +Embroidery' : ''}
                    </p>
                  </div>
                  <span className="font-bold text-[#0A2540] tabular-nums shrink-0">
                    ₹
                    {(
                      (p.price + (item.embroidery?.enabled ? 199 : 0)) *
                      item.qty
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5 py-4 border-b border-[#E2E8F0] text-sm tabular-nums">
            <div className="flex justify-between text-[#475569]">
              <span>Subtotal</span>
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
              <span>Shipping ({deliverySpeed === 'express' ? 'Express' : 'Standard'})</span>
              <span className="font-semibold text-[#059669]">
                {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
              </span>
            </div>
            {appliedPromo && discountAmount > 0 && (
              <div className="flex justify-between text-[#059669]">
                <span>Discount ({appliedPromo})</span>
                <span className="font-semibold">
                  − ₹{discountAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-baseline py-4 tabular-nums">
            <span className="text-base font-bold text-[#0A2540]">Total Payable</span>
            <span className="text-2xl font-extrabold text-[#0A2540]">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 bg-[#0A2540] hover:bg-[#1E3A8A] disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors shadow-sm tabular-nums"
          >
            {submitting
              ? 'Processing Secure Payment...'
              : paymentMethod === 'cod'
              ? `Confirm COD Order · ₹${grandTotal.toLocaleString('en-IN')}`
              : `Pay ₹${grandTotal.toLocaleString('en-IN')} & Place Order`}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>7-day size exchange · Instant confirmation SMS &amp; receipt</span>
          </div>
        </aside>
      </form>
    </main>
  );
}
