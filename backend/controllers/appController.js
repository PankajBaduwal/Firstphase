const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const parseResume = require('../utils/resumeParser');
const { extractSkillsAI, generateMatchScoreAI } = require('../utils/aiSkillMatcher');
const { processResumeUpload, calculateAndStoreMatch } = require('../services/skillMatchingService');

// @desc    Apply for a job
// @route   POST /api/applications/apply
// @access  Private/Candidate
const applyForJob = async (req, res) => {
    try {
        const { jobId, source } = req.body; // Extract source parameter
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({ message: 'Please upload a resume' });
        }

        // Check if already applied
        const existingApp = await Application.findOne({ job: jobId, candidate: req.user.id });
        if (existingApp) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Get Job Details
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Parse Resume using Python-based extraction
        const resumeText = await parseResume(resumeFile.path, resumeFile.mimetype);

        if (!resumeText) {
            return res.status(400).json({ 
                message: 'Failed to extract text from resume. Please ensure the PDF contains readable text.' 
            });
        }

        // --- AI Skill Matching Logic ---
        // 1. Extract Skills from Resume
        const resumeSkills = extractSkillsAI(resumeText);
        
        // 2. Generate Match Score and Breakdown
        const { score, matchedSkills, missingSkills } = generateMatchScoreAI(resumeSkills, job.requiredSkills);

        // 3. Create Application
        const application = await Application.create({
            job: jobId,
            candidate: req.user.id,
            resumeUrl: resumeFile.path,
            resumeText,
            skillScore: score, // AI Score
            matchedSkills,     // Explainable Data
            missingSkills,     // Explainable Data
            source: source || 'direct', // Track application source!
        });

        // 4. Process Resume Upload (updates Resume model and recalculates all matches)
        await processResumeUpload(req.user.id, resumeFile.path, resumeText);

        // 5. Calculate and store match in JobCandidateMatch collection
        await calculateAndStoreMatch(jobId, req.user.id, application._id);

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get applications for a job (Ranked)
// @route   GET /api/applications/:jobId
// @access  Private/Recruiter
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify Job ownership (optional depending on strictness)
        const job = await Job.findById(jobId);
        if (!job) {
             return res.status(404).json({ message: 'Job not found' });
        }
        
        // Ensure only owner can view (good security)
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: jobId })
            .populate('candidate', 'name email')
            .sort({ skillScore: -1 }); // Descending order

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my applications (Candidate)
// @route   GET /api/applications/my
// @access  Private/Candidate
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user.id })
            .populate('job', 'title');
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { applyForJob, getJobApplications, getMyApplications };
