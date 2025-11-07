'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Trash2, Tag, ArrowRight } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: string;
  image: string;
}

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Handcrafted Bamboo Mug',
      category: 'Woodcrafts',
      price: 150.00,
      quantity: 2,
      stock: 'In Stock',
      image: '/products/bamboo-mug.jpg'
    },
    {
      id: 2,
      name: 'Woven Laundry Basket',
      category: 'Bags & Purses',
      price: 350.00,
      quantity: 1,
      stock: 'In Stock',
      image: '/products/woven-basket.jpg'
    },
    {
      id: 3,
      name: 'Wooden Desk Organizer',
      category: 'Woodcrafts',
      price: 450.00,
      quantity: 1,
      stock: 'In Stock',
      image: '/products/desk-organizer.jpg'
    },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    console.log('Applying promo code:', promoCode);
    // Add promo code logic here
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // FREE
  const total = subtotal + shipping;

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
            <p className="text-sm text-gray-600">{cartItems.length} items</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Image</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                          <h3 className="text-base font-bold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-green-600 font-medium">{item.stock}</p>
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
                      <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                      <span className="font-medium text-gray-900">₱{subtotal.toFixed(2)}</span>
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

                  <Link
                    href="/checkout"
                    className="w-full bg-gray-900 text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Link>

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
        </div>
      </main>
    </div>
  );
}
