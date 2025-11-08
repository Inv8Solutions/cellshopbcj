'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Package, ShoppingCart, Settings, LogOut, User } from 'lucide-react';
import { getAuth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
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
  // items can be array of strings or detailed objects stored in Firestore
  items: any[];
  total: number;
  createdAt: any;
  // optional detailed fields saved by checkout/review flow
  shippingInfo?: any;
  subtotal?: number;
  shippingCost?: number;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<{ name: string; email: string; uid?: string }>({ name: '', email: '', uid: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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
  // Listen for cart updates
  // ------------------------------
  useEffect(() => {
    if (!user.uid) return;

    const cartRef = collection(db, 'users', user.uid, 'cart');
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      setCartCount(snapshot.docs.length);
    });

    return () => unsubscribe();
  }, [user.uid]);

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
          const ordersData: Order[] = ordersSnap.docs.map(doc => {
            const data = doc.data();
            return ({
              id: doc.id,
              status: data.status || 'Pending',
              items: data.items || [],
              total: data.total || 0,
              createdAt: data.createdAt || null,
              // include detailed fields so the modal can render shipping/payment info
              shippingInfo: data.shippingInfo ?? null,
              subtotal: data.subtotal ?? data.subTotal ?? null,
              shippingCost: data.shippingCost ?? null,
              // include payment info if available
              // @ts-ignore
              paymentInfo: data.paymentInfo ?? null,
            });
          });
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedOrder]);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedOrder(null);
    };
    if (selectedOrder) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedOrder]);

  // Helper: normalize shipping info shapes (object keys may vary)
  const normalizeShipping = (s: any) => {
    if (!s) return null;
    return {
      fullName: s.fullName ?? s.name ?? s.full_name ?? '',
      streetAddress: s.streetAddress ?? s.address ?? s.street ?? '',
      city: s.city ?? s.town ?? s.municipality ?? '',
      province: s.province ?? s.state ?? '',
      zipCode: s.zipCode ?? s.zip ?? s.postal ?? '',
      phoneNumber: s.phoneNumber ?? s.phone ?? s.contact ?? '',
      email: s.email ?? s.emailAddress ?? ''
    };
  };

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );

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
              <Link 
                href="/cart" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                title={`Shopping Cart (${cartCount} items)`}
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2">
                {loading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-medium" title={user.name || user.email}>
                      {user.name ? user.name[0].toUpperCase() : <User className="w-5 h-5" />}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-gray-900">{user.name || 'Welcome'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </>
                )}
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
                                        <p className="text-sm text-gray-600 mb-1">Items: {Array.isArray(order.items) ? (order.items.map((it:any)=> typeof it === 'string' ? it : it.name).join(', ')) : String(order.items)}</p>
                                        <p className="text-lg font-bold text-gray-900">Total: ₱{order.total.toFixed(2)}</p>
                                      </div>
                                      <button onClick={() => setSelectedOrder(order)} className="w-full sm:w-auto px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">View Details</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
                <div className="relative z-10 w-full max-w-2xl mx-4">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order #{selectedOrder.id}</h3>
                        <p className="text-sm text-gray-600">Placed on {selectedOrder.createdAt?.toDate?.()?.toLocaleString?.() ?? new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800">{selectedOrder.status}</span>
                        <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-500 hover:text-gray-900 absolute top-2 right-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                        <div className="space-y-3">
                          {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((it: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{typeof it === 'string' ? it : it.name ?? 'Item'}</div>
                                  {typeof it !== 'string' && it.facility && <div className="text-xs text-gray-500">{it.facility}</div>}
                                </div>
                                <div className="text-sm text-gray-700">Qty: {it.quantity ?? 1} • ₱{(((it.price ?? 0) * (it.quantity ?? 1))).toFixed(2)}</div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No item details available.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Shipping</h4>
                        {selectedOrder.shippingInfo ? (
                          Array.isArray(selectedOrder.shippingInfo) ? (
                            <div className="space-y-3 text-sm text-gray-700">
                              {selectedOrder.shippingInfo.map((s: any, idx: number) => {
                                const sh = normalizeShipping(s);
                                if (!sh) return null;
                                return (
                                  <div key={idx}>
                                    <p className="text-sm font-medium text-gray-800">Recipient {idx + 1}</p>
                                    <p className="font-medium">{sh.fullName}</p>
                                    <p>{sh.streetAddress}</p>
                                    <p>{sh.city ? sh.city + (sh.province ? ', ' + sh.province : '') : ''} {sh.zipCode}</p>
                                    <p className="text-xs text-gray-500 mt-1">{sh.phoneNumber} • {sh.email}</p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            (() => {
                              const sh = normalizeShipping(selectedOrder.shippingInfo);
                              if (!sh) return <p className="text-sm text-gray-500">No shipping information available.</p>;
                              return (
                                <div className="text-sm text-gray-700">
                                  <p className="font-medium">{sh.fullName}</p>
                                  <p>{sh.streetAddress}</p>
                                  <p>{sh.city ?? ''}{sh.province ? ', ' + sh.province : ''} {sh.zipCode ?? ''}</p>
                                  <p className="text-xs text-gray-500 mt-1">{sh.phoneNumber} • {sh.email}</p>
                                </div>
                              );
                            })()
                          )
                        ) : (
                          <p className="text-sm text-gray-500">No shipping information available.</p>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="font-medium">₱{(selectedOrder.subtotal ?? selectedOrder.total ?? 0).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Shipping</span>
                          <span className="font-medium">₱{(selectedOrder.shippingCost ?? 0).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-base font-bold">Total</span>
                          <span className="text-base font-bold">₱{(selectedOrder.total ?? 0).toFixed(2)}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
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
