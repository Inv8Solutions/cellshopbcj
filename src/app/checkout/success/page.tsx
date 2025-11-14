'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Home, Download, MapPin, Phone, Mail, Package, Truck, MapPinned } from 'lucide-react';
import Link from 'next/link';
import { db, auth } from '@/firebase/config';
import {collection,query,where,orderBy,limit,getDocs,doc,getDoc} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function OrderSuccessPage() {
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // We'll read the orderId from window.location.search inside the effect

  useEffect(() => {
    // Helper: load preview from localStorage if present. Prefer explicit checkout_* keys
    const loadPreviewFallback = () => {
      try {
        const rawItems = localStorage.getItem('checkout_items');
        const rawShipping = localStorage.getItem('checkout_shipping');
        const rawPayment = localStorage.getItem('checkout_payment');
        const rawTotal = localStorage.getItem('checkout_total');
        const lastOrderId = localStorage.getItem('last_order_id') ?? null;

        if (rawItems || rawShipping || rawPayment) {
          const items = rawItems ? JSON.parse(rawItems) : [];
          const shippingInfo = rawShipping ? JSON.parse(rawShipping) : null;
          const paymentInfo = rawPayment ? JSON.parse(rawPayment) : null;
          const subtotal = rawTotal ? Number(JSON.parse(rawTotal)) : (items ? items.reduce((s: number, i: any) => s + (i.price * (i.quantity ?? 1)), 0) : 0);
          const shippingCost = paymentInfo?.shippingCost ?? (paymentInfo?.shippingMethod === 'express' ? 100 : 0);
          const total = subtotal + (shippingCost ?? 0);

          setOrderData({
            orderId: lastOrderId ?? 'preview',
            items,
            shippingInfo,
            paymentInfo,
            subtotal,
            shippingCost,
            total,
            createdAt: new Date().toISOString()
          });
          return;
        }
      } catch (err) {
        }

      // legacy fallback key
      const preview = localStorage.getItem('last_order_preview');
      if (preview) setOrderData(JSON.parse(preview));
    };

    const fetchById = async (id: string) => {
      try {
        const d = doc(db, 'orders', id);
        const snap = await getDoc(d);
        if (snap.exists()) {
          setOrderData({ id: snap.id, ...snap.data() });
          return true;
        }
      } catch (err) {
        }
      return false;
    };

    // Read orderId from URL on the client
    const orderIdParamLocal = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('orderId') : null;

    // Wait for auth state to be known. This handles the case where auth isn't initialized yet.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // If an explicit orderId param is present, try fetching that order first (works without auth)
        if (orderIdParamLocal) {
          const ok = await fetchById(orderIdParamLocal);
          if (ok) {
            setLoading(false);
            return;
          }
        }

        if (!user) {
          // No signed-in user: fallback to preview
          loadPreviewFallback();
          setLoading(false);
          return;
        }

        // User is signed in: query most recent order for the user
        const ordersCol = collection(db, 'orders');
        const q = query(ordersCol, where('userId', '==', user.uid), orderBy('createdAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          setOrderData({ id: docSnap.id, ...docSnap.data() });
        } else {
          loadPreviewFallback();
        }
      } catch (err) {
        loadPreviewFallback();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fallback mock values when no order data is available
  const fallbackItems = [
    { id: 1, name: 'Handcrafted Bamboo Mug', facility: 'Baguio City Jail', quantity: 2, price: 300.0 },
    { id: 2, name: 'Woven Laundry Basket', facility: 'La Trinidad Municipal Jail', quantity: 1, price: 350.0 },
    { id: 3, name: 'Wooden Desk Organizer', facility: 'Baguio City Jail', quantity: 1, price: 450.0 }
  ];

  // Derive display values from orderData or fallbacks
  const orderNumber = orderData?.orderId ?? orderData?.id ?? '—';
  const createdAt = orderData?.createdAt?.toDate ? orderData.createdAt.toDate() : orderData?.createdAt ? new Date(orderData.createdAt) : null;
  const orderDate = createdAt ? createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const orderTimeline = [
    { status: 'Order Placed', date: orderDate, icon: CheckCircle, completed: true },
    { status: 'Processing', date: 'Your order is being prepared', icon: Package, completed: false },
    { status: 'Shipped', date: 'We will notify you when your order is shipped', icon: Truck, completed: false },
    { status: 'Delivered', date: 'We will notify you when delivered', icon: MapPinned, completed: false }
  ];

  const orderItems = orderData?.items ?? fallbackItems;

  const totalAmount = orderData?.total ?? orderItems.reduce((sum: number, item: any) => sum + (item.price * (item.quantity ?? 1)), 0);

  const shippingAddress = orderData?.shippingInfo ?? {
    name: 'Juan Dela Cruz',
    streetAddress: '123 Session Road, Baguio City, Benguet 2600',
    phoneNumber: '+63 912 345 6789',
    email: 'sample@example.com'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 text-white mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you for supporting BJMP-CAR's livelihood program.</p>
          <p className="text-sm text-gray-500 mb-8">Order Number: <span className="font-semibold text-gray-900">{orderNumber}</span></p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link href="/products" className="flex-1 bg-gray-900 text-white py-3.5 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              Proceed to Home
              <Home className="w-4 h-4" />
            </Link>
            <button onClick={() => window.print()} className="flex-1 bg-white text-gray-900 py-3.5 px-6 rounded-full font-medium border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center gap-2">
              Download Receipt
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Order Timeline */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>
              <div className="space-y-6">
                {orderTimeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    {/* Timeline Icon */}
                    <div className="relative flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.completed ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      {index < orderTimeline.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${item.completed ? 'bg-gray-900' : 'bg-gray-200'}`} />
                      )}
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 pt-0.5">
                      <h3 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>{item.status}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{shippingAddress.fullName ?? shippingAddress.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{shippingAddress.streetAddress ?? shippingAddress.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">{shippingAddress.phoneNumber ?? shippingAddress.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">{shippingAddress.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.facility && <p className="text-xs text-gray-500 mt-1">{item.facility}</p>}
                      <p className="text-xs text-gray-600 mt-1">Quantity: {item.quantity ?? 1}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">₱{((item.price || 0) * (item.quantity ?? 1)).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₱{(totalAmount ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
