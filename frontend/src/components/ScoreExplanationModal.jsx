import React, { useState } from 'react';
import axios from 'axios';
import './ScoreExplanationModal.css';

/**
 * Score Explanation Modal Component
 * Displays detailed AI matching score breakdown when recruiter clicks on a score
 * 
 * Props:
 * - jobId: ID of the job
 * - candidateId: ID of the candidate
 * - candidateName: Name of the candidate
 * - totalScore: Overall matching score
 * - onClose: Function to close the modal
 */
const ScoreExplanationModal = ({ jobId, candidateId, candidateName, totalScore, onClose }) => {
    const [explanation, setExplanation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch explanation data when component mounts
    React.useEffect(() => {
        fetchExplanation();
    }, [jobId, candidateId]);

    const fetchExplanation = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/matches/job/${jobId}/candidate/${candidateId}/explanation`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setExplanation(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching explanation:', err);
            setError('Failed to load score explanation');
            setLoading(false);
        }
    };

    const getScoreColor = (score, max) => {
        const percentage = (score / max) * 100;
        if (percentage >= 80) return '#28a745';
        if (percentage >= 60) return '#ffc107';
        return '#dc3545';
    };

    const getScoreBarWidth = (score, max) => {
        return `${(score / max) * 100}%`;
    };

    if (loading) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Loading...</h2>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <p>Fetching score breakdown...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Error</h2>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <p className="error-message">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content score-explanation-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2>AI Matching Score Explanation</h2>
                        <p className="candidate-name">{candidateName}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Total Score */}
                    <div className="total-score-section">
                        <div className="score-circle" style={{ borderColor: getScoreColor(explanation.totalScore, 100) }}>
                            <span className="score-number">{explanation.totalScore}</span>
                            <span className="score-label">/ 100</span>
                        </div>
                        <div className="explanation-text">
                            <p>{explanation.explanation}</p>
                        </div>
                    </div>

                    {/* Breakdown Sections */}
                    <div className="breakdown-sections">
                        {/* Skills Breakdown */}
                        <div className="breakdown-card">
                            <div className="breakdown-header">
                                <h3>💼 Skills Match</h3>
                                <span className="score-badge" style={{ backgroundColor: getScoreColor(explanation.breakdown.skills.score, explanation.breakdown.skills.max) }}>
                                    {explanation.breakdown.skills.score} / {explanation.breakdown.skills.max}
                                </span>
                            </div>
                            <div className="score-bar">
                                <div
                                    className="score-bar-fill"
                                    style={{
                                        width: getScoreBarWidth(explanation.breakdown.skills.score, explanation.breakdown.skills.max),
                                        backgroundColor: getScoreColor(explanation.breakdown.skills.score, explanation.breakdown.skills.max)
                                    }}
                                ></div>
                            </div>
                            <div className="breakdown-details">
                                <p><strong>Match Rate:</strong> {explanation.breakdown.skills.matchPercentage}%</p>
                                {explanation.breakdown.skills.matched.length > 0 && (
                                    <div className="skills-list">
                                        <p><strong>✓ Matched Skills:</strong></p>
                                        <div className="skill-tags">
                                            {explanation.breakdown.skills.matched.map((skill, idx) => (
                                                <span key={idx} className="skill-tag matched">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {explanation.breakdown.skills.missing.length > 0 && (
                                    <div className="skills-list">
                                        <p><strong>✗ Missing Skills:</strong></p>
                                        <div className="skill-tags">
                                            {explanation.breakdown.skills.missing.map((skill, idx) => (
                                                <span key={idx} className="skill-tag missing">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Experience Breakdown */}
                        <div className="breakdown-card">
                            <div className="breakdown-header">
                                <h3>📅 Experience Match</h3>
                                <span className="score-badge" style={{ backgroundColor: getScoreColor(explanation.breakdown.experience.score, explanation.breakdown.experience.max) }}>
                                    {explanation.breakdown.experience.score} / {explanation.breakdown.experience.max}
                                </span>
                            </div>
                            <div className="score-bar">
                                <div
                                    className="score-bar-fill"
                                    style={{
                                        width: getScoreBarWidth(explanation.breakdown.experience.score, explanation.breakdown.experience.max),
                                        backgroundColor: getScoreColor(explanation.breakdown.experience.score, explanation.breakdown.experience.max)
                                    }}
                                ></div>
                            </div>
                            <div className="breakdown-details">
                                <p><strong>Required:</strong> {explanation.breakdown.experience.requiredExperience}</p>
                                <p><strong>Candidate:</strong> {explanation.breakdown.experience.candidateExperience}</p>
                                <p><strong>Status:</strong> {explanation.breakdown.experience.status}</p>
                            </div>
                        </div>

                        {/* Department Breakdown */}
                        <div className="breakdown-card">
                            <div className="breakdown-header">
                                <h3>🏢 Department Match</h3>
                                <span className="score-badge" style={{ backgroundColor: getScoreColor(explanation.breakdown.department.score, explanation.breakdown.department.max) }}>
                                    {explanation.breakdown.department.score} / {explanation.breakdown.department.max}
                                </span>
                            </div>
                            <div className="score-bar">
                                <div
                                    className="score-bar-fill"
                                    style={{
                                        width: getScoreBarWidth(explanation.breakdown.department.score, explanation.breakdown.department.max),
                                        backgroundColor: getScoreColor(explanation.breakdown.department.score, explanation.breakdown.department.max)
                                    }}
                                ></div>
                            </div>
                            <div className="breakdown-details">
                                <p><strong>Status:</strong> {explanation.breakdown.department.status}</p>
                                {explanation.breakdown.department.jobDepartments && explanation.breakdown.department.jobDepartments.length > 0 && (
                                    <p><strong>Relevant Domains:</strong> {explanation.breakdown.department.jobDepartments.join(', ')}</p>
                                )}
                            </div>
                        </div>

                        {/* Description Breakdown */}
                        <div className="breakdown-card">
                            <div className="breakdown-header">
                                <h3>📝 Description Match</h3>
                                <span className="score-badge" style={{ backgroundColor: getScoreColor(explanation.breakdown.description.score, explanation.breakdown.description.max) }}>
                                    {explanation.breakdown.description.score} / {explanation.breakdown.description.max}
                                </span>
                            </div>
                            <div className="score-bar">
                                <div
                                    className="score-bar-fill"
                                    style={{
                                        width: getScoreBarWidth(explanation.breakdown.description.score, explanation.breakdown.description.max),
                                        backgroundColor: getScoreColor(explanation.breakdown.description.score, explanation.breakdown.description.max)
                                    }}
                                ></div>
                            </div>
                            <div className="breakdown-details">
                                <p><strong>Status:</strong> {explanation.breakdown.description.status}</p>
                                {explanation.breakdown.description.matchPercentage !== undefined && (
                                    <p><strong>Keyword Match:</strong> {explanation.breakdown.description.matchPercentage}%</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn-close" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ScoreExplanationModal;
