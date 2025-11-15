'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretAdminAccess() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to admin login
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
