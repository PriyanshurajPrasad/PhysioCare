import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Award, CheckCircle, Star, Zap, Heart, Clock, MapPin } from 'lucide-react';

const TrustSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeBadge, setActiveBadge] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const trustBadges = [
    {
      icon: Shield,
      title: 'Medical Board Certified',
      description: 'Fully accredited by national medical boards with highest safety standards',
      color: 'from-blue-500 to-blue-600',
      stats: '100% Compliant',
      features: ['Licensed Facility', 'Safety Certified', 'Regular Inspections']
    },
    {
      icon: Users,
      title: 'Expert Physiotherapists',
      description: 'Board-certified specialists with advanced training in rehabilitation',
      color: 'from-teal-500 to-teal-600',
      stats: '15+ Years Avg',
      features: ['Doctorate Level', 'Specialized Training', 'Continuing Education']
    },
    {
      icon: Activity,
      title: 'Advanced Rehabilitation Tech',
      description: 'State-of-the-art equipment and evidence-based treatment protocols',
      color: 'from-purple-500 to-purple-600',
      stats: 'Latest Equipment',
      features: ['Digital Therapy', 'Modern Equipment', 'Evidence-Based']
    },
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'Personalized treatment plans with compassionate, individual attention',
      color: 'from-green-500 to-green-600',
      stats: '98% Satisfaction',
      features: ['Personalized Plans', 'One-on-One Care', 'Family Support']
    }
  ];

  const certifications = [
    { name: 'American Physical Therapy Association', abbr: 'APTA' },
    { name: 'Board of Physical Therapy', abbr: 'BPT' },
    { name: 'Medical Quality Assurance', abbr: 'MQA' },
    { name: 'Healthcare Commission', abbr: 'HC' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Medical Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-500 rounded-full filter blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-500 rounded-full filter blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-6 border border-blue-200">
            <Shield className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-blue-800 text-sm font-medium">Medical Excellence & Trust</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Patients Trust Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Expert Medical Care
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're committed to the highest standards of medical excellence with board-certified therapists, 
            advanced technology, and personalized treatment plans that deliver real results.
          </p>
        </div>

        {/* Main Trust Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            const isActive = activeBadge === index;
            
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setActiveBadge(index)}
                onMouseLeave={() => setActiveBadge(null)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                
                {/* Glow Effect */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-10 rounded-3xl animate-pulse`}></div>
                )}
                
                {/* Icon with Stats Badge */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Stats Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {badge.stats}
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {badge.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {badge.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2">
                    {badge.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Badge */}
                <div className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Medical Certifications Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Medical Certifications & Accreditations</h3>
            <p className="text-gray-600">Recognized by leading medical authorities</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-900">{cert.abbr}</div>
                <div className="text-xs text-gray-600 mt-1">{cert.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Success Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
            <div className="text-gray-600 mb-2">Patient Rating</div>
            <div className="flex justify-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">2000+</div>
            <div className="text-gray-600">Happy Patients</div>
            <div className="text-sm text-green-600 mt-2">Since 2014</div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
            <div className="text-gray-600">Success Rate</div>
            <div className="text-sm text-green-600 mt-2">Recovery Outcomes</div>
          </div>
        </div>

        {/* Bottom Trust Line */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full border border-blue-200">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Serving the community with medical excellence since 2014
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
