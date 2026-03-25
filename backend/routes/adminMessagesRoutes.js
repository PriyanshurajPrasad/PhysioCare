const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContactById,
  markContactAsRead,
  updateContactStatus,
  deleteContact,
  replyToContact,
  getContactOptions // New lightweight endpoint
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protected routes (require authentication and admin role)
router.use(protect);
router.use(adminOnly);

// Messages management (alias for contacts to match frontend expectations)
router.get('/messages', getContacts);
router.get('/messages/options', getContactOptions); // New lightweight endpoint for dropdowns
router.get('/messages/:id', getContactById);
router.patch('/messages/:id/read', markContactAsRead);
router.patch('/messages/:id/status', updateContactStatus);
router.patch('/messages/:id/resolve', updateContactStatus); // Alias for resolve
router.post('/messages/:id/reply', replyToContact);
router.delete('/messages/:id', deleteContact);

module.exports = router;
