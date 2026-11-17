import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  CategoryName,
  EmbroideryOption,
  OrderRecord,
  ProductReview,
  RoutePage,
} from '../types/store';
import { PRODUCTS, PROMO_CODES, SAMPLE_TRACK_ORDER } from '../data/catalog';

interface StoreContextValue {
  page: RoutePage;
  selectedCategory: CategoryName | '';
  selectedProductId: number;
  selectedProductColor: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  navigate: (
    page: RoutePage,
    opts?: { category?: CategoryName | ''; productId?: number; color?: string }
  ) => void;

  cart: CartItem[];
  addToCart: (
    productId: number,
    opts?: { color?: string; size?: string; qty?: number; embroidery?: EmbroideryOption; openDrawer?: boolean }
  ) => void;
  updateCartQty: (key: string, delta: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  embroideryTotal: number;

  wishlist: number[];
  toggleWishlist: (productId: number) => void;

  appliedPromo: string;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  discountAmount: number;

  orders: OrderRecord[];
  latestOrder: OrderRecord | null;
  placeOrder: (order: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>) => OrderRecord;

  customReviews: Record<number, ProductReview[]>;
  addReview: (productId: number, review: Omit<ProductReview, 'id' | 'date' | 'verified'>) => void;

  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;
  isAssistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = 'tm_cart_v2';
const WISHLIST_KEY = 'tm_wishlist_v2';
const ORDERS_KEY = 'tm_orders_v2';
const REVIEWS_KEY = 'tm_reviews_v2';
const PROMO_KEY = 'tm_promo_v2';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<RoutePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | ''>('');
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [selectedProductColor, setSelectedProductColor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [1, 4];
    } catch {
      return [1, 4];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : [SAMPLE_TRACK_ORDER];
    } catch {
      return [SAMPLE_TRACK_ORDER];
    }
  });

  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);

  const [customReviews, setCustomReviews] = useState<Record<number, ProductReview[]>>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string>(() => {
    try {
      return localStorage.getItem(PROMO_KEY) || 'FLASH12';
    } catch {
      return 'FLASH12';
    }
  });

  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isSizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(customReviews));
    } catch {
      // ignore
    }
  }, [customReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(PROMO_KEY, appliedPromo);
    } catch {
      // ignore
    }
  }, [appliedPromo]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const navigate = (
    targetPage: RoutePage,
    opts?: { category?: CategoryName | ''; productId?: number; color?: string }
  ) => {
    setPage(targetPage);
    if (opts?.category !== undefined) {
      setSelectedCategory(opts.category);
    }
    if (opts?.productId !== undefined) {
      setSelectedProductId(opts.productId);
      setSelectedProductColor(opts.color || '');
    }
    setCartDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (
    productId: number,
    opts?: {
      color?: string;
      size?: string;
      qty?: number;
      embroidery?: EmbroideryOption;
      openDrawer?: boolean;
    }
  ) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const color = opts?.color || product.colors[0]?.name || 'Standard';
    const size = opts?.size || product.sizes[Math.min(1, product.sizes.length - 1)] || 'M';
    const qty = opts?.qty ?? 1;
    const embKey = opts?.embroidery?.enabled
      ? `${opts.embroidery.line1}|${opts.embroidery.line2}|${opts.embroidery.threadColor}`
      : 'no-emb';
    const key = `${productId}__${color}__${size}__${embKey}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: Math.min(10, item.qty + qty) } : item
        );
      }
      return [...prev, { key, productId, color, size, qty, embroidery: opts?.embroidery }];
    });

    if (opts?.openDrawer !== false) {
      setCartDrawerOpen(true);
    } else {
      showToast(`${product.name} added to bag`);
    }
  };

  const updateCartQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, qty: Math.max(0, Math.min(10, item.qty + delta)) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: number) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved wishlist');
        return prev.filter((id) => id !== productId);
      }
      showToast(`${product?.name ?? 'Item'} saved to wishlist`);
      return [...prev, productId];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const p = PRODUCTS.find((x) => x.id === item.productId);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const embroideryTotal = cart.reduce((sum, item) => {
    if (item.embroidery?.enabled) {
      return sum + 199 * item.qty;
    }
    return sum;
  }, 0);

  const promoDef = appliedPromo ? PROMO_CODES[appliedPromo] : undefined;
  const discountAmount = promoDef
    ? Math.round((cartSubtotal * promoDef.discountPercent) / 100)
    : 0;

  const applyPromo = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { ok: false, message: 'Enter a promo code to apply.' };
    }
    const found = PROMO_CODES[code];
    if (!found) {
      return { ok: false, message: 'Invalid code. Try FLASH12, DOC10, or STUDENT15.' };
    }
    setAppliedPromo(code);
    showToast(`${code} applied — ${found.label}`);
    return { ok: true, message: `${found.label} applied.` };
  };

  const removePromo = () => {
    setAppliedPromo('');
    showToast('Promo code removed');
  };

  const placeOrder = (orderInput: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>) => {
    const randomSix = Math.floor(100000 + Math.random() * 900000);
    const hasEmbroidery = orderInput.items.some((i) => i.embroideryFee > 0);
    const record: OrderRecord = {
      ...orderInput,
      id: `TM-2026-${randomSix}`,
      createdAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: hasEmbroidery ? 'Embroidery & QC' : 'Confirmed',
    };
    setOrders((prev) => [record, ...prev]);
    setLatestOrder(record);
    setCart([]);
    setPage('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return record;
  };

  const addReview = (
    productId: number,
    review: Omit<ProductReview, 'id' | 'date' | 'verified'>
  ) => {
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      verified: true,
    };
    setCustomReviews((prev) => ({
      ...prev,
      [productId]: [newReview, ...(prev[productId] || [])],
    }));
    showToast('Thank you! Your clinical review has been published.');
  };

  return (
    <StoreContext.Provider
      value={{
        page,
        selectedCategory,
        selectedProductId,
        selectedProductColor,
        searchQuery,
        setSearchQuery,
        navigate,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        embroideryTotal,
        wishlist,
        toggleWishlist,
        appliedPromo,
        applyPromo,
        removePromo,
        discountAmount,
        orders,
        latestOrder,
        placeOrder,
        customReviews,
        addReview,
        isCartDrawerOpen,
        setCartDrawerOpen,
        isSizeGuideOpen,
        setSizeGuideOpen,
        isAssistantOpen,
        setAssistantOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
