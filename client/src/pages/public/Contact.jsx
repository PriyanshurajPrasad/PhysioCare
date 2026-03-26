import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import contactService from '../../services/contactService';
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
  Phone,
  MessageCircle,
  MapPin,
  Mail
} from 'lucide-react';

const Contact = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Interactive background effects
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await contactService.createContact(formData);
      
      if (response.success) {
        setSuccess('Message sent successfully! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          priority: 'medium'
        });
      } else {
        setError(response.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError(err.error || err.customMessage || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <Phone className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-semibold">Get In Touch</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Contact
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  Our Experts
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed">
                Get in touch with us for appointments, questions, or more information about our services. Our expert team is ready to help you start your recovery journey.
              </p>

              {/* Contact Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Response Time", value: "< 24h", icon: Clock },
                  { label: "Expert Staff", value: "12+", icon: Users },
                  { label: "Success Rate", value: "98%", icon: CheckCircle },
                  { label: "Languages", value: "3+", icon: MessageCircle }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-white/50 shadow-lg"
                  >
                    <Icon className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                  );
                })}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="ml-1 text-gray-600 font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="ml-1 text-gray-600 font-medium">Secure Contact</span>
                </div>
              </div>
            </div>

            {/* Right Visual Section */}
            <div className="relative">
              <div className="relative image-container rounded-3xl overflow-hidden shadow-2xl">
                {/* 16:9 Aspect Ratio Container */}
                <div className="aspect-ratio-16-9">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1661719147671-4c422b475b26?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Contact Our Physiotherapy Experts"
                    className="img-responsive"
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add('loaded')}
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-4">
              <MessageCircle className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 text-sm font-semibold">Send Us a Message</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Touch
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below and our team will get back to you as soon as possible
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Visit Us Card */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 border border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Us</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    123 Medical Street, Healthcare District<br />
                    City, State 12345
                  </p>
                  <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Mon-Fri: 9AM-7PM</span>
                  </div>
                </div>
              </div>

              {/* Call Us Card */}
              <div className="group relative bg-gradient-to-br from-teal-50 to-green-50 rounded-3xl p-8 border border-teal-200 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    +1 (555) 123-4567<br />
                    Emergency: +1 (555) 911-HELP
                  </p>
                  <div className="flex items-center text-teal-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">24/7 Emergency</span>
                  </div>
                </div>
              </div>

              {/* Email Us Card */}
              <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    info@physiocare.com<br />
                    support@physiocare.com
                  </p>
                  <div className="flex items-center text-green-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Quick Response</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-semibold">Success!</div>
                      <div className="text-sm">{success}</div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-semibold">Error</div>
                      <div className="text-sm">{error}</div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                      placeholder="Tell us more about your needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Send Message
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
