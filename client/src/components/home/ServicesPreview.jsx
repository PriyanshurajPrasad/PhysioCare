import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Zap, Clock, ArrowRight, Calendar } from 'lucide-react';

const ServicesPreview = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: Heart,
      title: 'Physical Therapy',
      description: 'Comprehensive rehabilitation programs for recovery and strength building',
      price: '$80',
      duration: '60 min',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Activity,
      title: 'Sports Rehabilitation',
      description: 'Specialized treatment for sports injuries and performance enhancement',
      price: '$100',
      duration: '60 min',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Pain Management',
      description: 'Advanced techniques for chronic pain relief and management',
      price: '$90',
      duration: '45 min',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Medical
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-based treatments designed to restore function and improve quality of life
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div
                key={index}
                className={`group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Price and Duration */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to="/contact"
                  className={`inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r ${service.color} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-2xl hover:border-blue-400 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            View All Services
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
