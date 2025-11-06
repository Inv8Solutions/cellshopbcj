'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductsPreviewSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Bags & Purses',
    'Rugs',
    'Paper Crafts',
    'Pastries',
    'Wood Crafts',
    'Bonsel'
  ];

  // Sample products - replace with actual data
  const products: Product[] = [
    {
      id: '1',
      name: 'Bamboo Mug',
      price: 120.00,
      image: '/products/bamboo-mug.jpg',
      category: 'Wood Crafts'
    },
    {
      id: '2',
      name: 'Woven Storage Basket',
      price: 150.00,
      image: '/products/woven-basket.jpg',
      category: 'Bags & Purses'
    },
    {
      id: '3',
      name: 'Recycled Paper Journal',
      price: 180.00,
      image: '/products/paper-journal.jpg',
      category: 'Paper Crafts'
    },
    {
      id: '4',
      name: 'Handcrafted Keychain',
      price: 100.00,
      image: '/products/keychain.jpg',
      category: 'Wood Crafts'
    },
    {
      id: '5',
      name: 'Wooden Desk Organizer',
      price: 450.00,
      image: '/products/desk-organizer.jpg',
      category: 'Wood Crafts'
    },
    {
      id: '6',
      name: 'Woven Tote Bag',
      price: 300.00,
      image: '/products/tote-bag.jpg',
      category: 'Bags & Purses'
    }
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="w-full px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop with Purpose.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            By purchasing from BJMP-CAR Shop, you're not just buying a product — you're supporting rehabilitation, providing income for families, and contributing to a more sustainable future through eco-friendly practices.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {category}
            </button>
          ))}
          <Link
            href="/products"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-white text-gray-900 border border-gray-300 hover:border-gray-400 whitespace-nowrap transition-all ml-2"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              {/* Product Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 mb-3">
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Product Image</span>
                </div>
                {/* Uncomment when images are available */}
                {/* <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                /> */}
              </div>

              {/* Product Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-900">
                    ₱{product.price.toFixed(2)}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="shrink-0 w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
