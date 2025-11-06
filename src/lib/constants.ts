/**
 * Application Constants
 */

// Site Information
export const SITE_NAME = 'BJMP-CAR SHOP';
export const SITE_TAGLINE = 'Empowering Second Chances Through Livelihood';
export const SITE_DESCRIPTION = 
  "Every purchase supports the livelihood and rehabilitation of persons deprived of liberty under BJMP's national programs.";

// Contact Information
export const CONTACT_EMAIL = 'info@bjmpcarshop.com';
export const CONTACT_PHONE = '+63 123 456 7890';

// Social Media (to be updated)
export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
  twitter: '#',
};

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Browse Products', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Handicrafts',
  'Woven Products',
  'Keychains',
  'Mugs & Tumblers',
  'Bags & Pouches',
  'Home Decor',
  'Gift Sets',
  'Others',
];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: (id: string) => `/api/products/${id}`,
  CART: '/api/cart',
  ORDERS: '/api/orders',
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Currency
export const CURRENCY = 'PHP';
export const CURRENCY_SYMBOL = '₱';

// Shipping Fee (flat rate for now)
export const SHIPPING_FEE = 150;
export const FREE_SHIPPING_THRESHOLD = 1000;

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 64,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  PHONE_PATTERN: /^(09|\+639)\d{9}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
