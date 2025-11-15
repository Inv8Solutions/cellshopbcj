'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Footer() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset click count after 2 seconds of no clicks
  useEffect(() => {
    if (clickCount > 0) {
      timeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [clickCount]);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // 5 clicks to access admin
    if (newCount === 5) {
      router.push('/admin/login');
      setClickCount(0);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="w-full px-6 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright - Hidden Admin Access */}
          <p 
            onClick={handleSecretClick}
            className="text-sm text-gray-600 cursor-default select-none"
            title={clickCount > 0 ? `${5 - clickCount} more clicks...` : ''}
          >
            © {new Date().getFullYear()} Bureau of Jail Management and Penology. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/terms" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
