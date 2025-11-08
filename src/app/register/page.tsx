'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // -------------------------
  // 🧩 Validation
  // -------------------------
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  if (!agreeToTerms) {
    alert('Please agree to the Terms of Service and Privacy Policy');
    return;
  }

  try {
    // [ADDED] Initialize Firebase Auth
    const auth = getAuth();

    // [ADDED] Create new user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // [ADDED] Store user info in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      agreeToTerms,
    });

    console.log('✅ Registration successful:', user);

    // [ADDED] Redirect to profile page after registration
    router.push('/profile');

  } catch (error: any) {
    // [ADDED] Error Handling
    console.error('❌ Registration error:', error);
    alert(`Registration failed: ${error.message}`);
  }
};

  const handleGoogleSignup = async () => {
  // [ADDED] Loading and error state handling (optional)
  setLoading(true);
  setError('');

  // [ADDED] Initialize Google provider
  const provider = new GoogleAuthProvider();

  try {

    // [ADDED] Sign in with Google popup
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // [ADDED] Create or merge user data in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        provider: 'google',
      },
      { merge: true }
    );

    console.log('✅ Google signup successful:', user);

    // [ADDED] Redirect to profile page after successful signup
    router.push('/profile');
  } catch (error: any) {
    console.error('❌ Google signup error:', error);
    setError('Google signup failed. Please try again.');
  } finally {
    // [ADDED] Stop loading state
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full px-6 lg:px-12 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              BJMP-CAR SHOP
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Sign Up Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-8">
            Sign Up
          </h1>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-900 font-medium hover:bg-gray-50 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.805 10.23c0-.639-.057-1.252-.164-1.841H10.1v3.481h5.441a4.65 4.65 0 0 1-2.018 3.049v2.839h3.268c1.911-1.759 3.014-4.35 3.014-7.528z" fill="#4285F4"/>
                <path d="M10.1 19.931c2.73 0 5.018-.904 6.691-2.452l-3.268-2.839c-.904.606-2.061.964-3.423.964-2.633 0-4.862-1.779-5.659-4.168H1.051v2.93a9.893 9.893 0 0 0 9.05 5.565z" fill="#34A853"/>
                <path d="M4.442 11.436a5.948 5.948 0 0 1 0-3.803V4.703H1.051a9.893 9.893 0 0 0 0 9.663l3.39-2.93z" fill="#FBBC04"/>
                <path d="M10.1 3.901c1.484 0 2.817.51 3.865 1.512l2.9-2.9C15.113.964 12.826 0 10.1 0 6.15 0 2.721 2.485 1.051 6.05l3.39 2.93c.798-2.39 3.027-4.168 5.66-4.168z" fill="#EA4335"/>
              </svg>
              Login with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-gray-200 mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-gray-900">
                I agree to the{' '}
                <Link href="/terms" className="text-gray-900 font-medium hover:text-gray-700 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-gray-900 font-medium hover:text-gray-700 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Sign Up
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Have an Account?{' '}
              <Link
                href="/login"
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

