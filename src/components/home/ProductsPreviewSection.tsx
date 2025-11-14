'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  status?: string;
}

export default function ProductsPreviewSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Bags & Purses',
    'Rugs',
    'Paper Crafts',
    'Pastries',
    'Wood Crafts',
    'Bonsel'
  ];

  // Fetch first 8 products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Create a query that gets the first 8 items
        const itemsQuery = query(
          collection(db, 'items'),
          limit(8)
        );
        
        const querySnapshot = await getDocs(itemsQuery);
        
        // Process the documents
        const productsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Product',
            price: Number(data.price) || 0,
            image: data.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzljYTVhZSIgZD0iTTE5IDV2MTRIMVY1aDhtMC0yaC0yYTEgMSAwIDAwLTEgMXYxNmExIDEgMCAwMDEgMWgyMmExIDEgMCAwMDEtMVY0YTEgMSAwIDAwLTEtMWgtNmwtMi0yaC00bC0yIDJIN3ptLTcgNGgxMHY0SDEydjRINnYtNHoiLz48L3N2Zz4=',
            category: data.category || 'Uncategorized',
            status: data.status || 'active'
          };
        });
        
        setProducts(productsData);
      } catch (error) {
        } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-gray-200 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                {/* Product Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 mb-3">
                  <Image
                    src={product.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzljYTVhZSIgZD0iTTE5IDV2MTRIMVY1aDhtMC0yaC0yYTEgMSAwIDAwLTEgMXYxNmExIDEgMCAwMDEgMWgyMmExIDEgMCAwMDEtMVY0YTEgMSAwIDAwLTEtMWgtNmwtMi0yaC00bC0yIDJIN3ptLTcgNGgxMHY0SDEydjRINnYtNHoiLz48L3N2Zz4='}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzljYTVhZSIgZD0iTTE5IDV2MTRIMVY1aDhtMC0yaC0yYTEgMSAwIDAwLTEgMXYxNmExIDEgMCAwMDEgMWgyMmExIDEgMCAwMDEtMVY0YTEgMSAwIDAwLTEtMWgtNmwtMi0yaC00bC0yIDJIN3ptLTcgNGgxMHY0SDEydjRINnYtNHoiLz48L3N2Zz4=';
                    }}
                  />
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Please check back later.</p>
          </div>
        )}
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
