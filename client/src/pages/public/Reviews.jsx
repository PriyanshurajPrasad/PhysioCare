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
  MessageCircle,
  TrendingUp,
  Phone
} from 'lucide-react';

const Reviews = () => {
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

  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      comment: 'Excellent service! The therapists are very professional and caring. I recovered much faster than expected.',
      date: '2024-01-15',
      service: 'Physical Therapy'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 5,
      comment: 'Great experience! The staff is friendly and facility is clean. Highly recommend!',
      date: '2024-01-10',
      service: 'Sports Rehabilitation'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rating: 4,
      comment: 'Very good service. The only issue was scheduling, but treatment itself was excellent.',
      date: '2024-01-05',
      service: 'Pain Management'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      rating: 5,
      comment: 'Outstanding care! The therapists really know their stuff and helped me get back to my daily activities.',
      date: '2023-12-28',
      service: 'Post-Surgery Recovery'
    },
    {
      id: 5,
      name: 'Tom Brown',
      rating: 5,
      comment: 'Professional and caring staff. They took the time to explain everything and made me feel comfortable.',
      date: '2023-12-20',
      service: 'Manual Therapy'
    },
    {
      id: 6,
      name: 'Emily Davis',
      rating: 4,
      comment: 'Great results! The treatment plan was personalized and effective. Would definitely recommend.',
      date: '2023-12-15',
      service: 'Sports Injury Treatment'
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
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
                <Star className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-semibold">Patient Testimonials</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Patient
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  Reviews
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed">
                See what our patients have to say about their experience at PhysioCare. Real stories from real people who have transformed their lives through our expert care.
              </p>

              {/* Review Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Average Rating", value: "4.8", icon: Star },
                  { label: "Happy Patients", value: "150+", icon: Users },
                  { label: "Satisfaction", value: "98%", icon: CheckCircle },
                  { label: "Reviews", value: "200+", icon: MessageCircle }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-white/50 shadow-lg"
                    >
                      <Icon className="w-5 h-5 text-blue-600 mb-2" />
                      <div className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                    </div>
                  );
                })}
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
                  to="#reviews"
                  className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-xl hover:border-blue-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Read Reviews
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600 font-medium">4.8/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="ml-1 text-gray-600 font-medium">Verified Reviews</span>
                </div>
              </div>
            </div>

            {/* Right Visual Section */}
            <div className="relative">
              <div className="relative image-container rounded-3xl overflow-hidden shadow-2xl">
                {/* 16:9 Aspect Ratio Container */}
                <div className="aspect-ratio-16-9">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1728932322808-e9fce6abe034?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Patient Reviews and Testimonials"
                    className="img-responsive"
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add('loaded')}
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
                
                {/* Verified Badge */}
                <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-4">
              <MessageCircle className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 text-sm font-semibold">Patient Stories</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Patients
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Say About Us
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from real patients who have transformed their lives through our expert care
            </p>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Average Rating Card */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 border border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl" />
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 mb-2">
                  4.8
                </div>
                <div className="text-gray-600 mb-4">Average Rating</div>
                <div className="flex justify-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < 4 ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Happy Patients Card */}
            <div className="group relative bg-gradient-to-br from-teal-50 to-green-50 rounded-3xl p-8 border border-teal-200 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl" />
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600 mb-2">
                  150+
                </div>
                <div className="text-gray-600">Happy Patients</div>
                <div className="mt-4 flex items-center justify-center text-teal-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Verified Reviews</span>
                </div>
              </div>
            </div>
            
            {/* Satisfaction Rate Card */}
            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl" />
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                  98%
                </div>
                <div className="text-gray-600">Satisfaction Rate</div>
                <div className="mt-4 flex items-center justify-center text-green-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Exceeding Expectations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-100 group-hover:border-gray-200 rounded-3xl transition-all duration-300" />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.service}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                    "{review.comment}"
                  </blockquote>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-6">
              <Heart className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 text-sm font-semibold">Join Our Success Stories</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Recovery Journey?
              </span>
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Become one of our success stories. Schedule your consultation today and take the first step towards a pain-free life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <Heart className="w-4 h-4 text-white mr-2" />
              <span className="text-white text-sm font-semibold">Start Your Journey</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Experience
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-teal-100">
                Our Care?
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join our satisfied patients and start your journey to recovery with expert physiotherapy care
            </p>
          </div>
          
          {/* Service Selection Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Free Consultation Card */}
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Free Consultation</h3>
                <p className="text-blue-100 text-center leading-relaxed mb-4">
                  Talk to our experts to get personalized recommendations
                </p>
                
                {/* Quick Action */}
                <Link
                  to="/contact"
                  className="block w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium text-center"
                >
                  Schedule Call
                </Link>
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
                <Link
                  to="/contact"
                  className="block w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium text-center"
                >
                  Book Assessment
                </Link>
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
                <Link
                  to="/services"
                  className="block w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium text-center"
                >
                  View Plans
                </Link>
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
                Book Appointment
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-12 py-5 bg-white/20 backdrop-blur-lg text-white font-bold rounded-xl hover:bg-white/30 transform hover:scale-105 transition-all duration-300 text-lg border-2 border-white/30"
              >
                View Services
                <ChevronRight className="w-6 h-6 ml-3" />
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

export default Reviews;
