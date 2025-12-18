const mongoose = require('mongoose');

/**
 * Resume Model
 * Stores resume data separate from applications for better organization
 * Allows candidates to maintain one resume that can be used for multiple applications
 * 
 * Benefits:
 * - Reduces redundancy (one resume for many applications)
 * - Easier to update resume and re-process all applications
 * - Better separation of concerns
 */
const resumeSchema = mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // One resume per candidate (can be updated)
    },
    resumeFileUrl: {
        type: String,
        required: true,
    },
    extractedText: {
        type: String, // Full raw text extracted from PDF
        default: '',
    },
    extractedSkills: {
        type: [String], // Normalized, deduplicated skills array
        default: [],
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Update lastUpdated on save
resumeSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
