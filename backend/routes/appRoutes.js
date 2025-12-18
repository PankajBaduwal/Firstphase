const express = require('express');
const router = express.Router();
const multer = require('multer');
const { applyForJob, getJobApplications, getMyApplications } = require('../controllers/appController');
const { protect, recruiter } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/apply', protect, upload.single('resume'), applyForJob); // Candidate
router.get('/my', protect, getMyApplications); // Candidate
router.get('/:jobId', protect, recruiter, getJobApplications); // Recruiter

module.exports = router;
