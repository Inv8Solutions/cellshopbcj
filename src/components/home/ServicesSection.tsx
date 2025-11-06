import Link from 'next/link';
import { ArrowRight, Building2, Building, Home } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: Building2,
      title: 'District Jails',
      description: 'Explore products from district-level facilities offering specialized craftsmanship and training programs.',
      link: '/services/district-jails'
    },
    {
      icon: Building,
      title: 'City Jails',
      description: 'Discover unique creations from city jail facilities committed to rehabilitation and skills development.',
      link: '/services/city-jails'
    },
    {
      icon: Home,
      title: 'Municipal Jails',
      description: 'Support local communities through products crafted in municipal jail livelihood programs.',
      link: '/services/municipal-jails'
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="w-full px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Services
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Browse our carefully curated collections and learn about the BJMP facilities across the Philippines.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-gray-50 rounded-3xl p-8 lg:p-10 hover:bg-gray-100 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full border-2 border-gray-900 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-gray-900" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {service.description}
                </p>

                {/* Learn More Button */}
                <Link
                  href={service.link}
                  className="group inline-flex items-center justify-center bg-black text-white pl-6 pr-4 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300"
                >
                  Learn More
                  <span className="ml-2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
