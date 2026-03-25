import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  Award, 
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Shield,
  Target,
  Zap,
  Phone
} from 'lucide-react';
import publicService from '../../services/publicService';
import SkeletonLoader from '../../components/admin/SkeletonLoader';

const Services = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔄 Fetching services from API...');
        const response = await publicService.getServices();
        console.log('📋 Services response:', response.data);
        
        // Handle different response shapes
        const servicesData = response.data?.data?.services || response.data?.services || [];
        setServicesList(servicesData);
        setError('');
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching services:', err);
        setError('Failed to load services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <SkeletonLoader />
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!servicesList || servicesList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-4 rounded-xl">
            <p className="font-semibold">No services yet</p>
            <p className="text-sm">Services will appear here once they are added.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50"
      >
        {/* Interactive Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(37, 99, 235, 0.3) 0%, transparent 50%)`,
          }}
        />
        
        {/* Floating Medical Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[Heart, Brain, Activity, Shield].map((Icon, index) => (
            <div
              key={index}
              className="absolute animate-pulse"
              style={{
                left: `${20 + index * 20}%`,
                top: `${10 + index * 15}%`,
                transform: `translateY(${scrollY * 0.1 * (index + 1)}px)`,
              }}
            >
              <Icon className="w-8 h-8 text-blue-200 opacity-50" />
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Medical Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-semibold">Professional Medical Services</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Our
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  Premium Services
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed">
                Comprehensive physical therapy and rehabilitation services tailored to your needs. Experience world-class care with our expert team of medical professionals.
              </p>

              {/* Service Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Services", value: "6+" },
                  { label: "Expert Therapists", value: "12+" },
                  { label: "Success Rate", value: "98%" },
                  { label: "Sessions/Day", value: "50+" }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-white/50 shadow-lg"
                  >
                    <div className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Book Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="#services"
                  className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-xl hover:border-blue-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  View All Services
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600 font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="ml-1 text-gray-600 font-medium">Licensed & Certified</span>
                </div>
              </div>
            </div>

            {/* Right Visual Section */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Physiotherapy Services"
                  className="w-full h-[600px] object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
                
                {/* Floating Service Cards */}
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">6+ Services</div>
                      <div className="text-sm text-gray-600">Specialized Care</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">2000+</div>
                      <div className="text-sm text-gray-600">Happy Patients</div>
                    </div>
                  </div>
                </div>

                {/* Available Now Badge */}
                <div className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>Available Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-4">
              <Heart className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 text-sm font-semibold">Our Treatment Programs</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Care
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Services
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evidence-based treatments designed to restore function, reduce pain, and improve your quality of life
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, index) => (
              <div
                key={service._id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-100 group-hover:border-gray-200 rounded-3xl transition-all duration-300" />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon and Price */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                        ${service.price || 'Contact for price'}
                      </div>
                      <div className="text-sm text-gray-500">{service.duration || 'Duration varies'}</div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {service.title?.toLowerCase().includes('therapy') && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>Personalized treatment plans</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>Progress tracking</span>
                        </div>
                      </>
                    )}
                    {service.title?.toLowerCase().includes('physical') && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>Manual therapy techniques</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>Exercise prescription</span>
                        </div>
                      </>
                    )}
                    {service.title?.toLowerCase().includes('sports') && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>Injury prevention</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>Performance enhancement</span>
                        </div>
                      </>
                    )}
                    {!service.title?.toLowerCase().includes('therapy') && 
                     !service.title?.toLowerCase().includes('physical') && 
                     !service.title?.toLowerCase().includes('sports') && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>Professional care</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>Evidence-based treatment</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
                  >
                    Book Session
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Need Help Choosing?
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="text-gray-600 mt-4">
              Our expert team will help you find the perfect treatment plan
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-teal-600 overflow-hidden">
        {/* Interactive Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Medical Icons */}
          <div className="absolute top-10 left-10 animate-pulse">
            <Heart className="w-8 h-8 text-white/20" />
          </div>
          <div className="absolute top-20 right-20 animate-pulse delay-75">
            <Activity className="w-6 h-6 text-white/20" />
          </div>
          <div className="absolute bottom-20 left-20 animate-pulse delay-150">
            <Shield className="w-10 h-10 text-white/20" />
          </div>
          <div className="absolute bottom-10 right-10 animate-pulse delay-300">
            <Zap className="w-7 h-7 text-white/20" />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-700/20 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-6">
              <Phone className="w-4 h-4 text-white mr-2" />
              <span className="text-white text-sm font-semibold">Get Expert Help</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Need Help Choosing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-teal-100">
                The Right Service?
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Our team is here to help you find the perfect treatment plan for your specific needs and goals
            </p>
          </div>
          
          {/* Service Selection Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Free Consultation Card */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Free Consultation</h3>
                <p className="text-blue-100 text-center leading-relaxed mb-4">
                  Talk to our experts to get personalized recommendations
                </p>
                
                {/* Quick Action */}
                <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium">
                  Schedule Call
                </button>
              </div>
            </div>
            
            {/* Expert Assessment Card */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Expert Assessment</h3>
                <p className="text-blue-100 text-center leading-relaxed mb-4">
                  Comprehensive evaluation to identify your specific needs
                </p>
                
                {/* Quick Action */}
                <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium">
                  Book Assessment
                </button>
              </div>
            </div>
            
            {/* Treatment Plans Card */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Custom Plans</h3>
                <p className="text-blue-100 text-center leading-relaxed mb-4">
                  Tailored treatment programs designed just for you
                </p>
                
                {/* Quick Action */}
                <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium">
                  View Plans
                </button>
              </div>
            </div>
          </div>
          
          {/* Emergency CTA Section */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-bold text-lg">Urgent Care Available</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Need Immediate Assistance?
                </h3>
                <p className="text-red-100">
                  Our emergency line is available 24/7 for urgent physiotherapy needs
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Emergency Line
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main CTA */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-12 py-5 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg group"
              >
                Get Started Now
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/reviews"
                className="inline-flex items-center justify-center px-12 py-5 bg-white/20 backdrop-blur-lg text-white font-bold rounded-xl hover:bg-white/30 transform hover:scale-105 transition-all duration-300 text-lg border-2 border-white/30"
              >
                Read Reviews
                <Star className="w-6 h-6 ml-3" />
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center text-blue-100">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Free Consultation</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">Insurance Accepted</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">Flexible Scheduling</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
