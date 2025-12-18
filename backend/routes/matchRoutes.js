const express = require('express');
const router = express.Router();
const { protect, recruiterOnly } = require('../middleware/authMiddleware');
const {
    getRankedCandidates,
    getMatchDetails,
    triggerJobRecalculation,
    getScoreExplanation,
} = require('../controllers/matchController');

/**
 * Match Routes
 * All routes are protected and recruiter-only
 */

// Get ranked candidates for a job
router.get('/job/:jobId/ranked-candidates', protect, recruiterOnly, getRankedCandidates);

// Get detailed match information for a specific candidate-job pair
router.get('/job/:jobId/candidate/:candidateId', protect, recruiterOnly, getMatchDetails);

// Manually trigger recalculation of matches for a job
router.post('/job/:jobId/recalculate', protect, recruiterOnly, triggerJobRecalculation);

// Get detailed score explanation for a candidate (Explainable AI)
router.get('/job/:jobId/candidate/:candidateId/explanation', protect, recruiterOnly, getScoreExplanation);

module.exports = router;
