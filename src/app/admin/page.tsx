'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  User,
  DollarSign,
  ShoppingBag,
  Star,
  ArrowRight,
  Search,
  Filter,
  Edit2,
  Trash2,
  Plus,
  Eye,
  Clock,
  X
} from 'lucide-react';
import { db } from '@/firebase/config';
import { collection, getDocs, getCountFromServer, query, orderBy, limit, addDoc, serverTimestamp, where } from 'firebase/firestore';

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

// Separate Modal Component
const AddProductModal = ({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    facility: '',
    price: '',
    stock: 0,
    description: '',
    image: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      name: '',
      category: '',
      facility: '',
      price: '',
      stock: 0,
      description: '',
      image: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Accessories">Accessories</option>
                <option value="Home Decor">Home Decor</option>
              </select>
            </div>

            {/* Facility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facility *
              </label>
              <select
                name="facility"
                value={formData.facility}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select Facility</option>
                <option value="Baguio City Jail">Baguio City Jail</option>
                <option value="Benguet Provincial Jail">Benguet Provincial Jail</option>
                <option value="La Trinidad Municipal Jail">La Trinidad Municipal Jail</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="₱0.00"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Upload
              </label>
              <div className="flex items-center gap-4">
              <input
                type="file"
                name="image"
                onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData(prev => ({
                  ...prev,
                  image: file.name
                  }));
                }
                }}
                accept="image/*"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
              />
              {formData.image && (
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap truncate max-w-xs">
                {formData.image}
                </span>
              )}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                placeholder="Enter product description..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'processing' | 'pickup' | 'delivered'>('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

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

  // Live stats (loaded from Firestore)
  const [loadingStats, setLoadingStats] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number | null>(null);
  const [totalProductsCount, setTotalProductsCount] = useState<number | null>(null);
  const [totalReviewsCount, setTotalReviewsCount] = useState<number | null>(null);

  const formatCurrency = (n: number | null) => {
    if (n === null) return '—';
    return `₱${n.toLocaleString()}`;
  };

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        // Counts using getCountFromServer for efficiency
        const ordersCountSnap = await getCountFromServer(collection(db, 'orders'));
        const ordersCount = ordersCountSnap.data().count ?? 0;

        const itemsCountSnap = await getCountFromServer(collection(db, 'items'));
        const itemsCount = itemsCountSnap.data().count ?? 0;

        // reviews collection may not exist in this project; attempt to count and fallback to 0
        let reviewsCount = 0;
        try {
          const reviewsCountSnap = await getCountFromServer(collection(db, 'reviews'));
          reviewsCount = reviewsCountSnap.data().count ?? 0;
        } catch (err) {
          reviewsCount = 0;
        }

        // Sum revenue from orders collection. Orders are expected to have a numeric `total` field.
        let revenue = 0;
        const ordersSnap = await getDocs(collection(db, 'orders'));
        ordersSnap.forEach((d) => {
          const data = d.data() as any;
          const val = data.total ?? data.totalAmount ?? data.subtotal ?? 0;
          const num = typeof val === 'number' ? val : Number(val) || 0;
          revenue += num;
        });

        // Fetch recent orders (limit 5) ordered by createdAt if available
        try {
          const recentQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
          const recentSnap = await getDocs(recentQ);
          const recs = recentSnap.docs.map((d) => {
            const data = d.data() as any;
            const id = data.orderId ?? d.id;
            const status = typeof data.status === 'string' ? data.status : (data.state ?? 'Placed');
            const itemsDesc = Array.isArray(data.items)
              ? `${data.items.length} items`
              : (typeof data.items === 'string' ? data.items : JSON.stringify(data.items ?? ''));
            const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function'
              ? data.createdAt.toDate().toLocaleString()
              : (data.createdAt ?? '');
            const amountStr = typeof data.total === 'number'
              ? `₱${data.total.toLocaleString()}`
              : (data.total ?? data.totalAmount ?? data.subtotal ?? '₱0.00');
            return {
              id,
              status,
              items: itemsDesc,
              date: createdAt,
              amount: amountStr
            };
          });
          if (mounted) setRecentOrders(recs);
        } catch (err) {
          // fallback: leave static recentOrders
          console.warn('Could not fetch recent orders:', err);
        }

        // Fetch top products from `items` collection, sort by `sold`/`sales` field
        try {
          const itemsSnap = await getDocs(collection(db, 'items'));
          const itemsArr = itemsSnap.docs.map((d) => {
            const data = d.data() as any;
            // Prefer explicit name fields; fall back to common alternatives then to doc id
            const name = data.name ?? data.title ?? data.productName ?? d.id;
            const facility = data.facility ?? data.location ?? data.origin ?? 'Unknown';
            const sold = typeof data.sold === 'number'
              ? data.sold
              : (Number(data.sold) || Number(data.sales) || Number(data.unitsSold) || 0);

            // Normalize price: handle number, string with currency symbol, or text field
            let price = '₱0.00';
            if (typeof data.price === 'number') {
              price = `₱${data.price.toLocaleString()}`;
            } else if (typeof data.price === 'string') {
              const numeric = Number(data.price.replace(/[^0-9.-]+/g, '')) || 0;
              price = `₱${numeric.toLocaleString()}`;
            } else if (data.priceText) {
              price = data.priceText;
            }

            return { name, facility, sold, price };
          });
          itemsArr.sort((a, b) => b.sold - a.sold);
          const top = itemsArr.slice(0, 3);
          if (mounted && top.length) setTopProducts(top);
        } catch (err) {
          console.warn('Could not fetch top products:', err);
        }

        if (!mounted) return;
        setTotalOrdersCount(ordersCount);
        setTotalProductsCount(itemsCount);
        setTotalReviewsCount(reviewsCount);
        setTotalRevenue(revenue);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        if (mounted) setLoadingStats(false);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      sublabel: 'Total revenue (all time)',
      icon: DollarSign,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Total Orders',
      value: totalOrdersCount === null ? '—' : totalOrdersCount.toLocaleString(),
      sublabel: 'Total Orders',
      icon: ShoppingBag,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Total Product Listings',
      value: totalProductsCount === null ? '—' : totalProductsCount.toLocaleString(),
      sublabel: 'Total Product Listings',
      icon: Package,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Total Reviews',
      value: totalReviewsCount === null ? '—' : totalReviewsCount.toLocaleString(),
      sublabel: 'Total Reviews',
      icon: Star,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  // Recent orders (initial static fallback, replaced by Firestore data when available)
  const [recentOrders, setRecentOrders] = useState<Array<{id: string; status: string; items: string; date: string; amount: string;}>>([
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
  ]);

  // Top products (initial static fallback, replaced by Firestore data when available)
  const [topProducts, setTopProducts] = useState<Array<{name: string; facility: string; sold: number; price: string;}>>([
    { name: 'Bamboo Mug', facility: 'Baguio City Jail', sold: 89, price: '₱71,290' },
    { name: 'Bamboo Mug', facility: 'Baguio City Jail', sold: 89, price: '₱71,290' },
    { name: 'Bamboo Mug', facility: 'Baguio City Jail', sold: 89, price: '₱71,290' }
  ]);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'items');
        const q = query(productsCollection, where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure all required fields have default values if missing
          name: doc.data().name || 'Unnamed Product',
          category: doc.data().category || 'Uncategorized',
          facility: doc.data().facility || 'No Facility',
          price: doc.data().price || '₱0',
          stock: doc.data().stock || 0,
          status: doc.data().status || 'inactive',
          image: doc.data().image || '/product-placeholder.jpg'
        })) as Product[];
        
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Analytics chart state (will be populated from Firestore)
  const [revenueData, setRevenueData] = useState<{ month: string; value: number }[]>([]);
  const [ordersData, setOrdersData] = useState<{ month: string; value: number }[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Sales by category (pie/donut) - default fallback preserved
  const [categoryDataState, setCategoryDataState] = useState(
    [
      { name: 'Home & Kitchen', percentage: 48, color: 'bg-gray-900' },
      { name: 'Office Supplies', percentage: 30, color: 'bg-gray-600' },
      { name: 'Accessories', percentage: 16, color: 'bg-gray-400' },
      { name: 'Home Decor', percentage: 6, color: 'bg-gray-300' }
    ]
  );

  useEffect(() => {
    let mounted = true;
    const fetchAnalytics = async () => {
      try {
        // Build months array up to current month
        const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const now = new Date();
        const upto = now.getMonth(); // 0-based index
        const labels = monthLabels.slice(0, upto + 1);

        // Initialize accumulators
        const revenueByMonth: Record<number, number> = {};
        const ordersByMonth: Record<number, number> = {};
        labels.forEach((_, idx) => { revenueByMonth[idx] = 0; ordersByMonth[idx] = 0; });

        // Fetch orders and aggregate
        try {
          const ordersSnap = await getDocs(collection(db, 'orders'));
          ordersSnap.forEach((d) => {
            const data = d.data() as any;
            // resolve createdAt to JS Date
            let created: Date | null = null;
            if (data?.createdAt && typeof data.createdAt.toDate === 'function') {
              created = data.createdAt.toDate();
            } else if (typeof data?.createdAt === 'number') {
              created = new Date(data.createdAt);
            } else if (data?.createdAt) {
              try { created = new Date(data.createdAt); } catch (e) { created = null; }
            }

            if (!created) return;
            if (created.getFullYear() !== now.getFullYear()) return; // only current year
            const m = created.getMonth();
            if (m > upto) return; // ignore future months

            const val = data.total ?? data.totalAmount ?? data.subtotal ?? 0;
            const num = typeof val === 'number' ? val : Number(val) || 0;
            revenueByMonth[m] = (revenueByMonth[m] || 0) + num;
            ordersByMonth[m] = (ordersByMonth[m] || 0) + 1;
          });
        } catch (err) {
          console.warn('Could not aggregate orders for analytics:', err);
        }

        // Build arrays in month order
        const revenueArr = labels.map((lab, i) => ({ month: lab, value: Math.round(revenueByMonth[i] || 0) }));
        const ordersArr = labels.map((lab, i) => ({ month: lab, value: ordersByMonth[i] || 0 }));

        // Fetch items to compute sales by category if possible
        try {
          const itemsSnap = await getDocs(collection(db, 'items'));
          const categoryTotals: Record<string, number> = {};
          let totalSold = 0;
          itemsSnap.forEach((d) => {
            const data = d.data() as any;
            const category = data.category ?? data.type ?? 'Uncategorized';
            const sold = typeof data.sold === 'number' ? data.sold : (Number(data.sold) || Number(data.sales) || 0);
            if (!categoryTotals[category]) categoryTotals[category] = 0;
            categoryTotals[category] += sold;
            totalSold += sold;
          });

          if (Object.keys(categoryTotals).length > 0) {
            const colors = ['bg-gray-900','bg-gray-600','bg-gray-400','bg-gray-300','bg-slate-400','bg-amber-400'];
            const catArr = Object.entries(categoryTotals).map(([name, val], idx) => ({
              name,
              percentage: totalSold > 0 ? Math.round((val / totalSold) * 100) : 0,
              color: colors[idx % colors.length]
            }));
            if (mounted) setCategoryDataState(catArr);
          }
        } catch (err) {
          console.warn('Could not fetch items for category analytics:', err);
        }

        if (mounted) {
          setRevenueData(revenueArr);
          setOrdersData(ordersArr);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        if (mounted) setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
    return () => { mounted = false; };
  }, []);

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

  // Handle Add Product functionality
  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleCloseModal = () => {
    setShowAddProductModal(false);
  };

  const handleSubmitProduct = async (productData: any) => {
    console.log('Adding new product:', productData);
    try {
      // Get the file input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      let imageData = null;

      // If a file was selected
      if (fileInput?.files?.length) {
        const file = fileInput.files[0];
        
        // Convert image to base64
        imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      }

      // Save the product data with the base64 image directly in the items collection
      await addDoc(collection(db, 'items'), {
        name: productData.name,
        category: productData.category,
        facility: productData.facility,
        price: productData.price,
        stock: Number(productData.stock) || 0,
        description: productData.description,
        image: imageData, // Store the base64 image data directly
        imageName: fileInput?.files?.[0]?.name || '',
        imageType: fileInput?.files?.[0]?.type || '',
        status: 'active',
        createdAt: serverTimestamp()
      });

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding new product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  // Compute maxima for charts to scale bar heights safely
  const maxRevenue = Math.max(...revenueData.map((r) => r.value), 1);
  const maxOrders = Math.max(...ordersData.map((r) => r.value), 1);

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
                          style={{ height: `${(data.value / maxRevenue) * 100}%` }}
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
                          style={{ height: `${(data.value / maxOrders) * 100}%` }}
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
                    {/* background ring */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                    {
                      // render segments based on categoryDataState
                      (() => {
                        const circumference = 2 * Math.PI * 40; // ~251
                        let accumulated = 0; // percent
                        const classToHex: Record<string, string> = {
                          'bg-gray-900': '#111827',
                          'bg-gray-600': '#4b5563',
                          'bg-gray-400': '#9ca3af',
                          'bg-gray-300': '#d1d5db',
                          'bg-slate-400': '#94a3b8',
                          'bg-amber-400': '#f59e0b'
                        };
                        return categoryDataState.map((cat, idx) => {
                          const dash = (cat.percentage / 100) * circumference;
                          const gap = Math.max(0, circumference - dash);
                          const offset = -(accumulated / 100) * circumference;
                          accumulated += cat.percentage;
                          const stroke = classToHex[cat.color] ?? '#111827';
                          return (
                            <circle
                              key={idx}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={stroke}
                              strokeWidth="20"
                              strokeDasharray={`${dash} ${gap}`}
                              strokeDashoffset={`${offset}`}
                            />
                          );
                        });
                      })()
                    }
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                  {categoryDataState.map((category, index) => (
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                {/* Filters Button */}
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5" />
                  <span className="text-sm font-medium">Filters</span>
                </button>

                {/* Add Product Button */}
                <button 
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
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
                    {productsLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Loading products...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No products found. Add your first product to get started.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
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
                      ))
                    )}
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
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={showAddProductModal}
        onClose={handleCloseModal}
        onSave={handleSubmitProduct}
      />
    </div>
  );
}