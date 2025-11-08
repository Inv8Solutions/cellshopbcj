'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { db, auth } from '@/firebase/config';
import { collection, addDoc, doc, setDoc, serverTimestamp, getDocs, query, where, deleteDoc } from 'firebase/firestore';

interface CheckoutItem {
  id: string | number;
  productId?: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string | null;
}

interface ShippingInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  streetAddress: string;
  city: string;
  province: string;
  zipCode: string;
  deliveryNotes?: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // State for all checkout data
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    method: string;
    shippingMethod: string;
  } | null>(null);
  const [orderItems, setOrderItems] = useState<CheckoutItem[]>([]);

  useEffect(() => {
    try {
      // Get shipping info
      const rawShipping = localStorage.getItem('checkout_shipping');
      if (rawShipping) {
        setShippingInfo(JSON.parse(rawShipping));
      } else {
        router.push('/checkout');
        return;
      }

      // Get payment info
      const rawPayment = localStorage.getItem('checkout_payment');
      if (rawPayment) {
        setPaymentInfo(JSON.parse(rawPayment));
      } else {
        router.push('/checkout/payment');
        return;
      }

      // Get order items
      const rawItems = localStorage.getItem('checkout_items');
      if (rawItems) {
        setOrderItems(JSON.parse(rawItems));
      } else {
        router.push('/cart');
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading checkout data:', err);
      router.push('/cart');
    }
  }, [router]);

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = paymentInfo?.shippingMethod === 'express' ? 100 : 0;
  const total = subtotal + shipping;

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

  const handleConfirmOrder = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in to complete your order');
        router.push('/login');
        return;
      }

      // Show loading state
      setLoading(true);

      // Prepare order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: orderItems,
        shippingInfo,
        paymentInfo,
        subtotal,
        shippingCost: shipping,
        total,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      try {
        // Create a new order document in the orders collection
        const ordersRef = collection(db, 'orders');
        const newOrderRef = await addDoc(ordersRef, orderData);
        const orderId = newOrderRef.id;

        // Add the order to user's orders subcollection
        const userOrderRef = doc(db, 'users', user.uid, 'orders', orderId);
        await setDoc(userOrderRef, {
          ...orderData,
          orderId
        });

        // Remove checked out items from the user's Firestore cart
        try {
          const userCartRef = collection(db, 'users', user.uid, 'cart');
          for (const item of orderItems) {
            // Only try to remove items that have a productId (items from DB)
            const pid = (item as any).productId ?? (item as any).id ?? null;
            if (!pid) continue;

            const cartQuery = query(userCartRef, where('productId', '==', pid));
            const cartSnapshot = await getDocs(cartQuery);
            for (const cartDoc of cartSnapshot.docs) {
              try {
                await deleteDoc(doc(userCartRef, cartDoc.id));
              } catch (err) {
                console.warn('Failed to delete cart doc', cartDoc.id, err);
              }
            }
          }
        } catch (err) {
          console.warn('Error removing checked out items from cart:', err);
        }

        // Save a preview + id so the success page can show the order immediately
        try {
          const preview = {
            orderId,
            items: orderItems,
            shippingInfo,
            paymentInfo,
            subtotal,
            shippingCost: shipping,
            total,
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('last_order_id', orderId);
          localStorage.setItem('last_order_preview', JSON.stringify(preview));
        } catch (e) {
          console.warn('Could not save order preview to localStorage', e);
        }

        // Clear transient checkout keys
        localStorage.removeItem('checkout_items');
        localStorage.removeItem('checkout_total');
        localStorage.removeItem('checkout_shipping');
        localStorage.removeItem('checkout_payment');

        // Redirect to success page with orderId so the page can fetch the exact document
        window.location.href = `/checkout/success?orderId=${orderId}`;
      } catch (error) {
        console.error('Error submitting order:', error);
        alert('There was an error submitting your order. Please try again.');
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/checkout/payment" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                <p className="text-sm text-gray-600">Complete your order</p>
              </div>
            </div>

            {/* Progress Steps - All Completed */}
            <div className="hidden md:flex items-center gap-3">
              {/* Step 1: Shipping */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-900">Shipping</span>
              </div>

              <div className="h-px w-8 bg-gray-900"></div>

              {/* Step 2: Payment */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-900">Payment</span>
              </div>

              <div className="h-px w-8 bg-gray-900"></div>

              {/* Step 3: Review */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-900">Review</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                  <Link 
                    href="/checkout" 
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
                {shippingInfo && (
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-semibold text-gray-900">{shippingInfo.fullName}</p>
                    <p>{shippingInfo.phoneNumber} • {shippingInfo.email}</p>
                    <p>{shippingInfo.streetAddress}</p>
                    <p>{shippingInfo.city}, {shippingInfo.province} {shippingInfo.zipCode}</p>
                    {shippingInfo.deliveryNotes && (
                      <p className="text-gray-500 italic">Note: {shippingInfo.deliveryNotes}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment & Shipping Method */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Payment & Shipping</h2>
                  <Link 
                    href="/checkout/payment" 
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="text-sm font-semibold text-gray-900">{paymentInfo?.method}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shipping Method</p>
                    <p className="text-sm font-semibold text-gray-900">{paymentInfo?.shippingMethod}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({orderItems.length} items)</span>
                    <span className="font-semibold text-gray-900">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">₱{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-6"
                >
                  Confirm Order
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1 shrink-0"></span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1 shrink-0"></span>
                    <span>Free returns within 7 days</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1 shrink-0"></span>
                    <span>Supporting rehabilitation programs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
