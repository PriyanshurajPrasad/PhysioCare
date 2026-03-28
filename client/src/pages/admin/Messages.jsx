import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  CheckCircle, 
  Reply, 
  Trash2, 
  AlertCircle,
  Search,
  Filter,
  Send,
  X,
  XCircle,
  Clock
} from 'lucide-react';
import adminService from '../../services/adminService';

// Safe Icon Component to prevent crashes
const SafeIcon = ({ icon: Icon, fallback, className, ...props }) => {
  if (!Icon) {
    return <span className={className}>{fallback || '⚠️'}</span>;
  }
  
  try {
    return <Icon className={className} {...props} />;
  } catch (error) {
    console.warn('Icon render error:', error);
    return <span className={className}>{fallback || '⚠️'}</span>;
  }
};

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyForm, setReplyForm] = useState({
    subject: '',
    message: ''
  });
  const [sendingReply, setSendingReply] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await adminService.getMessages(params);
      
      if (response.data?.success && response.data?.data) {
        const messagesData = response.data.data?.messages || response.data.data?.contacts || [];
        setContacts(Array.isArray(messagesData) ? messagesData : []);
        setTotalPages(response.data.data?.pagination?.pages || 1);
      } else {
        const errorMsg = response.data?.message || 'Failed to fetch messages';
        setError(errorMsg);
        console.error('❌ API Error:', response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, searchTerm, statusFilter]);

  const handleResolveMessage = async (contactId) => {
    try {
      await adminService.resolveMessage(contactId);
      // Update local state to reflect the change
      setContacts(prev => prev.map(contact => 
        contact._id === contactId ? { ...contact, status: 'resolved' } : contact
      ));
      // Update selected contact if it's the one being resolved
      if (selectedContact?._id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, status: 'resolved' } : null);
      }
      setSuccess('Message marked as resolved');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve message');
    }
  };

  const handleDeleteMessage = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await adminService.deleteMessage(contactId);
        setContacts(prev => prev.filter(contact => contact._id !== contactId));
        if (selectedContact?._id === contactId) {
          setSelectedContact(null);
        }
        setSuccess('Message deleted successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete message');
      }
    }
  };

  const handleMarkAsRead = async (contactId) => {
    try {
      await adminService.markMessageAsRead(contactId);
      // Update local state to reflect the change
      setContacts(prev => prev.map(contact => 
        contact._id === contactId ? { ...contact, isRead: true } : contact
      ));
      // Update selected contact if it's the one being marked as read
      if (selectedContact?._id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, isRead: true } : null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark message as read');
    }
  };

  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    // Mark as read when selected
    if (!contact.isRead) {
      await handleMarkAsRead(contact._id);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedContact) return;

    setSendingReply(true);
    try {
      await adminService.replyToMessage(selectedContact._id, replyForm);
      setShowReplyModal(false);
      setReplyForm({ subject: '', message: '' });
      fetchContacts();
    } catch (err) {
      setError(err.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <SafeIcon icon={CheckCircle} fallback="✓" className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <SafeIcon icon={Clock} fallback="⏰" className="w-5 h-5 text-yellow-500" />;
      default:
        return <SafeIcon icon={AlertCircle} fallback="!" className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage contact messages and inquiries</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{contacts.length}</p>
              <p className="text-xs text-gray-500">Total Messages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 sm:mb-6 mx-4 sm:mx-0">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <SafeIcon icon={CheckCircle} fallback="✓" className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Success</div>
              <div className="text-sm">{success}</div>
            </div>
            <button
              onClick={() => setSuccess('')}
              className="ml-3 text-green-500 hover:text-green-700 flex-shrink-0"
            >
              <SafeIcon icon={X} fallback="✕" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 sm:mb-6 mx-4 sm:mx-0">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <SafeIcon icon={AlertCircle} fallback="!" className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Messages</label>
            <div className="relative">
              <SafeIcon icon={Search} fallback="🔍" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={Filter} fallback="⚙️" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="all">All Messages</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Message List */}
        <div className="lg:w-2/5">
          <div className="divide-y divide-gray-200 max-h-96 lg:max-h-[500px] overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-gray-400 mb-3 sm:mb-4">
              <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No Messages</h3>
            <p className="text-sm sm:text-base text-gray-500">No contact messages found. When users submit the contact form, they will appear here.</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => handleSelectContact(contact)}
              className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                selectedContact?._id === contact._id 
                  ? 'bg-indigo-50 border-indigo-500' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {/* Mobile Card Layout */}
              <div className="lg:hidden">
                <div className="space-y-3">
                  {/* Header with name and status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {contact.name}
                        </p>
                        <div className="flex-shrink-0">
                          {getStatusIcon(contact.status)}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">{contact.email}</p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message preview */}
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {contact.message}
                  </div>
                  
                  {/* Additional info for mobile */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {contact.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          <span>Phone</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        <span>Email</span>
                      </div>
                    </div>
                    {!contact.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden lg:block">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </p>
                      {getStatusIcon(contact.status)}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
          </div>
        </div>

      {/* Message Details */}
      <div className={`${selectedContact ? 'block' : 'hidden lg:block'} lg:w-3/5`}>
        {selectedContact ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            {/* Mobile Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Message Details</h2>
                    <p className="text-xs sm:text-sm text-gray-500">{selectedContact?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <SafeIcon icon={XCircle} fallback="✕" className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Message Content */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 block">Name</label>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{selectedContact?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 block">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm sm:text-base text-gray-900 break-all">{selectedContact?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 block">Phone</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm sm:text-base text-gray-900">{selectedContact?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 block">Status</label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedContact?.status)}
                      <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium ${getStatusColor(selectedContact?.status || 'new')}`}>
                        {selectedContact?.status || 'new'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 block">Subject</label>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{selectedContact?.subject || 'No subject'}</p>
                  </div>
                </div>
                
                {/* Message */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2 block">Message</label>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 max-h-48 overflow-y-auto">
                    <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap leading-relaxed">{selectedContact?.message || 'No message'}</p>
                  </div>
                </div>
                
                {/* Timestamp */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-500">Received</label>
                        <p className="text-xs sm:text-sm text-gray-900">
                          {selectedContact?.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                  {!selectedContact?.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(selectedContact?._id)}
                      className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium w-full sm:w-auto"
                    >
                      <SafeIcon icon={Mail} fallback="📧" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Mark as Read
                    </button>
                  )}
                  {selectedContact?.status !== 'resolved' && (
                    <button
                      onClick={() => handleResolveMessage(selectedContact?._id)}
                      className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm sm:text-base font-medium w-full sm:w-auto"
                    >
                      <SafeIcon icon={CheckCircle} fallback="✓" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Mark as Resolved
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowReplyModal(true);
                      setReplyForm({
                        subject: `Re: ${selectedContact?.subject || 'Your inquiry'}`,
                        message: ''
                      });
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <SafeIcon icon={Reply} fallback="↩️" className="w-4 h-4 mr-2" />
                    Reply
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(selectedContact?._id)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <SafeIcon icon={Trash2} fallback="🗑️" className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <SafeIcon icon={MessageSquare} fallback="💬" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Select a message to view details</p>
          </div>
        )}
      </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Reply to Message</h3>
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleReplySubmit} className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={replyForm.subject}
                    onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={replyForm.message}
                    onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                    rows={6}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                    placeholder="Type your reply here..."
                    required
                  />
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm sm:text-base font-medium"
                >
                  {sendingReply ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={Send} fallback="📤" className="w-4 h-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
