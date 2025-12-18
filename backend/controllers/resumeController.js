const Resume = require('../models/resumeModel');
const parseResume = require('../utils/resumeParser');
const { processResumeUpload, recalculateMatchesForCandidate } = require('../services/skillMatchingService');

/**
 * Resume Controller
 * Handles resume upload, retrieval, and updates
 * Integrates with skill matching service for automatic processing
 */

/**
 * @desc    Upload or update candidate's resume
 * @route   POST /api/resumes/upload
 * @access  Private/Candidate
 */
const uploadResume = async (req, res) => {
    try {
        const candidateId = req.user.id;
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({ message: 'Please upload a resume file' });
        }

        // Extract text from PDF using Python script
        const extractedText = await parseResume(resumeFile.path, resumeFile.mimetype);

        if (!extractedText) {
            return res.status(400).json({ 
                message: 'Failed to extract text from resume. Please ensure the PDF contains readable text.' 
            });
        }

        // Process resume: extract skills and update matches
        const resume = await processResumeUpload(
            candidateId,
            resumeFile.path,
            extractedText
        );

        res.status(200).json({
            message: 'Resume uploaded and processed successfully',
            resume: {
                resumeFileUrl: resume.resumeFileUrl,
                extractedSkills: resume.extractedSkills,
                uploadedAt: resume.uploadedAt,
            }
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({ 
            message: 'Failed to upload resume', 
            error: error.message 
        });
    }
};

/**
 * @desc    Get candidate's current resume
 * @route   GET /api/resumes/my-resume
 * @access  Private/Candidate
 */
const getMyResume = async (req, res) => {
    try {
        const candidateId = req.user.id;

        const resume = await Resume.findOne({ candidateId });

        if (!resume) {
            return res.status(404).json({ message: 'No resume found. Please upload a resume.' });
        }

        res.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get resume by candidate ID (for recruiters)
 * @route   GET /api/resumes/candidate/:candidateId
 * @access  Private/Recruiter
 */
const getResumeByCandidate = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const resume = await Resume.findOne({ candidateId })
            .populate('candidateId', 'name email');

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found for this candidate' });
        }

        res.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Delete candidate's resume
 * @route   DELETE /api/resumes/my-resume
 * @access  Private/Candidate
 */
const deleteMyResume = async (req, res) => {
    try {
        const candidateId = req.user.id;

        const resume = await Resume.findOneAndDelete({ candidateId });

        if (!resume) {
            return res.status(404).json({ message: 'No resume found' });
        }

        // Optionally: Delete the physical file
        const fs = require('fs');
        if (fs.existsSync(resume.resumeFileUrl)) {
            fs.unlinkSync(resume.resumeFileUrl);
        }

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadResume,
    getMyResume,
    getResumeByCandidate,
    deleteMyResume,
};
