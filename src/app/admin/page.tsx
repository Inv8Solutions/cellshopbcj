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
  PieChart,
  Search,
  Filter,
  Edit2,
  Trash2,
  Plus,
  Eye,
  Clock
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  facility: string;
  price: string;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
}

interface Order {
  id: string;
  customer: string;
  items: number;
  payment: string;
  date: string;
  time: string;
  amount: string;
  status: 'Pending' | 'Ready for Pickup' | 'Completed';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'processing' | 'pickup' | 'delivered'>('all');

  const admin = {
    name: 'BJMP Administrator',
    role: 'Admin'
  };

  const menuItems: Array<{
    id: 'dashboard' | 'products' | 'orders' | 'settings';
    label: string;
    icon: any;
  }> = [
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

  const products: Product[] = [
    {
      id: '1',
      name: 'Handcrafted Bamboo Mug',
      category: 'Home & Kitchen',
      facility: 'Baguio City Jail',
      price: '₱150',
      stock: 45,
      status: 'active',
      image: '/product-placeholder.jpg'
    },
    {
      id: '2',
      name: 'Handcrafted Bamboo Mug',
      category: 'Home & Kitchen',
      facility: 'Baguio City Jail',
      price: '₱150',
      stock: 45,
      status: 'inactive',
      image: '/product-placeholder.jpg'
    },
    {
      id: '3',
      name: 'Handcrafted Bamboo Mug',
      category: 'Home & Kitchen',
      facility: 'Baguio City Jail',
      price: '₱150',
      stock: 45,
      status: 'active',
      image: '/product-placeholder.jpg'
    },
    {
      id: '4',
      name: 'Handcrafted Bamboo Mug',
      category: 'Home & Kitchen',
      facility: 'Baguio City Jail',
      price: '₱150',
      stock: 45,
      status: 'active',
      image: '/product-placeholder.jpg'
    }
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

  const orders: Order[] = [
    {
      id: '#BJMP-2025-001',
      customer: 'Ana Garcia',
      items: 2,
      payment: 'GCash',
      date: 'Nov 8, 2024,',
      time: '09:10 PM',
      amount: '₱1100.00',
      status: 'Pending'
    },
    {
      id: '#BJMP-2025-002',
      customer: 'Juan Dela Cruz',
      items: 2,
      payment: 'Cash on Pickup',
      date: 'Nov 8, 2024,',
      time: '05:30 PM',
      amount: '₱600.00',
      status: 'Ready for Pickup'
    },
    {
      id: '#BJMP-2025-003',
      customer: 'Maria Santos',
      items: 2,
      payment: 'GCash',
      date: 'Nov 6, 2024,',
      time: '10:20 PM',
      amount: '₱710.00',
      status: 'Completed'
    }
  ];

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
        {activeTab === 'dashboard' && (
          <>
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
      </>
    )}

        {activeTab === 'products' && (
          <>
            {/* Products Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">BJMP Administrator</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
            </div>

            {/* Search and Add Product Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 mb-6">
              <div className="p-6 flex items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Filters Button */}
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5" />
                  <span className="text-sm font-medium">Filters</span>
                </button>

                {/* Add Product Button */}
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Facility
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg shrink-0 overflow-hidden">
                              <div className="w-full h-full bg-linear-to-br from-amber-600 to-amber-800"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{product.category}</span>
                        </td>

                        {/* Facility */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{product.facility}</span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{product.price}</span>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{product.stock}</span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              product.status === 'active'
                                ? 'bg-black text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {/* Orders Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-600">Manage and track all customer orders</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">BJMP Administrator</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 mb-6">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by order ID or customer"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  {/* Filters Button */}
                  <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5" />
                    <span className="text-sm font-medium">Filters</span>
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      orderFilter === 'all'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Orders
                  </button>
                  <button
                    onClick={() => setOrderFilter('processing')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      orderFilter === 'processing'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => setOrderFilter('pickup')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      orderFilter === 'pickup'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    For Pickup
                  </button>
                  <button
                    onClick={() => setOrderFilter('delivered')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      orderFilter === 'delivered'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Delivered
                  </button>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                      <span
                        className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${
                          order.status === 'Pending'
                            ? 'bg-gray-200 text-gray-700'
                            : order.status === 'Ready for Pickup'
                            ? 'bg-gray-800 text-white'
                            : 'bg-black text-white'
                        }`}
                      >
                        {order.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {order.status === 'Ready for Pickup' && <Package className="w-3 h-3" />}
                        {order.status === 'Completed' && '✓'}
                        {order.status === 'Pending' ? 'Pending' : order.status === 'Ready for Pickup' ? 'Ready for Pickup' : 'Completed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-900">{order.amount}</span>
                      <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <Eye className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Customer</div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Items</div>
                      <div className="text-sm text-gray-900">
                        {order.items}<br />
                        <span className="text-gray-600">Items</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Payment</div>
                      <div className="text-sm text-gray-900">{order.payment}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Date</div>
                      <div className="text-sm text-gray-900">
                        {order.date}<br />
                        {order.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
