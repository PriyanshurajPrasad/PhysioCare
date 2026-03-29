import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ChevronDown,
  CalendarDays,
  CalendarPlus,
  UserPlus,
  PhoneCall,
  Video,
  MapPin,
  Bell,
  Settings,
  X,
  Check,
  List
} from 'lucide-react';
import adminService from '../../services/adminService';
import Badge from '../../components/admin/Badge';
import SkeletonLoader from '../../components/admin/SkeletonLoader';

// Safe icon fallback component
const SafeCalendarPlus = ({ className }) => {
  try {
    return <CalendarPlus className={className} />;
  } catch (error) {
    return <Plus className={className} />;
  }
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list, calendar, grid
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state for new appointment
  const [formData, setFormData] = useState({
    messageId: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    serviceId: '',
    serviceName: '',
    appointmentDate: '',
    appointmentTime: '',
    mode: 'clinic',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await adminService.getAppointments();
      setAppointments(response.data?.appointments || []);
      setError(''); // Clear any previous errors
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to fetch appointments:', error);
      }
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      setMessagesError('');
      
      if (import.meta.env.DEV) {
        console.log('🔍 Fetching message options for dropdown...');
      }
      
      let response;
      let messagesArray = [];
      
      try {
        // Try the lightweight options endpoint first
        response = await adminService.getMessageOptions();
        if (import.meta.env.DEV) {
          console.log('📥 Using lightweight options endpoint');
        }
      } catch (optionsError) {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Options endpoint failed, falling back to full messages endpoint:', optionsError.message);
        }
        // Fallback to the full messages endpoint
        response = await adminService.getMessages({ status: 'all', limit: 100 });
        if (import.meta.env.DEV) {
          console.log('📥 Using fallback full messages endpoint');
        }
      }
      
      if (import.meta.env.DEV) {
        console.log('📥 Raw API Response received');
        console.log('📊 Response data structure:', {
          hasData: !!response.data,
          hasDataMessages: !!response.data?.messages,
          messagesType: typeof response.data?.messages,
          messagesLength: response.data?.messages?.length,
          messagesArray: Array.isArray(response.data?.messages)
        });
      }
      
      // Extract messages safely with multiple fallback paths
      if (response.data?.messages && Array.isArray(response.data.messages)) {
        messagesArray = response.data.messages;
      } else if (response.data?.data?.messages && Array.isArray(response.data.data.messages)) {
        messagesArray = response.data.data.messages;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        messagesArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        messagesArray = response.data;
      } else {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Unexpected response structure');
        }
      }
      
      if (import.meta.env.DEV) {
        console.log('✅ Extracted messages:', {
          count: messagesArray.length,
          firstMessage: messagesArray[0] ? {
            id: messagesArray[0]._id,
            name: '[REDACTED]',
            email: '[REDACTED]',
            phone: '[REDACTED]'
          } : null
        });
      }
      
      setMessages(messagesArray);
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Failed to fetch message options:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }
      
      // More specific error messages based on status code
      let errorMessage = 'Failed to load messages';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required - Please login again';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied - Admin privileges required';
      } else if (error.response?.status === 404) {
        errorMessage = 'Messages endpoint not found - Contact administrator';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error - Please try again later';
      } else if (!error.response) {
        errorMessage = 'Network error - Check backend connection';
      }
      
      setMessagesError(errorMessage);
      setMessages([]); // Set empty array on error
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await adminService.getServices();
      setServices(response.data?.services || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to fetch services:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMessageSelect = (messageId) => {
    const message = messages.find(m => m._id === messageId);
    if (message) {
      setFormData(prev => ({
        ...prev,
        messageId,
        patientName: message.name || '',
        patientEmail: message.email || '',
        patientPhone: message.phone || ''
      }));
    }
  };

  const handleServiceSelect = (serviceId) => {
    const service = services.find(s => s._id === serviceId);
    if (service) {
      setFormData(prev => ({
        ...prev,
        serviceId,
        serviceName: service.title || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    setSuccessMessage('');

    try {
      if (import.meta.env.DEV) {
        console.log('📋 Appointment creation started');
      }
      
      // Clean payload to not send empty strings for optional IDs
      const cleanedPayload = { ...formData };
      if (!cleanedPayload.messageId || cleanedPayload.messageId === '') {
        delete cleanedPayload.messageId;
      }
      if (!cleanedPayload.serviceId || cleanedPayload.serviceId === '') {
        delete cleanedPayload.serviceId;
      }
      
      if (import.meta.env.DEV) {
        console.log('📋 Payload prepared for API call');
        console.log('📋 Payload fields:', Object.keys(cleanedPayload));
      }
      
      const response = await adminService.createAppointment(cleanedPayload);
      
      if (import.meta.env.DEV) {
        console.log('✅ Appointment created successfully');
      }
      
      // Handle email status in success message
      let successMsg = response.data.message || 'Appointment created successfully';
      if (response.data.data?.email) {
        const emailStatus = response.data.data.email;
        if (emailStatus.sent && emailStatus.accepted) {
          successMsg = 'Appointment created and email sent successfully';
        } else if (emailStatus.sent && !emailStatus.accepted) {
          successMsg = 'Appointment created and email request accepted';
        } else if (!emailStatus.sent) {
          successMsg = `Appointment created but email failed: ${emailStatus.error}`;
        }
      }
      
      setSuccessMessage(successMsg);
      setShowCreateModal(false);
      resetForm();
      setError(''); // Clear any existing errors
      
      // Refetch appointments safely
      try {
        await fetchAppointments();
      } catch (refetchError) {
        if (import.meta.env.DEV) {
          console.error('Failed to refresh appointments after creation:', refetchError);
        }
        // Don't show error to user, just log it
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Create appointment error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data ? '[REDACTED]' : 'No response'
        });
      }
      
      // Handle different error types
      let errorMessage = 'Failed to create appointment';
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400 && data.errors && Array.isArray(data.errors)) {
          // Validation errors - show first one
          errorMessage = data.errors[0]?.message || data.message || errorMessage;
        } else if (status === 400 && data.message) {
          // Single validation error
          errorMessage = data.message;
        } else if (status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (status === 403) {
          errorMessage = 'Permission denied. You do not have admin access.';
        } else if (status === 404) {
          errorMessage = 'Service not found. Please check your connection.';
        } else if (status === 500) {
          errorMessage = data.error || 'Server error occurred. Please try again.';
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setCreateError(errorMessage);
      if (import.meta.env.DEV) {
        console.log('📱 Setting error message:', errorMessage);
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      messageId: '',
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      serviceId: '',
      serviceName: '',
      appointmentDate: '',
      appointmentTime: '',
      mode: 'clinic',
      notes: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setCreateError('');
    setMessagesError('');
    setShowCreateModal(true);
    // Refresh messages when modal opens to get latest data
    fetchMessages();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateAppointment(id, { status });
      fetchAppointments();
    } catch (error) {
      setError('Failed to update appointment status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await adminService.deleteAppointment(id);
        fetchAppointments();
      } catch (error) {
        setError('Failed to delete appointment');
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesDate = dateFilter === 'all' || appointment.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Modern Loading Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded-xl w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-96 animate-pulse"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader type="stat" count={4} />
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6">
            <SkeletonLoader type="card" className="h-96" />
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
              <h3 className="text-lg font-semibold text-red-900 mb-2">Appointments Error</h3>
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
    <>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Modern Header with Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage patient appointments and schedules</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1">
              {['list', 'grid', 'calendar'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === mode 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'list' && <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
                  {mode === 'grid' && <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
                  {mode === 'calendar' && <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
                  <span className="hidden sm:inline">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
                  <span className="sm:hidden">{mode === 'list' ? '📋' : mode === 'grid' ? '📱' : '📅'}</span>
                </button>
              ))}
            </div>
            
            {/* New Appointment Button */}
            <button 
              onClick={openCreateModal}
              className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:font-medium"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Appointment</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters & Search</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={dateFilter === 'all' ? '' : dateFilter}
              onChange={(e) => setDateFilter(e.target.value || 'all')}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="w-full px-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {searchTerm && (
              <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
                <Search className="w-4 h-4 mr-2" />
                <span className="text-sm truncate max-w-xs">{searchTerm}</span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {statusFilter !== 'all' && (
              <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                <Filter className="w-4 h-4 mr-2" />
                <span className="text-sm">Status: {statusFilter}</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {dateFilter !== 'all' && (
              <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{dateFilter}</span>
                <button
                  onClick={() => setDateFilter('all')}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">{appointments.length}</p>
              <p className="text-blue-100 text-sm sm:text-base">Total</p>
            </div>
            <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-blue-100" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
              <p className="text-emerald-100 text-sm sm:text-base">Confirmed</p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-100" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-amber-100 text-sm sm:text-base">Pending</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-100" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">
                {appointments.filter(a => a.status === 'cancelled').length}
              </p>
              <p className="text-red-100 text-sm sm:text-base">Cancelled</p>
            </div>
            <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-100" />
          </div>
        </div>
      </div>

      {/* Appointments List/Grid/Calendar View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">Try adjusting your filters or create a new appointment</p>
            <button 
              onClick={openCreateModal}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create First Appointment
            </button>
          </div>
        ) : (
          <div className={viewMode === 'calendar' ? 'p-4 sm:p-6' : 'overflow-x-auto'}>
            {viewMode === 'list' && (
              <div className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
                    {/* Mobile Card Layout */}
                    <div className="lg:hidden">
                      <div className="space-y-4">
                        {/* Header with patient info and priority */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityColor(appointment.priority)}`}></div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm flex-shrink-0">
                              {appointment.patientName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 truncate">{appointment.patientName}</h3>
                              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{appointment.email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge variant={appointment.status} size="sm" />
                            <div className="flex items-center space-x-1">
                              {appointment.status === 'pending' && (
                                <button
                                  onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                  className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                                  title="Confirm Appointment"
                                >
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              )}
                              {appointment.status === 'confirmed' && (
                                <button
                                  onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                  className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                  title="Mark Complete"
                                >
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedAppointment(appointment)}
                                className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(appointment._id)}
                                className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                title="Delete Appointment"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact and Service Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{appointment.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CalendarDays className="w-4 h-4 flex-shrink-0" />
                            <span>{appointment.service}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{appointment.date} at {appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{appointment.location || 'Main Clinic'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop Layout */}
                    <div className="hidden lg:block">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Priority Indicator */}
                          <div className={`
                            w-3 h-3 rounded-full
                            ${getPriorityColor(appointment.priority)}
                          `}>
                          </div>
                          
                          {/* Patient Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                                {appointment.patientName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Mail className="w-4 h-4" />
                                  <span>{appointment.email}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Contact Info */}
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.phone}</span>
                            </div>
                          </div>
                          
                          {/* Service & Date */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CalendarDays className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Service</p>
                                <p className="text-lg font-semibold text-gray-900">{appointment.service}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Date & Time</p>
                                <p className="text-lg font-semibold text-gray-900">{appointment.date}</p>
                                <p className="text-sm text-gray-600">{appointment.time}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex items-center space-x-3 mt-4">
                            <Badge variant={appointment.status} size="lg" />
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{appointment.location || 'Main Clinic'}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                              title="Confirm Appointment"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              title="Mark Complete"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(appointment._id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete Appointment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {viewMode === 'grid' && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm
                        `}>
                          {appointment.patientName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                    <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                    <Badge variant={appointment.status} size="sm" className="ml-2" />
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(appointment.priority)}`}></div>
              </div>
              
              <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.service}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{appointment.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{appointment.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                            className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                          >
                            Confirm
                          </button>
                        )}
                        {appointment.status !== 'completed' && (
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {viewMode === 'calendar' && (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-500">Calendar view coming soon</p>
                <div className="mt-6 flex justify-center space-x-4">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <List className="w-4 h-4 mr-2" />
                    Switch to List View
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{selectedAppointment.patientName}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{selectedAppointment.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{selectedAppointment.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{selectedAppointment.service}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{selectedAppointment.date}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{selectedAppointment.time}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(selectedAppointment.status)}
                  <span className="font-medium ml-2">{selectedAppointment.status}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedAppointment.priority)}`}></div>
                  <span className="font-medium ml-2">{selectedAppointment.priority}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-6">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {selectedAppointment.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedAppointment._id, 'confirmed');
                      setSelectedAppointment(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Confirm Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
    )}
    </div>
    
    {/* Success Notification */}
    {successMessage && (
      <div className="fixed top-4 right-4 z-50 max-w-sm animate-pulse">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Success!</p>
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-green-400 hover:text-green-600 ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Create Appointment Modal */}
    {showCreateModal && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setShowCreateModal(false)}
          />

          {/* Modal panel */}
          <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full w-full max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-4">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
                    <SafeCalendarPlus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" />
                    <span className="text-sm sm:text-base">Create New Appointment</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Error Message */}
                {createError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                    <p className="font-medium text-sm">Error:</p>
                    <p className="text-sm">{createError}</p>
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  {/* Message Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Message (Optional)
                    </label>
                    <select
                      name="messageId"
                      value={formData.messageId}
                      onChange={(e) => {
                        handleInputChange(e);
                        handleMessageSelect(e.target.value);
                      }}
                      disabled={messagesLoading}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                    >
                      <option value="">
                        {messagesLoading ? 'Loading messages...' : 
                         messagesError ? 'Failed to load messages' :
                         messages.length === 0 ? 'No messages available' :
                         'Select a message...'}
                      </option>
                      {messages.map((message) => (
                        <option key={message._id} value={message._id}>
                          {message.name} - {message.email}
                        </option>
                      ))}
                    </select>
                    {messagesError && (
                      <p className="mt-1 text-sm text-red-600">{messagesError}</p>
                    )}
                    {!messagesLoading && !messagesError && messages.length === 0 && (
                      <p className="mt-1 text-sm text-gray-500">No contact messages found. Messages from the contact form will appear here.</p>
                    )}
                  </div>

                  {/* Patient Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Name *
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Email *
                      </label>
                      <input
                        type="email"
                        name="patientEmail"
                        value={formData.patientEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Enter patient email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Phone
                    </label>
                    <input
                      type="tel"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter patient phone"
                    />
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service (Optional)
                    </label>
                    <select
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={(e) => {
                        handleInputChange(e);
                        handleServiceSelect(e.target.value);
                      }}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select a service...</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Appointment Date and Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Date *
                      </label>
                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        title="Select appointment date"
                      />
                      <p className="text-xs text-gray-500 mt-1">Date will be automatically formatted</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Time *
                      </label>
                      <input
                        type="time"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Mode
                    </label>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mode"
                          value="clinic"
                          checked={formData.mode === 'clinic'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <MapPin className="w-4 h-4 mr-1" />
                        In-Clinic
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mode"
                          value="online"
                          checked={formData.mode === 'online'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <Video className="w-4 h-4 mr-1" />
                        Online
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Add any notes about the appointment..."
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {createLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <SafeCalendarPlus className="w-4 h-4 mr-2" />
                      Create Appointment
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Appointments;
