const express = require('express');
const router = express.Router();
const { createJob, getJobs, getPublicJobs } = require('../controllers/jobController');
const { protect, recruiter } = require('../middleware/authMiddleware');

// Public endpoint for external job boards (no auth required)
router.get('/public', getPublicJobs);

router.post('/create', protect, recruiter, createJob);
router.get('/all', getJobs); // Can be public or protected. Let's keep it public for visibility or candidate protected. Requirement says: "Candidate -> View all open jobs".

module.exports = router;
