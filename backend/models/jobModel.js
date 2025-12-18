const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requiredSkills: {
        type: [String], // Array of strings e.g., ['React', 'Node.js']
        required: true,
    },
    experience: {
        type: String, // e.g., "2-5 years"
        required: true,
    },
    department: {
        type: String, // e.g., "Engineering", "Software Development", "Data Science"
        required: false, // Optional field
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
