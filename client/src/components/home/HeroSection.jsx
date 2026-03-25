import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Activity,
  Heart,
  Zap
} from 'lucide-react';
import PhysioVisualSection from './PhysioVisualSection';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    { icon: Heart, title: 'Pain Relief' },
    { icon: Activity, title: 'Sports Rehab' },
    { icon: Zap, title: 'Fast Recovery' }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            {/* Medical Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Medical Board Certified</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              Restore Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Natural Movement
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Expert physiotherapy care combining advanced therapeutic techniques with personalized treatment plans to eliminate pain and restore mobility.
            </p>

            {/* Service Pills */}
            <div className="flex flex-wrap gap-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{service.title}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-2xl hover:border-blue-400 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Activity className="w-5 h-5 mr-2" />
                View Treatments
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Licensed Therapists</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Insurance Accepted</span>
              </div>
            </div>
          </div>

          {/* Right Side - Professional Visual Section */}
          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-100'}`}>
            <PhysioVisualSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
