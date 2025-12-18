/**
 * AI SCORE EXPLANATION FEATURE - INTEGRATION GUIDE
 * 
 * This guide shows how to integrate the ScoreExplanationModal
 * into your existing recruiter dashboard/candidate list.
 */

import React, { useState } from 'react';
import ScoreExplanationModal from '../components/ScoreExplanationModal';

interface Candidate {
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    matchingScore: number;
    matchedSkills: string[];
}

interface CandidateListProps {
    jobId: string;
    candidates: Candidate[];
}

/**
 * EXAMPLE 1: Simple Integration in Candidate List
 * 
 * Add this to your existing recruiter dashboard where you display candidates
 */

const CandidateListWithExplanation: React.FC<CandidateListProps> = ({ jobId, candidates }) => {
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleScoreClick = (candidate: Candidate): void => {
        setSelectedCandidate(candidate);
        setShowModal(true);
    };

    const closeModal = (): void => {
        setShowModal(false);
        setSelectedCandidate(null);
    };

    return (
        <div className="candidates-list">
            {candidates.map((candidate) => (
                <div key={candidate.candidateId} className="candidate-card">
                    <div className="candidate-info">
                        <h3>{candidate.candidateName}</h3>
                        <p>{candidate.candidateEmail}</p>
                    </div>

                    {/* CLICKABLE SCORE - This is the key integration point */}
                    <div
                        className="match-score clickable"
                        onClick={() => handleScoreClick(candidate)}
                        style={{ cursor: 'pointer' }}
                        title="Click to see score breakdown"
                    >
                        <span className="score-number">{candidate.matchingScore}%</span>
                        <span className="score-label">Match</span>
                        <span className="info-icon">ℹ️</span>
                    </div>

                    {/* Other candidate details */}
                    <div className="skills-preview">
                        <p>Matched: {candidate.matchedSkills.join(', ')}</p>
                    </div>
                </div>
            ))}

            {/* MODAL - Render when score is clicked */}
            {showModal && selectedCandidate && (
                <ScoreExplanationModal
                    jobId={jobId}
                    candidateId={selectedCandidate.candidateId}
                    candidateName={selectedCandidate.candidateName}
                    totalScore={selectedCandidate.matchingScore}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

/**
 * EXAMPLE 2: Integration with Existing JobApplicants Component
 * 
 * If you have a component like JobApplicants.jsx, modify it like this:
 */

// In your JobApplicants.tsx file:
/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScoreExplanationModal from '../components/ScoreExplanationModal';

interface Applicant {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  matchingScore: number;
}

const JobApplicants: React.FC<{ jobId: string }> = ({ jobId }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ candidates: Applicant[] }>(
        `http://localhost:5000/api/matches/job/${jobId}/ranked-candidates`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setApplicants(response.data.candidates);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  // Handler for score click
  const handleScoreClick = (candidate: Applicant): void => {
    setSelectedCandidate(candidate);
    setShowExplanation(true);
  };

  return (
    <div>
      <h2>Applicants</h2>
      
      <table className="applicants-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>AI Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant.candidateId}>
              <td>{applicant.candidateName}</td>
              <td>{applicant.candidateEmail}</td>
              <td>
                <span 
                  className="score-badge clickable"
                  onClick={() => handleScoreClick(applicant)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {applicant.matchingScore}% 
                  <span style={{ marginLeft: '4px' }}>ℹ️</span>
                </span>
              </td>
              <td>
                <button>View Resume</button>
                <button>Shortlist</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showExplanation && selectedCandidate && (
        <ScoreExplanationModal
          jobId={jobId}
          candidateId={selectedCandidate.candidateId}
          candidateName={selectedCandidate.candidateName}
          totalScore={selectedCandidate.matchingScore}
          onClose={() => setShowExplanation(false)}
        />
      )}
    </div>
  );
};

export default JobApplicants;
*/

/**
 * EXAMPLE 3: Minimal CSS for Clickable Score
 * 
 * Add this to your existing CSS file to make the score look clickable:
 */

const exampleCSS = `
.match-score.clickable {
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px 12px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.match-score.clickable:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.info-icon {
  font-size: 14px;
  opacity: 0.7;
}

.score-badge.clickable {
  position: relative;
  padding: 6px 12px;
  border-radius: 4px;
  background: #007bff;
  color: white;
  font-weight: 600;
  transition: background 0.2s;
}

.score-badge.clickable:hover {
  background: #0056b3;
}
`;

/**
 * STEP-BY-STEP INTEGRATION CHECKLIST
 * 
 * 1. ✅ Import ScoreExplanationModal component
 * 2. ✅ Add state for modal visibility and selected candidate
 * 3. ✅ Make the score clickable (add onClick handler)
 * 4. ✅ Render modal conditionally when score is clicked
 * 5. ✅ Pass required props: jobId, candidateId, candidateName, totalScore, onClose
 * 6. ✅ Add CSS to make score look clickable (optional but recommended)
 * 
 * That's it! No changes to backend scoring logic or authentication.
 */

/**
 * API ENDPOINT REFERENCE
 * 
 * The modal automatically calls this endpoint:
 * GET /api/matches/job/:jobId/candidate/:candidateId/explanation
 * 
 * Response format:
 * {
 *   totalScore: 82,
 *   breakdown: {
 *     skills: { score: 40, max: 50, matched: [...], missing: [...], matchPercentage: 80 },
 *     experience: { score: 15, max: 20, candidateExperience: "3 years", requiredExperience: "2-5 years", status: "Meets requirement" },
 *     department: { score: 10, max: 10, status: "Matched", matched: true },
 *     description: { score: 17, max: 20, keywordMatches: 8, totalKeywords: 10, matchPercentage: 80 }
 *   },
 *   explanation: "This candidate is an excellent match for the role. They possess most of the required technical skills..."
 * }
 */

export default CandidateListWithExplanation;
