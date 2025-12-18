const JobCandidateMatch = require('../models/jobCandidateMatchModel');
const Resume = require('../models/resumeModel');
const Job = require('../models/jobModel');
const { extractSkillsAI, generateMatchScoreAI } = require('../utils/aiSkillMatcher');

/**
 * Skill Matching Service
 * Centralized service for all skill matching operations
 * Provides clean separation between business logic and controllers
 */

/**
 * Calculate and store match score for a specific job-candidate pair
 * This is the core matching function called whenever:
 * - A candidate applies to a job
 * - A candidate updates their resume
 * - A recruiter updates job requirements
 * 
 * @param {string} jobId - MongoDB ObjectId of the job
 * @param {string} candidateId - MongoDB ObjectId of the candidate
 * @param {string} applicationId - (Optional) MongoDB ObjectId of the application
 * @returns {Promise<Object>} - Match result with score and skill breakdown
 */
const calculateAndStoreMatch = async (jobId, candidateId, applicationId = null) => {
    try {
        // Fetch job details
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        // Fetch candidate's resume
        const resume = await Resume.findOne({ candidateId });
        if (!resume) {
            // No resume uploaded yet - create a zero-score match
            return await createOrUpdateMatch(jobId, candidateId, applicationId, [], job.requiredSkills);
        }

        // Generate match using AI service
        const { score, matchedSkills, missingSkills } = generateMatchScoreAI(
            resume.extractedSkills,
            job.requiredSkills
        );

        // Store or update match record
        return await createOrUpdateMatch(
            jobId,
            candidateId,
            applicationId,
            matchedSkills,
            missingSkills,
            score
        );
    } catch (error) {
        console.error('Error calculating match:', error);
        throw error;
    }
};

/**
 * Create or update a JobCandidateMatch record
 * Uses upsert to avoid duplicates
 * 
 * @param {string} jobId 
 * @param {string} candidateId 
 * @param {string} applicationId 
 * @param {Array<string>} matchedSkills 
 * @param {Array<string>} missingSkills 
 * @param {number} matchingScore 
 * @returns {Promise<Object>} - The created/updated match record
 */
const createOrUpdateMatch = async (
    jobId,
    candidateId,
    applicationId,
    matchedSkills,
    missingSkills,
    matchingScore = 0
) => {
    const matchData = {
        jobId,
        candidateId,
        applicationId,
        matchingScore,
        matchedSkills,
        missingSkills,
        calculatedAt: new Date(),
    };

    // Upsert: update if exists, create if doesn't
    const match = await JobCandidateMatch.findOneAndUpdate(
        { jobId, candidateId },
        matchData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return match;
};

/**
 * Recalculate matches for all applications when a resume is updated
 * This ensures all match scores stay in sync when candidate updates their resume
 * 
 * @param {string} candidateId - MongoDB ObjectId of the candidate
 * @returns {Promise<number>} - Number of matches recalculated
 */
const recalculateMatchesForCandidate = async (candidateId) => {
    try {
        const Application = require('../models/applicationModel');
        
        // Get all applications by this candidate
        const applications = await Application.find({ candidate: candidateId });
        
        let recalculatedCount = 0;
        
        // Recalculate match for each application
        for (const app of applications) {
            await calculateAndStoreMatch(app.job, candidateId, app._id);
            recalculatedCount++;
        }
        
        return recalculatedCount;
    } catch (error) {
        console.error('Error recalculating matches:', error);
        throw error;
    }
};

/**
 * Recalculate matches for all candidates when job requirements are updated
 * This ensures all match scores stay in sync when recruiter updates required skills
 * 
 * @param {string} jobId - MongoDB ObjectId of the job
 * @returns {Promise<number>} - Number of matches recalculated
 */
const recalculateMatchesForJob = async (jobId) => {
    try {
        const Application = require('../models/applicationModel');
        
        // Get all applications for this job
        const applications = await Application.find({ job: jobId });
        
        let recalculatedCount = 0;
        
        // Recalculate match for each candidate
        for (const app of applications) {
            await calculateAndStoreMatch(jobId, app.candidate, app._id);
            recalculatedCount++;
        }
        
        return recalculatedCount;
    } catch (error) {
        console.error('Error recalculating matches for job:', error);
        throw error;
    }
};

/**
 * Get ranked candidates for a specific job
 * Returns candidates sorted by matching score (highest first)
 * 
 * @param {string} jobId - MongoDB ObjectId of the job
 * @returns {Promise<Array>} - Sorted array of match records with populated data
 */
const getRankedCandidatesForJob = async (jobId) => {
    try {
        const matches = await JobCandidateMatch.find({ jobId })
            .populate('candidateId', 'name email')
            .sort({ matchingScore: -1 }) // Highest score first
            .lean();
        
        return matches;
    } catch (error) {
        console.error('Error getting ranked candidates:', error);
        throw error;
    }
};

/**
 * Process uploaded resume: extract text and skills
 * This is called after a resume file is uploaded
 * 
 * @param {string} candidateId - MongoDB ObjectId of the candidate
 * @param {string} resumeFileUrl - Path/URL to the resume file
 * @param {string} extractedText - Pre-extracted text from the resume
 * @returns {Promise<Object>} - The created/updated resume record
 */
const processResumeUpload = async (candidateId, resumeFileUrl, extractedText) => {
    try {
        // Extract skills from the text
        const extractedSkills = extractSkillsAI(extractedText);
        
        // Create or update resume record
        const resume = await Resume.findOneAndUpdate(
            { candidateId },
            {
                candidateId,
                resumeFileUrl,
                extractedText,
                extractedSkills,
                uploadedAt: new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        // Recalculate all matches for this candidate
        await recalculateMatchesForCandidate(candidateId);
        
        return resume;
    } catch (error) {
        console.error('Error processing resume upload:', error);
        throw error;
    }
};

module.exports = {
    calculateAndStoreMatch,
    recalculateMatchesForCandidate,
    recalculateMatchesForJob,
    getRankedCandidatesForJob,
    processResumeUpload,
};
