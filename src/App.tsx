import React from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AssistantMatchGuard } from './components/AssistantMatchGuard';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { BulkOrdersPage } from './pages/BulkOrdersPage';
import { StoresPage } from './pages/StoresPage';
import { AccountPage, WishlistPage } from './pages/WishlistAndAccountPages';

function StoreShell() {
  const { page, toastMessage } = useStore();

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'success':
        return <OrderSuccessPage />;
      case 'track':
        return <TrackOrderPage />;
      case 'bulk':
        return <BulkOrdersPage />;
      case 'stores':
        return <StoresPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'account':
        return <AccountPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF9] text-[#0A2540]">
      <Header />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />

      <CartDrawer />
      <SizeGuideModal />
      <AssistantMatchGuard />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-50 bg-[#0A2540] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-white/15"
          >
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <StoreShell />
      </StoreProvider>
    </MotionConfig>
  );
}
