'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Target, Eye, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-50 py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Empowering Lives Through Second Chances
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              At Cellshop BCJ, we believe in the power of transformation and the potential in every individual. 
              Our mission is to provide meaningful livelihood opportunities for persons deprived of liberty.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden">
                <Image
                  src="/hero.png"
                  alt="Our Story"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2025, Cellshop BCJ emerged from a vision to create sustainable livelihood programs 
                  for persons deprived of liberty. What started as a small initiative has grown into a movement 
                  that transforms lives through skill development and economic empowerment.
                </p>
                <p>
                  We partner with the Bureau of Jail Management and Penology (BJMP) to provide training and 
                  employment opportunities, helping individuals rebuild their lives with dignity and purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide sustainable livelihood opportunities and skills training that empower persons deprived 
                of liberty, fostering their rehabilitation and successful reintegration into society.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A society where every individual, regardless of their past, has the opportunity to transform their 
                life through meaningful work, dignity, and community support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Cellshop BCJ
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Empowerment",
                description: "We believe in the potential of every individual to grow and transform their lives.",
                icon: <Users className="w-8 h-8 text-blue-600" />
              },
              {
                title: "Dignity",
                description: "We treat everyone with respect and believe in the inherent worth of every person.",
                icon: <Heart className="w-8 h-8 text-red-600" />
              },
              {
                title: "Community",
                description: "We build bridges between individuals, families, and communities for collective growth.",
                icon: <Users className="w-8 h-8 text-green-600" />
              }
            ].map((value, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Us in Making a Difference</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Every purchase supports our mission and helps transform lives. Together, we can create more opportunities for rehabilitation and growth.
          </p>
          <Link 
            href="/login" 
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}