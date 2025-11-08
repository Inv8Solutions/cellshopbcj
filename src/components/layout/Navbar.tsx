'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X, ShoppingBag, Bell, User, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface NavbarProps {
  currentUser?: { uid: string; email: string } | null;
  notificationCount?: number;
}

export default function Navbar({ 
  currentUser,
  notificationCount = 0 
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const router = useRouter();

  // Subscribe to cart updates
  useEffect(() => {
    if (!currentUser) {
      setCartItemsCount(0);
      return;
    }

    const userCartRef = collection(db, 'users', currentUser.uid, 'cart');
    const unsubscribe = onSnapshot(query(userCartRef), (snapshot) => {
      // Get the count of documents in the cart collection
      const uniqueItemsCount = snapshot.size;
      setCartItemsCount(uniqueItemsCount);
    }, (error) => {
      console.error('Error fetching cart count:', error);
      setCartItemsCount(0);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setIsMenuOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const getDisplayName = (emailOrCustomer?: string | null) => {
    if (!emailOrCustomer) return 'Customer';
    if (emailOrCustomer === 'Customer') return 'Customer';
    // take local part of email and Title Case it
    const local = emailOrCustomer.split('@')[0];
    const parts = local.replace(/[._]/g, ' ').split(' ');
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Search Bar - Desktop / Search Icon - Mobile */}
          <div className="flex items-center flex-1 max-w-xs">
            {/* Desktop Search Bar */}
            <div className="hidden md:block relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
              />
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Logo - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap">
                BJMP-CAR SHOP
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Right */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Browse Products
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-4">
                {/* Shopping Bag */}
                <Link 
                  href="/cart" 
                  className="relative p-2 rounded-full hover:bg-gray-50 group"
                  aria-label={`Shopping bag with ${cartItemsCount} ${cartItemsCount === 1 ? 'item' : 'items'}`}
                >
                  <ShoppingBag className="h-5 w-5 text-gray-700" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'} in bag
                  </span>
                </Link>

                {/* Notifications */}
                <Link href="/notifications" className="relative p-2 rounded-full hover:bg-gray-50">
                  <Bell className="h-5 w-5 text-gray-700" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Link>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-200" />

                {/* User info */}
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {getDisplayName(currentUser?.email)}
                      </div>
                      <div className="text-xs text-gray-500">Customer</div>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    aria-label="Logout"
                    className="p-2 rounded-md hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-black text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Expandable) */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <Link
              href="/products"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={toggleMenu}
            >
              Browse Products
            </Link>
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4">
                  <Link 
                    href="/cart" 
                    className="relative p-2 rounded-full hover:bg-gray-50"
                    aria-label={`Shopping bag with ${cartItemsCount} ${cartItemsCount === 1 ? 'item' : 'items'}`}
                  >
                    <ShoppingBag className="h-5 w-5 text-gray-700" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/notifications" className="relative p-2 rounded-full hover:bg-gray-50">
                    <Bell className="h-5 w-5 text-gray-700" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={toggleMenu}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{getDisplayName(currentUser?.email)}</div>
                      <div className="text-xs text-gray-500">Customer</div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors text-center"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
