import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  Award, 
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Shield,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';

const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

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

  const aboutData = {
    hero: {
      title: "About PhysioCare Center",
      subtitle: "Your Trusted Partner in Health and Recovery",
      description: "With over 15 years of excellence in physiotherapy care, we combine advanced medical expertise with compassionate treatment to help you achieve optimal health and wellness.",
      stats: [
        { label: "Years Experience", value: "15+" },
        { label: "Happy Patients", value: "2000+" },
        { label: "Success Rate", value: "98%" },
        { label: "Expert Therapists", value: "12+" }
      ]
    },
    story: {
      title: "Our Story & Mission",
      description: "Founded in 2008, PhysioCare Center has been dedicated to providing exceptional physiotherapy services to our community. Our mission is to restore movement, reduce pain, and improve quality of life through evidence-based treatments and personalized care.",
      mission: "To provide comprehensive, compassionate, and cutting-edge physiotherapy care that empowers patients to achieve their optimal physical function and live pain-free lives.",
      vision: "To be the leading physiotherapy center known for excellence in patient care, innovative treatments, and outstanding clinical outcomes."
    },
    values: [
      {
        icon: Heart,
        title: "Patient-Centered Care",
        description: "Your health and comfort are our top priorities. We tailor every treatment plan to your unique needs and goals."
      },
      {
        icon: Shield,
        title: "Evidence-Based Practice",
        description: "We use the latest research and proven techniques to ensure effective and safe treatments."
      },
      {
        icon: Target,
        title: "Excellence in Service",
        description: "Committed to delivering the highest standards of care with professionalism and compassion."
      },
      {
        icon: Zap,
        title: "Innovation & Technology",
        description: "Utilizing advanced equipment and modern techniques to accelerate your recovery."
      }
    ],
    leadDoctor: {
      name: "Dr. Sarah Johnson",
      title: "Lead Physiotherapist & Clinic Director",
      credentials: "MPT, BPT, CSCS",
      experience: "15+ years",
      specialties: ["Orthopedic Rehabilitation", "Sports Medicine", "Manual Therapy"],
      description: "Dr. Johnson leads our team of expert physiotherapists with extensive experience in treating complex musculoskeletal conditions and helping athletes return to peak performance."
    },
    contact: {
      address: "123 Health Street, Medical District, City 12345",
      phone: "+1 (555) 123-4567",
      email: "info@physiocare.com",
      hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-2PM"
    }
  };

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
                <span className="text-blue-800 text-sm font-semibold">Certified Medical Facility</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                About
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  PhysioCare Center
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed">
                {aboutData.hero.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {aboutData.hero.stats.map((stat, index) => (
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
                  to="/services"
                  className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-xl hover:border-blue-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  View Services
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
              <div className="relative image-container rounded-3xl overflow-hidden shadow-2xl">
                {/* 16:9 Aspect Ratio Container */}
                <div className="aspect-ratio-16-9">
                  <img
                    src="https://images.unsplash.com/photo-1709880754472-be89c13abc52?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Modern Physiotherapy Clinic"
                    className="img-responsive"
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add('loaded')}
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
                
                {/* Open Now Badge */}
                <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>Open Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {aboutData.story.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {aboutData.story.description}
                </p>
              </div>

              {/* Mission & Vision Cards */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <Target className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                  <p className="text-gray-700">{aboutData.story.mission}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
                  <TrendingUp className="w-8 h-8 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                  <p className="text-gray-700">{aboutData.story.vision}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { value: "5000+", label: "Treatments/Year" },
                  { value: "50+", label: "Treatment Types" },
                  { value: "98%", label: "Success Rate" },
                  { value: "24/7", label: "Support" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1610258271340-57bc7d07b0a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhbXBsZSUyMHBoeXNpb3RoZXJhcHklMjBob3NwaXRhbCUyMGV4dGVyaW9yJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D"
                alt="Our Clinic"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our practice and ensure exceptional care for every patient
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                  
                  {/* Glass Effect Overlay */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-100 group-hover:border-gray-200 rounded-3xl transition-all duration-300" />
                  
                  {/* Content */}
                  <div className="relative p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {value.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lead Doctor Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-4">
              <Award className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 text-sm font-semibold">Meet Our Expert</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lead Medical Professional
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Led by renowned physiotherapy expert with extensive clinical experience and specialized expertise
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Enhanced Visual Section */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-teal-50 p-8">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={aboutData.leadDoctor.name}
                  className="rounded-2xl shadow-xl w-full"
                />
                
                {/* Floating Credentials Badge */}
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{aboutData.leadDoctor.credentials}</div>
                      <div className="text-sm text-gray-600">Certified Professional</div>
                    </div>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute bottom-8 right-8 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-2xl p-4 shadow-xl">
                  <div className="text-2xl font-bold">{aboutData.leadDoctor.experience}</div>
                  <div className="text-sm">Clinical Experience</div>
                </div>
              </div>

              {/* Background Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full opacity-30 blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-teal-200 to-green-200 rounded-full opacity-30 blur-xl" />
            </div>
            
            {/* Right: Enhanced Content Section */}
            <div className="space-y-8">
              {/* Professional Header */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-100 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {aboutData.leadDoctor.name}
                    </h2>
                    <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 font-semibold">
                      {aboutData.leadDoctor.title}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-600 font-medium">4.9 Rating</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="ml-1 text-gray-600 font-medium">Board Certified</span>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {aboutData.leadDoctor.description}
                </p>
              </div>

              {/* Specialties Grid */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="w-6 h-6 text-blue-600 mr-3" />
                  Areas of Expertise
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {aboutData.leadDoctor.specialties.map((specialty, index) => (
                    <div
                      key={index}
                      className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-800 font-medium">{specialty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "5000+", label: "Patients Treated", icon: Users },
                  { value: "15+", label: "Years Experience", icon: Clock },
                  { value: "98%", label: "Success Rate", icon: TrendingUp }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 text-center border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
                    >
                      <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Enhanced CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/team"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-xl hover:border-blue-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  View Full Team
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
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
              <span className="text-white text-sm font-semibold">Get In Touch</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-teal-100">
                Recovery Journey?
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Contact us today to schedule your consultation and take the first step towards a pain-free life
            </p>
          </div>
          
          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Visit Us Card */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Visit Us</h3>
                <p className="text-blue-100 text-center leading-relaxed">{aboutData.contact.address}</p>
                
                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center text-blue-100 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{aboutData.contact.hours}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call Us Card */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Call Us</h3>
                <p className="text-blue-100 text-center text-lg font-semibold mb-2">{aboutData.contact.phone}</p>
                <p className="text-blue-200 text-center text-sm">Available 24/7 for emergencies</p>
                
                {/* Quick Action */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium">
                    Request Call Back
                  </button>
                </div>
              </div>
            </div>
            
            {/* Email Us Card */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Email Us</h3>
                <p className="text-blue-100 text-center text-lg font-semibold mb-2">{aboutData.contact.email}</p>
                <p className="text-blue-200 text-center text-sm">Quick response within 24 hours</p>
                
                {/* Quick Action */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium">
                    Send Message
                  </button>
                </div>
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
                  <span className="text-white font-bold text-lg">Emergency Available</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Need Immediate Care?
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
            <Link
              to="/contact"
              className="inline-flex items-center px-12 py-5 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg group"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 mt-8">
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

export default About;
