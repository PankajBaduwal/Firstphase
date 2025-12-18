import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './JobApplicants.css';
import ScoreExplanationModal from '../components/ScoreExplanationModal';

const JobApplicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                };
                const res = await axios.get(`/api/applications/${jobId}`, config);
                setApplicants(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching applicants');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]);

    const handleViewResume = (resumeUrl) => {
        if (!resumeUrl) {
            alert('Resume not found');
            return;
        }
        // Normalize path: replace backslashes with forward slashes
        const normalizedPath = resumeUrl.replace(/\\/g, '/');
        // Check if path already starts with /uploads (it likely does from backend)
        // If it contains "uploads/", we want to ensure we are requesting "/uploads/..."
        // The backend saves exact path, usually "uploads\filename.pdf" or "uploads/filename.pdf"

        // Let's assume the path from backend is like "uploads\1765955620546-resume.pdf"
        // We want to open "http://localhost:5173/uploads/1765955620546-resume.pdf"
        // Since we have a proxy for /uploads, we just need "/uploads/..."

        // Simple normalization
        let finalPath = normalizedPath;
        if (!finalPath.startsWith('/')) {
            finalPath = '/' + finalPath;
        }
        // If path doesn't start with /uploads but contains it (e.g. "some/path/uploads/file.pdf"), that might be tricky, 
        // but standard multer config saves relative to root or absolute.
        // Based on server.js: app.use('/uploads', ...) matches /uploads url prefix to uploads dir.
        // The saved path in DB is likely "uploads\filename".

        window.open(finalPath, '_blank');
    };

    if (loading) return <div className="loader">Loading applicants...</div>;
    if (error)
        return (
            <div className="error-page">
                {error}
                <br />
                <Link to="/recruiter/dashboard">← Back to Dashboard</Link>
            </div>
        );

    return (
        <div className="applicants-page">
            <Link to="/recruiter/dashboard" className="back-link">
                ← Back to Dashboard
            </Link>

            <h2>Job Applicants</h2>
            <p className="subtitle">Ranked by AI Match Score</p>

            {applicants.length === 0 ? (
                <p className="empty-text">No applicants yet.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="applicants-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>AI Match</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applicants.map((app, index) => (
                                <tr key={app._id} className={index === 0 ? 'top-rank' : ''}>
                                    <td className="rank">#{index + 1}</td>
                                    <td>{app.candidate.name}</td>
                                    <td>{app.candidate.email}</td>

                                    <td>
                                        <div
                                            className="score-wrapper clickable"
                                            onClick={() => {
                                                setSelectedCandidate({
                                                    candidateId: app.candidate._id,
                                                    candidateName: app.candidate.name,
                                                    matchingScore: app.skillScore
                                                });
                                                setShowExplanation(true);
                                            }}
                                            title="Click to see detailed score breakdown"
                                        >
                                            <div className="score-bar">
                                                <div
                                                    className={`score-fill ${app.skillScore > 70
                                                        ? 'high'
                                                        : app.skillScore > 40
                                                            ? 'medium'
                                                            : 'low'
                                                        }`}
                                                    style={{ width: `${app.skillScore}%` }}
                                                />
                                            </div>
                                            <span className="score-text">{app.skillScore}% ℹ️</span>

                                            {/* Tooltip for Skill Detail */}
                                            <div className="skill-tooltip">
                                                {app.matchedSkills?.length > 0 && (
                                                    <div className="tooltip-section">
                                                        <strong>Matched:</strong>
                                                        <span className="success">{app.matchedSkills.join(', ')}</span>
                                                    </div>
                                                )}
                                                {app.missingSkills?.length > 0 && (
                                                    <div className="tooltip-section">
                                                        <strong>Missing:</strong>
                                                        <span className="error">{app.missingSkills.join(', ')}</span>
                                                    </div>
                                                )}
                                                <div className="tooltip-hint">
                                                    <small>Click for detailed breakdown</small>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={`status ${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="btn outline-btn"
                                            onClick={() => handleViewResume(app.resumeUrl)}
                                        >
                                            View Resume
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Score Explanation Modal */}
            {showExplanation && selectedCandidate && (
                <ScoreExplanationModal
                    jobId={jobId}
                    candidateId={selectedCandidate.candidateId}
                    candidateName={selectedCandidate.candidateName}
                    totalScore={selectedCandidate.matchingScore}
                    onClose={() => {
                        setShowExplanation(false);
                        setSelectedCandidate(null);
                    }}
                />
            )}
        </div>
    );
};

export default JobApplicants;
