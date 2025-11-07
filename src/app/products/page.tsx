'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';
import { useState } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'Bags & Purses',
    'Rugs',
    'Paper Crafts',
    'Pastries',
    'Wood Crafts',
    'Bonsel'
  ];

  const facilities = [
    'Baguio City Jail',
    'La Trinidad Municipal Jail',
    'Benguet Provincial Jail',
    'Tagudin Municipal Jail'
  ];

  // Mock products data
  const products = Array(6).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Bamboo Mug',
    price: i % 2 === 0 ? 120.00 : 120.00,
    image: '/products/bamboo-mug.jpg'
  }));

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev =>
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow pt-16">
        <div className="w-full px-6 lg:px-12 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Shop</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="space-y-8">
                {/* Price Range */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Price Range</h3>
                    <button className="text-sm text-gray-600">Reset</button>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">₱{priceRange[0]}</span>
                      <span className="text-gray-600">₱{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-gray-200"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Facilities</h3>
                  <div className="space-y-3">
                    {facilities.map((facility) => (
                      <label key={facility} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFacilities.includes(facility)}
                          onChange={() => toggleFacility(facility)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-gray-200"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {facility}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort Bar */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group">
                    <Link href={`/products/${product.id}`}>
                      {/* Product Image */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-3 cursor-pointer">
                        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center group-hover:bg-gray-400 transition-colors">
                          <span className="text-gray-400 text-xs">Product Image</span>
                        </div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/products/${product.id}`} className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 truncate hover:text-gray-700">
                          {product.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-900">
                          ₱{product.price.toFixed(2)}
                        </p>
                      </Link>

                      {/* Add to Cart Button */}
                      <button
                        className="shrink-0 w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
                        aria-label={`Add ${product.name} to cart`}
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Add to cart:', product);
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
        <ContactSection />
      <Footer />
    </div>
  );
}
