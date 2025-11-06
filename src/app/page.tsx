import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow pt-16">
        <HeroSection />
        <FeaturesSection />
        {/* Additional sections will be added here */}
      </main>
      <Footer />
    </div>
  );
}
