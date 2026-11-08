export type CategoryId = 'sweets' | 'cakes' | 'pastries' | 'chats' | 'ice-cream' | 'bakery';

export interface Product {
  id: string;
  name: string;
  nameKannada: string;
  category: CategoryId;
  description: string;
  descriptionKannada: string;
  price: number;
  unit: string;
  image: string;
  available: boolean;
  featured?: boolean;
  isDemonstration: boolean; // Indicates sample item pending owner confirmation
  dietary?: 'veg' | 'eggless' | 'contains-egg';
  portionOptions?: { label: string; priceMultiplier: number }[];
}

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  nameKannada: string;
  description: string;
  image: string;
  displayOrder: number;
}

export interface CakeEnquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  occasion: string;
  flavor: string;
  weightKg: string;
  eggless: boolean;
  messageOnCake: string;
  pickupDate: string;
  pickupTime: string;
  notes: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  estimatedPrice?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPortion?: string;
  itemPrice: number;
}

export type OrderStatus =
  | 'received'       // Order placed, waiting for preparation
  | 'making_parcel'  // Kitchen/counter staff packing parcel
  | 'parcel_ready'   // Boxed and placed on shelf/counter for handover
  | 'handed_over'    // Handed over to the customer
  | 'cancelled';

export interface ParcelDetails {
  boxType: 'Signature Gold Box' | 'Classic Sweet Box' | 'Pastry & Cake Box' | 'Standard Bakery Bag';
  packedBy: string;
  packedAt?: string;
  shelfRack?: string; // e.g. "Counter Shelf A1"
  handedOverTo?: string;
  handedOverAt?: string;
  paymentMethod: 'Cash on Handover' | 'UPI / GPay at Counter' | 'Pre-paid Online';
  packedItemsChecklist?: Record<string, boolean>;
}

export interface OrderEnquiry {
  id: string;
  tokenNumber: string; // e.g. "TK-101"
  orderType: 'online-whatsapp' | 'counter-walkin' | 'phone-order';
  customerName: string;
  customerPhone: string;
  pickupPreference: 'store-pickup' | 'local-delivery-enquiry';
  address?: string;
  specialInstructions: string;
  items: CartItem[];
  estimatedTotal: number;
  createdAt: string;
  status: OrderStatus;
  parcelDetails?: ParcelDetails;
}

export interface BusinessSettings {
  name: string;
  nameKannada: string;
  tagline: string;
  taglineKannada: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressKannada: string;
  landmark: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  openingHours: { days: string; hours: string; isVerified: boolean }[];
  announcement: {
    enabled: boolean;
    text: string;
    textKannada?: string;
    linkUrl?: string;
  };
  isDemoNoticeActive: boolean;
  verifiedStatus: {
    phoneVerified: boolean;
    whatsappVerified: boolean;
    addressVerified: boolean;
    hoursVerified: boolean;
    pricingVerified: boolean;
    menuVerified: boolean;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'storefront' | 'sweets' | 'cakes' | 'pastries' | 'chats' | 'bakery';
  imageUrl: string;
  caption: string;
  isOfficialShopPhoto: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  source: 'Google Maps' | 'Direct Customer';
  status: 'approved' | 'pending';
}

export interface FAQ {
  id: string;
  question: string;
  questionKannada: string;
  answer: string;
  answerKannada: string;
  category: string;
}

export type Language = 'en' | 'kn' | 'hi';
