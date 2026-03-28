import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  DollarSign,
  Search,
  Bell,
  Plus,
  Eye,
  CalendarPlus,
  MessageSquarePlus,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  CalendarDays,
  MailOpen,
  Star,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Heart,
  Shield,
  Settings,
  LogOut,
  ArrowUp,
  ArrowDown,
  Users2,
  FileText,
  TrendingUpIcon,
  CalendarClock,
  Award,
  UserPlus
} from 'lucide-react';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import SectionCard from '../../components/admin/SectionCard';
import Badge from '../../components/admin/Badge';
import DataTable from '../../components/admin/DataTable';
import SkeletonLoader from '../../components/admin/SkeletonLoader';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await adminService.getDashboardStats();
        setStats(statsResponse.data);

        // Fetch recent activity (mock data for now)
        setRecentActivity([
          {
            id: 1,
            title: 'New Appointment',
            description: 'Patient scheduled for consultation',
            time: '2 hours ago',
            type: 'appointment',
            icon: Calendar,
            color: 'text-blue-600'
          },
          {
            id: 2,
            title: 'Message Received',
            description: 'Contact form submission from website',
            time: '4 hours ago',
            type: 'message',
            icon: MessageSquare,
            color: 'text-green-600'
          },
          {
            id: 3,
            title: 'Service Updated',
            description: 'Physical therapy service details modified',
            time: '6 hours ago',
            type: 'service',
            icon: Target,
            color: 'text-purple-600'
          }
        ]);

        // Fetch appointments
        const appointmentsResponse = await adminService.getAppointments({ limit: 5 });
        setAppointments(appointmentsResponse.data);

      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || '248',
      icon: Users,
      color: 'bg-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Appointments Today',
      value: stats?.appointmentsToday || '12',
      icon: Calendar,
      color: 'bg-green-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Messages',
      value: stats?.totalMessages || '5',
      icon: MessageSquare,
      color: 'bg-purple-600',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: stats?.revenue || '$4,250',
      icon: DollarSign,
      color: 'bg-yellow-600',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} type="card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-lg max-w-md w-full mx-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Dashboard Error</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            change={card.change}
            changeType={card.changeType}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="space-y-4">
          <SectionCard 
            title="Recent Activity"
            subtitle="Latest updates and notifications"
            icon={Activity}
            headerAction={
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            }
          >
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <SectionCard 
            title="Upcoming Appointments"
            subtitle="Today's schedule"
            icon={CalendarDays}
          >
            <div className="space-y-3">
              {appointments.slice(0, 3).map((appointment, index) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-xs text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
