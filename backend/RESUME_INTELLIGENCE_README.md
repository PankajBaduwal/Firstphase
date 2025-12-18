# Resume Intelligence & Skill Matching System

## Overview

This is a production-ready automated resume intelligence and skill-matching system for your hiring platform. It automatically extracts skills from candidate resumes, matches them against job requirements, and ranks candidates by compatibility.

## Features

✅ **Automatic PDF Text Extraction** - Uses Python-based pypdf for high-quality text extraction

✅ **Intelligent Skill Extraction** - Identifies and normalizes technical/professional skills

✅ **Smart Skill Matching** - Weighted algorithm comparing resume skills vs. job requirements

✅ **Candidate Ranking** - Automatic ranking by matching score (0-100)

✅ **Real-time Updates** - Match scores recalculate when resumes or job requirements change

✅ **Clean Architecture** - Modular code with clear separation of concerns

✅ **Production Ready** - Error handling, validation, and security built-in

---

## Architecture

```
backend/
├── models/
│   ├── resumeModel.js              # Resume storage model
│   ├── jobCandidateMatchModel.js   # Match results storage
│   ├── applicationModel.js         # (Existing) Application model
│   └── ...
├── controllers/
│   ├── resumeController.js         # Resume upload/retrieval
│   ├── matchController.js          # Recruiter match queries
│   └── appController.js            # (Enhanced) Application logic
├── services/
│   └── skillMatchingService.js     # Core matching business logic
├── utils/
│   ├── extract_pdf.py              # Python PDF extraction script
│   ├── resumeParser.js             # Resume text extraction
│   ├── aiSkillMatcher.js           # Skill extraction & matching
│   └── requirements.txt            # Python dependencies
└── routes/
    ├── resumeRoutes.js             # Resume endpoints
    ├── matchRoutes.js              # Match endpoints
    └── ...
```

---

## Installation & Setup

### 1. Install Python Dependencies

```bash
cd backend/utils
pip install -r requirements.txt
```

This installs `pypdf==5.1.0` for PDF text extraction.

### 2. Verify Python Installation

Make sure Python 3 is available in your PATH:

```bash
python --version
```

If you're on a system where Python 3 is called `python3`, update the spawn command in `resumeParser.js`:

```javascript
const pythonProcess = spawn('python3', [pythonScriptPath, pdfPath]);
```

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will automatically create the required `uploads/resumes/` directory.

---

## How It Works

### 1. Resume Upload Flow

```
Candidate uploads PDF
    ↓
Python script extracts text (layout-aware)
    ↓
AI extractor identifies skills
    ↓
Skills normalized (e.g., "JS" → "javascript")
    ↓
Resume model updated with extracted data
    ↓
All existing job matches recalculated
```

### 2. Job Application Flow

```
Candidate applies to job
    ↓
Resume processed (if not already)
    ↓
Job requirements fetched
    ↓
Matching score calculated (0-100)
    ↓
JobCandidateMatch record created
    ↓
Application created with score data
```

### 3. Recruiter Dashboard Flow

```
Recruiter opens job dashboard
    ↓
Fetch ranked candidates for job
    ↓
Display candidates sorted by score
    ↓
Show matched/missing skills
```

---

## Skill Matching Algorithm

### Score Calculation

The algorithm uses **weighted matching**:

- **Core Skills (70% weight)**: First 50% of job requirements (most critical)
- **Secondary Skills (30% weight)**: Remaining 50% (nice-to-have)

**Example:**

Job requires: `["JavaScript", "React", "Node.js", "MongoDB"]`

- Core: `["JavaScript", "React"]` (70% weight)
- Secondary: `["Node.js", "MongoDB"]` (30% weight)

Candidate has: `["JavaScript", "React", "Node.js"]`

**Calculation:**
```
Core Matches: 2/2 = 100%
Secondary Matches: 1/2 = 50%
Final Score: (100% * 70) + (50% * 30) = 70 + 15 = 85%
```

### Skill Normalization

The system automatically handles variations:

| Input | Normalized |
|-------|-----------|
| JS, javascript, ECMAScript | javascript |
| React.js, ReactJS | react |
| Node.js, NodeJS | node |
| Mongo, MongoDB | mongodb |
| HTML5 | html |
| CSS3, SCSS, Tailwind | css |

---

## API Endpoints

### Resume Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/resumes/upload` | Candidate | Upload/update resume |
| GET | `/api/resumes/my-resume` | Candidate | Get own resume |
| DELETE | `/api/resumes/my-resume` | Candidate | Delete own resume |
| GET | `/api/resumes/candidate/:id` | Recruiter | Get candidate's resume |

### Match Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/matches/job/:jobId/ranked-candidates` | Recruiter | Get ranked candidates |
| GET | `/api/matches/job/:jobId/candidate/:candidateId` | Recruiter | Get match details |
| POST | `/api/matches/job/:jobId/recalculate` | Recruiter | Recalculate all matches |

See **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** for detailed endpoint specs.

---

## Database Models

### Resume

Stores candidate resume data (one per candidate):

```javascript
{
  candidateId: ObjectId,        // Reference to User
  resumeFileUrl: String,         // Path to PDF file
  extractedText: String,         // Full extracted text
  extractedSkills: [String],     // Normalized skills array
  uploadedAt: Date,
  lastUpdated: Date
}
```

### JobCandidateMatch

Stores match results (one per job-candidate pair):

```javascript
{
  jobId: ObjectId,               // Reference to Job
  candidateId: ObjectId,         // Reference to User
  applicationId: ObjectId,       // Optional: Reference to Application
  matchingScore: Number,         // 0-100
  matchedSkills: [String],       // Skills found in both
  missingSkills: [String],       // Required skills not found
  calculatedAt: Date
}
```

**Indexes for Performance:**
- `{ jobId: 1, matchingScore: -1 }` - Fast ranked queries
- `{ jobId: 1, candidateId: 1 }` - Unique constraint

---

## Integration with Frontend

### For Candidate Dashboard

**Upload Resume:**
```javascript
const uploadResume = async (pdfFile) => {
  const formData = new FormData();
  formData.append('resume', pdfFile);
  
  const response = await fetch('http://localhost:5000/api/resumes/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  const data = await response.json();
  console.log('Extracted skills:', data.resume.extractedSkills);
};
```

### For Recruiter Dashboard

**Get Ranked Candidates:**
```javascript
const getRankedCandidates = async (jobId) => {
  const response = await fetch(
    `http://localhost:5000/api/matches/job/${jobId}/ranked-candidates`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const data = await response.json();
  
  // Render candidates sorted by matching score
  data.candidates.forEach(candidate => {
    renderCandidateCard({
      name: candidate.candidateName,
      email: candidate.candidateEmail,
      score: candidate.matchingScore,
      matchedSkills: candidate.matchedSkills,
      missingSkills: candidate.missingSkills
    });
  });
};
```

**Example UI Display:**
```
┌────────────────────────────────────────────────┐
│ John Doe (john@example.com)                    │
│ Match Score: 85%                               │
│                                                │
│ ✓ Matched Skills:                             │
│   • JavaScript • React • Node.js              │
│                                                │
│ ✗ Missing Skills:                             │
│   • MongoDB                                    │
└────────────────────────────────────────────────┘
```

---

## Automatic Match Recalculation

The system automatically recalculates match scores in these scenarios:

### 1. When Candidate Updates Resume
```
Candidate uploads new resume
    ↓
processResumeUpload() called
    ↓
recalculateMatchesForCandidate() triggered
    ↓
All job applications by this candidate updated
```

### 2. When Recruiter Updates Job Requirements
```
Recruiter updates job.requiredSkills
    ↓
recalculateMatchesForJob() triggered
    ↓
All candidate matches for this job updated
```

### 3. Manual Trigger
Recruiters can manually trigger recalculation via:
```
POST /api/matches/job/:jobId/recalculate
```

---

## Error Handling

All endpoints include comprehensive error handling:

**Resume Upload Errors:**
- Invalid file type (non-PDF)
- PDF text extraction failure
- File size exceeded (5MB limit)
- Python process failure

**Match Query Errors:**
- Unauthorized access (wrong role)
- Job not found
- No candidates applied yet

**All errors return:**
```json
{
  "message": "Descriptive error message"
}
```

---

## Security Features

✅ **Role-based Access Control** - Candidates and recruiters have separate permissions

✅ **Job Ownership Verification** - Recruiters can only view candidates for their own jobs

✅ **File Type Validation** - Only PDF files accepted

✅ **File Size Limits** - 5MB max per resume

✅ **JWT Authentication** - All endpoints protected

---

## Performance Optimizations

🚀 **MongoDB Indexes** - Fast queries on jobId + matchingScore

🚀 **Upsert Operations** - Atomic create-or-update for matches

🚀 **Lean Queries** - Returns plain JavaScript objects for better performance

🚀 **Service Layer** - Business logic cached and reusable

---

## Testing the System

### 1. Upload a Resume (Candidate)

```bash
curl -X POST http://localhost:5000/api/resumes/upload \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN" \
  -F "resume=@sample-resume.pdf"
```

### 2. Apply to a Job (Candidate)

```bash
curl -X POST http://localhost:5000/api/applications/apply \
  -H "Authorization: Bearer YOUR_CANDIDATE_TOKEN" \
  -F "jobId=JOB_ID_HERE" \
  -F "resume=@sample-resume.pdf"
```

### 3. Get Ranked Candidates (Recruiter)

```bash
curl http://localhost:5000/api/matches/job/JOB_ID/ranked-candidates \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

---

## Future Enhancements (Easy to Add)

Since the code is modular, you can easily:

1. **Replace skill extraction with AI**:
   - Swap `extractSkillsAI()` with an OpenAI/Gemini API call
   - No changes needed elsewhere

2. **Add more skill ontology**:
   - Update `skillOntology` object in `aiSkillMatcher.js`
   - Instantly recognized across the system

3. **Customize matching algorithm**:
   - Modify `generateMatchScoreAI()` weights
   - Add additional factors (experience, education, etc.)

4. **Add resume parsing for DOCX**:
   - Already supported via mammoth library
   - Just allow DOCX in file filter

5. **Store resumes in cloud (S3, etc.)**:
   - Update `resumeController.js` to upload to cloud
   - Change `resumeFileUrl` to cloud URL

---

## Troubleshooting

### Python Script Not Found

**Error:** `Failed to start PDF extraction`

**Solution:** Ensure Python is in PATH and pypdf is installed:
```bash
cd backend/utils
pip install pypdf
```

### Empty Extracted Text

**Error:** `Failed to extract text from resume`

**Solution:** PDF might be image-based (scanned). Consider adding OCR (tesseract) for such cases.

### No Skills Extracted

**Issue:** Resume has skills but none extracted

**Solution:** Check if skills are in the ontology. Add missing skills to `skillOntology` in `aiSkillMatcher.js`.

---

## Code Quality

✅ **Clean Code** - Descriptive variable names, clear function purposes

✅ **Comments** - Inline documentation explaining logic

✅ **Modularity** - DRY principle, reusable functions

✅ **Error Handling** - Try-catch blocks, meaningful error messages

✅ **Standards** - Follows Node.js best practices

---

## Summary

This system provides:

1. ✅ Resume upload & PDF text extraction
2. ✅ Automatic skill extraction & normalization
3. ✅ Smart skill matching algorithm
4. ✅ Candidate ranking by compatibility
5. ✅ Real-time match updates
6. ✅ Clean recruiter dashboard integration
7. ✅ Production-ready code quality

**All implemented without modifying your existing authentication, dashboards, or job posting logic!**

---

## Contact & Support

For questions or issues:
1. Check `API_DOCUMENTATION.md` for endpoint details
2. Review inline code comments
3. Test endpoints with Postman/curl

Happy hiring! 🚀
