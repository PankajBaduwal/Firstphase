const Job = require('../models/jobModel');

// @desc    Create a job
// @route   POST /api/jobs/create
// @access  Private/Recruiter
const createJob = async (req, res) => {
    const { title, description, requiredSkills, experience } = req.body;

    if (!title || !description || !requiredSkills || !experience) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const job = await Job.create({
        title,
        description,
        requiredSkills, // Expecting array or comma-separated string?
        // If frontend sends array, good. If string, we split. 
        // For now assume standard JSON array.
        experience,
        postedBy: req.user.id,
    });

    res.status(201).json(job);
};

// @desc    Get all jobs
// @route   GET /api/jobs/all
// @access  Public
const getJobs = async (req, res) => {
    const jobs = await Job.find({}).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(jobs);
};

// @desc    Get public jobs for external job boards
// @route   GET /api/jobs/public
// @access  Public (no auth required)
const getPublicJobs = async (req, res) => {
    try {
        const jobs = await Job.find({})
            .select('_id title description requiredSkills experience department createdAt')
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(50);
        
        // Transform data for external boards
        const publicJobs = jobs.map(job => ({
            _id: job._id,
            title: job.title,
            company: job.postedBy?.name || 'Company Name',
            location: 'Remote', // Add location field to Job model if needed
            shortDescription: job.description?.substring(0, 200) + '...',
            department: job.department,
            experience: job.experience,
            requiredSkills: job.requiredSkills,
            postedDate: job.createdAt
        }));
        
        res.json(publicJobs);
    } catch (error) {
        console.error('Error fetching public jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
};

module.exports = { createJob, getJobs, getPublicJobs };
