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
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0,
    latestMessages: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [sseConnection, setSseConnection] = useState(null);
  const [newMessageNotification, setNewMessageNotification] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        console.log('📊 Dashboard stats response:', response.data);
        
        if (response.data?.success) {
          setStats(response.data.stats);
          setError('');
        } else {
          setError('Failed to fetch dashboard statistics');
        }
      } catch (err) {
        console.error('❌ Dashboard stats error:', err);
        setError(err.message || 'Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    // Establish SSE connection for real-time updates
    const connectSSE = () => {
      try {
        console.log('🔌 Connecting to SSE...');
        const eventSource = adminService.connectSSE();
        setSseConnection(eventSource);

        // Handle new message events
        eventSource.addEventListener('new_message', (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 New message received via SSE:', data);
            
            // Show toast notification
            setNewMessageNotification({
              name: data.name,
              subject: data.subject,
              timestamp: new Date()
            });

            // Update stats immediately
            setStats(prevStats => ({
              ...prevStats,
              totalMessages: prevStats.totalMessages + 1,
              unreadMessages: prevStats.unreadMessages + 1,
              todayMessages: prevStats.todayMessages + 1,
              latestMessages: [data, ...prevStats.latestMessages.slice(0, 9)]
            }));

            // Clear notification after 5 seconds
            setTimeout(() => {
              setNewMessageNotification(null);
            }, 5000);
          } catch (error) {
            console.error('❌ Failed to parse SSE data:', error);
          }
        });

        eventSource.addEventListener('connected', (event) => {
          console.log('🔌 SSE connected:', event.data);
        });

        eventSource.onerror = (error) => {
          console.error('❌ SSE connection error:', error);
          // Fallback to polling if SSE fails
          setTimeout(() => {
            console.log('🔄 Falling back to polling...');
            startPolling();
          }, 5000);
        };

      } catch (error) {
        console.error('❌ Failed to establish SSE connection:', error);
        // Fallback to polling
        startPolling();
      }
    };

    // Fallback polling mechanism
    const startPolling = () => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await adminService.getDashboardStats();
          if (response.data?.success) {
            setStats(response.data.stats);
          }
        } catch (error) {
          console.error('❌ Polling error:', error);
        }
      }, 7000); // Poll every 7 seconds

      // Store interval for cleanup
      window.dashboardPollInterval = pollInterval;
    };

    // Initial connection
    connectSSE();

    // Initial stats fetch
    fetchDashboardStats();

    // Cleanup on unmount
    return () => {
      if (sseConnection) {
        sseConnection.close();
      }
      if (window.dashboardPollInterval) {
        clearInterval(window.dashboardPollInterval);
      }
    };
  }, []);

  const statCards = [
    {
      title: 'Total Messages',
      value: stats.totalMessages?.toLocaleString() || 0,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: stats.todayMessages > 0 ? `+${stats.todayMessages}` : '0',
      changeType: stats.todayMessages > 0 ? 'positive' : 'neutral',
      trend: stats.todayMessages > 0 ? 'up' : 'neutral',
      description: 'today'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages?.toLocaleString() || 0,
      icon: Bell,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      change: stats.unreadMessages > 0 ? `+${stats.unreadMessages}` : '0',
      changeType: stats.unreadMessages > 0 ? 'positive' : 'neutral',
      trend: stats.unreadMessages > 0 ? 'up' : 'neutral',
      description: 'need attention'
    },
    {
      title: "Today's Messages",
      value: stats.todayMessages?.toLocaleString() || 0,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: stats.todayMessages > 0 ? `+${stats.todayMessages}` : '0',
      changeType: stats.todayMessages > 0 ? 'positive' : 'neutral',
      trend: stats.todayMessages > 0 ? 'up' : 'neutral',
      description: 'new today'
    }
  ];

  const recentActivities = stats.latestMessages?.slice(0, 5).map((message, index) => ({
    id: message._id,
    type: 'message',
    title: `New message from ${message.name || 'Unknown'}`,
    description: message.subject || 'No subject',
    time: new Date(message.createdAt).toLocaleTimeString(),
    icon: MessageSquare,
    bgColor: message.isRead ? 'bg-gray-50' : 'bg-blue-50',
    borderColor: message.isRead ? 'border-gray-200' : 'border-blue-200',
    priority: 'high'
  })) || [];

  const quickActions = [
    {
      title: 'Schedule Appointment',
      description: 'Book new patient appointment',
      icon: CalendarPlus,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200',
      shortcut: 'Ctrl+N'
    },
    {
      title: 'Add Patient',
      description: 'Register new patient',
      icon: UserPlus,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200',
      shortcut: 'Ctrl+P'
    },
    {
      title: 'Send Message',
      description: 'Compose new message',
      icon: MailOpen,
      color: 'bg-gradient-to-br from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200',
      shortcut: 'Ctrl+M'
    },
    {
      title: 'Generate Report',
      description: 'Create analytics report',
      icon: FileText,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200',
      shortcut: 'Ctrl+R'
    }
  ];

  const appointmentsData = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      date: '2024-03-15',
      time: '10:30 AM',
      service: 'Sports Therapy',
      status: 'confirmed',
      priority: 'high'
    },
    {
      id: 2,
      patient: 'Michael Chen',
      email: 'michael.chen@email.com',
      date: '2024-03-15',
      time: '2:00 PM',
      service: 'Rehabilitation',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      patient: 'Emma Wilson',
      email: 'emma.w@email.com',
      date: '2024-03-14',
      time: '4:15 PM',
      service: 'Physiotherapy',
      status: 'completed',
      priority: 'low'
    },
    {
      id: 4,
      patient: 'David Brown',
      email: 'david.brown@email.com',
      date: '2024-03-14',
      time: '11:00 AM',
      service: 'Sports Therapy',
      status: 'cancelled',
      priority: 'medium'
    }
  ];

  const appointmentsColumns = [
    {
      header: 'Patient',
      key: 'patient',
      width: '30%',
      render: (patient, row) => (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
              {patient.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            {row.priority === 'high' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{patient}</p>
            <p className="text-sm text-gray-500 truncate">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Date & Time',
      key: 'datetime',
      width: '20%',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <CalendarClock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{row.date}</p>
            <p className="text-sm text-gray-500">{row.time}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Service',
      key: 'service',
      width: '25%',
      render: (service) => (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium text-gray-900">{service}</span>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      width: '15%',
      render: (status) => (
        <Badge 
          variant={status} 
          size="sm"
        />
      )
    },
    {
      header: 'Actions',
      key: 'action',
      width: '10%',
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const performanceMetrics = [
    {
      title: 'Patient Satisfaction',
      value: '94%',
      change: '+5.2%',
      trend: 'up',
      icon: Award,
      color: 'green',
      bgColor: 'bg-green-50',
      description: 'Based on reviews'
    },
    {
      title: 'Appointment Rate',
      value: '87%',
      change: '+12.1%',
      trend: 'up',
      icon: Target,
      color: 'blue',
      bgColor: 'bg-blue-50',
      description: 'This month'
    },
    {
      title: 'Patient Retention',
      value: '91%',
      change: '+3.4%',
      trend: 'up',
      icon: Heart,
      color: 'purple',
      bgColor: 'bg-purple-50',
      description: 'Last 90 days'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Modern Loading Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-10 sm:h-10 sm:w-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-10 sm:h-10 sm:w-10 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">Loading Dashboard</h2>
              <p className="text-sm text-gray-500 text-center mt-2">Fetching your clinic metrics...</p>
            </div>
          </div>

          {/* Responsive Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader type="stat" count={4} />
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <SkeletonLoader type="card" className="h-64 sm:h-72" />
              <SkeletonLoader type="card" className="h-48 sm:h-56" />
            </div>
            <div className="space-y-6">
              <SkeletonLoader type="card" className="h-48 sm:h-56" />
              <SkeletonLoader type="card" className="h-48 sm:h-56" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-2xl max-w-md w-full mx-4 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Dashboard Error</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-lg hover:shadow-xl"
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
      {/* Toast Notification for New Messages */}
      {newMessageNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-pulse">
          <div className="bg-white rounded-lg shadow-xl border-l-4 border-blue-500 p-4 flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">New Message Received</p>
              <p className="text-sm text-gray-600">
                From: <span className="font-medium">{newMessageNotification.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Subject: <span className="font-medium">{newMessageNotification.subject}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {newMessageNotification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => setNewMessageNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modern Header with Time Range Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-sm text-gray-500">Real-time clinic performance metrics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time Range Selector */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeRange === range 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search dashboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className={`
            bg-white rounded-2xl shadow-sm border ${card.borderColor} p-6
            hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1
          `}>
            <div className="flex items-start justify-between mb-4">
              <div className={`
                w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl 
                flex items-center justify-center shadow-lg
              `}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {card.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm font-medium text-gray-700 mb-1">{card.title}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity - 2 columns */}
        <div className="xl:col-span-2 space-y-6">
          <SectionCard 
            title="Recent Activity"
            subtitle="Latest updates and notifications"
            icon={Activity}
            headerAction={
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            }
          >
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className={`
                    flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 group
                    ${activity.bgColor} hover:shadow-md
                  `}>
                    <div className="relative">
                      <div className={`
                        w-12 h-12 bg-white rounded-xl flex items-center justify-center 
                        shadow-sm group-hover:scale-105 transition-transform duration-200
                      `}>
                        <Icon className={`w-6 h-6 ${activity.color}`} />
                      </div>
                      {activity.priority === 'high' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900 truncate">{activity.title}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="info" size="sm">
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center group">
                        View Details
                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Upcoming Appointments */}
          <SectionCard 
            title="Upcoming Appointments"
            subtitle="Today's schedule"
            icon={CalendarDays}
            headerAction={
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group">
                Calendar
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            }
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50">
                    <tr>
                      {appointmentsColumns.map((column) => (
                        <th
                          key={column.key}
                          className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {column.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointmentsData.map((appointment, index) => (
                      <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                        {appointmentsColumns.map((column) => (
                          <td
                            key={column.key}
                            className="px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-900 whitespace-nowrap"
                          >
                            {column.render(appointment)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Responsive Quick Actions */}
          <SectionCard 
            title="Quick Actions"
            subtitle="Common tasks and shortcuts"
            icon={Zap}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`
                    ${action.color} 
                    text-white 
                    p-3 sm:p-4 
                    rounded-xl 
                    shadow-lg 
                    hover:shadow-xl 
                    transform 
                    hover:-translate-y-0.5 
                    transition-all 
                    duration-200
                    flex 
                    items-center 
                    justify-center
                    space-x-2
                    text-sm
                    sm:text-base
                    font-medium
                  `}
                  title={action.description}
                >
                  <action.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{action.title}</span>
                  <span className="sm:hidden text-xs">{action.shortcut}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Responsive Performance Metrics */}
          <SectionCard 
            title="Performance Metrics"
            subtitle="Key performance indicators"
            icon={TrendingUpIcon}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {performanceMetrics.map((metric, index) => (
                <div
                  key={index}
                  className={`
                    bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6
                    ${metric.bgColor}
                  `}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${metric.color} rounded-xl flex items-center justify-center shadow-sm`}>
                        <metric.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{metric.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{metric.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl sm:text-3xl font-bold ${metric.color}`}>
                        {metric.value}%
                      </span>
                      <div className={`flex items-center text-xs sm:text-sm ${metric.changeType === 'positive' ? 'text-green-600' : metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'}`}>
                        {metric.trend && (
                          <metric.trend className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Quick Stats */}
          <SectionCard 
            title="Quick Stats"
            subtitle="Today at a glance"
            icon={Users2}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Messages</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{stats.unreadMessages || 0}</p>
                <p className="text-xs text-blue-600">Unread</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{stats.totalUsers || 0}</p>
                <p className="text-xs text-green-600">Registered</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
