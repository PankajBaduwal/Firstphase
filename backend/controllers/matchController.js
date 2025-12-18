const Job = require('../models/jobModel');
const JobCandidateMatch = require('../models/jobCandidateMatchModel');
const { getRankedCandidatesForJob, recalculateMatchesForJob } = require('../services/skillMatchingService');

/**
 * Match Controller
 * Handles recruiter-facing endpoints for viewing ranked candidates
 * and managing skill matching operations
 */

/**
 * @desc    Get ranked candidates for a specific job
 * @route   GET /api/matches/job/:jobId/ranked-candidates
 * @access  Private/Recruiter
 */
const getRankedCandidates = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify job exists and belongs to recruiter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to view candidates for this job' });
        }

        // Get ranked candidates using the service
        const rankedCandidates = await getRankedCandidatesForJob(jobId);

        res.json({
            jobId,
            jobTitle: job.title,
            totalCandidates: rankedCandidates.length,
            candidates: rankedCandidates.map(match => ({
                candidateId: match.candidateId._id,
                candidateName: match.candidateId.name,
                candidateEmail: match.candidateId.email,
                matchingScore: match.matchingScore,
                matchedSkills: match.matchedSkills,
                missingSkills: match.missingSkills,
                appliedAt: match.createdAt,
            }))
        });
    } catch (error) {
        console.error('Error getting ranked candidates:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get match details for a specific candidate-job pair
 * @route   GET /api/matches/job/:jobId/candidate/:candidateId
 * @access  Private/Recruiter
 */
const getMatchDetails = async (req, res) => {
    try {
        const { jobId, candidateId } = req.params;

        // Verify job belongs to recruiter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Get match details
        const match = await JobCandidateMatch.findOne({ jobId, candidateId })
            .populate('candidateId', 'name email')
            .populate('applicationId');

        if (!match) {
            return res.status(404).json({ message: 'No match found for this candidate' });
        }

        res.json(match);
    } catch (error) {
        console.error('Error getting match details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Manually trigger recalculation of matches for a job
 * @route   POST /api/matches/job/:jobId/recalculate
 * @access  Private/Recruiter
 * 
 * Useful when job requirements are updated and recruiter wants to
 * immediately see updated match scores
 */
const triggerJobRecalculation = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify job belongs to recruiter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Recalculate all matches
        const count = await recalculateMatchesForJob(jobId);

        res.json({
            message: 'Match recalculation completed',
            recalculatedMatches: count
        });
    } catch (error) {
        console.error('Error recalculating matches:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get detailed AI score explanation for a candidate
 * @route   GET /api/matches/job/:jobId/candidate/:candidateId/explanation
 * @access  Private/Recruiter
 * 
 * Returns detailed breakdown of matching score for explainable AI
 */
const getScoreExplanation = async (req, res) => {
    try {
        const { jobId, candidateId } = req.params;

        // Verify job belongs to recruiter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Get score explanation
        const { generateScoreExplanation } = require('../services/scoreExplanationService');
        const explanation = await generateScoreExplanation(jobId, candidateId);

        res.json(explanation);
    } catch (error) {
        console.error('Error getting score explanation:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

module.exports = {
    getRankedCandidates,
    getMatchDetails,
    triggerJobRecalculation,
    getScoreExplanation,
};
