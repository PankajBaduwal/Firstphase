const mongoose = require('mongoose');

/**
 * JobCandidateMatch Model
 * Stores skill matching results between jobs and candidates
 * Automatically updated when:
 * - Candidate uploads/updates resume
 * - Recruiter updates job required skills
 * - New application is submitted
 * 
 * This provides a denormalized view optimized for recruiter dashboard queries
 */
const jobCandidateMatchSchema = mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
        index: true, // Index for fast queries
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: false, // Optional: links to specific application
    },
    matchingScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        index: true, // Index for sorting by score
    },
    matchedSkills: {
        type: [String], // Skills that match job requirements
        default: [],
    },
    missingSkills: {
        type: [String], // Required skills not found in resume
        default: [],
    },
    calculatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Compound index for efficient queries (find all candidates for a job, sorted by score)
jobCandidateMatchSchema.index({ jobId: 1, matchingScore: -1 });

// Unique constraint: one match record per job-candidate pair
jobCandidateMatchSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

const JobCandidateMatch = mongoose.model('JobCandidateMatch', jobCandidateMatchSchema);

module.exports = JobCandidateMatch;
