'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, CreditCard, CheckCircle, ArrowRight, Wallet, Banknote } from 'lucide-react';

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingMethod, setShippingMethod] = useState('standard');

  interface CheckoutItem {
    id: string | number;
    productId?: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string | null;
  }

  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [checkoutSubtotal, setCheckoutSubtotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Check if we have shipping info from previous step
      const shippingInfo = localStorage.getItem('checkout_shipping');
      if (!shippingInfo) {
        // Redirect back to shipping info page if data is missing
        window.location.href = '/checkout';
        return;
      }

      const raw = localStorage.getItem('checkout_items');
      const rawTotal = localStorage.getItem('checkout_total');

      if (raw) {
        const parsed: CheckoutItem[] = JSON.parse(raw);
        setCartItems(parsed);
      }

      if (rawTotal) {
        const parsedTotal = JSON.parse(rawTotal);
        // In cart we store subtotal (selected items) as checkout_total
        setCheckoutSubtotal(Number(parsedTotal));
      }
    } catch (err) {
      console.error('Error reading checkout payload from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // subtotal is either the passed subtotal from cart or computed from items as fallback
  const computedSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = checkoutSubtotal !== null ? checkoutSubtotal : computedSubtotal;
  const shippingCost = shippingMethod === 'standard' ? 0 : 100;
  const total = subtotal + shippingCost;

  const handleContinue = () => {
    // Save payment and shipping selections to localStorage
    const paymentData = {
      method: paymentMethod,
      shippingMethod: shippingMethod,
      shippingCost: shippingMethod === 'standard' ? 0 : 100
    };
    
    try {
      localStorage.setItem('checkout_payment', JSON.stringify(paymentData));
      // Redirect to review page
      window.location.href = '/checkout/review';
    } catch (err) {
      console.error('Error saving payment data:', err);
      alert('There was an error saving your payment information. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/checkout" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                <p className="text-sm text-gray-600">Complete your order</p>
              </div>
            </div>

            {/* Progress Steps - Horizontal */}
            <div className="hidden md:flex items-center gap-3">
              {/* Step 1: Shipping */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-900">Shipping</span>
              </div>

              <div className="h-px w-8 bg-gray-900"></div>

              {/* Step 2: Payment */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-900">Payment</span>
              </div>

              <div className="h-px w-8 bg-gray-300"></div>

              {/* Step 3: Review */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-400">Review</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Payment & Shipping Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method */}
              <div className="bg-white rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="Cash-On-Delivery"
                        checked={paymentMethod === 'Cash-On-Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-gray-400" />
                  </label>

                  {/* GCash */}
                  <div className="relative">
                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-not-allowed bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="gcash"
                          checked={paymentMethod === 'gcash'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 text-gray-300 cursor-not-allowed"
                          disabled
                        />
                        <div>
                          <p className="font-semibold text-gray-400">GCash</p>
                          <p className="text-sm text-gray-400">Fast and secure mobile payment</p>
                        </div>
                      </div>
                      <Wallet className="w-5 h-5 text-gray-300" />
                    </label>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Unavailable, Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Method</h2>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="standard"
                      name="shipping"
                      value="Standard"
                      checked={shippingMethod === 'Standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900 mt-0.5"
                    />
                    <label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Standard Delivery (3-5 days)</span>
                        <span className="font-semibold text-green-600">FREE</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="express"
                      name="shipping"
                      value="Express"
                      checked={shippingMethod === 'Express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900 mt-0.5"
                    />
                    <label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Express Delivery (1-2 days)</span>
                        <span className="font-semibold text-gray-900">₱100</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold text-gray-900">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shippingCost === 0 ? 'FREE' : `₱${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">₱{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-6"
                >
                  Continue
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
