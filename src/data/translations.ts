import { Language } from '../types';

export interface TranslationStrings {
  brandName: string;
  tagline: string;
  location: string;
  exploreMenu: string;
  orderWhatsApp: string;
  getDirections: string;
  navMenu: string;
  navCakes: string;
  navAbout: string;
  navGallery: string;
  navReviews: string;
  navContact: string;
  cart: string;
  adminLogin: string;
  adminDashboard: string;
  demoNotice: string;
  demoBadge: string;
  ownerConfirmationRequired: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  menuTitle: string;
  menuSubtitle: string;
  allCategories: string;
  searchPlaceholder: string;
  sortByPriceLow: string;
  sortByPriceHigh: string;
  sortDefault: string;
  addToEnquiry: string;
  viewDetails: string;
  available: string;
  unavailable: string;
  preorderOnly: string;
  eggless: string;
  veg: string;
  cakeSectionTitle: string;
  cakeSectionSubtitle: string;
  customizeCake: string;
  freshnessCommitment: string;
  shopAddress: string;
  callUs: string;
  chatWhatsApp: string;
  openingHours: string;
  faqsTitle: string;
  galleryTitle: string;
  reviewsTitle: string;
  leaveReview: string;
  reviewDisclaimer: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    brandName: 'SHABARI Sweets & Bakery',
    tagline: 'A Little Sweetness, A Lot of Happiness.',
    location: 'Bhatkal, Karnataka',
    exploreMenu: 'Explore Our Menu',
    orderWhatsApp: 'Order on WhatsApp',
    getDirections: 'Get Directions',
    navMenu: 'Our Menu',
    navCakes: 'Celebration Cakes',
    navAbout: 'About Us',
    navGallery: 'Gallery',
    navReviews: 'Customer Reviews',
    navContact: 'Contact & Map',
    cart: 'Enquiry Cart',
    adminLogin: 'Owner Login',
    adminDashboard: 'Owner Dashboard',
    demoNotice: 'Notice: This website is in demonstration mode. Product prices, descriptions, and shop hours are sample entries pending official owner verification.',
    demoBadge: 'Sample / Demo Item',
    ownerConfirmationRequired: 'Owner confirmation needed',
    categoriesTitle: 'Taste the Traditions & Fresh Bakes',
    categoriesSubtitle: 'From authentic desi ghee sweets to designer celebration cakes and crispy evening chats.',
    menuTitle: 'Explore Our Delicacies',
    menuSubtitle: 'Select your favorites to create a combined WhatsApp order enquiry or reserve fresh.',
    allCategories: 'All Delicacies',
    searchPlaceholder: 'Search sweets, cakes, pastries, chaats, ice cream...',
    sortByPriceLow: 'Price: Low to High',
    sortByPriceHigh: 'Price: High to Low',
    sortDefault: 'Featured First',
    addToEnquiry: 'Add to Enquiry',
    viewDetails: 'Quick View',
    available: 'Fresh & Available',
    unavailable: 'Currently Unavailable',
    preorderOnly: 'Pre-order Required',
    eggless: '100% Eggless',
    veg: 'Pure Veg',
    cakeSectionTitle: 'Cakes & Celebrations',
    cakeSectionSubtitle: 'Make your birthdays, anniversaries, and family milestones memorable with fresh handcrafted cakes.',
    customizeCake: 'Custom Cake Enquiry Builder',
    freshnessCommitment: 'Crafted with Purity & Authentic Taste',
    shopAddress: 'Store Location in Bhatkal',
    callUs: 'Call Shop',
    chatWhatsApp: 'WhatsApp Chat',
    openingHours: 'Opening Hours',
    faqsTitle: 'Frequently Asked Questions',
    galleryTitle: 'Store & Delicacy Showcase',
    reviewsTitle: 'What Local Customers Say',
    leaveReview: 'Review on Google Maps',
    reviewDisclaimer: 'Authentic customer feedback. To help our local business grow, please leave your verified review on Google Maps.',
  },
  kn: {
    brandName: 'ಶಬರಿ ಸ್ವೀಟ್ಸ್ & ಬೇಕರಿ',
    tagline: 'ಸ್ವಲ್ಪ ಮಾಧುರ್ಯ, ಅಪಾರ ಸಂತೋಷ.',
    location: 'ಭಟ್ಕಳ, ಕರ್ನಾಟಕ',
    exploreMenu: 'ನಮ್ಮ ಮೆನು ವೀಕ್ಷಿಸಿ',
    orderWhatsApp: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಆರ್ಡರ್ ಮಾಡಿ',
    getDirections: 'ಅಂಗಡಿಗೆ ದಾರಿ',
    navMenu: 'ಮೆನು',
    navCakes: 'ಕೇಕ್ಸ್',
    navAbout: 'ನಮ್ಮ ಬಗ್ಗೆ',
    navGallery: 'ಗ್ಯಾಲರಿ',
    navReviews: 'ಗ್ರಾಹಕರ ಅನಿಸಿಕೆ',
    navContact: 'ಸಂಪರ್ಕ & ವಿಳಾಸ',
    cart: 'ಆರ್ಡರ್ ಕಾರ್ಟ್',
    adminLogin: 'ಮಾಲೀಕರ ಲಾಗಿನ್',
    adminDashboard: 'ಮಾಲೀಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    demoNotice: 'ಗಮನಿಸಿ: ಈ ವೆಬ್‌ಸೈಟ್ ಡೆಮೋ ಮೋಡ್‌ನಲ್ಲಿದೆ. ಬೆಲೆಗಳು ಮತ್ತು ವಿವರಗಳನ್ನು ಮಾಲೀಕರು ಅಂತಿಮವಾಗಿ ದೃಢೀಕರಿಸಬೇಕಿದೆ.',
    demoBadge: 'ಮಾದರಿ ತಿನಿಸು',
    ownerConfirmationRequired: 'ಮಾಲೀಕರ ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ',
    categoriesTitle: 'ಸಾಂಪ್ರದಾಯಿಕ ರುಚಿ ಮತ್ತು ತಾಜಾ ತಿನಿಸುಗಳು',
    categoriesSubtitle: 'ಶುದ್ಧ ತುಪ್ಪದ ಸಿಹಿ ತಿಂಡಿಗಳಿಂದ ಹಿಡಿದು ಆಕರ್ಷಕ ಕೇಕ್ಸ್ ಮತ್ತು ಸಂಜೆಯ ಗರಿಗರಿ ಚಾಟ್ಸ್‌ವರೆಗೆ.',
    menuTitle: 'ನಮ್ಮ ವಿಶೇಷ ತಿನಿಸುಗಳು',
    menuSubtitle: 'ನಿಮ್ಮ ನೆಚ್ಚಿನ ತಿನಿಸುಗಳನ್ನು ಆರಿಸಿ ಸುಲಭವಾಗಿ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಆರ್ಡರ್ ಕಳುಹಿಸಿ.',
    allCategories: 'ಎಲ್ಲಾ ತಿನಿಸುಗಳು',
    searchPlaceholder: 'ಸಿಹಿ, ಕೇಕ್, ಪೇಸ್ಟ್ರಿ, ಚಾಟ್ಸ್ ಹುಡುಕಿ...',
    sortByPriceLow: 'ಕಡಿಮೆ ಬೆಲೆ ಮೊದಲು',
    sortByPriceHigh: 'ಹೆಚ್ಚು ಬೆಲೆ ಮೊದಲು',
    sortDefault: 'ವಿಶೇಷ ತಿನಿಸುಗಳು',
    addToEnquiry: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    viewDetails: 'ವಿವರ ನೋಡಿ',
    available: 'ತಾಜಾ ಲಭ್ಯವಿದೆ',
    unavailable: 'ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ',
    preorderOnly: 'ಮುಂಚಿತ ಬುಕಿಂಗ್ ಅಗತ್ಯ',
    eggless: 'ಮೊಟ್ಟೆ ರಹಿತ (Eggless)',
    veg: 'ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ',
    cakeSectionTitle: 'ಕೇಕ್ಸ್ & ಸಂಭ್ರಮಾಚರಣೆ',
    cakeSectionSubtitle: 'ನಿಮ್ಮ ಹುಟ್ಟುಹಬ್ಬ ಮತ್ತು ಶುಭ ಸಮಾರಂಭಗಳಿಗೆ ರುಚಿಕರವಾದ ತಾಜಾ ಕೇಕ್‌ಗಳು.',
    customizeCake: 'ಕಸ್ಟಮ್ ಕೇಕ್ ವಿಚಾರಣೆ ಫಾರ್ಮ್',
    freshnessCommitment: 'ಶುದ್ಧತೆ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ರುಚಿಯ ಭರವಸೆ',
    shopAddress: 'ಅಂಗಡಿಯ ವಿಳಾಸ (ಭಟ್ಕಳ)',
    callUs: 'ಕರೆ ಮಾಡಿ',
    chatWhatsApp: 'ವಾಟ್ಸಾಪ್ ಸಂದೇಶ',
    openingHours: 'ಕಾರ್ಯನಿರ್ವಹಣಾ ಸಮಯ',
    faqsTitle: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೋತ್ತರಗಳು',
    galleryTitle: 'ಫೋಟೋ ಗ್ಯಾಲರಿ',
    reviewsTitle: 'ಸ್ಥಳೀಯ ಗ್ರಾಹಕರ ಅಭಿಪ್ರಾಯ',
    leaveReview: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ರಿವ್ಯೂ ನೀಡಿ',
    reviewDisclaimer: 'ಸ್ಥಳೀಯ ಗ್ರಾಹಕರ ನಿಜವಾದ ಪ್ರತಿಕ್ರಿಯೆಗಳು. ನಮ್ಮ ಸೇವೆ ಉತ್ತಮಗೊಳಿಸಲು ಗೂಗಲ್‌ನಲ್ಲಿ ರಿವ್ಯೂ ಬರೆಯಿರಿ.',
  },
  hi: {
    brandName: 'शबरी स्वीट्स & बेकरी',
    tagline: 'थोड़ी मिठास, ढेर सारी खुशियाँ।',
    location: 'भटकल, कर्नाटक',
    exploreMenu: 'हमारा मेनू देखें',
    orderWhatsApp: 'व्हाट्सएप पर ऑर्डर करें',
    getDirections: 'रास्ता देखें',
    navMenu: 'हमारा मेनू',
    navCakes: 'सेलिब्रेशन केक्स',
    navAbout: 'हमारे बारे में',
    navGallery: 'गैलरी',
    navReviews: 'ग्राहक समीक्षा',
    navContact: 'संपर्क और पता',
    cart: 'ऑर्डर कार्ट',
    adminLogin: 'मालिक लॉगिन',
    adminDashboard: 'मालिक डैशबोर्ड',
    demoNotice: 'सूचना: यह वेबसाइट डेमो मोड में है। कीमतें और विवरण मालिक की पुष्टि के अधीन हैं।',
    demoBadge: 'सैंपल आइटम',
    ownerConfirmationRequired: 'पुष्टि आवश्यक',
    categoriesTitle: 'पारंपरिक स्वाद और ताज़ी बेकरी',
    categoriesSubtitle: 'शुद्ध घी की मिठाइयों से लेकर डिजाइनर केक और शाम के स्वादिष्ट चाट्स तक।',
    menuTitle: 'हमारे विशेष व्यंजन',
    menuSubtitle: 'अपनी पसंद चुनें और सीधे व्हाट्सएप पर ऑर्डर भेजें।',
    allCategories: 'सभी व्यंजन',
    searchPlaceholder: 'मिठाई, केक, पेस्ट्री, चाट खोजें...',
    sortByPriceLow: 'कीमत: कम से ज्यादा',
    sortByPriceHigh: 'कीमत: ज्यादा से कम',
    sortDefault: 'खास पहले',
    addToEnquiry: 'कार्ट में जोड़ें',
    viewDetails: 'विवरण देखें',
    available: 'ताज़ा उपलब्ध',
    unavailable: 'फिलहाल अनुपलब्ध',
    preorderOnly: 'प्री-ऑर्डर आवश्यक',
    eggless: '100% एगलेस',
    veg: 'शुद्ध शाकाहारी',
    cakeSectionTitle: 'केक्स और उत्सव',
    cakeSectionSubtitle: 'जन्मदिन और विशेष अवसरों के लिए ताज़ा डिजाइनर केक।',
    customizeCake: 'कस्टम केक पूछताछ फॉर्म',
    freshnessCommitment: 'शुद्धता और ताज़गी का वादा',
    shopAddress: 'दुकान का पता (भटकल)',
    callUs: 'कॉल करें',
    chatWhatsApp: 'व्हाट्सएप चैट',
    openingHours: 'दुकान का समय',
    faqsTitle: 'अक्सर पूछे जाने वाले सवाल',
    galleryTitle: 'दुकान और व्यंजनों की गैलरी',
    reviewsTitle: 'ग्राहकों की राय',
    leaveReview: 'गूगल मैप्स पर रिव्यू लिखें',
    reviewDisclaimer: 'असली ग्राहकों की राय। हमारे विकास में सहयोग के लिए गूगल मैप्स पर रिव्यू छोड़ें।',
  },
};
