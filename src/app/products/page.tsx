'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';
import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase/config';

// ------------------------------
// Product Type Definition
// ------------------------------
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  facility: string;
  createdAt: any; // Firestore timestamp
}

export default function ProductsPage() {
  // ------------------------------
  // State
  // ------------------------------
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // single selection
  const [selectedFacility, setSelectedFacility] = useState<string>(''); // single selection
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  // ------------------------------
  // Fetch products from Firestore
  // ------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const constraints: QueryConstraint[] = [];

        // Firestore filtering (single selection)
        if (selectedCategory) constraints.push(where('category', '==', selectedCategory));
        if (selectedFacility) constraints.push(where('facility', '==', selectedFacility));
        constraints.push(where('price', '>=', priceRange[0]));
        constraints.push(where('price', '<=', priceRange[1]));

        // Sorting
        if (sortBy === 'price-low') constraints.push(orderBy('price', 'asc'));
        else if (sortBy === 'price-high') constraints.push(orderBy('price', 'desc'));
        else if (sortBy === 'newest') constraints.push(orderBy('createdAt', 'desc'));

        const q = query(collection(db, 'items'), ...constraints);
        const querySnapshot = await getDocs(q);

        // Map Firestore docs with fallbacks
        const items: Product[] = querySnapshot.docs.map(doc => {
          const data = doc.data() as Partial<Product>;
          return {
            id: doc.id,
            name: data.name || 'Unnamed Product',
            price: typeof data.price === 'number' ? data.price : 0,
            image: data.image || '/placeholder.png',
            category: data.category || 'Uncategorized',
            facility: data.facility || 'Unknown Facility',
            createdAt: data.createdAt || null,
          };
        });

        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedFacility, priceRange, sortBy]);

  // ------------------------------
  // JSX Rendering
  // ------------------------------
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
            <aside className="lg:col-span-1 space-y-8">
              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Price Range</h3>
                  <button
                    className="text-sm text-gray-600"
                    onClick={() => setPriceRange([0, 100000])}
                  >
                    Reset
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₱{priceRange[0]}</span>
                  <span>₱{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Categories (Radio) */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-gray-200"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Facilities (Radio) */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Facilities</h3>
                <div className="space-y-3">
                  {facilities.map((facility) => (
                    <label key={facility} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="facility"
                        checked={selectedFacility === facility}
                        onChange={() => setSelectedFacility(facility)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-gray-200"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {facility}
                      </span>
                    </label>
                  ))}
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
                    onChange={(e) => setSortBy(e.target.value as any)}
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

              {/* Product Grid */}
              {loading ? (
                <p>Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-gray-600 text-center mt-10">No products found for your selected filters.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="group">
                      <Link href={`/products/${product.id}`}>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-3 cursor-pointer">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </Link>

                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${product.id}`} className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 truncate hover:text-gray-700">
                            {product.name}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-900">
                            ₱{product.price.toFixed(2)}
                          </p>
                        </Link>

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
              )}
            </div>
          </div>
        </div>
      </main>

      <ContactSection />
      <Footer />
    </div>
  );
}
