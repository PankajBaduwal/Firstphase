# Resume Intelligence & Skill Matching API Documentation

## Overview
This document describes the API endpoints for the automated resume intelligence and skill-matching system.

## Base URL
```
http://localhost:5000/api
```

---

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Resume Endpoints

### 1. Upload Resume
Upload or update a candidate's resume.

**Endpoint:** `POST /api/resumes/upload`

**Access:** Candidate only

**Request Type:** `multipart/form-data`

**Body:**
- `resume` (file): PDF file (max 5MB)

**Success Response (200):**
```json
{
  "message": "Resume uploaded and processed successfully",
  "resume": {
    "resumeFileUrl": "uploads/resumes/resume-1234567890.pdf",
    "extractedSkills": ["javascript", "react", "node", "mongodb"],
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: No file uploaded or invalid PDF
- `500`: Server error

---

### 2. Get My Resume
Get the currently logged-in candidate's resume details.

**Endpoint:** `GET /api/resumes/my-resume`

**Access:** Candidate only

**Success Response (200):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "candidateId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "resumeFileUrl": "uploads/resumes/resume-1234567890.pdf",
  "extractedText": "Full resume text here...",
  "extractedSkills": ["javascript", "react", "node", "mongodb"],
  "uploadedAt": "2024-01-15T10:30:00.000Z",
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404`: No resume found
- `500`: Server error

---

### 3. Get Resume by Candidate ID
Get a specific candidate's resume (for recruiters).

**Endpoint:** `GET /api/resumes/candidate/:candidateId`

**Access:** Recruiter only

**URL Parameters:**
- `candidateId`: MongoDB ObjectId of the candidate

**Success Response (200):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "candidateId": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "resumeFileUrl": "uploads/resumes/resume-1234567890.pdf",
  "extractedText": "Full resume text...",
  "extractedSkills": ["javascript", "react", "node", "mongodb"],
  "uploadedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404`: Resume not found
- `500`: Server error

---

### 4. Delete My Resume
Delete the currently logged-in candidate's resume.

**Endpoint:** `DELETE /api/resumes/my-resume`

**Access:** Candidate only

**Success Response (200):**
```json
{
  "message": "Resume deleted successfully"
}
```

**Error Responses:**
- `404`: No resume found
- `500`: Server error

---

## Match Endpoints (Recruiter Dashboard Integration)

### 1. Get Ranked Candidates for Job
Get all candidates who applied to a job, ranked by matching score.

**Endpoint:** `GET /api/matches/job/:jobId/ranked-candidates`

**Access:** Recruiter only (must own the job)

**URL Parameters:**
- `jobId`: MongoDB ObjectId of the job

**Success Response (200):**
```json
{
  "jobId": "65a1b2c3d4e5f6g7h8i9j0k3",
  "jobTitle": "Full Stack Developer",
  "totalCandidates": 5,
  "candidates": [
    {
      "candidateId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "candidateName": "John Doe",
      "candidateEmail": "john@example.com",
      "matchingScore": 85,
      "matchedSkills": ["javascript", "react", "node"],
      "missingSkills": ["mongodb"],
      "appliedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "candidateId": "65a1b2c3d4e5f6g7h8i9j0k4",
      "candidateName": "Jane Smith",
      "candidateEmail": "jane@example.com",
      "matchingScore": 70,
      "matchedSkills": ["javascript", "react"],
      "missingSkills": ["node", "mongodb"],
      "appliedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401`: Not authorized (not job owner)
- `404`: Job not found
- `500`: Server error

---

### 2. Get Match Details
Get detailed match information for a specific candidate-job pair.

**Endpoint:** `GET /api/matches/job/:jobId/candidate/:candidateId`

**Access:** Recruiter only (must own the job)

**URL Parameters:**
- `jobId`: MongoDB ObjectId of the job
- `candidateId`: MongoDB ObjectId of the candidate

**Success Response (200):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
  "jobId": "65a1b2c3d4e5f6g7h8i9j0k3",
  "candidateId": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "applicationId": "65a1b2c3d4e5f6g7h8i9j0k6",
  "matchingScore": 85,
  "matchedSkills": ["javascript", "react", "node"],
  "missingSkills": ["mongodb"],
  "calculatedAt": "2024-01-15T10:35:00.000Z",
  "createdAt": "2024-01-15T10:35:00.000Z"
}
```

**Error Responses:**
- `401`: Not authorized
- `404`: Job or match not found
- `500`: Server error

---

### 3. Trigger Match Recalculation
Manually trigger recalculation of all matches for a job (useful after updating job requirements).

**Endpoint:** `POST /api/matches/job/:jobId/recalculate`

**Access:** Recruiter only (must own the job)

**URL Parameters:**
- `jobId`: MongoDB ObjectId of the job

**Success Response (200):**
```json
{
  "message": "Match recalculation completed",
  "recalculatedMatches": 5
}
```

**Error Responses:**
- `401`: Not authorized
- `404`: Job not found
- `500`: Server error

---

## Application Endpoints (Enhanced)

### Apply for Job
The existing apply endpoint has been enhanced to automatically:
1. Extract text from PDF using Python script
2. Extract skills from resume text
3. Calculate matching score
4. Update Resume model
5. Create JobCandidateMatch record

**Endpoint:** `POST /api/applications/apply`

**Access:** Candidate only

**Request Type:** `multipart/form-data`

**Body:**
- `jobId` (string): MongoDB ObjectId of the job
- `resume` (file): PDF file

**Success Response (201):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
  "job": "65a1b2c3d4e5f6g7h8i9j0k3",
  "candidate": "65a1b2c3d4e5f6g7h8i9j0k2",
  "resumeUrl": "uploads/resume-1234567890.pdf",
  "resumeText": "Full extracted text...",
  "skillScore": 85,
  "matchedSkills": ["javascript", "react", "node"],
  "missingSkills": ["mongodb"],
  "status": "received",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Skill Matching Algorithm

### Matching Score Calculation

The system uses a weighted scoring algorithm:

1. **Core Skills (70% weight)**: First 50% of required skills
2. **Secondary Skills (30% weight)**: Remaining 50% of required skills

**Formula:**
```
matchingScore = (coreMatches / totalCoreSkills) * 70 + (secondaryMatches / totalSecondarySkills) * 30
```

### Skill Normalization

The system automatically normalizes skill variations:
- "JS" → "javascript"
- "React.js" → "react"
- "Node.js" → "node"
- "Mongo" → "mongodb"

### Automatic Updates

Match scores are automatically recalculated when:
- A candidate uploads/updates their resume
- A recruiter updates job required skills
- A candidate applies to a job

---

## Database Models

### Resume Model
```javascript
{
  candidateId: ObjectId, // Reference to User
  resumeFileUrl: String,
  extractedText: String,
  extractedSkills: [String],
  uploadedAt: Date,
  lastUpdated: Date
}
```

### JobCandidateMatch Model
```javascript
{
  jobId: ObjectId, // Reference to Job
  candidateId: ObjectId, // Reference to User
  applicationId: ObjectId, // Reference to Application
  matchingScore: Number, // 0-100
  matchedSkills: [String],
  missingSkills: [String],
  calculatedAt: Date
}
```

---

## Setup Instructions

### 1. Install Python Dependencies
```bash
cd backend/utils
pip install -r requirements.txt
```

### 2. Create Required Directories
The server automatically creates required directories on startup.

### 3. Environment Variables
Ensure your `.env` file includes:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## Integration with Frontend

### Candidate Dashboard
Candidates can:
1. Upload resume via `/api/resumes/upload`
2. View their resume via `/api/resumes/my-resume`
3. Apply to jobs (automatically processes resume) via `/api/applications/apply`

### Recruiter Dashboard
Recruiters can:
1. View ranked candidates for their jobs via `/api/matches/job/:jobId/ranked-candidates`
2. See matching scores, matched skills, and missing skills
3. Click to view detailed candidate information
4. Trigger recalculation after updating job requirements

### Example Frontend Integration

**For Candidate - Upload Resume:**
```javascript
const formData = new FormData();
formData.append('resume', pdfFile);

fetch('http://localhost:5000/api/resumes/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

**For Recruiter - Get Ranked Candidates:**
```javascript
fetch(`http://localhost:5000/api/matches/job/${jobId}/ranked-candidates`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  // Display ranked candidates in UI
  data.candidates.forEach(candidate => {
    console.log(`${candidate.candidateName}: ${candidate.matchingScore}%`);
  });
});
```

---

## Error Handling

All endpoints follow consistent error response format:
```json
{
  "message": "Error description here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `401`: Unauthorized (auth error or role mismatch)
- `404`: Resource not found
- `500`: Server error

---

## Notes

1. **PDF Extraction**: Uses Python-based pypdf library for high-quality text extraction
2. **Skill Matching**: Can be easily replaced with AI/ML models later
3. **Performance**: Uses MongoDB indexes for fast queries
4. **Scalability**: Service layer allows easy horizontal scaling
5. **Clean Architecture**: Clear separation between routes, controllers, services, and models
