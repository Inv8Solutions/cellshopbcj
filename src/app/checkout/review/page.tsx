'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';

export default function ReviewPage() {
  // Mock data - in a real app, this would come from state management or API
  const shippingInfo = {
    name: 'Juan',
    fullName: 'Juan Dela Cruz',
    email: 'sample@example.com',
    address: 'Legarda, Baguio City, Benguet 2600'
  };

  const paymentInfo = {
    method: 'Cash on Delivery',
    shippingMethod: 'Standard (3-5 days)'
  };

  const orderItems = [
    { id: 1, name: 'Handcrafted Bamboo Mug', quantity: 2, price: 150.00, total: 300.00 },
    { id: 2, name: 'Woven Laundry Basket', quantity: 1, price: 350.00, total: 350.00 },
    { id: 3, name: 'Wooden Desk Organizer', quantity: 1, price: 450.00, total: 450.00 },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = 0; // FREE
  const total = subtotal + shipping;

  const handleConfirmOrder = () => {
    console.log('Order confirmed!');
    // In a real app, this would submit the order to the backend
    window.location.href = '/checkout/success';
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
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold text-gray-900">{shippingInfo.name}</p>
                  <p>{shippingInfo.fullName} • {shippingInfo.email}</p>
                  <p>{shippingInfo.address}</p>
                </div>
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
                    <p className="text-sm font-semibold text-gray-900">{paymentInfo.method}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shipping Method</p>
                    <p className="text-sm font-semibold text-gray-900">{paymentInfo.shippingMethod}</p>
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
                      <p className="text-sm font-bold text-gray-900">₱{item.total.toFixed(2)}</p>
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
