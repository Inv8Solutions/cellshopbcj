'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password reset functionality will be implemented later
    console.log('Password reset requested for:', email);
    alert('A password reset link has been sent to your email!');
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
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-3">
            Forgot Password?
          </h1>
          
          {/* Subtitle */}
          <p className="text-sm text-gray-600 text-center mb-8">
            A link will be sent to your email to help reset your password
          </p>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Reset Password Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Reset Password
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-sm text-gray-600">
              Back to{' '}
              <Link
                href="/login"
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
