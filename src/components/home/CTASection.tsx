import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="w-full px-6 lg:px-12">
        {/* CTA Container */}
        <div className="bg-gray-900 rounded-[2rem] lg:rounded-[3rem] px-8 py-16 lg:px-16 lg:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 lg:mb-10 max-w-4xl mx-auto leading-tight">
            Join us in supporting rehabilitation through meaningful commerce.
          </h2>

          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-full text-base font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl gap-2"
          >
            Explore All Products
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
