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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <SafeIcon icon={CheckCircle} fallback="✓" className="w-5 h-5 mr-2" />
          <div>
            <div className="font-semibold">Success</div>
            <div className="text-sm">{success}</div>
          </div>
          <button
            onClick={() => setSuccess('')}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <SafeIcon icon={X} fallback="✕" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <SafeIcon icon={AlertCircle} fallback="!" className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={Search} fallback="🔍" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={Filter} fallback="⚙️" className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Messages</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Messages List */}
        <div className={`${selectedContact ? 'hidden lg:block' : 'block'} lg:w-2/5`}>
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Messages</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.586z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Messages</h3>
                  <p className="text-gray-500">No contact messages found. When users submit the contact form, they will appear here.</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => handleSelectContact(contact)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedContact?._id === contact._id ? 'bg-indigo-50' : ''
                    }`}
                  >
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Details */}
        <div className={`${selectedContact ? 'block' : 'hidden lg:block'} lg:w-3/5`}>
          {selectedContact ? (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Message Details</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="lg:hidden text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={XCircle} fallback="✕" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedContact?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedContact?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedContact?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Subject</label>
                    <p className="text-gray-900">{selectedContact?.subject || 'No subject'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Message</label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedContact?.message || 'No message'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedContact?.status || 'new')}`}>
                      {selectedContact?.status || 'new'}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Received</label>
                    <p className="text-gray-900">
                      {selectedContact?.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {!selectedContact?.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(selectedContact?._id)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <SafeIcon icon={Mail} fallback="📧" className="w-4 h-4 mr-2" />
                      Mark as Read
                    </button>
                  )}
                  {selectedContact?.status !== 'resolved' && (
                    <button
                      onClick={() => handleResolveMessage(selectedContact?._id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <SafeIcon icon={CheckCircle} fallback="✓" className="w-4 h-4 mr-2" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reply to Message</h3>
            </div>
            <form onSubmit={handleReplySubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={replyForm.subject}
                    onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
