import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Browse Products</h1>
          <p className="text-gray-600">Products page coming soon...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
