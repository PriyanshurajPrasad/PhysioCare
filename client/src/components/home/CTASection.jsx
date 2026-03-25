import React from 'react';
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

const CTASection = () => {
  return (
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
            Ready to Start Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-teal-100">
              Recovery Journey?
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Contact us today to schedule your consultation and take the first step towards a pain-free life
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
              Get Started Now
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
  );
};

export default CTASection;
