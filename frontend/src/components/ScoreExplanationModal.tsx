import React, { useState, useEffect, MouseEvent } from 'react';
import axios, { AxiosError } from 'axios';
import './ScoreExplanationModal.css';

interface ScoreExplanationModalProps {
    jobId: string;
    candidateId: string;
    candidateName: string;
    totalScore: number;
    onClose: () => void;
}

interface SkillsBreakdown {
    score: number;
    max: number;
    matchPercentage: number;
    matched: string[];
    missing: string[];
}

interface ExperienceBreakdown {
    score: number;
    max: number;
    requiredExperience: string;
    candidateExperience: string;
    status: string;
}

interface DepartmentBreakdown {
    score: number;
    max: number;
    status: string;
    jobDepartments?: string[];
}

interface DescriptionBreakdown {
    score: number;
    max: number;
    status: string;
    matchPercentage?: number;
}

interface Breakdown {
    skills: SkillsBreakdown;
    experience: ExperienceBreakdown;
    department: DepartmentBreakdown;
    description: DescriptionBreakdown;
}

interface ExplanationData {
    totalScore: number;
    explanation: string;
    breakdown: Breakdown;
}

const ScoreExplanationModal: React.FC<ScoreExplanationModalProps> = ({
    jobId,
    candidateId,
    candidateName,
    totalScore,
    onClose
}) => {
    const [explanation, setExplanation] = useState<ExplanationData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExplanation();
    }, [jobId, candidateId]);

    const fetchExplanation = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<ExplanationData>(
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

    const getScoreColor = (score: number, max: number): string => {
        const percentage = (score / max) * 100;
        if (percentage >= 80) return '#28a745';
        if (percentage >= 60) return '#ffc107';
        return '#dc3545';
    };

    const getScoreBarWidth = (score: number, max: number): string => {
        return `${(score / max) * 100}%`;
    };

    const handleOverlayClick = (): void => {
        onClose();
    };

    const handleContentClick = (e: MouseEvent<HTMLDivElement>): void => {
        e.stopPropagation();
    };

    if (loading) {
        return (
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-content" onClick={handleContentClick}>
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
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-content" onClick={handleContentClick}>
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

    if (!explanation) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content score-explanation-modal" onClick={handleContentClick}>
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
