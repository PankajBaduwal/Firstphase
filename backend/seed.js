const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Job = require('./models/jobModel');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    await connectDB();

    try {
        await User.deleteMany();
        await Job.deleteMany();

        const users = await User.create([
            {
                name: 'John Recruiter',
                email: 'recruiter@example.com',
                password: 'password123',
                role: 'recruiter',
            },
            {
                name: 'Jane Candidate',
                email: 'jane@example.com',
                password: 'password123',
                role: 'candidate',
            },
            {
                name: 'Bob Candidate',
                email: 'bob@example.com',
                password: 'password123',
                role: 'candidate',
            }
        ]);

        const recruiter = users[0];

        const jobs = await Job.create([
            {
                title: 'Senior React Developer',
                description: 'We are looking for an expert in React.js and Frontend performance.',
                requiredSkills: ['React', 'Redux', 'JavaScript', 'CSS'],
                experience: '5+ Years',
                postedBy: recruiter._id,
            },
            {
                title: 'Backend Engineer (Node.js)',
                description: 'Build scalable APIs using Node.js and MongoDB.',
                requiredSkills: ['Node.js', 'Express', 'MongoDB', 'API'],
                experience: '3+ Years',
                postedBy: recruiter._id,
            }
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
