'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="w-full px-6 lg:px-12 py-6 lg:py-8">
        {/* Hero Container with Background Image */}
        <div className="relative w-full rounded-4xl overflow-hidden min-h-[500px] lg:min-h-[600px]">
          {/* Background Image - Full Coverage */}
          <Image
            src="/hero.png"
            alt="BJMP Products"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />

          {/* Content Overlay */}
          <div className="relative z-10 flex items-center min-h-[500px] lg:min-h-[600px]">
            {/* Left Content with semi-transparent background */}
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 lg:py-16 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-6">
                Empowering Second Chances Through Livelihood
              </h1>
              
              <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-lg leading-relaxed">
                Every purchase supports the livelihood and rehabilitation of persons deprived of liberty under BJMP's national programs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center bg-black text-white pl-8 pr-6 py-3.5 rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Shop Now
                  <span className="ml-3 w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-black group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center text-black px-8 py-3.5 rounded-full text-base font-medium hover:bg-gray-100 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
