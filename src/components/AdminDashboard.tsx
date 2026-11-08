import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, CategoryId, CakeEnquiry, OrderEnquiry } from '../types';
import {
  X,
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Cake,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  LogOut,
  ExternalLink,
  MessageCircle,
  Eye,
  AlertCircle,
  Save,
  Database,
  RefreshCw,
  CheckCircle2,
  Search,
  Filter,
  Calendar,
  Clock,
  Ban,
  Phone,
  MapPin,
  Printer,
  FileText,
  CheckCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'products' | 'orders' | 'cakes' | 'business' | 'gallery-reviews';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const {
    products,
    categories,
    businessSettings,
    cakeEnquiries,
    orderEnquiries,
    gallery,
    reviews,
    logoutAdmin,
    updateSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    updateCakeEnquiryStatus,
    updateOrderEnquiryStatus,
    addGalleryItem,
    deleteGalleryItem,
    updateReviewStatus,
    resetToDemoDefaults,
    setIsParcelStationOpen,
    setIsCounterPosOpen,
    setSelectedOrderForSlip,
    supabaseStatus,
    refreshSupabaseSync,
    editOrderEnquiry,
    cancelOrderEnquiry,
    deleteOrderEnquiry,
    editCakeEnquiry,
    cancelCakeEnquiry,
    deleteCakeEnquiry,
  } = useStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');

  // Booking & Order Search / Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [cakeSearch, setCakeSearch] = useState('');
  const [cakeStatusFilter, setCakeStatusFilter] = useState<string>('all');

  // Modals for editing & cancelling bookings
  const [editingOrder, setEditingOrder] = useState<OrderEnquiry | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<OrderEnquiry | null>(null);
  const [cancelOrderReason, setCancelOrderReason] = useState('Customer requested cancellation');

  const [editingCake, setEditingCake] = useState<CakeEnquiry | null>(null);
  const [cancellingCake, setCancellingCake] = useState<CakeEnquiry | null>(null);
  const [cancelCakeReason, setCancelCakeReason] = useState('Customer requested cancellation');

  const [deletingBooking, setDeletingBooking] = useState<{
    type: 'order' | 'cake';
    id: string;
    ref: string;
    customerName: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Product Add / Edit Modal state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    nameKannada: '',
    category: 'sweets',
    description: '',
    descriptionKannada: '',
    price: 100,
    unit: 'per kg',
    image: '/src/assets/images/hero_shabari_sweets_1794111050804.jpg',
    available: true,
    isDemonstration: false,
    dietary: 'veg',
  });

  // Business settings local edit state
  const [settingsForm, setSettingsForm] = useState(businessSettings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // New Gallery item state
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<'storefront' | 'sweets' | 'cakes' | 'pastries' | 'chats'>('sweets');

  if (!isOpen) return null;

  const handleOpenAddProduct = () => {
    setProductForm({
      name: '',
      nameKannada: '',
      category: 'sweets',
      description: '',
      descriptionKannada: '',
      price: 100,
      unit: 'per kg',
      image: '/src/assets/images/hero_shabari_sweets_1794111050804.jpg',
      available: true,
      isDemonstration: false,
      dietary: 'veg',
    });
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setProductForm({ ...prod });
    setIsEditingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    if (productForm.id) {
      updateProduct(productForm.id, productForm);
    } else {
      addProduct(productForm as any);
    }
    setIsEditingProduct(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 2000);
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryUrl) return;
    addGalleryItem({
      title: newGalleryTitle,
      imageUrl: newGalleryUrl,
      category: newGalleryCategory,
      caption: newGalleryTitle,
      isOfficialShopPhoto: true,
    });
    setNewGalleryTitle('');
    setNewGalleryUrl('');
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameKannada.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dashboard-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-6xl w-full h-[95vh] flex flex-col overflow-hidden border border-[#E6DBCE] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="bg-[#2C1810] text-white px-6 py-4 flex items-center justify-between border-b border-[#422518] shrink-0">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-[#DFB75A]" />
            <div>
              <h2 id="admin-dashboard-title" className="font-serif text-lg font-bold leading-none text-white">
                SHABARI Sweets &amp; Bakery · Owner Management Console
              </h2>
              <span className="text-[11px] text-[#DFB75A] font-kannada">
                ಮಾಲೀಕರ ನಿರ್ವಹಣಾ ಫಲಕ · ಭಟ್ಕಳ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px]">wuhflfqujlfdmpuagrtl</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                setIsParcelStationOpen(true);
              }}
              className="text-xs bg-[#C89D3C] hover:bg-[#A88029] text-[#2C1810] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>📦 Open Packaging &amp; Handover Station</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsCounterPosOpen(true);
              }}
              className="text-xs bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1.5 rounded-lg border border-white/20 hidden sm:flex items-center gap-1 transition-colors"
            >
              <span>+ Take Walk-in Order</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="text-xs bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg"
              aria-label="Close dashboard"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#F3ECE2] border-b border-[#E6DBCE] px-6 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview &amp; Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Products &amp; Pricing ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders &amp; Parcels ({orderEnquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cakes')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cakes'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>Cake Bookings ({cakeEnquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'business'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Business Info &amp; Verification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery-reviews')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'gallery-reviews'
                ? 'border-[#2C1810] text-[#2C1810]'
                : 'border-transparent text-[#7A4B34] hover:text-[#2C1810]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery &amp; Reviews</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E6DBCE] shadow-2xs">
                  <span className="text-xs text-[#7A4B34] uppercase font-bold tracking-wider">Total Products</span>
                  <div className="text-2xl font-bold font-mono text-[#2C1810] mt-1">
                    {products.length}
                  </div>
                  <span className="text-[11px] text-[#7A4B34]">Across 6 storefront categories</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E6DBCE] shadow-2xs">
                  <span className="text-xs text-[#7A4B34] uppercase font-bold tracking-wider">Cart Enquiries</span>
                  <div className="text-2xl font-bold font-mono text-[#2C1810] mt-1">
                    {orderEnquiries.length}
                  </div>
                  <span className="text-[11px] text-emerald-700">Logged from website</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E6DBCE] shadow-2xs">
                  <span className="text-xs text-[#7A4B34] uppercase font-bold tracking-wider">Cake Requests</span>
                  <div className="text-2xl font-bold font-mono text-[#2C1810] mt-1">
                    {cakeEnquiries.length}
                  </div>
                  <span className="text-[11px] text-[#C89D3C]">Custom celebration forms</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E6DBCE] shadow-2xs">
                  <span className="text-xs text-[#7A4B34] uppercase font-bold tracking-wider">Demo Mode Flag</span>
                  <div className="text-lg font-bold text-amber-800 mt-1">
                    {businessSettings.isDemoNoticeActive ? 'Active' : 'Turned Off'}
                  </div>
                  <span className="text-[11px] text-[#7A4B34]">Shows sample disclosure banner</span>
                </div>
              </div>

              {/* Supabase Live Cloud Sync Card */}
              <div className="bg-linear-to-r from-emerald-950 to-[#142e20] text-emerald-50 p-5 rounded-2xl border border-emerald-800/80 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-serif text-base font-bold text-white">
                        Supabase Cloud Database Connected
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/90 leading-relaxed">
                      All customer order enquiries, counter parcels, custom cake celebration requests, and customer reviews are automatically synced to your Supabase project.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-emerald-300/80">
                      <span>Project: <strong className="text-emerald-100">wuhflfqujlfdmpuagrtl</strong></span>
                      <span>•</span>
                      <span>URL: <strong className="text-emerald-100">https://wuhflfqujlfdmpuagrtl.supabase.co</strong></span>
                      {supabaseStatus.lastSyncedAt && (
                        <>
                          <span>•</span>
                          <span>Last sync: {new Date(supabaseStatus.lastSyncedAt).toLocaleTimeString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={async () => {
                        setIsSyncing(true);
                        try {
                          await refreshSupabaseSync();
                        } finally {
                          setTimeout(() => setIsSyncing(false), 500);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-800/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">order_enquiries</span>
                      <p className="text-[10px] text-emerald-300/70">Online orders &amp; Parcel tracking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">cake_enquiries</span>
                      <p className="text-[10px] text-emerald-300/70">Celebration cakes &amp; Occasions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">customer_reviews</span>
                      <p className="text-[10px] text-emerald-300/70">Testimonials &amp; Ratings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Quick Controls & Notice */}
              <div className="bg-[#F3ECE2] p-5 rounded-2xl border border-[#E6DBCE] space-y-3">
                <h3 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#C89D3C]" />
                  Proprietor Verification Guidelines
                </h3>
                <p className="text-xs text-[#5C3624] leading-relaxed">
                  As the shop proprietor of <strong>SHABARI Sweets &amp; Bakery</strong> in Bhatkal:
                  You can update and confirm real prices, WhatsApp number, shop address, and operating hours. 
                  Once you verify details in the "Business Info" tab, the "Owner confirmation needed" tags on the public site will reflect your verified status.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateSettings({ isDemoNoticeActive: !businessSettings.isDemoNoticeActive });
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      businessSettings.isDemoNoticeActive
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white text-[#2C1810] border-[#E6DBCE]'
                    }`}
                  >
                    Toggle Demo Banner: {businessSettings.isDemoNoticeActive ? 'Visible' : 'Hidden'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateSettings({
                        announcement: {
                          ...businessSettings.announcement,
                          enabled: !businessSettings.announcement.enabled,
                        },
                      });
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-[#2C1810] border border-[#E6DBCE]"
                  >
                    Toggle Top Announcement: {businessSettings.announcement.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset all products and settings to default seed data?')) {
                        resetToDemoDefaults();
                      }
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 ml-auto flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Seed Defaults</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Snapshot */}
              <div className="bg-white rounded-2xl border border-[#E6DBCE] p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-base font-bold text-[#2C1810]">
                    Recent Customer Enquiries
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#C89D3C] hover:underline font-semibold"
                  >
                    View All Orders →
                  </button>
                </div>

                {orderEnquiries.length === 0 ? (
                  <p className="text-xs text-[#7A4B34] py-4 text-center">
                    No customer orders submitted yet. They will appear here immediately when submitted on the website.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {orderEnquiries.slice(0, 3).map((ord) => (
                      <div key={ord.id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DBCE] flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-[#2C1810]">{ord.customerName}</strong> · {ord.customerPhone}
                          <p className="text-[11px] text-[#7A4B34]">
                            {ord.items.map((it) => `${it.product.name} (x${it.quantity})`).join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-[#2C1810] block">₹{ord.estimatedTotal}</span>
                          <span className="text-[10px] uppercase font-bold text-[#C89D3C]">{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & PRICING */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-[#E6DBCE]">
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs text-[#2C1810]"
                  />

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs text-[#2C1810]"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="bg-[#2C1810] hover:bg-[#422518] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#DFB75A]" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-[#E6DBCE] overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F3ECE2] text-[#2C1810] border-b border-[#E6DBCE] uppercase tracking-wider font-semibold text-[11px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Availability</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DBCE]/60">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#F3ECE2] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-[#2C1810]">{p.name}</div>
                            <div className="font-kannada text-[#7A4B34] text-[11px]">{p.nameKannada}</div>
                          </div>
                        </td>

                        <td className="p-3 capitalize font-medium text-[#7A4B34]">
                          {p.category.replace('-', ' ')}
                        </td>

                        <td className="p-3">
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => {
                              const newPrice = Number(e.target.value);
                              updateProduct(p.id, { price: newPrice });
                            }}
                            className="w-20 px-2 py-1 bg-white border border-[#E6DBCE] rounded font-mono font-bold text-[#2C1810]"
                          />
                        </td>

                        <td className="p-3 text-[#7A4B34]">{p.unit}</td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => toggleProductAvailability(p.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                              p.available
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.available ? 'Available' : 'Out of Stock'}
                          </button>
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => updateProduct(p.id, { isDemonstration: !p.isDemonstration })}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              p.isDemonstration
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {p.isDemonstration ? 'Sample / Demo' : 'Verified by Shop'}
                          </button>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-[#2C1810] hover:bg-[#E6DBCE] rounded"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS & PARCELS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Header & Database Sync Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E6DBCE] shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#2C1810]">
                      Orders &amp; Parcels Database Management
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      Supabase: order_enquiries
                    </span>
                  </div>
                  <p className="text-xs text-[#7A4B34] mt-0.5">
                    View, manage, edit customer details, update parcel stages, or cancel bookings in real time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={async () => {
                      setIsSyncing(true);
                      try {
                        await refreshSupabaseSync();
                        showToast('Retrieved latest orders from Supabase database!');
                      } finally {
                        setTimeout(() => setIsSyncing(false), 500);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F3ECE2] border border-[#E6DBCE] text-[#2C1810] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Fetch from Database'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsCounterPosOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#C89D3C] hover:bg-[#A88029] text-[#2C1810] text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Walk-in Order</span>
                  </button>
                </div>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#7A4B34] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by customer name, phone, token (TK-105) or address..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E6DBCE] rounded-xl text-xs text-[#2C1810] placeholder:text-[#A89080] focus:ring-1 focus:ring-[#C89D3C]"
                  />
                  {orderSearch && (
                    <button
                      type="button"
                      onClick={() => setOrderSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A4B34] hover:text-[#2C1810]"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0 text-xs">
                  <Filter className="w-3.5 h-3.5 text-[#7A4B34] shrink-0" />
                  {[
                    { key: 'all', label: `All (${orderEnquiries.length})` },
                    { key: 'received', label: `Received (${orderEnquiries.filter((o) => o.status === 'received').length})` },
                    { key: 'making_parcel', label: `Packing (${orderEnquiries.filter((o) => o.status === 'making_parcel').length})` },
                    { key: 'parcel_ready', label: `Ready (${orderEnquiries.filter((o) => o.status === 'parcel_ready').length})` },
                    { key: 'handed_over', label: `Completed (${orderEnquiries.filter((o) => o.status === 'handed_over').length})` },
                    { key: 'cancelled', label: `Cancelled (${orderEnquiries.filter((o) => o.status === 'cancelled').length})` },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setOrderStatusFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        orderStatusFilter === tab.key
                          ? 'bg-[#2C1810] text-[#FAF7F2] font-semibold'
                          : 'bg-white border border-[#E6DBCE] text-[#5C3624] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Listing */}
              {(() => {
                const filtered = orderEnquiries.filter((ord) => {
                  if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
                  if (orderSearch.trim()) {
                    const q = orderSearch.toLowerCase();
                    const matchName = ord.customerName.toLowerCase().includes(q);
                    const matchPhone = ord.customerPhone.includes(q);
                    const matchToken = (ord.tokenNumber || '').toLowerCase().includes(q);
                    const matchRef = ord.id.toLowerCase().includes(q);
                    const matchAddress = (ord.address || '').toLowerCase().includes(q);
                    return matchName || matchPhone || matchToken || matchRef || matchAddress;
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white p-12 text-center rounded-xl border border-[#E6DBCE] space-y-2">
                      <p className="text-sm font-semibold text-[#2C1810]">No orders matching your criteria</p>
                      <p className="text-xs text-[#7A4B34]">
                        Try clearing search terms or status filters.
                      </p>
                      {orderSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderSearch('');
                            setOrderStatusFilter('all');
                          }}
                          className="mt-2 text-xs text-[#C89D3C] underline font-semibold"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {filtered.map((order) => {
                      const isCancelled = order.status === 'cancelled';
                      const statusColorMap: Record<string, string> = {
                        received: 'bg-blue-100 text-blue-900 border-blue-200',
                        making_parcel: 'bg-amber-100 text-amber-900 border-amber-300',
                        parcel_ready: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                        handed_over: 'bg-slate-100 text-slate-800 border-slate-300',
                        cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
                      };

                      return (
                        <div
                          key={order.id}
                          className={`bg-white rounded-xl p-5 border shadow-2xs space-y-3 transition-all ${
                            isCancelled
                              ? 'border-rose-200 bg-rose-50/20 opacity-80'
                              : 'border-[#E6DBCE]'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-[#E6DBCE]/80 pb-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-[#2C1810] text-[#DFB75A]">
                                  {order.tokenNumber || 'TK-POS'}
                                </span>
                                <h4 className="font-bold text-sm text-[#2C1810]">
                                  {order.customerName}
                                </h4>
                                <span className="font-mono text-xs text-[#7A4B34]">
                                  (Ref: #{order.id.slice(-6).toUpperCase()})
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColorMap[order.status] || 'bg-gray-100'}`}>
                                  {order.status === 'making_parcel' ? 'IN PACKING' : order.status.toUpperCase().replace('_', ' ')}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E6DBCE] text-[#5C3624]">
                                  {order.orderType === 'counter-walkin' ? 'Walk-in Counter' : 'Online Cart'}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C3624]">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-[#7A4B34]" />
                                  <strong>{order.customerPhone}</strong>
                                </span>
                                <span>
                                  Preference: <strong className="capitalize">{order.pickupPreference.replace('-', ' ')}</strong>
                                </span>
                                <span className="text-[#8C6D58]">
                                  Logged: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(order.createdAt).toLocaleDateString()})
                                </span>
                              </div>
                            </div>

                            {/* Status Quick Changer & Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                              <select
                                value={order.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as any;
                                  await editOrderEnquiry(order.id, { status: newStatus });
                                  showToast(`Status updated to ${newStatus} in Supabase`);
                                }}
                                className="bg-[#FAF7F2] border border-[#E6DBCE] text-xs font-semibold rounded-lg px-2.5 py-1.5 text-[#2C1810]"
                              >
                                <option value="received">Received (New)</option>
                                <option value="making_parcel">Making Parcel</option>
                                <option value="parcel_ready">Parcel Ready</option>
                                <option value="handed_over">Handed Over</option>
                                <option value="cancelled">Cancelled</option>
                              </select>

                              {/* WhatsApp Direct Chat */}
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(order.customerName)},%20this%20is%20Shabari%20Sweets%20%26%20Bakery%20Bhatkal%20regarding%20your%20order%20${order.tokenNumber}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5C] transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              {/* Edit Order */}
                              <button
                                type="button"
                                onClick={() => setEditingOrder(order)}
                                className="px-2.5 py-1.5 bg-white hover:bg-[#FAF7F2] border border-[#E6DBCE] text-[#2C1810] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                title="Edit Customer & Details"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#C89D3C]" />
                                <span>Edit</span>
                              </button>

                              {/* View / Print Thermal Slip */}
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForSlip(order)}
                                className="p-2 bg-white hover:bg-[#FAF7F2] border border-[#E6DBCE] text-[#2C1810] rounded-lg transition-colors"
                                title="Print / View Thermal Order Slip"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Cancel Booking / Order */}
                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCancellingOrder(order);
                                    setCancelOrderReason('Customer requested cancellation');
                                  }}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                  title="Cancel this order"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Cancel</span>
                                </button>
                              )}

                              {/* Delete Order from Supabase */}
                              <button
                                type="button"
                                onClick={() =>
                                  setDeletingBooking({
                                    type: 'order',
                                    id: order.id,
                                    ref: order.tokenNumber || order.id,
                                    customerName: order.customerName,
                                  })
                                }
                                className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors"
                                title="Permanently Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Parcel & Packaging Details if available */}
                          {order.parcelDetails && (
                            <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E6DBCE] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                              <span><strong>Box:</strong> {order.parcelDetails.boxType}</span>
                              <span><strong>Shelf / Rack:</strong> {order.parcelDetails.shelfRack || 'Pending Placement'}</span>
                              <span><strong>Packed by:</strong> {order.parcelDetails.packedBy || 'Packaging Counter'}</span>
                              <span><strong>Payment Method:</strong> {order.parcelDetails.paymentMethod}</span>
                            </div>
                          )}

                          {/* Items Breakdown */}
                          <div className="bg-white p-3 rounded-lg border border-[#E6DBCE]/60 space-y-1.5 text-xs text-[#5C3624]">
                            <span className="text-[10px] uppercase font-bold text-[#7A4B34] tracking-wider block">
                              Items Ordered ({order.items.reduce((s, it) => s + it.quantity, 0)})
                            </span>
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center py-0.5 border-b border-[#E6DBCE]/30 last:border-0">
                                <span>
                                  • <strong className="text-[#2C1810]">{it.product.name}</strong> {it.selectedPortion && <span className="text-[#7A4B34]">({it.selectedPortion})</span>} <span className="font-mono text-gray-500">x {it.quantity}</span>
                                </span>
                                <span className="font-mono font-semibold text-[#2C1810]">₹{it.itemPrice * it.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {order.address && (
                            <p className="text-xs bg-amber-50/50 p-2 rounded-lg border border-amber-200/60 text-[#422518] flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span><strong>Delivery Address:</strong> {order.address}</span>
                            </p>
                          )}

                          {order.specialInstructions && (
                            <p className="text-xs text-[#7A4B34] italic bg-[#FAF7F2] p-2 rounded border border-[#E6DBCE]">
                              Note / Instructions: "{order.specialInstructions}"
                            </p>
                          )}

                          <div className="pt-2 border-t border-[#E6DBCE] flex justify-between items-center text-xs">
                            <span className="text-[#7A4B34]">
                              Token: <strong className="text-[#2C1810]">{order.tokenNumber}</strong>
                            </span>
                            <span className="font-bold font-mono text-sm text-[#2C1810]">
                              Estimated Total: ₹{order.estimatedTotal}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 4: CELEBRATION CAKE BOOKINGS MANAGEMENT */}
          {activeTab === 'cakes' && (
            <div className="space-y-4">
              {/* Header & Database Sync Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E6DBCE] shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#2C1810]">
                      Celebration Cake Bookings Management
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      Supabase: cake_enquiries
                    </span>
                  </div>
                  <p className="text-xs text-[#7A4B34] mt-0.5">
                    View customer cake specifications, edit pickup dates, manage prices, and confirm or cancel custom bookings.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={async () => {
                      setIsSyncing(true);
                      try {
                        await refreshSupabaseSync();
                        showToast('Retrieved latest cake bookings from Supabase!');
                      } finally {
                        setTimeout(() => setIsSyncing(false), 500);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F3ECE2] border border-[#E6DBCE] text-[#2C1810] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Fetch from Database'}</span>
                  </button>
                </div>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#7A4B34] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cakeSearch}
                    onChange={(e) => setCakeSearch(e.target.value)}
                    placeholder="Search by customer name, phone, occasion, or flavour..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E6DBCE] rounded-xl text-xs text-[#2C1810] placeholder:text-[#A89080] focus:ring-1 focus:ring-[#C89D3C]"
                  />
                  {cakeSearch && (
                    <button
                      type="button"
                      onClick={() => setCakeSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A4B34] hover:text-[#2C1810]"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0 text-xs">
                  <Filter className="w-3.5 h-3.5 text-[#7A4B34] shrink-0" />
                  {[
                    { key: 'all', label: `All (${cakeEnquiries.length})` },
                    { key: 'new', label: `New (${cakeEnquiries.filter((c) => c.status === 'new').length})` },
                    { key: 'contacted', label: `Contacted (${cakeEnquiries.filter((c) => c.status === 'contacted').length})` },
                    { key: 'confirmed', label: `Confirmed (${cakeEnquiries.filter((c) => c.status === 'confirmed').length})` },
                    { key: 'ready', label: `Ready (${cakeEnquiries.filter((c) => c.status === 'ready').length})` },
                    { key: 'completed', label: `Completed (${cakeEnquiries.filter((c) => c.status === 'completed').length})` },
                    { key: 'cancelled', label: `Cancelled (${cakeEnquiries.filter((c) => c.status === 'cancelled').length})` },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setCakeStatusFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        cakeStatusFilter === tab.key
                          ? 'bg-[#2C1810] text-[#FAF7F2] font-semibold'
                          : 'bg-white border border-[#E6DBCE] text-[#5C3624] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cakes Listing */}
              {(() => {
                const filtered = cakeEnquiries.filter((cake) => {
                  if (cakeStatusFilter !== 'all' && cake.status !== cakeStatusFilter) return false;
                  if (cakeSearch.trim()) {
                    const q = cakeSearch.toLowerCase();
                    const matchName = cake.customerName.toLowerCase().includes(q);
                    const matchPhone = cake.customerPhone.includes(q);
                    const matchFlavor = cake.flavor.toLowerCase().includes(q);
                    const matchOccasion = cake.occasion.toLowerCase().includes(q);
                    const matchRef = cake.id.toLowerCase().includes(q);
                    return matchName || matchPhone || matchFlavor || matchOccasion || matchRef;
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white p-12 text-center rounded-xl border border-[#E6DBCE] space-y-2">
                      <p className="text-sm font-semibold text-[#2C1810]">No celebration cake bookings found</p>
                      <p className="text-xs text-[#7A4B34]">
                        When customers submit custom cake orders, their requests appear here.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {filtered.map((cake) => {
                      const isCancelled = cake.status === 'cancelled';
                      const statusColorMap: Record<string, string> = {
                        new: 'bg-blue-100 text-blue-900 border-blue-200',
                        contacted: 'bg-purple-100 text-purple-900 border-purple-200',
                        confirmed: 'bg-teal-100 text-teal-900 border-teal-200',
                        ready: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                        completed: 'bg-slate-100 text-slate-800 border-slate-300',
                        cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
                      };

                      return (
                        <div
                          key={cake.id}
                          className={`bg-white rounded-xl p-5 border shadow-2xs space-y-3 transition-all ${
                            isCancelled
                              ? 'border-rose-200 bg-rose-50/20 opacity-80'
                              : 'border-[#E6DBCE]'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-[#E6DBCE]/80 pb-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-[#C89D3C] text-[#2C1810]">
                                  CAKE
                                </span>
                                <h4 className="font-bold text-sm text-[#2C1810]">{cake.customerName}</h4>
                                <span className="font-mono text-xs text-[#7A4B34]">
                                  (Ref: #{cake.id.slice(-6).toUpperCase()})
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColorMap[cake.status] || 'bg-gray-100'}`}>
                                  {cake.status.toUpperCase()}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C3624]">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-[#7A4B34]" />
                                  <strong>{cake.customerPhone}</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#7A4B34]" />
                                  Pickup: <strong>{cake.pickupDate}</strong> at <strong>{cake.pickupTime}</strong>
                                </span>
                              </div>
                            </div>

                            {/* Status Quick Changer & Actions */}
                            <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                              <select
                                value={cake.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as any;
                                  await editCakeEnquiry(cake.id, { status: newStatus });
                                  showToast(`Cake status updated to ${newStatus} in Supabase`);
                                }}
                                className="bg-[#FAF7F2] border border-[#E6DBCE] text-xs font-semibold rounded-lg px-2.5 py-1.5 text-[#2C1810]"
                              >
                                <option value="new">New Enquiry</option>
                                <option value="contacted">Contacted</option>
                                <option value="confirmed">Confirmed Booking</option>
                                <option value="ready">Ready for Pickup</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>

                              {/* WhatsApp Chat with Customer */}
                              <a
                                href={`https://wa.me/${cake.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(cake.customerName)},%20this%20is%20Shabari%20Sweets%20%26%20Bakery%20Bhatkal%20regarding%20your%20celebration%20cake%20booking%20for%20${encodeURIComponent(cake.occasion)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5C] transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              {/* Edit Cake Booking */}
                              <button
                                type="button"
                                onClick={() => setEditingCake(cake)}
                                className="px-2.5 py-1.5 bg-white hover:bg-[#FAF7F2] border border-[#E6DBCE] text-[#2C1810] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                title="Edit Booking Details"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#C89D3C]" />
                                <span>Edit</span>
                              </button>

                              {/* Cancel Booking */}
                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCancellingCake(cake);
                                    setCancelCakeReason('Customer requested cancellation');
                                  }}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                  title="Cancel Cake Booking"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Cancel</span>
                                </button>
                              )}

                              {/* Delete Cake Booking */}
                              <button
                                type="button"
                                onClick={() =>
                                  setDeletingBooking({
                                    type: 'cake',
                                    id: cake.id,
                                    ref: cake.id,
                                    customerName: cake.customerName,
                                  })
                                }
                                className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors"
                                title="Delete from Supabase"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Cake Specifications Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF7F2] p-3 rounded-lg border border-[#E6DBCE]">
                            <div>
                              <span className="text-[#7A4B34] block">Occasion:</span>
                              <strong className="text-[#2C1810]">{cake.occasion}</strong>
                            </div>
                            <div>
                              <span className="text-[#7A4B34] block">Flavour:</span>
                              <strong className="text-[#2C1810]">{cake.flavor}</strong>
                            </div>
                            <div>
                              <span className="text-[#7A4B34] block">Weight:</span>
                              <strong className="text-[#2C1810]">{cake.weightKg}</strong>
                            </div>
                            <div>
                              <span className="text-[#7A4B34] block">Dietary:</span>
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${cake.eggless ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                                {cake.eggless ? '100% Eggless (Veg)' : 'Contains Egg'}
                              </span>
                            </div>
                          </div>

                          {/* Message on Cake */}
                          {cake.messageOnCake && (
                            <div className="text-xs bg-amber-50/90 p-3 rounded-lg border border-amber-200 text-amber-950 flex items-start gap-2">
                              <span className="text-amber-700 font-bold">🎂 Message on Cake:</span>
                              <span className="font-semibold italic">"{cake.messageOnCake}"</span>
                            </div>
                          )}

                          {cake.notes && (
                            <p className="text-xs text-[#7A4B34] bg-white p-2 rounded border border-[#E6DBCE] italic">
                              Special Notes: "{cake.notes}"
                            </p>
                          )}

                          <div className="flex flex-wrap justify-between items-center text-xs text-[#7A4B34] pt-2 border-t border-[#E6DBCE]">
                            <span>
                              Requested for: <strong>{cake.pickupDate}</strong> ({cake.pickupTime})
                            </span>
                            <span className="font-bold font-mono text-sm text-[#2C1810]">
                              {cake.estimatedPrice ? `Quotation: ₹${cake.estimatedPrice}` : 'Price: Pending Quote'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: BUSINESS INFO & VERIFICATION */}
          {activeTab === 'business' && (
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-[#E6DBCE] space-y-6">
              <div className="flex justify-between items-center border-b border-[#E6DBCE] pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                    Shop Information &amp; Official Verification
                  </h3>
                  <p className="text-xs text-[#7A4B34]">
                    Set verified contact numbers, address, and announcement messages.
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-[#2C1810] hover:bg-[#422518] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Save className="w-4 h-4 text-[#DFB75A]" />
                  <span>Save Changes</span>
                </button>
              </div>

              {settingsSavedMessage && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Business settings saved successfully to live website!</span>
                </div>
              )}

              {/* Shop Branding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                    English Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                    Kannada Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.nameKannada}
                    onChange={(e) => setSettingsForm({ ...settingsForm, nameKannada: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-kannada text-[#2C1810]"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                    Phone Number (Display &amp; Call)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-mono text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                    WhatsApp Number (Format with country code: +919448000000)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-mono text-[#2C1810]"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                    Physical Store Address (English)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">
                    Store Address (Kannada)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.addressKannada}
                    onChange={(e) => setSettingsForm({ ...settingsForm, addressKannada: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-kannada text-[#2C1810]"
                  />
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="p-4 bg-[#F3ECE2] rounded-xl border border-[#E6DBCE] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C1810] block">
                  Proprietor Verification Status Badges:
                </span>
                <p className="text-[11px] text-[#7A4B34]">
                  Check each field once verified to remove "Owner Confirmation Needed" tags from public visitors:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.verifiedStatus.phoneVerified}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          verifiedStatus: {
                            ...settingsForm.verifiedStatus,
                            phoneVerified: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span>Phone Verified</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.verifiedStatus.whatsappVerified}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          verifiedStatus: {
                            ...settingsForm.verifiedStatus,
                            whatsappVerified: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span>WhatsApp Verified</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.verifiedStatus.addressVerified}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          verifiedStatus: {
                            ...settingsForm.verifiedStatus,
                            addressVerified: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span>Address Verified</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.verifiedStatus.hoursVerified}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          verifiedStatus: {
                            ...settingsForm.verifiedStatus,
                            hoursVerified: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span>Hours Verified</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settingsForm.verifiedStatus.pricingVerified}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          verifiedStatus: {
                            ...settingsForm.verifiedStatus,
                            pricingVerified: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span>Menu Pricing Verified</span>
                  </label>
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[#2C1810] block">
                  Top Promotional Announcement Banner
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settingsForm.announcement.enabled}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: {
                          ...settingsForm.announcement,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-xs font-medium">Show announcement on top of site</span>
                </div>
                <input
                  type="text"
                  value={settingsForm.announcement.text}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcement: {
                        ...settingsForm.announcement,
                        text: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter festive or special promotional offer..."
                  className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#2C1810] hover:bg-[#422518] text-white py-3 rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  Save Business Profile
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: GALLERY & REVIEWS */}
          {activeTab === 'gallery-reviews' && (
            <div className="space-y-8">
              {/* Gallery upload */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DBCE] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#2C1810]">
                  Add Photo to Gallery
                </h3>
                <form onSubmit={handleAddGallery} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#2C1810] block mb-1">Photo Title / Caption</label>
                    <input
                      type="text"
                      required
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      placeholder="e.g. Diwali Sweet Boxes"
                      className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#2C1810] block mb-1">Category</label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value as any)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="storefront">Storefront</option>
                      <option value="sweets">Sweets</option>
                      <option value="cakes">Cakes</option>
                      <option value="pastries">Pastries</option>
                      <option value="chats">Chats</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#2C1810] text-white py-2 rounded-lg text-xs font-semibold hover:bg-[#422518]"
                    >
                      Add Photo
                    </button>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-xs font-semibold text-[#2C1810] block mb-1">Image URL / Path</label>
                    <input
                      type="text"
                      required
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="/src/assets/images/... or public image URL"
                      className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </form>

                {/* Existing Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-[#E6DBCE]">
                  {gallery.map((g) => (
                    <div key={g.id} className="relative rounded-lg overflow-hidden border border-[#E6DBCE] group aspect-square bg-[#FAF7F2]">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-[10px]">
                        <div>
                          <p className="font-bold line-clamp-1">{g.title}</p>
                          <button
                            type="button"
                            onClick={() => deleteGalleryItem(g.id)}
                            className="mt-2 text-rose-300 hover:text-rose-100 flex items-center justify-center gap-1 mx-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Moderation */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DBCE] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#2C1810]">
                  Customer Reviews Moderation ({reviews.length})
                </h3>

                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DBCE] flex justify-between items-center text-xs">
                      <div>
                        <strong>{r.author}</strong> ({r.rating} Stars) · <span className="opacity-75">{r.source}</span>
                        <p className="text-xs text-[#5C3624] mt-1">"{r.comment}"</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>

                        {r.status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => updateReviewStatus(r.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-700 text-white rounded text-xs font-semibold"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateReviewStatus(r.id, 'pending')}
                            className="px-2 py-1 text-[#7A4B34] hover:bg-[#E6DBCE] rounded text-xs"
                          >
                            Unpublish
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Edit / Add Product Modal */}
      {isEditingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-editor-title"
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsEditingProduct(false)}
        >
          <div
            className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E6DBCE] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#E6DBCE] pb-3">
              <h3 id="product-editor-title" className="font-serif text-lg font-bold text-[#2C1810]">
                {productForm.id ? 'Edit Delicacy' : 'Add New Delicacy'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProduct(false)}
                className="text-[#7A4B34] hover:text-[#2C1810]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">Kannada Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameKannada || ''}
                    onChange={(e) => setProductForm({ ...productForm, nameKannada: e.target.value })}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs font-kannada text-[#2C1810]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">Category *</label>
                  <select
                    value={productForm.category || 'sweets'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-2 py-1.5 text-xs text-[#2C1810]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price || 0}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-[#2C1810]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C1810] block mb-1">Unit *</label>
                  <input
                    type="text"
                    required
                    value={productForm.unit || 'per kg'}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. per kg"
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs text-[#2C1810]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">Image URL / Path *</label>
                <input
                  type="text"
                  required
                  value={productForm.image || ''}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs font-mono text-[#2C1810]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C1810] block mb-1">Description (English)</label>
                <textarea
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-1.5 text-xs text-[#2C1810]"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={productForm.available ?? true}
                    onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                    className="rounded"
                  />
                  <span>Currently Available</span>
                </label>

                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={productForm.isDemonstration ?? false}
                    onChange={(e) => setProductForm({ ...productForm, isDemonstration: e.target.checked })}
                    className="rounded"
                  />
                  <span>Sample / Demo Item</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E6DBCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-4 py-2 border border-[#E6DBCE] text-xs font-semibold rounded-lg hover:bg-[#F3ECE2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C1810] text-white text-xs font-bold rounded-lg hover:bg-[#422518]"
                >
                  Save Delicacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT CUSTOMER ORDER / PARCEL */}
      {editingOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setEditingOrder(null)}
        >
          <div
            className="relative bg-[#FAF7F2] rounded-2xl max-w-lg w-full border border-[#E6DBCE] shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E6DBCE] pb-3 mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C1810]">
                  Edit Order Details · {editingOrder.tokenNumber}
                </h3>
                <span className="text-xs text-[#7A4B34]">
                  Changes are saved directly to your Supabase database table.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="p-1 rounded-lg hover:bg-[#E6DBCE] text-[#2C1810]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates = {
                  customerName: formData.get('customerName') as string,
                  customerPhone: formData.get('customerPhone') as string,
                  pickupPreference: formData.get('pickupPreference') as any,
                  address: (formData.get('address') as string) || undefined,
                  specialInstructions: formData.get('specialInstructions') as string,
                  estimatedTotal: Number(formData.get('estimatedTotal')) || editingOrder.estimatedTotal,
                  status: formData.get('status') as any,
                };
                await editOrderEnquiry(editingOrder.id, updates);
                showToast(`Order ${editingOrder.tokenNumber} successfully updated in database!`);
                setEditingOrder(null);
              }}
              className="space-y-3.5 overflow-y-auto flex-1 pr-1 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    defaultValue={editingOrder.customerName}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    name="customerPhone"
                    required
                    defaultValue={editingOrder.customerPhone}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Fulfilment Preference</label>
                  <select
                    name="pickupPreference"
                    defaultValue={editingOrder.pickupPreference}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  >
                    <option value="store-pickup">In-Store Counter Pickup</option>
                    <option value="local-delivery-enquiry">Local Delivery Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingOrder.status}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C1810]"
                  >
                    <option value="received">Received (New)</option>
                    <option value="making_parcel">Making Parcel</option>
                    <option value="parcel_ready">Parcel Ready on Shelf</option>
                    <option value="handed_over">Handed Over (Completed)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Estimated Total (₹)</label>
                <input
                  type="number"
                  name="estimatedTotal"
                  required
                  defaultValue={editingOrder.estimatedTotal}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#2C1810]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Delivery Address (if applicable)</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={editingOrder.address || ''}
                  placeholder="Street / locality in Bhatkal"
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Special Instructions &amp; Packaging Notes</label>
                <textarea
                  name="specialInstructions"
                  rows={2}
                  defaultValue={editingOrder.specialInstructions || ''}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6DBCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-[#E6DBCE] text-xs font-semibold rounded-lg hover:bg-[#F3ECE2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C1810] text-white text-xs font-bold rounded-lg hover:bg-[#422518] shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#DFB75A]" />
                  <span>Save to Supabase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL ORDER CONFIRMATION */}
      {cancellingOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setCancellingOrder(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-md w-full border border-rose-200 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2C1810]">
                  Cancel Order {cancellingOrder.tokenNumber}?
                </h3>
                <p className="text-xs text-[#7A4B34]">
                  Customer: <strong>{cancellingOrder.customerName}</strong> ({cancellingOrder.customerPhone})
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#2C1810] block">
                Select or Type Cancellation Reason:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Customer requested cancellation',
                  'Item out of stock / unavailable',
                  'Duplicate test booking',
                  'Unable to reach customer phone',
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setCancelOrderReason(reason)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                      cancelOrderReason === reason
                        ? 'bg-rose-100 text-rose-900 border-rose-300 font-semibold'
                        : 'bg-[#FAF7F2] text-[#5C3624] border-[#E6DBCE] hover:bg-rose-50'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={cancelOrderReason}
                onChange={(e) => setCancelOrderReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-rose-400 mt-2"
              />
            </div>

            <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-800 border border-rose-200 leading-relaxed">
              This will update the order status to <strong>Cancelled</strong> in your Supabase database. You can also notify the customer directly on WhatsApp.
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <a
                href={`https://wa.me/${cancellingOrder.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Dear ${cancellingOrder.customerName}, your order for Token ${cancellingOrder.tokenNumber} at Shabari Sweets & Bakery Bhatkal has been cancelled. Reason: ${cancelOrderReason}. If you have any questions, please feel free to reply.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  await cancelOrderEnquiry(cancellingOrder.id, cancelOrderReason);
                  showToast(`Order ${cancellingOrder.tokenNumber} cancelled in Supabase & WhatsApp opened!`);
                  setCancellingOrder(null);
                }}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20BA5C] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Cancel &amp; Alert on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={async () => {
                  await cancelOrderEnquiry(cancellingOrder.id, cancelOrderReason);
                  showToast(`Order ${cancellingOrder.tokenNumber} marked as cancelled in Supabase.`);
                  setCancellingOrder(null);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Confirm Cancellation
              </button>

              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="px-3 py-2 border border-[#E6DBCE] text-xs font-semibold rounded-lg hover:bg-[#F3ECE2]"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT CELEBRATION CAKE BOOKING */}
      {editingCake && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setEditingCake(null)}
        >
          <div
            className="relative bg-[#FAF7F2] rounded-2xl max-w-lg w-full border border-[#E6DBCE] shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E6DBCE] pb-3 mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C1810]">
                  Edit Cake Booking · #{editingCake.id.slice(-6).toUpperCase()}
                </h3>
                <span className="text-xs text-[#7A4B34]">
                  Update cake specifications and pickup schedule directly in Supabase.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingCake(null)}
                className="p-1 rounded-lg hover:bg-[#E6DBCE] text-[#2C1810]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates = {
                  customerName: formData.get('customerName') as string,
                  customerPhone: formData.get('customerPhone') as string,
                  occasion: formData.get('occasion') as string,
                  flavor: formData.get('flavor') as string,
                  weightKg: formData.get('weightKg') as string,
                  eggless: formData.get('eggless') === 'on',
                  messageOnCake: formData.get('messageOnCake') as string,
                  pickupDate: formData.get('pickupDate') as string,
                  pickupTime: formData.get('pickupTime') as string,
                  estimatedPrice: formData.get('estimatedPrice') ? Number(formData.get('estimatedPrice')) : undefined,
                  status: formData.get('status') as any,
                  notes: formData.get('notes') as string,
                };
                await editCakeEnquiry(editingCake.id, updates);
                showToast(`Cake booking for ${updates.customerName} saved to Supabase!`);
                setEditingCake(null);
              }}
              className="space-y-3.5 overflow-y-auto flex-1 pr-1 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    defaultValue={editingCake.customerName}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    name="customerPhone"
                    required
                    defaultValue={editingCake.customerPhone}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Occasion</label>
                  <input
                    type="text"
                    name="occasion"
                    defaultValue={editingCake.occasion}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Flavour / Theme</label>
                  <input
                    type="text"
                    name="flavor"
                    defaultValue={editingCake.flavor}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Weight</label>
                  <input
                    type="text"
                    name="weightKg"
                    defaultValue={editingCake.weightKg}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Pickup Date *</label>
                  <input
                    type="date"
                    name="pickupDate"
                    required
                    defaultValue={editingCake.pickupDate}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Pickup Time *</label>
                  <input
                    type="text"
                    name="pickupTime"
                    required
                    defaultValue={editingCake.pickupTime}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Quotation (₹)</label>
                  <input
                    type="number"
                    name="estimatedPrice"
                    defaultValue={editingCake.estimatedPrice || ''}
                    placeholder="e.g. 750"
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#2C1810]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="font-semibold text-[#2C1810] block mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingCake.status}
                    className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs font-semibold text-[#2C1810]"
                  >
                    <option value="new">New Enquiry</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="ready">Ready for Pickup</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="eggless"
                      defaultChecked={editingCake.eggless}
                      className="rounded text-[#C89D3C]"
                    />
                    <span className="font-semibold text-[#2C1810]">100% Eggless Vegetarian Cake</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Message on Cake</label>
                <input
                  type="text"
                  name="messageOnCake"
                  defaultValue={editingCake.messageOnCake || ''}
                  placeholder="e.g. Happy Birthday Rahul!"
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2C1810] block mb-1">Notes / Instructions</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingCake.notes || ''}
                  className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6DBCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCake(null)}
                  className="px-4 py-2 border border-[#E6DBCE] text-xs font-semibold rounded-lg hover:bg-[#F3ECE2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C1810] text-white text-xs font-bold rounded-lg hover:bg-[#422518] shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#DFB75A]" />
                  <span>Save to Supabase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CANCEL CAKE BOOKING CONFIRMATION */}
      {cancellingCake && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setCancellingCake(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-md w-full border border-rose-200 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2C1810]">
                  Cancel Cake Booking?
                </h3>
                <p className="text-xs text-[#7A4B34]">
                  Customer: <strong>{cancellingCake.customerName}</strong> ({cancellingCake.flavor} - {cancellingCake.occasion})
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#2C1810] block">
                Cancellation Reason:
              </label>
              <input
                type="text"
                value={cancelCakeReason}
                onChange={(e) => setCancelCakeReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full bg-[#FAF7F2] border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-rose-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <a
                href={`https://wa.me/${cancellingCake.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Dear ${cancellingCake.customerName}, regarding your cake booking for ${cancellingCake.occasion} on ${cancellingCake.pickupDate} at Shabari Sweets & Bakery Bhatkal: your booking has been cancelled (${cancelCakeReason}). Please reach out if you need assistance.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  await cancelCakeEnquiry(cancellingCake.id, cancelCakeReason);
                  showToast(`Cake booking cancelled in Supabase & WhatsApp opened!`);
                  setCancellingCake(null);
                }}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20BA5C] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Cancel &amp; Alert on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={async () => {
                  await cancelCakeEnquiry(cancellingCake.id, cancelCakeReason);
                  showToast(`Cake booking marked as cancelled in Supabase.`);
                  setCancellingCake(null);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Confirm Cancel
              </button>

              <button
                type="button"
                onClick={() => setCancellingCake(null)}
                className="px-3 py-2 border border-[#E6DBCE] text-xs font-semibold rounded-lg hover:bg-[#F3ECE2]"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PERMANENT DELETE CONFIRMATION */}
      {deletingBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setDeletingBooking(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-sm w-full border border-rose-300 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2C1810]">
                  Permanently Delete?
                </h3>
                <p className="text-xs text-[#7A4B34]">
                  {deletingBooking.type === 'order' ? 'Order' : 'Cake Booking'} ref: {deletingBooking.ref}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5C3624] leading-relaxed">
              Are you sure you want to delete this record for <strong>{deletingBooking.customerName}</strong>? This will permanently remove the record from your Supabase database table (<code>{deletingBooking.type === 'order' ? 'order_enquiries' : 'cake_enquiries'}</code>).
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBooking(null)}
                className="px-3.5 py-1.5 border border-[#E6DBCE] text-xs font-semibold rounded-lg hover:bg-[#F3ECE2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (deletingBooking.type === 'order') {
                    await deleteOrderEnquiry(deletingBooking.id);
                    showToast(`Order permanently deleted from Supabase`);
                  } else {
                    await deleteCakeEnquiry(deletingBooking.id);
                    showToast(`Cake booking permanently deleted from Supabase`);
                  }
                  setDeletingBooking(null);
                }}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-70 bg-[#2C1810] text-[#FAF7F2] px-4 py-3 rounded-xl shadow-2xl border border-[#DFB75A]/40 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
