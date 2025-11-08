'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, onSnapshot, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase/config';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';
import { Star, ShoppingCart, Minus, Plus } from 'lucide-react';

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
  images: string[];
  specifications: Specification[];
  stock: number;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // unwrap Promise safely
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || ''
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch product data from Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'items', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Ensure all required fields have fallback defaults
          setProduct({
            id: docSnap.id,
            name: data?.name || 'No Name',
            price: typeof data?.price === 'number' ? data.price : 0,
            rating: typeof data?.rating === 'number' ? data.rating : 0,
            description: data?.description || 'No description available.',
            category: data?.category || 'Uncategorized',
            images: Array.isArray(data?.images) && data.images.length > 0 ? data.images : ['/products/placeholder.png'],
            specifications: Array.isArray(data?.specifications) ? data.specifications : [],
            stock: typeof data?.stock === 'number' ? data.stock : 0,
          });
        } else {
          console.warn('Product not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    setQuantity(Math.max(1, Math.min(product.stock, quantity + delta)));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const cartRef = doc(db, 'users', user.uid, 'cart', product.id);
      
      // Check if the item already exists in the cart
      const cartItem = await getDoc(cartRef);
      if (cartItem.exists()) {
        alert('This item is already in your cart! You can update the quantity in the cart page.');
        return;
      }

      // Add the new item to cart
      await setDoc(cartRef, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0]
      });
      
      // Show success alert
      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !user) {
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      // Check cart first
      const cartRef = doc(db, 'users', user.uid, 'cart', product.id);
      const cartItem = await getDoc(cartRef);
      
      // If item exists in cart, update its quantity instead of adding new
      if (cartItem.exists()) {
        await setDoc(cartRef, {
          ...cartItem.data(),
          quantity: quantity // Update with new quantity
        });
      } else {
        // Add new item to cart
        await setDoc(cartRef, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images[0]
        });
      }
      
      // Redirect to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error during buy now process:', error);
      alert('Failed to process your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading product details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar currentUser={user} />
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
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-gray-900' : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <img src={product.images[index]} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
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
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>

              {/* Price */}
              <p className="text-3xl font-bold text-gray-900">₱{product.price.toFixed(2)}</p>

              {/* Description */}
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{product.description}</p>

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
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isLoading}
                  className="w-full bg-white text-gray-900 py-4 rounded-full font-medium border-2 border-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin absolute left-1/2 -ml-2.5" />
                      <span className="opacity-0">Buy Now</span>
                    </>
                  ) : (
                    'Buy Now'
                  )}
                </button>
              </div>

              {/* Product Specifications */}
              {product.specifications.length > 0 && (
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
