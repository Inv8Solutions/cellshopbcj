'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingBag, Heart, Package, ShoppingCart, Settings, LogOut, User } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data
  const user = {
    name: 'Juan Dela Cruz',
    email: 'bjmpcuser@email.com',
    avatar: null
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Explore our collection',
      icon: ShoppingBag,
      href: '/products',
      featured: true
    },
    {
      title: 'Track Orders',
      description: 'Check delivery status',
      icon: Package,
      href: '#',
      featured: false
    },
    {
      title: 'Saved Items',
      description: 'View saved items',
      icon: Heart,
      href: '#',
      featured: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-gray-900">
              BJMP-CAR SHOP
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search Anything.."
                  className="block w-full pl-9 pr-3 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              <Link href="/products" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">
                Browse Products
              </Link>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-medium">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">Customer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-100 rounded-3xl p-6">
              {/* User Info */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white text-2xl font-medium mb-4">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === item.id
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Quick Actions</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.title}
                        href={action.href}
                        className={`rounded-3xl p-6 transition-all hover:scale-[1.02] ${
                          action.featured
                            ? 'bg-black text-white md:col-span-2 md:row-span-2'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mb-4 ${action.featured ? 'text-white' : 'text-gray-900'}`} />
                        <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                        <p className={`text-sm ${action.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                          {action.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
                <div className="bg-white rounded-3xl p-8 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Items</h1>
                <div className="bg-white rounded-3xl p-8 text-center">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No saved items</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
                <div className="bg-white rounded-3xl p-8">
                  <p className="text-gray-600">Settings coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
