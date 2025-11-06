import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductsPreviewSection from '@/components/home/ProductsPreviewSection';
import ServicesSection from '@/components/home/ServicesSection';
import CTASection from '@/components/home/CTASection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow pt-16">
        <HeroSection />
        <FeaturesSection />
        <ProductsPreviewSection />
        <ServicesSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
