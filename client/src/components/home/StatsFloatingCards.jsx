import React from 'react';
import { Users, Award, CheckCircle, TrendingUp } from 'lucide-react';

const StatsFloatingCards = () => {
  const stats = [
    { icon: Users, value: '2000+', label: 'Patients Treated', color: 'from-blue-500 to-blue-600' },
    { icon: Award, value: '15+', label: 'Years Experience', color: 'from-teal-500 to-teal-600' },
    { icon: CheckCircle, value: '98%', label: 'Success Rate', color: 'from-green-500 to-green-600' },
    { icon: TrendingUp, value: '4.9/5', label: 'Patient Rating', color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsFloatingCards;
