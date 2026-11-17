import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/catalog';
import { CategoryName } from '../types/store';
import { ResilientImage } from './ResilientImage';

type GuardStatus =
  | 'on_topic'
  | 'off_topic_redirect'
  | 'medical_disclaimer'
  | 'injection_blocked';

interface SuggestedAction {
  label: string;
  action: 'shop' | 'stores' | 'bulk' | 'track' | 'size_guide' | 'cart';
  category?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  guardStatus?: GuardStatus;
  guardReason?: string;
  recommendedProductIds?: number[];
  suggestedActions?: SuggestedAction[];
  followUpPrompts?: string[];
}

const STARTER_PROMPTS = [
  'Best scrubs for 12-hour ICU shifts?',
  'Help me pick a stethoscope & size',
  'Do you have stores in Bengaluru or Mumbai?',
  'Explain promo codes & custom embroidery',
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Welcome to Trade Meds. I am your Clinical Outfitting Guide, protected by Match Guard to keep sizing, fabric, embroidery, and store guidance accurate.',
  guardStatus: 'on_topic',
  guardReason: 'Match Guard · Verified Storefront Assistant',
  recommendedProductIds: [1, 4],
  suggestedActions: [
    { label: 'Open Size Guide', action: 'size_guide' },
    { label: 'Visit 8 Offline Stores', action: 'stores' },
  ],
  followUpPrompts: STARTER_PROMPTS,
};

type ClinicalRole = 'icu' | 'surgery' | 'opd' | 'student' | 'paediatrics';
type TargetTrack = 'Women' | 'Men' | 'Lab Coats' | 'Full Kit';
type ClimateType = 'cold_ac' | 'warm_ward';
type FitPreference = 'tailored' | 'relaxed';

const CHEST_OPTIONS = [
  { label: '34–35" (Chest / Bust)', baseIdx: 0 },
  { label: '36–37" (Chest / Bust)', baseIdx: 1 },
  { label: '38–40" (Chest / Bust)', baseIdx: 2 },
  { label: '41–43" (Chest / Bust)', baseIdx: 3 },
  { label: '44–46" (Chest / Bust)', baseIdx: 4 },
  { label: '47–50" (Chest / Bust)', baseIdx: 5 },
  { label: '51–54" (Chest / Bust)', baseIdx: 6 },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export function AssistantMatchGuard() {
  const {
    page,
    selectedProductId,
    cartCount,
    navigate,
    addToCart,
    setSizeGuideOpen,
    setCartDrawerOpen,
    isAssistantOpen,
    setAssistantOpen,
    applyPromo,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'guard'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Interactive Match Guard (Fit & Shift Kit Matcher) state
  const [role, setRole] = useState<ClinicalRole>('icu');
  const [track, setTrack] = useState<TargetTrack>('Women');
  const [climate, setClimate] = useState<ClimateType>('cold_ac');
  const [chestIdx, setChestIdx] = useState<number>(2);
  const [fitPref, setFitPref] = useState<FitPreference>('tailored');

  useEffect(() => {
    if (scrollRef.current && activeTab === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, activeTab, isAssistantOpen]);

  const matchResult = useMemo(() => {
    const rawIdx = fitPref === 'relaxed' ? Math.min(6, chestIdx + 1) : chestIdx;
    const lockedSize = ALL_SIZES[rawIdx] || 'M';
    // Men's scrub lines start at S
    const mensSafeSize = lockedSize === 'XS' ? 'S' : lockedSize;

    const matchedIds: number[] = [];
    let recommendedColor = 'Clinical Navy';
    let fabricSummary = 'ecoflex™ 185 GSM 4-Way Stretch';
    let promoTip = 'FLASH12 (12% Off)';

    if (role === 'student') {
      promoTip = 'STUDENT15 (15% Student Privilege)';
    } else if (role === 'opd') {
      promoTip = 'DOC10 (10% Clinician Privilege) or FLASH12 (12% Off)';
    }

    if (track === 'Lab Coats') {
      matchedIds.push(role === 'student' ? 10 : 3, 7);
      recommendedColor = 'Optic Clinical White';
      fabricSummary =
        role === 'student'
          ? 'Campus 205 GSM Cotton-Poly Academic Twill'
          : 'Chief 220 GSM Hydrophobic Structured Gabardine';
    } else if (track === 'Women') {
      if (climate === 'warm_ward') {
        matchedIds.push(8, 5);
        recommendedColor = 'Sage Mist';
        fabricSummary = 'ecoflex™ Lite 155 GSM Cooling Stretch';
      } else {
        matchedIds.push(1, 13);
        recommendedColor = role === 'paediatrics' ? 'Burgundy Wine' : 'Clinical Navy';
        fabricSummary = 'ecoflex™ 185 GSM 4-Way Stretch + Pima Base Layer';
      }
    } else if (track === 'Men') {
      if (climate === 'warm_ward') {
        matchedIds.push(9, 6);
        recommendedColor = 'Forest Olive';
        fabricSummary = 'ecoflex™ Lite 160 GSM Cooling Flex';
      } else {
        matchedIds.push(2, 13);
        recommendedColor = 'Charcoal Slate';
        fabricSummary = 'ecoflex™ 190 GSM Performance Twill + Pima Base Layer';
      }
    } else {
      // Full Shift Kit
      const scrubId =
        climate === 'warm_ward'
          ? role === 'student'
            ? 5
            : 8
          : role === 'surgery'
            ? 2
            : 1;
      const stethId = role === 'student' ? 11 : 4;
      matchedIds.push(scrubId, stethId, 12);
      if (climate === 'cold_ac') {
        matchedIds.push(15);
      }
      recommendedColor =
        climate === 'warm_ward' ? 'Sage Mist' : 'Clinical Navy';
      fabricSummary =
        climate === 'warm_ward'
          ? 'Cooling ecoflex™ Lite + SRC Anti-Slip Clogs + 6sense Acoustics'
          : 'ecoflex™ 4-Way Stretch + 6sense Dual-Head + DWR Ward Shell';
    }

    const matchedProducts = matchedIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

    const checks: Array<{ ok: boolean; text: string }> = [
      {
        ok: true,
        text: `Size Match Guard locked ${
          track === 'Men' ? mensSafeSize : lockedSize
        } (${fitPref === 'relaxed' ? '+1 ease allowance applied' : 'true-to-chest clinical drape'})`,
      },
      {
        ok: climate === 'cold_ac' || track === 'Lab Coats' || matchedProducts.some((p) => p.line !== 'Drift'),
        text:
          climate === 'cold_ac'
            ? 'Cold AC/OT Guard: Breathable 185+ GSM weave pairs cleanly with DRIFT base layer'
            : 'Warm Ward Guard: Lightweight <=175 GSM breathable weave prevents heat buildup',
      },
      {
        ok: matchedProducts.some((p) => p.supportsEmbroidery),
        text: matchedProducts.every((p) => p.supportsEmbroidery)
          ? 'Embroidery Guard: All matched garments support +₹199 chest embroidery'
          : 'Embroidery Guard: Scrubs/Lab Coats support +₹199 chest embroidery; stethoscopes & clogs do not',
      },
    ];

    return {
      lockedSize: track === 'Men' ? mensSafeSize : lockedSize,
      recommendedColor,
      fabricSummary,
      promoTip,
      matchedProducts,
      checks,
    };
  }, [role, track, climate, chestIdx, fitPref]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
          context: {
            currentPage: page,
            activeProductId: page === 'product' ? selectedProductId : undefined,
            cartCount,
          },
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        guardStatus?: GuardStatus;
        guardReason?: string;
        reply?: string;
        recommendedProductIds?: number[];
        suggestedActions?: SuggestedAction[];
        followUpPrompts?: string[];
      };

      if (!res.ok) {
        setErrorMsg(data.error || 'Unable to reach Trade Meds Guide right now.');
        setLoading(false);
        return;
      }

      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Here is what I found in our catalog.',
        guardStatus: data.guardStatus || 'on_topic',
        guardReason: data.guardReason,
        recommendedProductIds: data.recommendedProductIds || [],
        suggestedActions: data.suggestedActions || [],
        followUpPrompts: data.followUpPrompts || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setErrorMsg('Network error reaching the Trade Meds Assistant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (act: SuggestedAction) => {
    if (act.action === 'size_guide') {
      setSizeGuideOpen(true);
      return;
    }
    if (act.action === 'cart') {
      setCartDrawerOpen(true);
      return;
    }
    if (act.action === 'stores') {
      navigate('stores');
      return;
    }
    if (act.action === 'bulk') {
      navigate('bulk');
      return;
    }
    if (act.action === 'track') {
      navigate('track');
      return;
    }
    if (act.action === 'shop') {
      const validCats: Array<CategoryName | ''> = [
        'Women',
        'Men',
        'Lab Coats',
        'Stethoscopes',
        'Accessories',
        '',
      ];
      const cat = validCats.includes((act.category || '') as CategoryName | '')
        ? ((act.category || '') as CategoryName | '')
        : '';
      navigate('shop', { category: cat });
    }
  };

  const handleAddMatchedKit = () => {
    matchResult.matchedProducts.forEach((p, idx) => {
      const chosenSize = p.sizes.includes(matchResult.lockedSize)
        ? matchResult.lockedSize
        : p.sizes[Math.min(1, p.sizes.length - 1)] || 'Standard';
      const chosenColor =
        p.colors.find((c) => c.name === matchResult.recommendedColor)?.name ||
        p.colors[0]?.name;
      addToCart(p.id, {
        size: chosenSize,
        color: chosenColor,
        qty: 1,
        openDrawer: idx === matchResult.matchedProducts.length - 1,
      });
    });
    if (role === 'student') {
      applyPromo('STUDENT15');
    }
    setAssistantOpen(false);
  };

  const handleAskAiAboutMatch = () => {
    const prompt = `Match Guard recommended Size ${matchResult.lockedSize} in ${matchResult.fabricSummary} (${matchResult.recommendedColor}) for my ${role} rotation (${climate === 'cold_ac' ? 'cold AC/OT' : 'warm ward'}). Can you confirm pocket count, care instructions, and any alternative colorway?`;
    setActiveTab('chat');
    void sendMessage(prompt);
  };

  const renderGuardBadge = (status?: GuardStatus, reason?: string) => {
    if (!status) return null;
    if (status === 'medical_disclaimer') {
      return (
        <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[11px] font-semibold flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{reason || 'Match Guard · Medical Advice Boundary'}</span>
        </div>
      );
    }
    if (status === 'off_topic_redirect' || status === 'injection_blocked') {
      return (
        <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] text-[11px] font-semibold flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#0A2540]" />
          <span>{reason || 'Match Guard · Storefront Scope Shield'}</span>
        </div>
      );
    }
    return (
      <div className="mb-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>{reason || 'Match Guard · Verified Catalog'}</span>
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isAssistantOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setAssistantOpen(true)}
          aria-label="Open Trade Meds AI Care Guide and Match Guard"
          className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white shadow-xl border border-white/15 flex items-center gap-2.5 transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-bold">Care Guide &amp; Match Guard</div>
            <div className="text-[10px] text-[#93C5FD]">Fit, Scrubs &amp; Store Help</div>
          </div>
        </motion.button>
      )}

      {/* Assistant & Match Guard Drawer/Panel */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Trade Meds Care Guide and Match Guard"
            className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[420px] h-[min(640px,calc(100vh-2.5rem))] bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0A2540] text-white px-4 pt-3.5 pb-3 shrink-0">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-white truncate font-sans">
                      Trade Meds Care Guide
                    </h2>
                    <p className="text-[11px] text-[#93C5FD] truncate">
                      Match Guard Protected · Catalog, Sizing &amp; Stores
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {activeTab === 'chat' && messages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setMessages([INITIAL_MESSAGE]);
                        setErrorMsg(null);
                      }}
                      title="Reset conversation"
                      aria-label="Reset conversation"
                      className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setAssistantOpen(false)}
                    aria-label="Close Care Guide"
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-white text-[#0A2540]'
                      : 'text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>AI Guide Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('guard')}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'guard'
                      ? 'bg-white text-[#0A2540]'
                      : 'text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Fit &amp; Kit Match Guard</span>
                </button>
              </div>
            </div>

            {/* Tab 1: AI Care Guide Chat */}
            {activeTab === 'chat' ? (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFBF9]"
                >
                  {messages.map((msg) => {
                    if (msg.role === 'user') {
                      return (
                        <div key={msg.id} className="flex justify-end">
                          <div className="max-w-[85%] bg-[#0A2540] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl rounded-tr-sm leading-relaxed">
                            {msg.text}
                          </div>
                        </div>
                      );
                    }

                    const recProducts = (msg.recommendedProductIds || [])
                      .map((id) => PRODUCTS.find((p) => p.id === id))
                      .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

                    return (
                      <div key={msg.id} className="flex justify-start">
                        <div className="max-w-[94%] bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-sm p-3.5 shadow-xs space-y-3">
                          {renderGuardBadge(msg.guardStatus, msg.guardReason)}

                          <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed whitespace-pre-line">
                            {msg.text}
                          </p>

                          {/* Matched Product Cards */}
                          {recProducts.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {recProducts.map((p) => (
                                <div
                                  key={p.id}
                                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                                >
                                  <div className="w-11 h-14 rounded-lg overflow-hidden bg-[#E2E8F0] shrink-0">
                                    <ResilientImage
                                      src={p.image}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-[#0A2540] truncate">
                                      {p.name}
                                    </div>
                                    <div className="text-[11px] text-[#64748B] tabular-nums">
                                      ₹{p.price.toLocaleString('en-IN')} · {p.line}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => navigate('product', { productId: p.id })}
                                      className="px-2 py-1 rounded-md border border-[#CBD5E1] hover:border-[#0A2540] text-[11px] font-semibold text-[#0A2540] bg-white"
                                    >
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => addToCart(p.id, { qty: 1, openDrawer: true })}
                                      className="px-2 py-1 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-[11px] font-semibold text-white"
                                    >
                                      + Bag
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Storefront Quick Actions */}
                          {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestedActions.map((act, idx) => (
                                <button
                                  key={`${act.label}-${idx}`}
                                  type="button"
                                  onClick={() => handleAction(act)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                >
                                  <span>{act.label}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Follow-Up Prompts */}
                          {msg.followUpPrompts && msg.followUpPrompts.length > 0 && (
                            <div className="pt-2 border-t border-[#F1F5F9] flex flex-wrap gap-1.5">
                              {msg.followUpPrompts.map((fp) => (
                                <button
                                  key={fp}
                                  type="button"
                                  disabled={loading}
                                  onClick={() => void sendMessage(fp)}
                                  className="text-left px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0A2540] text-[11px] text-[#475569] hover:text-[#0A2540] transition-colors"
                                >
                                  {fp}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-sm px-3.5 py-2.5 inline-flex items-center gap-2 text-xs text-[#475569]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
                        <span>Checking Match Guard &amp; catalog...</span>
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold">Assistant Unavailable</p>
                        <p className="mt-0.5">{errorMsg}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendMessage(input);
                  }}
                  className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about scrubs, sizing, stethoscopes, or stores..."
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0A2540]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                    className="p-2.5 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] disabled:opacity-45 text-white transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              /* Tab 2: Interactive Fit, Climate & Shift Kit Match Guard */
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFBF9]">
                <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#2563EB]" />
                  <div>
                    <span className="font-bold">Clinical Match Guard:</span> Prevents size, climate, and embroidery mismatches before you order.
                  </div>
                </div>

                {/* Role & Category */}
                <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                      1. Clinical Department / Role
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(
                        [
                          { id: 'icu', label: 'ICU & Emergency' },
                          { id: 'surgery', label: 'Surgery / OT' },
                          { id: 'opd', label: 'OPD / Consultant' },
                          { id: 'student', label: 'MBBS / Nursing' },
                        ] as const
                      ).map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            role === r.id
                              ? 'bg-[#0A2540] text-white border-[#0A2540]'
                              : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#94A3B8]'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                      2. Outfitting Track &amp; Ward Climate
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {(['Women', 'Men', 'Lab Coats', 'Full Kit'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTrack(t)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            track === t
                              ? 'bg-[#2563EB] text-white border-[#2563EB]'
                              : 'bg-white text-[#475569] border-[#E2E8F0]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setClimate('cold_ac')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                          climate === 'cold_ac'
                            ? 'bg-[#F1F5F9] text-[#0A2540] border-[#0A2540]'
                            : 'bg-white text-[#64748B] border-[#E2E8F0]'
                        }`}
                      >
                        Cold AC / OT
                      </button>
                      <button
                        type="button"
                        onClick={() => setClimate('warm_ward')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                          climate === 'warm_ward'
                            ? 'bg-[#F1F5F9] text-[#0A2540] border-[#0A2540]'
                            : 'bg-white text-[#64748B] border-[#E2E8F0]'
                        }`}
                      >
                        Warm / Non-AC Ward
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                      3. Chest / Bust &amp; Preferred Fit
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={chestIdx}
                        onChange={(e) => setChestIdx(Number(e.target.value))}
                        className="px-2.5 py-2 text-xs font-medium bg-white border border-[#CBD5E1] rounded-lg tabular-nums"
                      >
                        {CHEST_OPTIONS.map((opt, idx) => (
                          <option key={opt.label} value={idx}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setFitPref('tailored')}
                          className={`px-2 py-1.5 rounded-lg text-xs font-semibold border ${
                            fitPref === 'tailored'
                              ? 'bg-[#0A2540] text-white border-[#0A2540]'
                              : 'bg-white text-[#475569] border-[#E2E8F0]'
                          }`}
                        >
                          Tailored
                        </button>
                        <button
                          type="button"
                          onClick={() => setFitPref('relaxed')}
                          className={`px-2 py-1.5 rounded-lg text-xs font-semibold border ${
                            fitPref === 'relaxed'
                              ? 'bg-[#0A2540] text-white border-[#0A2540]'
                              : 'bg-white text-[#475569] border-[#E2E8F0]'
                          }`}
                        >
                          Relaxed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Guard Verification Summary */}
                <div className="bg-white p-3.5 rounded-xl border border-[#CBD5E1] space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                    <div>
                      <div className="text-[11px] font-semibold text-[#2563EB]">
                        Locked Shift Specification
                      </div>
                      <div className="text-sm font-bold text-[#0A2540]">
                        Size {matchResult.lockedSize} · {matchResult.recommendedColor}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#047857] text-[11px] font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <p className="text-xs text-[#475569]">
                    <strong className="text-[#0A2540]">Fabric Match:</strong>{' '}
                    {matchResult.fabricSummary}
                  </p>

                  <ul className="space-y-1.5">
                    {matchResult.checks.map((chk) => (
                      <li
                        key={chk.text}
                        className="flex items-start gap-2 text-[11px] text-[#334155]"
                      >
                        <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span>{chk.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-[11px] text-[#2563EB] font-semibold bg-[#F8FAFC] px-2.5 py-1.5 rounded-lg border border-[#E2E8F0]">
                    Best Promo Match: {matchResult.promoTip}
                  </div>

                  {/* Matched Products */}
                  <div className="space-y-2 pt-1">
                    {matchResult.matchedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FAFBF9] border border-[#E2E8F0]"
                      >
                        <div className="w-10 h-12 rounded overflow-hidden bg-[#E2E8F0] shrink-0">
                          <ResilientImage
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#0A2540] truncate">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-[#64748B] tabular-nums">
                            ₹{p.price.toLocaleString('en-IN')} ·{' '}
                            {p.supportsEmbroidery ? 'Embroidery Ready' : 'Standard Spec'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigate('product', {
                              productId: p.id,
                              color: matchResult.recommendedColor,
                            });
                            showToast(`Loaded Size ${matchResult.lockedSize} recommendation`);
                          }}
                          className="px-2.5 py-1 rounded-md border border-[#CBD5E1] hover:border-[#0A2540] text-[11px] font-semibold text-[#0A2540] bg-white shrink-0"
                        >
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAddMatchedKit}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        Add Matched Kit (Size {matchResult.lockedSize}) to Bag
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAskAiAboutMatch}
                      className="w-full py-2 px-3 rounded-lg border border-[#CBD5E1] hover:border-[#0A2540] bg-white text-[#0A2540] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Ask AI Guide About This Match</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
