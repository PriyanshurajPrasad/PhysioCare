const express = require('express');
const {
  getAboutContent,
  updateAboutContent,
  getAboutContentForAdmin
} = require('../controllers/aboutController');

const router = express.Router();

// Public routes
router.get('/', getAboutContent);

// Admin routes (now public since auth is removed)
router.post('/admin', updateAboutContent);
router.get('/admin', getAboutContentForAdmin);

module.exports = router;
