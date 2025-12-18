const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resumeUrl: {
        type: String, // Path to file
        required: true,
    },
    resumeText: {
        type: String, // Extracted Text
    },
    skillScore: {
        type: Number, // 0-100
        default: 0,
    },
    matchedSkills: {
        type: [String],
        default: [],
    },
    missingSkills: {
        type: [String],
        default: [],
    },
    status: {
        type: String, // e.g., 'received', 'shortlisted', 'rejected'
        default: 'received',
    },
    source: {
        type: String, // Track where application came from: 'direct', 'careerconnect-demo', 'linkedin', etc.
        default: 'direct',
    },
}, {
    timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
