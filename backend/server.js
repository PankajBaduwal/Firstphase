const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Ensure required directories exist
const fs = require('fs');
const resumesDir = path.join(__dirname, 'uploads', 'resumes');
if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir, { recursive: true });
    console.log('Created uploads/resumes directory');
}

const app = express();

app.use(express.json());

// CORS Configuration - Allow demo website and ATS frontend
app.use(cors({
    origin: [
        'http://localhost:5173',           // ATS frontend
        'http://localhost:8000',           // Demo website (CareerConnect)
        'http://127.0.0.1:8000',           // Demo website (alternative)
        'http://localhost:3000',           // Alternative port
    ],
    credentials: true
}));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/appRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes')); // New: Resume routes
app.use('/api/matches', require('./routes/matchRoutes')); // New: Match routes

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Force Restart Trigger 1
