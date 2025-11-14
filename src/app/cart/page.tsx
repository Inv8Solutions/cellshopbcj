'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Trash2, Tag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase/config';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  image: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string } | null>(null);
  const router = useRouter();

  // Authentication effect
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email || 'Customer' });
      } else {
        setCurrentUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Cart subscription effect
  useEffect(() => {
    if (!currentUser) return;
    const userCartRef = collection(db, 'users', currentUser.uid, 'cart');

    const unsubscribe = onSnapshot(userCartRef, (snapshot) => {
      const items: CartItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        items.push({ id: docSnap.id, ...data } as CartItem);
      });

      // Try to sort by createdAt client-side if present (descending)
      items.sort((a, b) => {
        const aTs = (a.createdAt && typeof (a.createdAt as any).toMillis === 'function') ? (a.createdAt as any).toMillis() : 0;
        const bTs = (b.createdAt && typeof (b.createdAt as any).toMillis === 'function') ? (b.createdAt as any).toMillis() : 0;
        return bTs - aTs;
      });

  setCartItems(items);
  // initialize selection to all items currently in cart
  setSelectedIds(new Set(items.map((it) => it.id)));
      setLoading(false);
    }, (error) => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateQuantity = async (id: string, delta: number) => {
    if (!currentUser) return;

    try {
      const itemRef = doc(db, 'users', currentUser.uid, 'cart', id);
      const itemSnap = await getDoc(itemRef);
      
      if (!itemSnap.exists()) {
        return;
      }

      const currentQuantity = itemSnap.data().quantity || 0;
      const newQuantity = Math.max(1, currentQuantity + delta);

      await updateDoc(itemRef, {
        quantity: newQuantity,
        updatedAt: new Date()
      });
    } catch (error) {
      alert('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (id: string) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'cart', id));
    } catch (error) {
      alert('Failed to remove item. Please try again.');
    }
  };

  const applyPromoCode = () => {
    // Promo code logic to be implemented
    alert('Promo code feature coming soon!');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // FREE
  const total = subtotal + shipping;

  // Selected items and totals (reflects only selected items)
  const selectedItems = cartItems.filter((item) => selectedIds.has(item.id));
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedTotal = selectedSubtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 lg:px-12 py-4">
          <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-600">{selectedItems.length} of {cartItems.length} items selected</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-gray-600">Loading your cart...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex gap-4">
                    {/* Selection Checkbox */}
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => {
                          const next = new Set(selectedIds);
                          if (next.has(item.id)) next.delete(item.id);
                          else next.add(item.id);
                          setSelectedIds(next);
                        }}
                        className="w-4 h-4 text-gray-900 rounded border-gray-300"
                        aria-label={`Select ${item.name}`}
                      />
                    </div>
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjd2VhcmVzdW5kZXIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1pbWFnZSI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDIxIDMgMyAxOCA4LjUgMTguNSIgLz48L3N2Zz4=';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                          <h3 className="text-base font-bold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-green-600 font-medium">In Stock</p>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-12 text-center text-sm font-medium text-gray-900 bg-transparent focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">₱{item.price.toFixed(2)} each</p>
                          <p className="text-lg font-bold text-gray-900">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Button */}
              <button
                onClick={() => window.location.href = '/products'}
                className="w-full py-4 text-gray-900 font-medium hover:bg-white rounded-xl transition-colors"
              >
                Continue Shopping
              </button>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8 space-y-6">
                {/* Promo Code */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Promo Code</h3>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({selectedItems.length} items)</span>
                      <span className="font-medium text-gray-900">₱{selectedSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">₱{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // proceed to checkout with selected items
                      if (!currentUser) {
                        router.push('/login');
                        return;
                      }

                      if (selectedItems.length === 0) {
                        alert('Please select at least one item to proceed to checkout.');
                        return;
                      }

                      try {
                        // Prepare lightweight payload for checkout (plain JS objects)
                        const payload = selectedItems.map((it) => ({
                          id: it.id,
                          productId: it.productId,
                          name: it.name,
                          price: it.price,
                          quantity: it.quantity,
                          image: it.image,
                          category: it.category || null
                        }));
                        localStorage.setItem('checkout_items', JSON.stringify(payload));
                        localStorage.setItem('checkout_total', JSON.stringify(selectedTotal));
                        router.push('/checkout');
                      } catch (err) {
                        alert('Failed to start checkout. Please try again.');
                      }
                    }}
                    className={`w-full ${selectedItems.length === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'} py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2`}
                    disabled={selectedItems.length === 0}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="space-y-2 text-sm text-gray-600 mt-6">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5 shrink-0"></span>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5 shrink-0"></span>
                      <span>Free returns within 7 days</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5 shrink-0"></span>
                      <span>Supporting rehabilitation programs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
