import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Heart, 
  Activity, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Shield,
  Zap,
  Target,
  Users,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'Personalized Treatment Plans',
      description: 'Custom rehabilitation programs tailored to your specific condition and goals',
      color: 'from-blue-500 to-blue-600',
      stats: '100% Personalized',
      highlights: ['Individual Assessment', 'Custom Goals', 'Progress Tracking']
    },
    {
      icon: Zap,
      title: 'Advanced Pain Relief',
      description: 'Evidence-based methods for effective pain management and recovery',
      color: 'from-teal-500 to-teal-600',
      stats: 'Fast Relief',
      highlights: ['Manual Therapy', 'Modalities', 'Exercise Programs']
    },
    {
      icon: Users,
      title: 'Expert Therapists',
      description: 'Board-certified specialists with extensive rehabilitation experience',
      color: 'from-purple-500 to-purple-600',
      stats: '15+ Years Experience',
      highlights: ['Board Certified', 'Specialized Training', 'Expert Care']
    },
    {
      icon: Shield,
      title: 'Modern Facility',
      description: 'State-of-the-art equipment and comfortable healing environment',
      color: 'from-green-500 to-green-600',
      stats: 'Latest Technology',
      highlights: ['Modern Equipment', 'Clean Environment', 'Private Rooms']
    }
  ];

  const benefits = [
    { icon: Clock, title: 'Flexible Scheduling', desc: 'Early & late appointments' },
    { icon: TrendingUp, title: 'Proven Results', desc: '98% satisfaction rate' },
    { icon: Award, title: 'Insurance Accepted', desc: 'Direct billing available' },
    { icon: Users, title: 'Family Support', desc: 'All ages welcome' }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-6 border border-blue-200">
            <Shield className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-blue-800 text-sm font-medium">Why Choose PhysioCare</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Excellence in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Physiotherapy Care
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine advanced therapeutic techniques with compassionate care to help you achieve 
            optimal recovery through evidence-based treatment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Professional Image with Modern Design */}
          <div className={`relative transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Main Image with Proper Aspect Ratio */}
              <div className="relative image-container rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white">
                {/* 16:9 Aspect Ratio Container */}
                <div className="aspect-ratio-16-9">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Professional Physiotherapy Session"
                    className="img-responsive"
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add('loaded')}
                  />
                  
                  {/* Modern Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-600/10 to-teal-600/20"></div>
                </div>
                
                {/* Live Badge with Glassmorphism */}
                <div className="absolute top-6 left-6">
                  <div className="flex items-center px-4 py-2 bg-green-500/90 backdrop-blur-lg text-white rounded-full border border-green-400/30 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs font-semibold">Live Session</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = activeFeature === index;
                
                return (
                  <div
                    key={index}
                    className={`group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    {/* Icon and Stats */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-xs font-bold text-blue-600">{feature.stats}</div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    
                    {/* Highlights */}
                    <div className="space-y-1">
                      {feature.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Benefits */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Benefits</h4>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{benefit.title}</div>
                        <div className="text-xs text-gray-600">{benefit.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Start Your Recovery</h3>
                  <p className="text-gray-600 text-sm">Book your free consultation</p>
                </div>
                <Link
                  to="/contact"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full border border-blue-200">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="text-blue-800 font-medium">
              Trusted by 2000+ patients with 4.9/5 rating
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
