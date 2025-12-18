const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

console.log('Loading authRoutes...');
try {
    const authRoutes = require('./routes/authRoutes');
    console.log('authRoutes type:', typeof authRoutes);
    console.log('authRoutes stack length:', authRoutes.stack ? authRoutes.stack.length : 'undefined');
    
    app.use('/api/auth', authRoutes);
    console.log('Mounted /api/auth');
} catch (error) {
    console.error('Failed to load authRoutes:', error);
}

// 404 Handler for debug
app.use((req, res, next) => {
    console.log(`404 Hit: ${req.method} ${req.url}`);
    res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Debug Server running on port ${PORT}`);
});
