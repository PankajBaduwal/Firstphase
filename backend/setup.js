const fs = require('fs');
const path = require('path');

/**
 * Setup Script
 * Creates necessary directories for the application
 * Run this before starting the server for the first time
 */

const directories = [
    './uploads',
    './uploads/resumes',
];

console.log('Setting up required directories...\n');

directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✓ Created: ${dir}`);
    } else {
        console.log(`✓ Already exists: ${dir}`);
    }
});

console.log('\nSetup complete!\n');
