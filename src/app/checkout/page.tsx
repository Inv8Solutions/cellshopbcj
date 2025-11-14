'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    streetAddress: '',
    city: '',
    province: '',
    zipCode: '',
    deliveryNotes: '',
  });

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
  const [checkoutTotal, setCheckoutTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load cart items and total
      const raw = localStorage.getItem('checkout_items');
      const rawTotal = localStorage.getItem('checkout_total');

      if (raw) {
        const parsed: CheckoutItem[] = JSON.parse(raw);
        setCartItems(parsed);
      }

      if (rawTotal) {
        const parsedTotal = JSON.parse(rawTotal);
        setCheckoutTotal(Number(parsedTotal));
      }

      // Load previously saved shipping information if it exists
      const savedShippingInfo = localStorage.getItem('checkout_shipping');
      if (savedShippingInfo) {
        const parsedShippingInfo = JSON.parse(savedShippingInfo);
        setFormData(parsedShippingInfo);
      }
    } catch (err) {
      } finally {
      setLoading(false);
    }
  }, []);

  const shipping = 0; // FREE
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = checkoutTotal !== null ? checkoutTotal : subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    // Validate form
    if (!formData.fullName || !formData.phoneNumber || !formData.email || 
        !formData.streetAddress || !formData.city || !formData.province || !formData.zipCode) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Save shipping information to localStorage
      localStorage.setItem('checkout_shipping', JSON.stringify(formData));
      // Navigate to payment page
      window.location.href = '/checkout/payment';
    } catch (err) {
      alert('There was an error saving your shipping information. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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

              <div className="h-px w-8 bg-gray-300"></div>

              {/* Step 2: Payment */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-400">Payment</span>
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
            {/* Left: Shipping Information Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                <form className="space-y-5">
                  {/* Full Name and Phone Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Juan Dela Cruz"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+63 912 345 6789"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="juan@example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  {/* Street Address */}
                  <div>
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-900 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="House/Unit No., Building, Street"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  {/* City, Province, ZIP Code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Baguio"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-gray-900 mb-2">
                        Province *
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        placeholder="Benguet"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-900 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="2600"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  <div>
                    <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-900 mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      value={formData.deliveryNotes}
                      onChange={handleInputChange}
                      placeholder="Special delivery instructions..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-sm"
                    />
                  </div>
                </form>
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
