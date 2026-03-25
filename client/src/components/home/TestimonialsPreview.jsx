import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Activity, 
  Users, 
  Award,
  CheckCircle,
  Calendar,
  Clock,
  TrendingUp,
  Play
} from 'lucide-react';

const TestimonialsPreview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Chronic Back Pain Recovery',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      rating: 5,
      quote: 'The personalized care I received was exceptional. The therapists took time to understand my specific needs and created a treatment plan that worked wonders for my chronic back pain. I\'m now pain-free and back to my active lifestyle!',
      recovery: 'Fully recovered in 8 weeks',
      treatment: 'Physical Therapy + Manual Therapy',
      sessions: 12,
      therapist: 'Dr. Michael Chen'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'ACL Surgery Rehabilitation',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      rating: 5,
      quote: 'After my ACL surgery, I thought I would never play sports again. The team here not only helped me recover but also taught me how to prevent future injuries. Their sports rehab program is world-class!',
      recovery: 'Returned to sports in 12 weeks',
      treatment: 'Sports Rehabilitation + Strength Training',
      sessions: 24,
      therapist: 'Dr. Sarah Williams'
    },
    {
      id: 3,
      name: 'Emily Thompson',
      role: 'Post-Surgery Recovery',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      rating: 5,
      quote: 'The facility is amazing and the staff is incredibly supportive. They made my rehabilitation journey comfortable and motivating. I couldn\'t have asked for better care after my knee replacement surgery.',
      recovery: 'Complete mobility restored',
      treatment: 'Post-Surgery Rehabilitation + Pain Management',
      sessions: 18,
      therapist: 'Dr. James Anderson'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Sports Injury Treatment',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      rating: 5,
      quote: 'As a professional athlete, I needed specialized care for my shoulder injury. The sports medicine team here provided targeted treatment that got me back to peak performance faster than I expected.',
      recovery: 'Full athletic performance restored',
      treatment: 'Sports Medicine + Performance Training',
      sessions: 16,
      therapist: 'Dr. Lisa Martinez'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}.0</span>
      </div>
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Medical Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-6 border border-blue-200">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-blue-800 text-sm font-medium">Patient Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Patients
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Say About Their Recovery
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real stories from real patients who have transformed their lives through our expert 
            physiotherapy care and personalized treatment programs.
          </p>
        </div>

        {/* Main Testimonials Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Testimonial Card */}
          <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Patient Image and Info */}
              <div className="text-center md:text-left">
                <div className="relative inline-block mb-6">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{currentTestimonial.name}</h3>
                  <p className="text-gray-600 mb-2">{currentTestimonial.role}</p>
                  <div className="flex items-center text-sm text-blue-600 mb-2">
                    <Users className="w-4 h-4 mr-1" />
                    Therapist: {currentTestimonial.therapist}
                  </div>
                  {renderStars(currentTestimonial.rating)}
                </div>

                {/* Treatment Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100">
                  <div className="text-sm font-medium text-gray-700 mb-2">Treatment Plan</div>
                  <div className="text-sm text-gray-600">{currentTestimonial.treatment}</div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{currentTestimonial.sessions} sessions</span>
                    <span>•</span>
                    <span>{currentTestimonial.recovery}</span>
                  </div>
                </div>
              </div>

              {/* Quote Content */}
              <div className="md:col-span-2">
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-blue-200 mb-4" />
                  <div className="flex items-center space-x-4 mb-4">
                    {renderStars(currentTestimonial.rating)}
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified Patient
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Recovery Progress */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Recovery Progress</div>
                      <div className="text-lg font-bold text-gray-900">{currentTestimonial.recovery}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Satisfaction</div>
                      <div className="text-lg font-bold text-gray-900">100%</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-gradient-to-r from-blue-600 to-teal-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Auto-play Controls */}
          <div className="flex items-center justify-center mt-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isAutoPlaying ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Pause Auto-play
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play Auto-play
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
            <div className="text-gray-600 mb-2">Average Rating</div>
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">2000+</div>
            <div className="text-gray-600">Happy Patients</div>
            <div className="text-sm text-green-600 mt-2">Since 2014</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
            <div className="text-gray-600">Success Rate</div>
            <div className="text-sm text-green-600 mt-2">Recovery Outcomes</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
            <div className="text-gray-600">Expert Therapists</div>
            <div className="text-sm text-blue-600 mt-2">Board Certified</div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full border border-blue-200">
            <Heart className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Join our 2000+ happy patients on their recovery journey
            </span>
          </div>
          
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Start Your Recovery Journey
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
