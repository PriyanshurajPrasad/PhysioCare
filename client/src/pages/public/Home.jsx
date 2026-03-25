import React from 'react';

// Import all home components with CORRECT paths
import HeroSection from '../../components/home/HeroSection';
import TrustSection from '../../components/home/TrustSection';
import ServicesSection from '../../components/home/ServicesSection';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import TestimonialsPreview from '../../components/home/TestimonialsPreview';
import CTASection from '../../components/home/CTASection';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Badges Section */}
      <TrustSection />

      {/* Services Grid Section */}
      <ServicesSection />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials Preview Section */}
      <TestimonialsPreview />

      {/* Call to Action Section */}
      <CTASection />
    </div>
  );
};

export default Home;
