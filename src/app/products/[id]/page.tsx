'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';
import { Star, ShoppingCart, Minus, Plus } from 'lucide-react';

// Mock product data - in a real app, this would come from an API or database
const getProductDetails = (id: string) => {
  return {
    id,
    name: 'Bamboo Mug',
    price: 120.00,
    rating: 4.8,
    description: 'Handcrafted from sustainably sourced bamboo, this eco-friendly mug is both durable and elegant — perfect for your morning coffee or tea. Each piece is uniquely made through BuMel\'s livelihood programs, supporting rehabilitation and meaningful work for displaced or liberty.',
    category: 'Woodcrafts',
    images: [
      '/products/bamboo-mug-1.jpg',
      '/products/bamboo-mug-2.jpg',
      '/products/bamboo-mug-3.jpg',
      '/products/bamboo-mug-4.jpg',
    ],
    specifications: [
      { label: 'Material', value: 'Natural Bamboo' },
      { label: 'Finish', value: 'Polished, food-safe coating' },
      { label: 'Dimensions', value: 'Approx. 10cm (H) × 8cm (D)' },
      { label: 'Care', value: 'Hand wash only, avoid prolonged soaking' },
    ],
    stock: 50,
  };
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const product = getProductDetails(id);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, Math.min(product.stock, quantity + delta)));
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Adding to cart:', { product, quantity });
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log('Buy now:', { product, quantity });
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
            <Link href="/products" className="hover:text-gray-900">Shop</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-gray-900">{product.category}</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          {/* Product Detail Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Left: Product Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-4">
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Product Image {selectedImage + 1}</span>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-gray-200 border-2 transition-all ${
                      selectedImage === index ? 'border-gray-900' : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">{index + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : star - 0.5 <= product.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{product.rating}</span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-3xl font-bold text-gray-900">
                ₱{product.price.toFixed(2)}
              </p>

              {/* Description */}
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-900 rounded-full">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 text-center font-medium text-gray-900 bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-white text-gray-900 py-4 rounded-full font-medium border-2 border-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Product Specifications */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Product Specifications</h3>
                <ul className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      <span className="font-medium">• {spec.label}:</span> {spec.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Products You May Like Section */}
          <div className="py-12 border-t border-gray-200">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-8">
              Products You May Like
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Product 1 */}
              <div className="group">
                <Link href="/products/2">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-4 cursor-pointer">
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center group-hover:bg-gray-400 transition-colors">
                      <span className="text-gray-400 text-sm">Product Image</span>
                    </div>
                  </div>
                </Link>
                
                <div className="flex items-start justify-between gap-3">
                  <Link href="/products/2" className="flex-1">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1 hover:text-gray-700">
                      Bamboo Mug
                    </h3>
                    <p className="text-base lg:text-lg text-gray-900">
                      ₱120.00
                    </p>
                  </Link>
                  
                  <button
                    className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
                    aria-label="Add Bamboo Mug to cart"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Add to cart: Bamboo Mug');
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product 2 */}
              <div className="group">
                <Link href="/products/3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-4 cursor-pointer">
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center group-hover:bg-gray-400 transition-colors">
                      <span className="text-gray-400 text-sm">Product Image</span>
                    </div>
                  </div>
                </Link>
                
                <div className="flex items-start justify-between gap-3">
                  <Link href="/products/3" className="flex-1">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1 hover:text-gray-700">
                      Woven Storage Basket
                    </h3>
                    <p className="text-base lg:text-lg text-gray-900">
                      ₱150.00
                    </p>
                  </Link>
                  
                  <button
                    className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
                    aria-label="Add Woven Storage Basket to cart"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Add to cart: Woven Storage Basket');
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product 3 */}
              <div className="group">
                <Link href="/products/4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-4 cursor-pointer">
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center group-hover:bg-gray-400 transition-colors">
                      <span className="text-gray-400 text-sm">Product Image</span>
                    </div>
                  </div>
                </Link>
                
                <div className="flex items-start justify-between gap-3">
                  <Link href="/products/4" className="flex-1">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1 hover:text-gray-700">
                      Recycled Paper Journal
                    </h3>
                    <p className="text-base lg:text-lg text-gray-900">
                      ₱180.00
                    </p>
                  </Link>
                  
                  <button
                    className="shrink-0 w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
                    aria-label="Add Recycled Paper Journal to cart"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Add to cart: Recycled Paper Journal');
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
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
