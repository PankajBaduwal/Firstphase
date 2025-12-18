/**
 * Test Script for AI Score Explanation Feature
 * 
 * This script helps you test the new endpoint
 * Run this in your browser console or as a Node.js script
 */

// ============================================
// BROWSER CONSOLE TEST
// ============================================

// 1. First, log in as a recruiter and get your token
// 2. Open browser console (F12)
// 3. Copy and paste this code:

async function testScoreExplanation() {
  // Replace these with actual IDs from your database
  const jobId = 'YOUR_JOB_ID_HERE';
  const candidateId = 'YOUR_CANDIDATE_ID_HERE';
  const token = localStorage.getItem('token'); // Or however you store it

  try {
    const response = await fetch(
      `http://localhost:5000/api/matches/job/${jobId}/candidate/${candidateId}/explanation`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    
    console.log('✅ Success! Score Explanation:');
    console.log('Total Score:', data.totalScore);
    console.log('Breakdown:', data.breakdown);
    console.log('Explanation:', data.explanation);
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
// testScoreExplanation();


// ============================================
// CURL COMMAND TEST
// ============================================

/*
# Replace JOB_ID, CANDIDATE_ID, and TOKEN with actual values

curl -X GET \
  http://localhost:5000/api/matches/job/JOB_ID/candidate/CANDIDATE_ID/explanation \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Expected Response:
{
  "totalScore": 82,
  "breakdown": {
    "skills": {
      "score": 40,
      "max": 50,
      "matched": ["javascript", "react", "node"],
      "missing": ["mongodb"],
      "matchPercentage": 80
    },
    "experience": {
      "score": 15,
      "max": 20,
      "candidateExperience": "3 years",
      "requiredExperience": "2-5 years",
      "status": "Meets requirement"
    },
    "department": {
      "score": 10,
      "max": 10,
      "status": "Matched",
      "matched": true
    },
    "description": {
      "score": 17,
      "max": 20,
      "keywordMatches": 8,
      "totalKeywords": 10,
      "matchPercentage": 80
    }
  },
  "explanation": "This candidate is an excellent match for the role..."
}
*/


// ============================================
// POSTMAN TEST
// ============================================

/*
Method: GET
URL: http://localhost:5000/api/matches/job/{jobId}/candidate/{candidateId}/explanation

Headers:
- Authorization: Bearer YOUR_TOKEN
- Content-Type: application/json

Replace {jobId} and {candidateId} with actual IDs
*/


// ============================================
// REACT COMPONENT TEST
// ============================================

/*
// Add this to any component to test the modal:

import React, { useState } from 'react';
import ScoreExplanationModal from '../components/ScoreExplanationModal';

function TestScoreModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Test Score Explanation
      </button>

      {showModal && (
        <ScoreExplanationModal
          jobId="YOUR_JOB_ID"
          candidateId="YOUR_CANDIDATE_ID"
          candidateName="Test Candidate"
          totalScore={82}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default TestScoreModal;
*/


// ============================================
// VERIFICATION CHECKLIST
// ============================================

/*
✅ Backend Checklist:
- [ ] Server is running (npm run dev)
- [ ] No errors in terminal
- [ ] Route registered in matchRoutes.js
- [ ] Controller method exists
- [ ] Service file created

✅ Frontend Checklist:
- [ ] ScoreExplanationModal.jsx exists
- [ ] ScoreExplanationModal.css exists
- [ ] Component imports correctly
- [ ] No console errors

✅ Integration Checklist:
- [ ] Modal imported in recruiter dashboard
- [ ] State variables added
- [ ] onClick handler on score
- [ ] Modal renders conditionally
- [ ] Props passed correctly

✅ Testing Checklist:
- [ ] API endpoint returns 200
- [ ] Response has correct structure
- [ ] Modal opens when score clicked
- [ ] Breakdown displays correctly
- [ ] Modal closes properly
*/


// ============================================
// COMMON ISSUES & SOLUTIONS
// ============================================

/*
Issue: "Application not found"
Solution: Make sure the candidate has actually applied to the job

Issue: "Not authorized"
Solution: Ensure you're logged in as recruiter who owns the job

Issue: Modal doesn't open
Solution: Check browser console for errors, verify state is updating

Issue: Breakdown shows zeros
Solution: Check if resume was processed and skills were extracted

Issue: CORS error
Solution: Ensure backend CORS is configured for frontend URL
*/


// ============================================
// SAMPLE DATA FOR TESTING
// ============================================

const sampleExplanationResponse = {
  totalScore: 82,
  breakdown: {
    skills: {
      score: 40,
      max: 50,
      matched: ['javascript', 'react', 'node', 'html', 'css'],
      missing: ['mongodb', 'docker'],
      matchPercentage: 71
    },
    experience: {
      score: 18,
      max: 20,
      candidateExperience: '4 years',
      requiredExperience: '3-5 years',
      status: 'Meets or exceeds requirement'
    },
    department: {
      score: 8,
      max: 10,
      jobDepartments: ['software', 'engineering'],
      candidateDepartments: ['software'],
      status: 'Matched',
      matched: true
    },
    description: {
      score: 16,
      max: 20,
      keywordMatches: 8,
      totalKeywords: 10,
      matchPercentage: 80,
      status: '8 of 10 keywords matched'
    }
  },
  explanation: 'This candidate is an excellent match for the role. They possess most of the required technical skills. Their experience level aligns well with the requirements. They have relevant domain experience. Their background strongly aligns with the job description.'
};

console.log('Sample response structure:', sampleExplanationResponse);


// ============================================
// HOW TO GET JOB_ID AND CANDIDATE_ID
// ============================================

/*
Option 1: From MongoDB Compass
- Open your database
- Look in the 'applications' collection
- Copy the 'job' and 'candidate' ObjectIds

Option 2: From Browser Network Tab
- Open recruiter dashboard
- Open Network tab (F12)
- Click on a candidate
- Look at the API calls
- Copy IDs from the URL

Option 3: From Backend Logs
- Add console.log in your code
- Log jobId and candidateId
- Copy from terminal output

Option 4: Create Test Data
- Use your seed script
- Or manually create a test job and application
- Note down the IDs
*/


module.exports = {
  testScoreExplanation,
  sampleExplanationResponse
};
