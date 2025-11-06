import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      label: 'Contact Number',
      value: '+63 911 341 1221',
      href: 'tel:+639113411221'
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: 'bjmpcommerce@email.com',
      href: 'mailto:bjmpcommerce@email.com'
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: 'BJMP Office',
      href: '#'
    }
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="w-full px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Contact Us
          </h2>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-12">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <Link
                key={info.label}
                href={info.href}
                className="group bg-white rounded-2xl p-6 flex items-center gap-4 hover:bg-gray-100 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-600 mb-1">{info.label}</div>
                  <div className="text-base font-medium text-gray-900 truncate">
                    {info.value}
                  </div>
                </div>

                {/* Arrow */}
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-5 h-5 text-gray-900" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Image Section with Navigation */}
        <div className="relative w-full rounded-3xl lg:rounded-[3rem] overflow-hidden min-h-[400px] lg:min-h-[500px]">
          {/* Background Image */}
          <Image
            src="/footer.png"
            alt="BJMP Products"
            fill
            className="object-cover object-center"
            quality={100}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Navigation Links */}
          <div className="absolute top-6 right-6 flex items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-6 py-3 bg-white hover:bg-gray-50 rounded-full text-sm font-medium text-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
