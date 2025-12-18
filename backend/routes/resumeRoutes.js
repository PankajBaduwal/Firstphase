const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, candidateOnly, recruiterOnly } = require('../middleware/authMiddleware');
const {
    uploadResume,
    getMyResume,
    getResumeByCandidate,
    deleteMyResume,
} = require('../controllers/resumeController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Candidate routes
router.post('/upload', protect, candidateOnly, upload.single('resume'), uploadResume);
router.get('/my-resume', protect, candidateOnly, getMyResume);
router.delete('/my-resume', protect, candidateOnly, deleteMyResume);

// Recruiter routes
router.get('/candidate/:candidateId', protect, recruiterOnly, getResumeByCandidate);

module.exports = router;
