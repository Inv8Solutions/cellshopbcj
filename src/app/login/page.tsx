'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login functionality will be implemented later
    console.log('Login submitted:', { email, password, rememberMe });
    
    // Redirect to profile page after login
    router.push('/profile');
  };

  const handleGoogleLogin = () => {
    // Google login functionality will be implemented later
    console.log('Google login clicked');
    
    // Redirect to profile page after Google login
    router.push('/profile');
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
          {/* Welcome Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-8">
            Welcome Back!
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
                placeholder="Enter your Password"
                required
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-gray-200"
                />
                <span className="text-gray-900">Remember me?</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-gray-900 hover:text-gray-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Log In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
              >
                Sign Up Now
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
