import React, { useState, useEffect } from 'react';
import { Award, Users, CheckCircle, Clock, MapPin, TrendingUp, Heart } from 'lucide-react';

const PhysioVisualSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Excellence in Physiotherapy Care
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of patients with proven results and compassionate care
          </p>
        </div>

        {/* Main Image Container with Proper Aspect Ratio */}
        <div className={`relative image-container rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Proper 16:9 Aspect Ratio Container */}
          <div className="aspect-ratio-16-9">
            <img
              src="https://plus.unsplash.com/premium_photo-1663091187365-172a30dee98f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Professional Physiotherapy Session"
              className="img-responsive"
              loading="lazy"
              onLoad={(e) => e.target.classList.add('loaded')}
            />
            
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-600/20"></div>
          </div>
        </div>

        {/* Enhanced Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 rounded-3xl blur-3xl -z-10"></div>
        
        {/* Additional Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-teal-500/20 rounded-full blur-xl"></div>
      </div>

      {/* Stats Section - Below Image */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Years Experience */}
        <div className={`text-center transition-all duration-700 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">15+</div>
            <div className="text-xs text-gray-600 font-medium">Years Experience</div>
          </div>
        </div>

        {/* Success Rate */}
        <div className={`text-center transition-all duration-700 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">98%</div>
            <div className="text-xs text-gray-600 font-medium">Success Rate</div>
          </div>
        </div>

        {/* Sessions */}
        <div className={`text-center transition-all duration-700 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">5000+</div>
            <div className="text-xs text-gray-600 font-medium">Sessions</div>
          </div>
        </div>

        {/* Happy Patients */}
        <div className={`text-center transition-all duration-700 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">2000+</div>
            <div className="text-xs text-gray-600 font-medium">Happy Patients</div>
          </div>
        </div>
      </div>

      {/* Location Badge */}
      <div className={`mt-6 text-center transition-all duration-700 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="inline-flex items-center space-x-2 bg-white rounded-full shadow-lg border border-gray-100 px-6 py-3 hover:shadow-xl transition-shadow duration-300">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Medical Center, Main Branch</span>
        </div>
      </div>

      {/* Bottom Call-to-Action Section */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full px-6 py-3 border border-blue-200">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Join 2000+ satisfied patients</span>
          <Heart className="w-5 h-5 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default PhysioVisualSection;
