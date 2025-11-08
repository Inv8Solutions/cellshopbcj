'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Package, ShoppingCart, Settings, LogOut, User } from 'lucide-react';
import { getAuth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRouter } from 'next/navigation';

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  href: string;
  featured: boolean;
}

interface Order {
  id: string;
  status: string;
  items: string[];
  total: number;
  createdAt: any;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<{ name: string; email: string; uid?: string }>({ name: '', email: '', uid: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const auth = getAuth();
  const router = useRouter();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const quickActions: QuickAction[] = [
    { title: 'Browse Products', description: 'Explore our collection', icon: ShoppingBag, href: '/products', featured: true },
    { title: 'Track Orders', description: 'Check delivery status', icon: Package, href: '#', featured: false },
    { title: 'Saved Items', description: 'View saved items', icon: Heart, href: '#', featured: false }
  ];

  // ------------------------------
  // Fetch logged-in user details
  // ------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        router.push('/');
        return;
      }

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUser({ uid: firebaseUser.uid, ...(userSnap.data() as any) });
      } else {
        console.warn('User document not found');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ------------------------------
  // Fetch subcollection data based on active tab
  // ------------------------------
  useEffect(() => {
    if (!user.uid) return; // wait until user UID is available

    const fetchSubcollection = async () => {
      setLoading(true);
      try {
        if (activeTab === 'orders') {
          const ordersSnap = await getDocs(collection(db, 'users', user.uid!, 'orders'));
          const ordersData: Order[] = ordersSnap.docs.map(doc => ({
            id: doc.id,
            status: doc.data().status || 'Pending',
            items: doc.data().items || [],
            total: doc.data().total || 0,
            createdAt: doc.data().createdAt || null,
          }));
          setOrders(ordersData);
        } else if (activeTab === 'saved') {
          const savedSnap = await getDocs(collection(db, 'users', user.uid!, 'saved'));
          const savedData = savedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSavedItems(savedData);
        }
      } catch (error) {
        console.error('Error fetching subcollection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcollection();
  }, [activeTab, user.uid]);

  // ------------------------------
  // Show settings content
  // ------------------------------
  useEffect(() => {
    setShowSettings(activeTab === 'settings');
  }, [activeTab]);

  // ------------------------------
  // Sidebar click handler
  // ------------------------------
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // ------------------------------
  // Logout
  // ------------------------------
  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  // ------------------------------
  // Change password logic
  // ------------------------------
  const handleChangePassword = async () => {
    if (!auth.currentUser || !auth.currentUser.email) return;
    try {
      // Reauthenticate
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);
      setPasswordMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error(error);
      setPasswordMessage(error.message || 'Failed to update password.');
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-xl font-bold text-gray-900">BJMP-CAR SHOP</Link>
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" placeholder="Search Anything.." className="block w-full pl-9 pr-3 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/products" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">Browse Products</Link>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
              </button>
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
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white text-2xl font-medium mb-4">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === item.id ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}

                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all">
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
                      <Link key={action.title} href={action.href} className={`rounded-3xl p-6 transition-all hover:scale-[1.02] ${action.featured ? 'bg-black text-white md:col-span-2 md:row-span-2' : 'bg-gray-100 text-gray-900'}`}>
                        <Icon className={`w-8 h-8 mb-4 ${action.featured ? 'text-white' : 'text-gray-900'}`} />
                        <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                        <p className={`text-sm ${action.featured ? 'text-gray-300' : 'text-gray-600'}`}>{action.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
                {orders.length === 0 ? <p>No orders found.</p> : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">#{order.id}</h3>
                            <p className="text-sm text-gray-600">Placed on {order.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</p>
                          </div>
                          <span className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full">{order.status}</span>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Items: {order.items.join(', ')}</p>
                          <p className="text-lg font-bold text-gray-900">Total: ₱{order.total.toFixed(2)}</p>
                        </div>
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">View Details</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Products</h1>
                {savedItems.length === 0 ? <p>No saved items.</p> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedItems.map(item => (
                      <div key={item.id} className="group">
                        <Link href={`/products/${item.id}`}>
                          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-4 cursor-pointer">
                            <img src={item.image || '/placeholder.png'} alt={item.name} className="object-cover w-full h-full" />
                          </div>
                        </Link>
                        <div className="flex items-start justify-between gap-3">
                          <Link href={`/products/${item.id}`} className="flex-1">
                            <h3 className="text-base font-bold text-gray-900 mb-1 hover:text-gray-700">{item.name || 'Unnamed Product'}</h3>
                            <p className="text-base text-gray-900">₱{item.price?.toFixed(2) || 0}</p>
                          </Link>
                          <button className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all" aria-label="Add to cart">
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {showSettings && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
                <div className="space-y-8">
                  {/* Change Password Section */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={handleChangePassword}
                        className="px-8 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                      >
                        Update Password
                      </button>
                      {passwordMessage && <p className="text-sm mt-2 text-gray-700">{passwordMessage}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
