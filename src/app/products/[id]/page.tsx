'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, onSnapshot, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { db } from '@/firebase/config';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';
import { Star, ShoppingCart, Minus, Plus, ChevronLeft } from 'lucide-react';

// ------------------------------
// Type Definitions
// ------------------------------
interface Specification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  category: string;
  facility: string;
  image: string;
  images?: string[];
  specifications?: Specification[];
  stock: number;
  status: 'active' | 'inactive';
  createdAt: any;
}

// ------------------------------
// Main Component
// -----------------------------
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------
  // Authentication
  // ------------------------------
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'Customer'
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch product data from Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const docRef = doc(db, 'items', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Check if product is inactive - redirect to products page
          if (data.status === 'inactive') {
            setError('This product is no longer available');
            setTimeout(() => router.push('/products'), 2000);
            setLoading(false);
            return;
          }
          
          setProduct({
            id: docSnap.id,
            name: data.name || 'Unnamed Product',
            price: Number(data.price) || 0,
            rating: Number(data.rating) || 0,
            description: data.description || 'No description available',
            category: data.category || 'Uncategorized',
            facility: data.facility || 'Unknown Facility',
            image: data.image || '/placeholder.png',
            images: data.images || [],
            specifications: data.specifications || [],
            stock: Number(data.stock) || 0,
            status: data.status || 'active',
            createdAt: data.createdAt || null
          });
          
          // Set first image as selected if available
          if (data.images?.length) {
            setSelectedImage(0);
          }
        } else {
          setError('Product not found');
          }
      } catch (error) {
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ------------------------------
  // Event Handlers
  // ------------------------------
  const handleAddToCart = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      setLoading(true);
      
      const cartItem = {
        productId: id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || product.image,
        addedAt: serverTimestamp()
      };

      const cartRef = collection(db, 'users', currentUser.uid, 'cart');
      await addDoc(cartRef, cartItem);
      
      // Show success message (you might want to replace this with a toast notification)
      alert('Added to cart!');
    } catch (error) {
      setError('Failed to add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !currentUser) {
      router.push('/login');
      return;
    }
    
    try {
      setLoading(true);
      
      const cartItem = {
        productId: id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || product.image,
        addedAt: serverTimestamp()
      };

      const cartRef = collection(db, 'users', currentUser.uid, 'cart');
      await addDoc(cartRef, cartItem);
      
      // Redirect to checkout
      router.push('/checkout');
    } catch (error) {
      setError('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Render Loading & Error States
  // ------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/products')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Product not found</p>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Products
        </button>
      </div>
    );
  }

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
            <Link href={`/products/${product.category}`} className="hover:text-gray-900">{product.category}</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          {/* Product Detail Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Left: Product Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4 flex justify-center items-center bg-white rounded-lg border border-gray-200 p-2">
                <div className="relative w-full max-w-2xl h-[32rem] flex items-center justify-center">
                  <img 
                    src={product.images?.[selectedImage] || product.image} 
                    alt={product.name}
                    className="max-w-full max-h-full w-auto h-auto object-scale-down"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                    }}
                  />
                </div>
              </div>
              
              {/* Thumbnails */}
              {(product.images?.length || 0) > 1 && (
                <div className="flex space-x-2 mt-2 overflow-x-auto">
                  {product.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer transition-opacity ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setSelectedImage(index)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.png';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= Math.floor(product.rating) ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
              
              {/* Price */}
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ₱{product.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
              
              {/* Stock Status */}
              <div className="mb-4">
                <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {/* Description */}
              <div className="prose max-w-none mb-6">
                {product.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-700 mb-2">
                    {paragraph || <br />}
                  </p>
                ))}
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-l border-r w-12 text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                    disabled={product.stock > 0 && quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={loading || product.stock <= 0}
                  className={`ml-4 flex items-center justify-center px-6 py-2 rounded-lg transition-colors ${
                    product.stock > 0 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    'Adding...'
                  ) : product.stock > 0 ? (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </button>
              </div>
              
              {/* Specifications */}
              {(product.specifications?.length || 0) > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                  <div className="space-y-3">
                    {product.specifications?.map((spec, index) => (
                      <div key={index} className="flex flex-wrap border-b border-gray-100 pb-2">
                        <span className="w-full md:w-1/3 font-medium text-gray-700">
                          {spec.label}:
                        </span>
                        <span className="w-full md:w-2/3 text-gray-600">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Product Information</h2>
                <div className="space-y-3">
                  <div className="flex flex-wrap">
                    <span className="w-full md:w-1/3 font-medium text-gray-700">Category:</span>
                    <span className="w-full md:w-2/3 text-gray-600">{product.category}</span>
                  </div>
                  <div className="flex flex-wrap">
                    <span className="w-full md:w-1/3 font-medium text-gray-700">Facility:</span>
                    <span className="w-full md:w-2/3 text-gray-600">{product.facility}</span>
                  </div>
                  <div className="flex flex-wrap">
                    <span className="w-full md:w-1/3 font-medium text-gray-700">Status:</span>
                    <span className="w-full md:w-2/3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </span>
                  </div>
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
