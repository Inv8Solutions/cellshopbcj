'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronUp,
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
  Search as SearchIcon,
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
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  limit, 
  where, 
  getCountFromServer, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp,
  startAfter,
  DocumentData
} from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
  TooltipItem,
  ChartType
} from 'chart.js';

// Define all interfaces at the top level
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

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingInfo {
  fullName?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  phoneNumber?: string;
  email?: string;
  deliveryNotes?: string;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  payment: string;
  date: string;
  time: string | Date;
  amount: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Picked Up' | 'Completed' | 'Processing' | 'Ready for Pickup' | 'Placed' | 'Delivery';
  shippingInfo?: ShippingInfo;
  customerName?: string;
  paymentMethod?: string;
  createdAt?: {
    toDate: () => Date;
  };
  total?: number;
}

interface TopProduct {
  id: string;
  name: string;
  facility: string;
  sold: number;
  price: string;
  image: string;
  orderCount: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  tab: 'dashboard' | 'products' | 'orders' | 'settings';
}

// Extend the ChartData interface to include our custom properties
interface CustomChartData extends ChartData {
  datasets: Array<{
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    hoverBackgroundColor?: string | string[];
    hoverBorderColor?: string | string[];
    [key: string]: any;
  }>;
}

type ChartCallback = (value: number | string, index: number, values: any[]) => string;

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


// Separate Modal Component
const AddProductModal = ({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => Promise<void>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSave(formData);
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
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
              className={`px-6 py-3 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 min-w-[120px] ${isSubmitting ? 'opacity-75' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'processing' | 'pickup' | 'delivered'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  
  // Loading States
  const [isMarkingAsShipped, setIsMarkingAsShipped] = useState<Record<string, boolean>>({});
  const [isMarkingAsArrived, setIsMarkingAsArrived] = useState<Record<string, boolean>>({});
  const [isMarkingAsPickedUp, setIsMarkingAsPickedUp] = useState<Record<string, boolean>>({});
  
  // Menu items for sidebar navigation
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tab: 'dashboard' },
    { id: 'products', label: 'Products', icon: Package, tab: 'products' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, tab: 'orders' },
    { id: 'settings', label: 'Settings', icon: Settings, tab: 'settings' },
  ];

  // Orders state and fetching logic

  // Fetch orders when orders tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab !== 'orders') return;
      
      setLoadingOrders(true);
      try {
        const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(ordersQuery);
        
        const ordersData: Order[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const items: OrderItem[] = Array.isArray(data.items) 
            ? data.items.map((item: any) => ({
                id: item.id || '',
                name: item.name || 'Unknown Item',
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 1,
                image: item.image
              }))
            : [];
          
          // Get customer name from shippingInfo.fullName if available, otherwise fall back to other fields
          const customerName = data.shippingInfo?.fullName || 
                             data.customerName || 
                             data.customer?.name || 
                             'Unknown Customer';
            
          const orderDate = data.createdAt?.toDate() || new Date();
          
          return {
            id: doc.id,
            customer: customerName,
            items: items,
            payment: data.paymentMethod || data.payment?.method || 'Unknown',
            date: orderDate.toLocaleDateString(),
            time: orderDate.toLocaleTimeString(),
            amount: `₱${(data.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            status: data.status || 'Pending',
            shippingInfo: data.shippingInfo || {},
            customerName: customerName,
            paymentMethod: data.paymentMethod || data.payment?.method || 'Unknown',
            createdAt: data.createdAt ? { toDate: () => new Date(data.createdAt.toDate()) } : undefined,
            total: Number(data.total) || 0
          };
        });
        
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [activeTab]);

  const fetchProducts = useCallback(async (page: number, isInitialLoad = false) => {
    // Skip if we're already loading or if we're not on the products tab
    if ((productsLoading && !isInitialLoad) || activeTab !== 'products') return;
    
    setProductsLoading(true);
    try {
      let productsQuery;
      const itemsCollection = collection(db, 'items');
      
      if (page > currentPage && lastVisible) {
        // Next page
        productsQuery = query(itemsCollection, orderBy('name'), startAfter(lastVisible), limit(productsPerPage));
      } else if (page < currentPage && firstVisible) {
        // Previous page - we need to reverse the order to get the previous set
        productsQuery = query(itemsCollection, orderBy('name', 'desc'), startAfter(firstVisible), limit(productsPerPage));
      } else {
        // First load or refresh
        productsQuery = query(itemsCollection, orderBy('name'), limit(productsPerPage));
      }

      const documentSnapshots = await getDocs(productsQuery);
      
      // If we're going to the previous page, we need to reverse the results
      const shouldReverse = page < currentPage;
      let newProducts = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      if (shouldReverse) {
        newProducts = newProducts.reverse();
      }

      // Only update state if we have new data
      if (newProducts.length > 0 || page === 1) {
        setProducts(newProducts);
        
        if (documentSnapshots.docs.length > 0) {
          setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
          setFirstVisible(documentSnapshots.docs[0]);
        }
        
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  }, [activeTab, currentPage, lastVisible, firstVisible, productsLoading, productsPerPage]);

  // Fetch products when the products tab becomes active
  useEffect(() => {
    if (activeTab === 'products' && products.length === 0) {
      fetchProducts(1, true);
    }
  }, [activeTab, fetchProducts, products.length]);

  const admin = {
    name: 'BJMP Administrator',
    role: 'Admin'
  };

  const handleTabClick = (tab: 'dashboard' | 'products' | 'orders' | 'settings') => {
    setActiveTab(tab);
  };

  

  const handleMarkAsShipped = useCallback(async (orderId: string) => {
    try {
      setIsMarkingAsShipped(prev => ({ ...prev, [orderId]: true }));
      // Update order status in Firestore
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Shipped',
        time: new Date().toISOString()
      });
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { 
                ...order, 
                status: 'Shipped', 
                time: new Date().toISOString(),
                date: new Date().toLocaleDateString()
              }
            : order
        )
      );
    } catch (error) {
      console.error('Error marking order as shipped:', error);
    } finally {
      setIsMarkingAsShipped(prev => ({ ...prev, [orderId]: false }));
    }
  }, []);

  const handleMarkAsArrived = useCallback(async (orderId: string) => {
    try {
      setIsMarkingAsArrived(prev => ({ ...prev, [orderId]: true }));
      // Update order status in Firestore
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Delivered',
        time: new Date().toISOString()
      });
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { 
                ...order, 
                status: 'Delivered', 
                time: new Date().toISOString(),
                date: new Date().toLocaleDateString()
              }
            : order
        )
      );
    } catch (error) {
      console.error('Error marking order as arrived:', error);
    } finally {
      setIsMarkingAsArrived(prev => ({ ...prev, [orderId]: false }));
    }
  }, []);

  // Analytics chart state
  interface ChartDataPoint {
    month: string;
    value: number;
    amount?: string;
    count?: number;
  }

  interface ChartDataState {
    labels: string[];
    values: number[];
    amounts: string[];
  }

  const [revenueChartData, setRevenueChartData] = useState<ChartDataState>({ labels: [], values: [], amounts: [] });
  const [ordersChartData, setOrdersChartData] = useState<ChartDataState>({ labels: [], values: [], amounts: [] });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Fetch revenue data from orders
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setAnalyticsLoading(true);
        
        // Get current date and calculate last 6 months
        const now = new Date();
        const months = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Initialize data for last 6 months
        const revenueByMonth: Record<string, { total: number; count: number }> = {};
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = `${monthNames[date.getMonth()]} '${String(date.getFullYear()).slice(-2)}`;
          months.push({ month: monthName, key: monthKey });
          revenueByMonth[monthKey] = { total: 0, count: 0 };
        }

        // Fetch all orders with their items
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        
        // Process each order
        for (const doc of ordersSnapshot.docs) {
          const order = doc.data();
          if (order.createdAt && order.items && Array.isArray(order.items)) {
            const orderDate = order.createdAt.toDate();
            const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
            
            // Only process orders from the last 6 months
            if (revenueByMonth[monthKey]) {
              // Calculate total from items if available, otherwise use order.total
              let orderTotal = 0;
              if (order.items && order.items.length > 0) {
                orderTotal = order.items.reduce((sum: number, item: any) => {
                  return sum + (parseFloat(item.price) * (item.quantity || 1));
                }, 0);
              } else if (order.total) {
                orderTotal = parseFloat(order.total) || 0;
              }
              
              revenueByMonth[monthKey].total += orderTotal;
              revenueByMonth[monthKey].count += 1;
            }
          }
        }

        // Format the data for the charts
        const labels = months.map(({ month }) => month);
        const revenueValues = months.map(({ key }) => (revenueByMonth[key]?.total || 0));
        const orderValues = months.map(({ key }) => (revenueByMonth[key]?.count || 0));
        const amounts = months.map(({ key }) => 
          `₱${(revenueByMonth[key]?.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        );

        setRevenueChartData({
          labels,
          values: revenueValues,
          amounts
        });

        setOrdersChartData({
          labels: months.map(({ month }) => month.split(' ')[0]),
          values: orderValues,
          amounts: orderValues.map(val => `${val} orders`)
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

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

        // Data is now handled by the separate chart data states
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        if (mounted) setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
    return () => { mounted = false; };
  }, []);

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
      window.location.reload(); // Reload the page to show the new product
    } catch (error) {
      console.error('Error adding new product:', error);
      alert('Failed to add product. Please try again.');
    }
  };


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
                  onClick={() => setActiveTab(item.tab)}
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
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { name: 'Total Revenue', value: '₱45,231', change: '+8.2%', changeType: 'increase', icon: DollarSign, iconColor: 'text-green-500' },
                { name: 'Total Orders', value: '1,234', change: '+12%', changeType: 'increase', icon: ShoppingCart, iconColor: 'text-blue-500' },
                { name: 'New Customers', value: '45', change: '+3.1%', changeType: 'increase', icon: User, iconColor: 'text-indigo-500' },
                { name: 'Avg. Order Value', value: '₱2,345', change: '-2.3%', changeType: 'decrease', icon: ShoppingBag, iconColor: 'text-red-500' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-600">{stat.name}</div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Icon className={`w-5 h-5 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </div>
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
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    View All
                  </button>
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
                        <div className="text-xs text-gray-600 mb-1">{Array.isArray(order.items) ? `${order.items.length} items` : order.items}</div>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {Array.isArray(topProducts) ? (
                    topProducts.map((product) => (
                      <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 mb-3">
                          <img 
                            src={product.image || '/product-placeholder.jpg'} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/product-placeholder.jpg';
                            }}
                          />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{product.facility}</p>
                        <p className="text-xs text-gray-500 mb-1">{product.orderCount} Orders • {product.sold} Sold</p>
                        <p className="text-sm font-bold text-gray-900">{product.price}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No items</div>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
          
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                    <div className="text-sm text-gray-500">Last 6 Months</div>
                  </div>
                  {analyticsLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-pulse text-gray-500">Loading revenue data...</div>
                    </div>
                  ) : (
                    <div className="h-64">
                      <Line
                        data={{
                          labels: revenueChartData.labels,
                          datasets: [
                            {
                              label: 'Revenue',
                              data: revenueChartData.values,
                              borderColor: 'rgba(79, 70, 229, 1)',
                              backgroundColor: 'rgba(79, 70, 229, 0.1)',
                              tension: 0.3,
                              fill: true,
                              pointBackgroundColor: 'white',
                              pointBorderColor: 'rgba(79, 70, 229, 1)',
                              pointBorderWidth: 2,
                              pointHoverRadius: 5,
                              pointHoverBackgroundColor: 'rgba(79, 70, 229, 1)',
                              pointHoverBorderWidth: 2,
                              pointHoverBorderColor: 'white',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#111827',
                              bodyColor: '#4B5563',
                              borderColor: '#E5E7EB',
                              borderWidth: 1,
                              padding: 12,
                              displayColors: false,
                              callbacks: {
                                label: function(context) {
                                  const value = (context.parsed as { y: number }).y;
                                  return `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                              }
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: '#6B7280',
                              },
                            },
                            y: {
                              grid: {
                                color: '#F3F4F6',
                              },
                              ticks: {
                                color: '#6B7280',
                                callback: function(value) {
                                return `₱${Number(value).toLocaleString()}`;
                              }
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Orders Overview */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Orders Overview</h3>
                    <div className="text-sm text-gray-500">Last 6 Months</div>
                  </div>
                  {analyticsLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-pulse text-gray-500">Loading orders data...</div>
                    </div>
                  ) : (
                    <div className="h-64">
                      <Bar
                        data={{
                          labels: ordersChartData.labels,
                          datasets: [
                            {
                              label: 'Orders',
                              data: ordersChartData.values,
                              backgroundColor: 'rgba(55, 65, 81, 0.7)',
                              hoverBackgroundColor: 'rgba(55, 65, 81, 1)',
                              borderRadius: 4,
                              borderSkipped: false,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              backgroundColor: 'white',
                              titleColor: '#111827',
                              bodyColor: '#4B5563',
                              borderColor: '#E5E7EB',
                              borderWidth: 1,
                              padding: 12,
                              displayColors: false,
                              callbacks: {
                                label: function(context) {
                                  const value = (context.parsed as { y: number }).y;
                                  return `${value} orders`;
                                }
                              }
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: '#6B7280',
                              },
                            },
                            y: {
                              grid: {
                                color: '#F3F4F6',
                              },
                              ticks: {
                                color: '#6B7280',
                                precision: 0,
                              },
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </div>
                  )}
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
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                              <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden">
                                {product.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to a colored div if image fails to load
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallback = document.createElement('div');
                                      fallback.className = 'w-full h-full bg-gradient-to-br from-amber-600 to-amber-800';
                                      target.parentNode?.insertBefore(fallback, target.nextSibling);
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800"></div>
                                )}
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
              <div className="flex justify-between items-center p-4">
                <button 
                  onClick={() => fetchProducts(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">Page {currentPage}</span>
                <button 
                  onClick={() => fetchProducts(currentPage + 1)} 
                  disabled={products.length < productsPerPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
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
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              {loadingOrders ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                  <p className="text-gray-500 mt-1">When you receive orders, they'll appear here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                        <span
                          className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${
                            order.status === 'Pending' || order.status === 'Placed' || order.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'Ready for Pickup'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-gray-900">{order.amount}</span>
                        {!['Shipped', 'Delivered', 'Picked Up'].includes(order.status) && (
                          <button 
                            onClick={() => handleMarkAsShipped(order.id)}
                            disabled={isMarkingAsShipped[order.id]}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                              isMarkingAsShipped[order.id]
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {isMarkingAsShipped[order.id] ? 'Processing...' : 'Mark as Shipped'}
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleMarkAsArrived(order.id)}
                              disabled={isMarkingAsArrived[order.id]}
                              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                isMarkingAsArrived[order.id]
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {isMarkingAsArrived[order.id] ? 'Processing...' : 'Mark as Arrived'}
                            </button>
                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                              Shipped
                            </span>
                          </div>
                        )}
                        {order.status === 'Delivered' && (
                          <span className="px-3 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                            Delivered
                          </span>
                        )}
                        {order.status === 'Picked Up' && (
                          <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            Picked Up
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Customer</div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName || 'Unknown Customer'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Items</div>
                        <div className="text-sm text-gray-600">
                          {Array.isArray(order.items) 
                            ? `${order.items.length} items`
                            : order.items}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Payment</div>
                        <div className="text-sm text-gray-900">{order.paymentMethod || 'Unknown'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Date</div>
                        <div className="text-sm text-gray-900">
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
                    >
                      {expandedOrderId === order.id ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Hide Shipping Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          View Shipping Details
                        </>
                      )}
                    </button>
                    
                    {expandedOrderId === order.id && order.shippingInfo && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h4>
                        {Array.isArray(order.shippingInfo) ? (
                          <div className="space-y-4">
                            {order.shippingInfo.map((info, idx) => (
                              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium text-sm">{info.fullName || 'N/A'}</p>
                                <p className="text-sm">{info.streetAddress || ''}</p>
                                <p className="text-sm">
                                  {[info.city, info.province, info.zipCode].filter(Boolean).join(', ')}
                                </p>
                                <p className="text-sm">
                                  {[info.phoneNumber, info.email].filter(Boolean).join(' • ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-sm">{order.shippingInfo.fullName || 'N/A'}</p>
                            <p className="text-sm">{order.shippingInfo.streetAddress || ''}</p>
                            <p className="text-sm">
                              {[
                                order.shippingInfo.city,
                                order.shippingInfo.province,
                                order.shippingInfo.zipCode
                              ].filter(Boolean).join(', ')}
                            </p>
                            <p className="text-sm">
                              {[
                                order.shippingInfo.phoneNumber,
                                order.shippingInfo.email
                              ].filter(Boolean).join(' • ')}
                            </p>
                            {order.shippingInfo.deliveryNotes && (
                              <p className="text-sm mt-2 text-gray-600">
                                <span className="font-medium">Notes:</span> {order.shippingInfo.deliveryNotes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
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