'use client';

import { CheckCircle, Home, Download, MapPin, Phone, Mail, Package, Truck, MapPinned } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  // Mock order data
  const orderNumber = '73329876';
  const orderDate = 'November 7, 2025';
  
  const orderTimeline = [
    {
      status: 'Order Placed',
      date: 'November 7, 2025',
      icon: CheckCircle,
      completed: true
    },
    {
      status: 'Processing',
      date: 'Your order is being prepared',
      icon: Package,
      completed: false
    },
    {
      status: 'Shipped',
      date: 'Expected November 12, 2025',
      icon: Truck,
      completed: false
    },
    {
      status: 'Delivered',
      date: 'We will notify you when delivered',
      icon: MapPinned,
      completed: false
    }
  ];

  const orderItems = [
    { 
      id: 1, 
      name: 'Handcrafted Bamboo Mug', 
      facility: 'Baguio City Jail',
      quantity: 2, 
      price: 300.00 
    },
    { 
      id: 2, 
      name: 'Woven Laundry Basket', 
      facility: 'La Trinidad Municipal Jail',
      quantity: 1, 
      price: 350.00 
    },
    { 
      id: 3, 
      name: 'Wooden Desk Organizer', 
      facility: 'Baguio City Jail',
      quantity: 1, 
      price: 450.00 
    },
  ];

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

  const shippingAddress = {
    name: 'Juan Dela Cruz',
    address: '123 Session Road, Baguio City, Benguet 2600',
    phone: '+63 912 345 6789',
    email: 'sample@example.com'
  };

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
          <p className="text-gray-600 mb-2">
            Thank you for supporting BuMel's livelihood program.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Order Number: <span className="font-semibold text-gray-900">{orderNumber}</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link
              href="/"
              className="flex-1 bg-gray-900 text-white py-3.5 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Home
              <Home className="w-4 h-4" />
            </Link>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-white text-gray-900 py-3.5 px-6 rounded-full font-medium border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
            >
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      {index < orderTimeline.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          item.completed ? 'bg-gray-900' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    
                    {/* Timeline Content */}
                    <div className="flex-1 pt-0.5">
                      <h3 className={`font-semibold ${
                        item.completed ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {item.status}
                      </h3>
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
                    <p className="font-semibold text-gray-900">{shippingAddress.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{shippingAddress.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">{shippingAddress.phone}</p>
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
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.facility}</p>
                      <p className="text-xs text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">₱{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₱{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
