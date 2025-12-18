const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const mammoth = require('mammoth');

/**
 * Enhanced Resume Parser
 * Uses Python-based PDF extraction for better quality text extraction
 * Falls back to mammoth for DOCX files
 * 
 * @param {string} filePath - Path to the resume file
 * @param {string} fileMimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text content
 */
const parseResume = async (filePath, fileMimeType) => {
    try {
        if (fileMimeType === 'application/pdf') {
            // Use Python-based PDF extraction for better accuracy
            return await extractPdfWithPython(filePath);
        } else if (
            fileMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            fileMimeType === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else {
            console.warn(`Unsupported file type: ${fileMimeType}`);
            return '';
        }
    } catch (error) {
        console.error('Error parsing resume:', error);
        return '';
    }
};

/**
 * Extracts text from PDF using Python script
 * Uses the provided pypdf-based extraction script for layout-aware extraction
 * 
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text
 */
const extractPdfWithPython = (pdfPath) => {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.join(__dirname, 'extract_pdf.py');
        
        // Spawn Python process to run the extraction script
        const pythonProcess = spawn('python', [pythonScriptPath, pdfPath]);
        
        let extractedText = '';
        let errorOutput = '';
        
        // Collect stdout (extracted text)
        pythonProcess.stdout.on('data', (data) => {
            extractedText += data.toString();
        });
        
        // Collect stderr (error messages)
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        // Handle process completion
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                // Successful extraction
                resolve(extractedText.trim());
            } else {
                // Extraction failed
                console.error('PDF extraction error:', errorOutput);
                reject(new Error(`PDF extraction failed with code ${code}: ${errorOutput}`));
            }
        });
        
        // Handle process errors (e.g., Python not found)
        pythonProcess.on('error', (error) => {
            console.error('Failed to start Python process:', error);
            reject(new Error(`Failed to start PDF extraction: ${error.message}`));
        });
    });
};

module.exports = parseResume;
