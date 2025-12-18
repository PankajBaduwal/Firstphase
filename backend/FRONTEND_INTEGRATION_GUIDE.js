// ============================================================
// FRONTEND INTEGRATION GUIDE
// Resume Intelligence & Skill Matching System
// ============================================================

// This file shows how to integrate the new backend endpoints
// into your existing React frontend.

// ============================================================
// 1. CANDIDATE DASHBOARD - RESUME UPLOAD
// ============================================================

// File: frontend/src/pages/CandidateDashboard.jsx
// Add this component to allow candidates to upload their resume

import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus(null);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth implementation
      
      const response = await axios.post(
        'http://localhost:5000/api/resumes/upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUploadStatus({
        type: 'success',
        message: 'Resume uploaded successfully!'
      });
      setExtractedSkills(response.data.resume.extractedSkills);
      
      // Optionally refresh application list
      // fetchMyApplications();
      
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.message || 'Upload failed'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="resume-upload-container">
      <h3>Upload Your Resume</h3>
      
      <div className="upload-section">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
        />
        
        <button 
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </div>

      {uploadStatus && (
        <div className={`status-message ${uploadStatus.type}`}>
          {uploadStatus.message}
        </div>
      )}

      {extractedSkills.length > 0 && (
        <div className="extracted-skills">
          <h4>Extracted Skills:</h4>
          <div className="skills-list">
            {extractedSkills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;


// ============================================================
// 2. RECRUITER DASHBOARD - RANKED CANDIDATES
// ============================================================

// File: frontend/src/pages/RecruiterDashboard.jsx
// This component displays ranked candidates for a specific job

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RankedCandidates = ({ jobId }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    fetchRankedCandidates();
  }, [jobId]);

  const fetchRankedCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:5000/api/matches/job/${jobId}/ranked-candidates`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setCandidates(response.data.candidates);
      setJobTitle(response.data.jobTitle);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  if (loading) {
    return <div>Loading candidates...</div>;
  }

  return (
    <div className="ranked-candidates-container">
      <h2>Candidates for: {jobTitle}</h2>
      <p className="total-count">Total Applicants: {candidates.length}</p>

      <div className="candidates-list">
        {candidates.length === 0 ? (
          <p>No candidates have applied yet.</p>
        ) : (
          candidates.map((candidate, index) => (
            <div key={candidate.candidateId} className="candidate-card">
              <div className="candidate-header">
                <div className="rank-badge">#{index + 1}</div>
                <div className="candidate-info">
                  <h3>{candidate.candidateName}</h3>
                  <p>{candidate.candidateEmail}</p>
                </div>
                <div 
                  className="match-score"
                  style={{ color: getScoreColor(candidate.matchingScore) }}
                >
                  {candidate.matchingScore}% Match
                </div>
              </div>

              <div className="skills-breakdown">
                <div className="matched-skills">
                  <h4>✓ Matched Skills</h4>
                  <div className="skills-tags">
                    {candidate.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag matched">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {candidate.missingSkills.length > 0 && (
                  <div className="missing-skills">
                    <h4>✗ Missing Skills</h4>
                    <div className="skills-tags">
                      {candidate.missingSkills.map((skill, idx) => (
                        <span key={idx} className="skill-tag missing">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="candidate-actions">
                <button onClick={() => viewResume(candidate.candidateId)}>
                  View Resume
                </button>
                <button onClick={() => shortlistCandidate(candidate.candidateId)}>
                  Shortlist
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  function viewResume(candidateId) {
    // Implement resume viewing logic
    // Could open in modal or new tab
    console.log('View resume for:', candidateId);
  }

  function shortlistCandidate(candidateId) {
    // Implement shortlisting logic
    console.log('Shortlist candidate:', candidateId);
  }
};

export default RankedCandidates;


// ============================================================
// 3. ENHANCED JOB APPLICATION (CANDIDATE)
// ============================================================

// File: frontend/src/components/JobApplicationForm.jsx
// Enhanced application form with resume upload

import React, { useState } from 'react';
import axios from 'axios';

const JobApplicationForm = ({ jobId, onSuccess }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationResult, setApplicationResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert('Please upload your resume');
      return;
    }

    setApplying(true);

    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('resume', resumeFile);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/applications/apply',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setApplicationResult({
        type: 'success',
        data: response.data
      });

      // Show match score to candidate
      alert(`Application submitted! Your match score: ${response.data.skillScore}%`);

      if (onSuccess) onSuccess();

    } catch (error) {
      setApplicationResult({
        type: 'error',
        message: error.response?.data?.message || 'Application failed'
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-application-form">
      <h3>Apply for this Job</h3>

      <div className="form-group">
        <label>Upload Resume (PDF only)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
          required
        />
      </div>

      <button type="submit" disabled={applying || !resumeFile}>
        {applying ? 'Submitting...' : 'Submit Application'}
      </button>

      {applicationResult && applicationResult.type === 'success' && (
        <div className="success-message">
          <p>✓ Application submitted successfully!</p>
          <p>Match Score: {applicationResult.data.skillScore}%</p>
          <div className="skills-info">
            <p><strong>Matched Skills:</strong> {applicationResult.data.matchedSkills.join(', ')}</p>
            {applicationResult.data.missingSkills.length > 0 && (
              <p><strong>Skills to Improve:</strong> {applicationResult.data.missingSkills.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {applicationResult && applicationResult.type === 'error' && (
        <div className="error-message">
          {applicationResult.message}
        </div>
      )}
    </form>
  );
};

export default JobApplicationForm;


// ============================================================
// 4. CSS STYLING EXAMPLES
// ============================================================

/*
File: frontend/src/styles/ResumeMatching.css

.resume-upload-container {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.upload-section {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 15px 0;
}

.upload-section button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.upload-section button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.status-message {
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.status-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.extracted-skills {
  margin-top: 20px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.skill-badge {
  padding: 6px 12px;
  background: #007bff;
  color: white;
  border-radius: 20px;
  font-size: 14px;
}

.ranked-candidates-container {
  padding: 20px;
}

.total-count {
  color: #666;
  margin-bottom: 20px;
}

.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.candidate-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.candidate-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.rank-badge {
  background: #f0f0f0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.candidate-info {
  flex: 1;
}

.candidate-info h3 {
  margin: 0 0 5px 0;
}

.candidate-info p {
  margin: 0;
  color: #666;
}

.match-score {
  font-size: 24px;
  font-weight: bold;
}

.skills-breakdown {
  margin: 15px 0;
}

.matched-skills,
.missing-skills {
  margin-bottom: 15px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.skill-tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.skill-tag.matched {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.skill-tag.missing {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.candidate-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.candidate-actions button {
  padding: 8px 16px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 5px;
  cursor: pointer;
}

.candidate-actions button:hover {
  background: #007bff;
  color: white;
}
*/


// ============================================================
// 5. AXIOS CONFIGURATION (OPTIONAL)
// ============================================================

// File: frontend/src/utils/api.js
// Centralized API configuration

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Resume API calls
export const resumeAPI = {
  upload: (formData) => api.post('/resumes/upload', formData),
  getMyResume: () => api.get('/resumes/my-resume'),
  deleteMyResume: () => api.delete('/resumes/my-resume'),
  getCandidateResume: (candidateId) => api.get(`/resumes/candidate/${candidateId}`),
};

// Match API calls
export const matchAPI = {
  getRankedCandidates: (jobId) => api.get(`/matches/job/${jobId}/ranked-candidates`),
  getMatchDetails: (jobId, candidateId) => api.get(`/matches/job/${jobId}/candidate/${candidateId}`),
  recalculateMatches: (jobId) => api.post(`/matches/job/${jobId}/recalculate`),
};

// Application API calls
export const applicationAPI = {
  apply: (formData) => api.post('/applications/apply', formData),
  getJobApplications: (jobId) => api.get(`/applications/${jobId}`),
  getMyApplications: () => api.get('/applications/my'),
};

export default api;


// ============================================================
// 6. USAGE EXAMPLES WITH CENTRALIZED API
// ============================================================

// Example 1: Upload Resume
import { resumeAPI } from '../utils/api';

const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  try {
    const response = await resumeAPI.upload(formData);
    console.log('Uploaded:', response.data);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Example 2: Get Ranked Candidates
import { matchAPI } from '../utils/api';

const showRankedCandidates = async (jobId) => {
  try {
    const response = await matchAPI.getRankedCandidates(jobId);
    console.log('Candidates:', response.data.candidates);
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
};

// Example 3: Apply to Job
import { applicationAPI } from '../utils/api';

const applyToJob = async (jobId, resumeFile) => {
  const formData = new FormData();
  formData.append('jobId', jobId);
  formData.append('resume', resumeFile);
  
  try {
    const response = await applicationAPI.apply(formData);
    console.log('Application submitted:', response.data);
    alert(`Your match score: ${response.data.skillScore}%`);
  } catch (error) {
    console.error('Application failed:', error);
  }
};


// ============================================================
// SUMMARY
// ============================================================

/*
Integration Steps:

1. Add ResumeUpload component to Candidate Dashboard
2. Add RankedCandidates component to Recruiter Dashboard
3. Update existing job application form to show match scores
4. Import and apply the provided CSS
5. (Optional) Use centralized API file for cleaner code

That's it! The backend handles all the heavy lifting:
- PDF text extraction
- Skill extraction & normalization
- Match score calculation
- Automatic updates

Your frontend just needs to:
- Send files to the backend
- Display the ranked results
- Show skills breakdown
*/
