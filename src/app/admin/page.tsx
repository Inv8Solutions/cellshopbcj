'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  User,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  ArrowRight,
  BarChart3,
  PieChart
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const admin = {
    name: 'BJMP Administrator',
    role: 'Admin'
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    {
      label: 'Total Revenue',
      value: '₱125,480',
      sublabel: 'Total Revenue this month',
      icon: DollarSign,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Total Orders',
      value: '1,248',
      sublabel: 'Total Orders',
      icon: ShoppingBag,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Total Product Listings',
      value: '156',
      sublabel: 'Total Product Listings',
      icon: Package,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Total Reviews',
      value: '892',
      sublabel: 'Total Reviews',
      icon: Star,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const recentOrders = [
    {
      id: '#BJ-2024-166',
      status: 'Delivery',
      items: 'Bags, Mugs, Clay - 3 items',
      date: 'Nov 8, 2024',
      amount: '₱850.00'
    },
    {
      id: '#BJ-2024-165',
      status: 'Placed',
      items: 'Mugs, Woven - 2 items',
      date: 'Nov 8, 2024',
      amount: '₱500.00'
    },
    {
      id: '#BJ-2024-164',
      status: 'Pending',
      items: 'Plates, Woven - 2 items',
      date: 'Nov 8, 2024',
      amount: '₱180.00'
    }
  ];

  const topProducts = [
    { name: 'Bamboo Mug', facility: 'Baguio City Jail', sold: 89, price: '₱71,290' },
    { name: 'Bamboo Mug', facility: 'Baguio City Jail', sold: 89, price: '₱71,290' },
    { name: 'Bamboo Mug', facility: 'Baguio City Jail', sold: 89, price: '₱71,290' }
  ];

  const categoryData = [
    { name: 'Home & Kitchen', percentage: 48, color: 'bg-gray-900' },
    { name: 'Office Supplies', percentage: 30, color: 'bg-gray-600' },
    { name: 'Accessories', percentage: 16, color: 'bg-gray-400' },
    { name: 'Home Decor', percentage: 6, color: 'bg-gray-300' }
  ];

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', value: 4000 },
    { month: 'Feb', value: 5000 },
    { month: 'Mar', value: 4500 },
    { month: 'Apr', value: 6000 },
    { month: 'May', value: 7000 },
    { month: 'Jun', value: 8500 },
    { month: 'Jul', value: 9000 },
    { month: 'Aug', value: 8000 },
    { month: 'Sep', value: 9500 },
    { month: 'Oct', value: 10000 },
    { month: 'Nov', value: 11000 }
  ];

  const ordersData = Array.from({ length: 11 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][i],
    value: 100 + i * 20
  }));

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <h1 className="text-xl font-bold text-gray-900 mb-8">BJMP-CAR SHOP</h1>

          {/* Admin Info */}
          <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">{admin.name}</div>
              <div className="text-xs text-gray-500">{admin.role}</div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
            
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all mt-4">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Admin!</h1>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <p className="text-gray-600">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.sublabel}</div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">View All</button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Delivery' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Placed' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{order.items}</div>
                    <div className="text-xs text-gray-500">{order.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">{order.amount}</span>
                    <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
            <div className="grid grid-cols-3 gap-4">
              {topProducts.map((product, index) => (
                <div key={index} className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.facility}</p>
                  <p className="text-xs text-gray-500 mb-1">{product.sold} Sold</p>
                  <p className="text-sm font-bold text-gray-900">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-black rounded-t-lg transition-all hover:bg-gray-700"
                      style={{ height: `${(data.value / 11000) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Overview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Orders Overview</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {ordersData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gray-900 rounded-t-lg transition-all hover:bg-gray-700"
                      style={{ height: `${(data.value / 300) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales by Category</h2>
          <div className="flex items-center gap-8">
            {/* Donut Chart */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#111827" strokeWidth="20" strokeDasharray="125 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#4b5563" strokeWidth="20" strokeDasharray="75 251" strokeDashoffset="-125" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#9ca3af" strokeWidth="20" strokeDasharray="40 251" strokeDashoffset="-200" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#d1d5db" strokeWidth="20" strokeDasharray="15 251" strokeDashoffset="-240" />
              </svg>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{category.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
