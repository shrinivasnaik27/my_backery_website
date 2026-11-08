import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CategoryId,
  CakeEnquiry,
  CartItem,
  OrderEnquiry,
  OrderStatus,
  ParcelDetails,
  BusinessSettings,
  GalleryItem,
  Review,
  FAQ,
  Language,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_GALLERY,
  INITIAL_FAQS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
} from '../data/initialData';
import { playCounterChime } from '../utils/audio';
import {
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  updateOrderInSupabase,
  deleteOrderFromSupabase,
  saveCakeEnquiryToSupabase,
  updateCakeEnquiryInSupabase,
  deleteCakeEnquiryFromSupabase,
  saveReviewToSupabase,
  fetchOrdersFromSupabase,
  fetchCakeEnquiriesFromSupabase,
  checkSupabaseConnection,
  SupabaseSyncStatus,
} from '../lib/supabase';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  businessSettings: BusinessSettings;
  cart: CartItem[];
  cakeEnquiries: CakeEnquiry[];
  orderEnquiries: OrderEnquiry[];
  gallery: GalleryItem[];
  faqs: FAQ[];
  reviews: Review[];
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  supabaseStatus: SupabaseSyncStatus;
  refreshSupabaseSync: () => Promise<void>;

  // Cart & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCakeModalOpen: boolean;
  setIsCakeModalOpen: (open: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;

  // Live Tracking & Station Modals
  activeTrackingToken: string | null;
  setActiveTrackingToken: (token: string | null) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  isParcelStationOpen: boolean;
  setIsParcelStationOpen: (open: boolean) => void;
  isCounterPosOpen: boolean;
  setIsCounterPosOpen: (open: boolean) => void;
  selectedOrderForSlip: OrderEnquiry | null;
  setSelectedOrderForSlip: (order: OrderEnquiry | null) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number, selectedPortion?: string, portionMultiplier?: number) => void;
  updateCartQuantity: (productId: string, selectedPortion: string | undefined, delta: number) => void;
  removeFromCart: (productId: string, selectedPortion?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Customer submissions
  submitOrderEnquiry: (details: {
    customerName: string;
    customerPhone: string;
    pickupPreference: 'store-pickup' | 'local-delivery-enquiry';
    address?: string;
    specialInstructions: string;
  }) => OrderEnquiry;
  submitCakeEnquiry: (details: Omit<CakeEnquiry, 'id' | 'createdAt' | 'status'>) => CakeEnquiry;
  submitCustomerReview: (author: string, rating: number, comment: string) => void;

  // Working Parcel & Order Management Operations
  takeCounterOrder: (details: {
    customerName: string;
    customerPhone: string;
    items: CartItem[];
    orderType?: 'counter-walkin' | 'phone-order';
    specialInstructions?: string;
  }) => OrderEnquiry;
  startMakingParcel: (
    orderId: string,
    boxType: ParcelDetails['boxType'],
    packedBy: string,
    shelfRack?: string
  ) => void;
  toggleItemPacked: (orderId: string, itemName: string) => void;
  markParcelReady: (orderId: string, shelfRack: string, packedBy?: string) => void;
  handoverParcel: (
    orderId: string,
    handedOverTo: string,
    paymentMethod: ParcelDetails['paymentMethod']
  ) => void;

  // WhatsApp helpers
  generateWhatsAppOrderLink: (order: OrderEnquiry) => string;
  generateWhatsAppCakeLink: (cake: CakeEnquiry) => string;
  generateWhatsAppGeneralLink: (customMessage?: string) => string;
  generateWhatsAppHandoverReceiptLink: (order: OrderEnquiry) => string;

  // Admin operations
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  updateCakeEnquiryStatus: (id: string, status: CakeEnquiry['status']) => void;
  updateOrderEnquiryStatus: (id: string, status: OrderStatus) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  addFAQ: (faq: Omit<FAQ, 'id'>) => void;
  updateFAQ: (id: string, updates: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'pending') => void;
  resetToDemoDefaults: () => void;

  // Live Supabase Booking & Order Management
  editOrderEnquiry: (id: string, updates: Partial<OrderEnquiry>) => Promise<void>;
  cancelOrderEnquiry: (id: string, reason?: string) => Promise<void>;
  deleteOrderEnquiry: (id: string) => Promise<void>;
  editCakeEnquiry: (id: string, updates: Partial<CakeEnquiry>) => Promise<void>;
  cancelCakeEnquiry: (id: string, reason?: string) => Promise<void>;
  deleteCakeEnquiry: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'shabari_products_v2',
  SETTINGS: 'shabari_settings_v2',
  CART: 'shabari_cart_v2',
  CAKE_ENQUIRIES: 'shabari_cake_enquiries_v2',
  ORDER_ENQUIRIES: 'shabari_order_enquiries_v2',
  GALLERY: 'shabari_gallery_v2',
  FAQS: 'shabari_faqs_v2',
  REVIEWS: 'shabari_reviews_v2',
  LANGUAGE: 'shabari_lang_v2',
  ADMIN_AUTH: 'shabari_admin_auth_v2',
  TOKEN_SEQ: 'shabari_token_seq_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Categories
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_BUSINESS_SETTINGS;
    } catch {
      return INITIAL_BUSINESS_SETTINGS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cake Enquiries
  const [cakeEnquiries, setCakeEnquiries] = useState<CakeEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CAKE_ENQUIRIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Order Enquiries (with parcels in different stages)
  const [orderEnquiries, setOrderEnquiries] = useState<OrderEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDER_ENQUIRIES);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Token Sequence
  const [tokenSeq, setTokenSeq] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN_SEQ);
      return saved ? Number(saved) : 104;
    } catch {
      return 104;
    }
  });

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  // FAQs
  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FAQS);
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // UI state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) as Language;
      return saved || 'en';
    } catch {
      return 'en';
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCakeModalOpen, setIsCakeModalOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Tracking & Station modals
  const [activeTrackingToken, setActiveTrackingToken] = useState<string | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isParcelStationOpen, setIsParcelStationOpen] = useState(false);
  const [isCounterPosOpen, setIsCounterPosOpen] = useState(false);
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<OrderEnquiry | null>(null);

  // Supabase Sync state
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSyncStatus>({
    isConnected: true,
    errorMessage: undefined,
  });

  const refreshSupabaseSync = async () => {
    const status = await checkSupabaseConnection();
    setSupabaseStatus(status);
    if (status.isConnected) {
      try {
        const [remoteOrders, remoteCakes] = await Promise.all([
          fetchOrdersFromSupabase(),
          fetchCakeEnquiriesFromSupabase(),
        ]);

        if (remoteOrders && remoteOrders.length > 0) {
          setOrderEnquiries((prev) => {
            const map = new Map<string, OrderEnquiry>();
            remoteOrders.forEach((o) => map.set(o.tokenNumber || o.id, o));
            prev.forEach((o) => map.set(o.tokenNumber || o.id, o));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }

        if (remoteCakes && remoteCakes.length > 0) {
          setCakeEnquiries((prev) => {
            const map = new Map<string, CakeEnquiry>();
            remoteCakes.forEach((c) => map.set(c.id, c));
            prev.forEach((c) => map.set(c.id, c));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      } catch (err) {
        console.warn('Supabase initial fetch sync warning:', err);
      }
    }
  };

  useEffect(() => {
    refreshSupabaseSync();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(businessSettings));
  }, [businessSettings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CAKE_ENQUIRIES, JSON.stringify(cakeEnquiries));
  }, [cakeEnquiries]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDER_ENQUIRIES, JSON.stringify(orderEnquiries));
  }, [orderEnquiries]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN_SEQ, String(tokenSeq));
  }, [tokenSeq]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lang);
  };

  const loginAdmin = (password: string): boolean => {
    if (password === 'shabari123' || password === 'bhatkal' || password === 'admin') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
  };

  // Helper to generate next Token Number e.g. TK-105
  const getNextTokenNumber = () => {
    const nextNum = tokenSeq + 1;
    setTokenSeq(nextNum);
    return `TK-${nextNum}`;
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedPortion?: string,
    portionMultiplier = 1
  ) => {
    setCart((prev) => {
      const calculatedItemPrice = Math.round(product.price * portionMultiplier);
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedPortion === selectedPortion
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedPortion,
          itemPrice: calculatedItemPrice,
        },
      ];
    });
  };

  const updateCartQuantity = (
    productId: string,
    selectedPortion: string | undefined,
    delta: number
  ) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedPortion === selectedPortion) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string, selectedPortion?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedPortion === selectedPortion)
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // WhatsApp helpers
  const getCleanWhatsAppNumber = () => {
    return businessSettings.whatsapp.replace(/[^0-9]/g, '');
  };

  const generateWhatsAppOrderLink = (order: OrderEnquiry): string => {
    const phone = getCleanWhatsAppNumber();
    const itemsList = order.items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.product.name}* ${it.selectedPortion ? `(${it.selectedPortion})` : ''} x ${it.quantity} = ₹${it.itemPrice * it.quantity}`
      )
      .join('\n');

    const msg = `*NEW ORDER PLACED - SHABARI SWEETS & BAKERY*\n` +
      `---------------------------------------\n` +
      `*Token Number:* ${order.tokenNumber}\n` +
      `*Order ID:* #${order.id.slice(-6).toUpperCase()}\n` +
      `*Customer:* ${order.customerName}\n` +
      `*Phone:* ${order.customerPhone}\n` +
      `*Type:* ${order.orderType === 'counter-walkin' ? 'Walk-in Counter' : 'Online / WhatsApp'}\n` +
      `*Fulfilment:* ${order.pickupPreference === 'store-pickup' ? 'In-Store Pickup' : 'Local Delivery Enquiry'}\n` +
      (order.address ? `*Address:* ${order.address}\n` : '') +
      `---------------------------------------\n` +
      `*ITEMS TO PACK:*\n${itemsList}\n` +
      `---------------------------------------\n` +
      `*Estimated Total:* ₹${order.estimatedTotal}\n` +
      (order.specialInstructions ? `*Notes:* ${order.specialInstructions}\n` : '') +
      `\n_Please start making parcel for Token ${order.tokenNumber}. Thank you!_`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const generateWhatsAppCakeLink = (cake: CakeEnquiry): string => {
    const phone = getCleanWhatsAppNumber();
    const msg = `*CELEBRATION CAKE ENQUIRY - SHABARI SWEETS & BAKERY*\n` +
      `---------------------------------------\n` +
      `*Enquiry Ref:* #${cake.id.slice(-6).toUpperCase()}\n` +
      `*Customer:* ${cake.customerName}\n` +
      `*Phone:* ${cake.customerPhone}\n` +
      `*Occasion:* ${cake.occasion}\n` +
      `*Flavour / Theme:* ${cake.flavor}\n` +
      `*Size / Weight:* ${cake.weightKg}\n` +
      `*Dietary:* ${cake.eggless ? '100% Eggless (Vegetarian)' : 'Standard'}\n` +
      `*Message on Cake:* "${cake.messageOnCake || 'None specified'}"\n` +
      `*Preferred Pickup Date:* ${cake.pickupDate}\n` +
      `*Preferred Pickup Time:* ${cake.pickupTime}\n` +
      (cake.notes ? `*Special Requests:* ${cake.notes}\n` : '') +
      `---------------------------------------\n` +
      `_Please let me know price estimation and order confirmation._`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const generateWhatsAppHandoverReceiptLink = (order: OrderEnquiry): string => {
    const custPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const msg = `*SHABARI SWEETS & BAKERY - PARCEL HANDOVER RECEIPT*\n` +
      `---------------------------------------\n` +
      `Dear ${order.customerName},\n` +
      `Your parcel for Token *${order.tokenNumber}* has been freshly packed & handed over at the counter!\n\n` +
      `*Items Packed:*\n` +
      order.items.map((it) => `• ${it.product.name} (x${it.quantity})`).join('\n') +
      `\n\n*Total Amount:* ₹${order.estimatedTotal}\n` +
      `*Payment:* ${order.parcelDetails?.paymentMethod || 'Paid at Counter'}\n` +
      `---------------------------------------\n` +
      `Thank you for visiting Shabari Sweets & Bakery, Bhatkal! Have a wonderful and sweet day!`;

    return `https://wa.me/${custPhone}?text=${encodeURIComponent(msg)}`;
  };

  const generateWhatsAppGeneralLink = (customMessage?: string): string => {
    const phone = getCleanWhatsAppNumber();
    const msg = customMessage || `Hello Shabari Sweets & Bakery (Bhatkal), I would like to enquire about your fresh sweets and bakery items.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  // Submissions (Online Checkout)
  const submitOrderEnquiry = (details: {
    customerName: string;
    customerPhone: string;
    pickupPreference: 'store-pickup' | 'local-delivery-enquiry';
    address?: string;
    specialInstructions: string;
  }): OrderEnquiry => {
    const token = getNextTokenNumber();
    const initialChecklist: Record<string, boolean> = {};
    cart.forEach((it) => {
      initialChecklist[it.product.name] = false;
    });

    const newOrder: OrderEnquiry = {
      id: 'ord-' + Date.now().toString(36),
      tokenNumber: token,
      orderType: 'online-whatsapp',
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      pickupPreference: details.pickupPreference,
      address: details.address,
      specialInstructions: details.specialInstructions,
      items: [...cart],
      estimatedTotal: cartTotal,
      createdAt: new Date().toISOString(),
      status: 'received',
      parcelDetails: {
        boxType: 'Classic Sweet Box',
        packedBy: 'Unassigned',
        shelfRack: 'Pending Packing',
        paymentMethod: 'Cash on Handover',
        packedItemsChecklist: initialChecklist,
      },
    };

    setOrderEnquiries((prev) => [newOrder, ...prev]);
    setActiveTrackingToken(token);
    clearCart();

    // Auto-save to Supabase project
    saveOrderToSupabase(newOrder).catch((err) =>
      console.warn('Supabase order enquiry save notice:', err)
    );

    return newOrder;
  };

  // 1. Counter POS: Taking Order by Staff / Owner directly
  const takeCounterOrder = (details: {
    customerName: string;
    customerPhone: string;
    items: CartItem[];
    orderType?: 'counter-walkin' | 'phone-order';
    specialInstructions?: string;
  }): OrderEnquiry => {
    const token = getNextTokenNumber();
    const orderTotal = details.items.reduce((sum, it) => sum + it.itemPrice * it.quantity, 0);
    const initialChecklist: Record<string, boolean> = {};
    details.items.forEach((it) => {
      initialChecklist[it.product.name] = false;
    });

    const newOrder: OrderEnquiry = {
      id: 'ord-' + Date.now().toString(36),
      tokenNumber: token,
      orderType: details.orderType || 'counter-walkin',
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      pickupPreference: 'store-pickup',
      specialInstructions: details.specialInstructions || 'Direct counter order',
      items: details.items,
      estimatedTotal: orderTotal,
      createdAt: new Date().toISOString(),
      status: 'received',
      parcelDetails: {
        boxType: 'Signature Gold Box',
        packedBy: 'Staff',
        shelfRack: 'Pending Packing',
        paymentMethod: 'Cash on Handover',
        packedItemsChecklist: initialChecklist,
      },
    };

    setOrderEnquiries((prev) => [newOrder, ...prev]);

    // Auto-save to Supabase project
    saveOrderToSupabase(newOrder).catch((err) =>
      console.warn('Supabase counter order save notice:', err)
    );

    return newOrder;
  };

  // 2. Making Parcel: Staff starts packing
  const startMakingParcel = (
    orderId: string,
    boxType: ParcelDetails['boxType'],
    packedBy: string,
    shelfRack?: string
  ) => {
    setOrderEnquiries((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const checklist = ord.parcelDetails?.packedItemsChecklist || {};
          ord.items.forEach((it) => {
            if (checklist[it.product.name] === undefined) {
              checklist[it.product.name] = false;
            }
          });

          const updatedParcel: ParcelDetails = {
            ...(ord.parcelDetails || {
              paymentMethod: 'Cash on Handover',
            }),
            boxType,
            packedBy,
            shelfRack: shelfRack || ord.parcelDetails?.shelfRack || 'Packing Station 1',
            packedItemsChecklist: checklist,
          };

          // Sync status change to Supabase
          updateOrderStatusInSupabase(
            ord.tokenNumber || ord.id,
            'making_parcel',
            updatedParcel
          ).catch((err) => console.warn('Supabase parcel status sync notice:', err));

          return {
            ...ord,
            status: 'making_parcel',
            parcelDetails: updatedParcel,
          };
        }
        return ord;
      })
    );
  };

  // Toggle item packed checkbox during boxing
  const toggleItemPacked = (orderId: string, itemName: string) => {
    setOrderEnquiries((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId && ord.parcelDetails) {
          const currentChecklist = { ...(ord.parcelDetails.packedItemsChecklist || {}) };
          currentChecklist[itemName] = !currentChecklist[itemName];
          return {
            ...ord,
            parcelDetails: {
              ...ord.parcelDetails,
              packedItemsChecklist: currentChecklist,
            },
          };
        }
        return ord;
      })
    );
  };

  // 3. Mark Parcel Ready for Pickup (Places on Counter Shelf and rings counter chime!)
  const markParcelReady = (orderId: string, shelfRack: string, packedBy = 'Packaging Head') => {
    playCounterChime(); // Play pleasant shop chime!

    setOrderEnquiries((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          // Check all items as packed
          const allPacked: Record<string, boolean> = {};
          ord.items.forEach((it) => {
            allPacked[it.product.name] = true;
          });

          const updatedParcel: ParcelDetails = {
            boxType: ord.parcelDetails?.boxType || 'Signature Gold Box',
            packedBy: packedBy || ord.parcelDetails?.packedBy || 'Packaging Head',
            packedAt: new Date().toISOString(),
            shelfRack: shelfRack || 'Ready Shelf A1',
            paymentMethod: ord.parcelDetails?.paymentMethod || 'Cash on Handover',
            packedItemsChecklist: allPacked,
          };

          // Sync status change to Supabase
          updateOrderStatusInSupabase(
            ord.tokenNumber || ord.id,
            'parcel_ready',
            updatedParcel
          ).catch((err) => console.warn('Supabase ready status sync notice:', err));

          return {
            ...ord,
            status: 'parcel_ready',
            parcelDetails: updatedParcel,
          };
        }
        return ord;
      })
    );
  };

  // 4. Giving to the People Who Have Ordered (Handover at Counter)
  const handoverParcel = (
    orderId: string,
    handedOverTo: string,
    paymentMethod: ParcelDetails['paymentMethod']
  ) => {
    setOrderEnquiries((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedParcel: ParcelDetails = {
            ...(ord.parcelDetails || {
              boxType: 'Signature Gold Box',
              packedBy: 'Staff',
            }),
            handedOverTo: handedOverTo || ord.customerName,
            handedOverAt: new Date().toISOString(),
            paymentMethod: paymentMethod || 'Cash on Handover',
          };

          // Sync status change to Supabase
          updateOrderStatusInSupabase(
            ord.tokenNumber || ord.id,
            'handed_over',
            updatedParcel
          ).catch((err) => console.warn('Supabase handover status sync notice:', err));

          const updated: OrderEnquiry = {
            ...ord,
            status: 'handed_over',
            parcelDetails: updatedParcel,
          };

          // Open parcel handover slip for instant viewing or printing
          setSelectedOrderForSlip(updated);
          return updated;
        }
        return ord;
      })
    );
  };

  const submitCakeEnquiry = (
    details: Omit<CakeEnquiry, 'id' | 'createdAt' | 'status'>
  ): CakeEnquiry => {
    const newCake: CakeEnquiry = {
      ...details,
      id: 'cake-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    setCakeEnquiries((prev) => [newCake, ...prev]);

    // Auto-save to Supabase
    saveCakeEnquiryToSupabase(newCake).catch((err) =>
      console.warn('Supabase cake enquiry save notice:', err)
    );

    return newCake;
  };

  const submitCustomerReview = (author: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: 'rev-' + Date.now().toString(36),
      author,
      rating,
      comment,
      date: 'Just now',
      isVerified: true,
      source: 'Direct Customer',
      status: 'pending',
    };
    setReviews((prev) => [newReview, ...prev]);

    // Auto-save to Supabase
    saveReviewToSupabase(newReview).catch((err) =>
      console.warn('Supabase review save notice:', err)
    );
  };

  // Admin methods
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setBusinessSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prodData,
      id: 'prd-' + Date.now().toString(36),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const updateCakeEnquiryStatus = (id: string, status: CakeEnquiry['status']) => {
    setCakeEnquiries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const updateOrderEnquiryStatus = (id: string, status: OrderStatus) => {
    setOrderEnquiries((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          updateOrderStatusInSupabase(o.tokenNumber || o.id, status).catch(console.warn);
          return { ...o, status };
        }
        return o;
      })
    );
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newGal: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now().toString(36),
    };
    setGallery((prev) => [...prev, newGal]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const addFAQ = (faq: Omit<FAQ, 'id'>) => {
    const newFaq: FAQ = {
      ...faq,
      id: 'faq-' + Date.now().toString(36),
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const updateFAQ = (id: string, updates: Partial<FAQ>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const updateReviewStatus = (id: string, status: 'approved' | 'pending') => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const resetToDemoDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setBusinessSettings(INITIAL_BUSINESS_SETTINGS);
    setGallery(INITIAL_GALLERY);
    setFaqs(INITIAL_FAQS);
    setReviews(INITIAL_REVIEWS);
    setOrderEnquiries(INITIAL_ORDERS);
    setTokenSeq(104);
    setCart([]);
  };

  // Manage, Edit & Cancel Bookings & Orders (Directly syncs to Supabase)
  const editOrderEnquiry = async (id: string, updates: Partial<OrderEnquiry>) => {
    let targetOrderRef = id;
    setOrderEnquiries((prev) =>
      prev.map((ord) => {
        if (ord.id === id || ord.tokenNumber === id) {
          targetOrderRef = ord.tokenNumber || ord.id;
          return { ...ord, ...updates };
        }
        return ord;
      })
    );
    await updateOrderInSupabase(targetOrderRef, updates);
  };

  const cancelOrderEnquiry = async (id: string, reason?: string) => {
    let targetOrderRef = id;
    setOrderEnquiries((prev) =>
      prev.map((ord) => {
        if (ord.id === id || ord.tokenNumber === id) {
          targetOrderRef = ord.tokenNumber || ord.id;
          const noteSuffix = reason ? ` [Cancelled: ${reason}]` : ' [Cancelled by Admin]';
          return {
            ...ord,
            status: 'cancelled',
            specialInstructions: (ord.specialInstructions || '') + noteSuffix,
          };
        }
        return ord;
      })
    );
    await updateOrderInSupabase(targetOrderRef, {
      status: 'cancelled',
      ...(reason ? { specialInstructions: `Cancelled: ${reason}` } : {}),
    });
  };

  const deleteOrderEnquiry = async (id: string) => {
    let targetOrderRef = id;
    const target = orderEnquiries.find((o) => o.id === id || o.tokenNumber === id);
    if (target) {
      targetOrderRef = target.tokenNumber || target.id;
    }
    setOrderEnquiries((prev) => prev.filter((ord) => ord.id !== id && ord.tokenNumber !== id));
    await deleteOrderFromSupabase(targetOrderRef);
  };

  const editCakeEnquiry = async (id: string, updates: Partial<CakeEnquiry>) => {
    setCakeEnquiries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    await updateCakeEnquiryInSupabase(id, updates);
  };

  const cancelCakeEnquiry = async (id: string, reason?: string) => {
    setCakeEnquiries((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const noteSuffix = reason ? ` [Cancelled: ${reason}]` : ' [Cancelled by Admin]';
          return {
            ...c,
            status: 'cancelled',
            notes: (c.notes || '') + noteSuffix,
          };
        }
        return c;
      })
    );
    await updateCakeEnquiryInSupabase(id, {
      status: 'cancelled',
      ...(reason ? { notes: `Cancelled: ${reason}` } : {}),
    });
  };

  const deleteCakeEnquiry = async (id: string) => {
    setCakeEnquiries((prev) => prev.filter((c) => c.id !== id));
    await deleteCakeEnquiryFromSupabase(id);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        businessSettings,
        cart,
        cakeEnquiries,
        orderEnquiries,
        gallery,
        faqs,
        reviews,
        language,
        setLanguage,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        supabaseStatus,
        refreshSupabaseSync,
        isCartOpen,
        setIsCartOpen,
        isCakeModalOpen,
        setIsCakeModalOpen,
        activeProductModal,
        setActiveProductModal,
        activeTrackingToken,
        setActiveTrackingToken,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        isParcelStationOpen,
        setIsParcelStationOpen,
        isCounterPosOpen,
        setIsCounterPosOpen,
        selectedOrderForSlip,
        setSelectedOrderForSlip,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        submitOrderEnquiry,
        submitCakeEnquiry,
        submitCustomerReview,
        takeCounterOrder,
        startMakingParcel,
        toggleItemPacked,
        markParcelReady,
        handoverParcel,
        generateWhatsAppOrderLink,
        generateWhatsAppCakeLink,
        generateWhatsAppGeneralLink,
        generateWhatsAppHandoverReceiptLink,
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        updateCakeEnquiryStatus,
        updateOrderEnquiryStatus,
        addGalleryItem,
        deleteGalleryItem,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        updateReviewStatus,
        resetToDemoDefaults,
        editOrderEnquiry,
        cancelOrderEnquiry,
        deleteOrderEnquiry,
        editCakeEnquiry,
        cancelCakeEnquiry,
        deleteCakeEnquiry,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
