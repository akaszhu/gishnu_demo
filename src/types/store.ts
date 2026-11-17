export type CategoryName =
  | 'Women'
  | 'Men'
  | 'Lab Coats'
  | 'Stethoscopes'
  | 'Accessories';

export type FabricLine =
  | 'Classic'
  | 'ecoflex™'
  | 'ecoflex™ Lite'
  | 'Chief'
  | '6sense'
  | 'Drift'
  | 'Campus';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  role: string;
  hospital: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface ProductSpecs {
  fabric: string;
  weight: string;
  stretch: string;
  pockets: string;
  care: string;
  fit: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: CategoryName;
  line: FabricLine;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  sizes: string[];
  tag?: string;
  supportsEmbroidery: boolean;
  description: string;
  highlights: string[];
  specs: ProductSpecs;
  reviews: ProductReview[];
}

export interface EmbroideryOption {
  enabled: boolean;
  line1: string;
  line2: string;
  threadColor: 'White' | 'Navy' | 'Gold' | 'Slate';
}

export interface CartItem {
  key: string;
  productId: number;
  color: string;
  size: string;
  qty: number;
  embroidery?: EmbroideryOption;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'emi';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pinCode: string;
  gstin?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  items: Array<{
    productId: number;
    name: string;
    image: string;
    color: string;
    size: string;
    qty: number;
    unitPrice: number;
    embroideryFee: number;
    embroideryText?: string;
  }>;
  subtotal: number;
  embroideryTotal: number;
  discountCode?: string;
  discountAmount: number;
  shippingFee: number;
  total: number;
  deliverySpeed: 'standard' | 'express';
  paymentMethod: PaymentMethod;
  address: ShippingAddress;
  status: 'Confirmed' | 'Embroidery & QC' | 'Dispatched' | 'Out for Delivery';
  estimatedDelivery: string;
}

export type RoutePage =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'success'
  | 'wishlist'
  | 'account'
  | 'bulk'
  | 'track';
