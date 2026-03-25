import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  X, 
  AlertCircle,
  Search,
  Filter,
  Users,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  Award,
  Clock,
  MoreVertical,
  RefreshCw,
  Heart,
  Quote
} from 'lucide-react';
import adminService from '../../services/adminService';
import Badge from '../../components/admin/Badge';
import SkeletonLoader from '../../components/admin/SkeletonLoader';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await adminService.getTestimonials();
      setTestimonials(response.data?.testimonials || []);
    } catch (error) {
      setError('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveTestimonial(id);
      fetchTestimonials();
    } catch (error) {
      setError('Failed to approve testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      try {
        await adminService.deleteTestimonial(id);
        fetchTestimonials();
      } catch (error) {
        setError('Failed to delete testimonial');
      }
    }
  };

  const handleViewDetails = (testimonial) => {
    setSelectedTestimonial(testimonial);
  };

  const getFilteredAndSortedTestimonials = () => {
    let filtered = testimonials.filter(testimonial => {
      const matchesSearch = testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.service?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'approved' && testimonial.isApproved) ||
        (statusFilter === 'pending' && !testimonial.isApproved);
      
      const matchesRating = ratingFilter === 'all' || 
        (ratingFilter === '5' && testimonial.rating >= 5) ||
        (ratingFilter === '4' && testimonial.rating >= 4) ||
        (ratingFilter === '3' && testimonial.rating >= 3) ||
        (ratingFilter === '2' && testimonial.rating >= 2) ||
        (ratingFilter === '1' && testimonial.rating >= 1);

      return matchesSearch && matchesStatus && matchesRating;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'rating') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSentimentIcon = (rating) => {
    if (rating >= 4) {
      return <ThumbsUp className="w-5 h-5 text-green-600" />;
    } else if (rating <= 2) {
      return <ThumbsDown className="w-5 h-5 text-red-600" />;
    }
    return <MessageSquare className="w-5 h-5 text-gray-600" />;
  };

  if (loading && testimonials.length === 0) {
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
              <h3 className="text-lg font-semibold text-red-900 mb-2">Testimonials Error</h3>
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

  const filteredTestimonials = getFilteredAndSortedTestimonials();
  const approvedCount = testimonials.filter(t => t.isApproved).length;
  const pendingCount = testimonials.filter(t => !t.isApproved).length;
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Modern Header with Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
              <p className="text-sm text-gray-500">Manage patient testimonials and reviews</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchTestimonials}
              className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              title="Refresh testimonials"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{testimonials.length}</p>
              <p className="text-indigo-100">Total Testimonials</p>
            </div>
            <MessageSquare className="w-8 h-8 text-indigo-100" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{approvedCount}</p>
              <p className="text-emerald-100">Approved</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-100" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{pendingCount}</p>
              <p className="text-amber-100">Pending</p>
            </div>
            <Clock className="w-8 h-8 text-amber-100" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold flex items-center">
                {averageRating}
                <Star className="w-5 h-5 ml-2 text-purple-100" />
              </p>
              <p className="text-purple-100">Average Rating</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-100" />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                List
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, message, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="createdAt">Date Created</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'all' || ratingFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {searchTerm && (
              <div className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                <Search className="w-4 h-4 mr-2" />
                {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {statusFilter !== 'all' && (
              <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                <Filter className="w-4 h-4 mr-2" />
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter('all')}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {ratingFilter !== 'all' && (
              <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                <Star className="w-4 h-4 mr-2" />
                Rating: {ratingFilter}+ Stars
                <button
                  onClick={() => setRatingFilter('all')}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Testimonials Display */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No testimonials found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 relative group">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant={testimonial.isApproved ? 'approved' : 'pending'} size="sm" />
                </div>
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(testimonial)}
                      className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-600">({testimonial.rating}.0)</span>
                </div>

                {/* Service */}
                {testimonial.service && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <Heart className="w-4 h-4" />
                    <span>{testimonial.service}</span>
                  </div>
                )}

                {/* Message */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-2 mb-2">
                    <Quote className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 italic">"{testimonial.message}"</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    {!testimonial.isApproved && (
                      <button
                        onClick={() => handleApprove(testimonial._id)}
                        className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(testimonial)}
                      className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">{new Date(testimonial.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(testimonial.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-600">({testimonial.rating}.0)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{testimonial.service || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{new Date(testimonial.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={testimonial.isApproved ? 'approved' : 'pending'} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(testimonial)}
                          className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!testimonial.isApproved && (
                          <button
                            onClick={() => handleApprove(testimonial._id)}
                            className="ml-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(testimonial._id)}
                          className="ml-2 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Testimonial Details Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Testimonial Details</h2>
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{selectedTestimonial.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-1">
                      {renderStars(selectedTestimonial.rating)}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600">({selectedTestimonial.rating}.0)</span>
                    <div className="ml-auto flex items-center space-x-1">
                      {getSentimentIcon(selectedTestimonial.rating)}
                      <span className="text-sm text-gray-600">
                        {selectedTestimonial.rating >= 4 ? 'Excellent' : 
                         selectedTestimonial.rating >= 3 ? 'Good' : 
                         selectedTestimonial.rating >= 2 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{selectedTestimonial.service || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {new Date(selectedTestimonial.createdAt).toLocaleDateString()} at {new Date(selectedTestimonial.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-2 mb-2">
                    <Quote className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 italic text-lg leading-relaxed">"{selectedTestimonial.message}"</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {selectedTestimonial.isApproved ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-emerald-700">Approved</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-amber-700">Pending Approval</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 space-x-3">
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
              {!selectedTestimonial.isApproved && (
                <button
                  onClick={() => {
                    handleApprove(selectedTestimonial._id);
                    setSelectedTestimonial(null);
                  }}
                  className="flex items-center px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Testimonial
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
