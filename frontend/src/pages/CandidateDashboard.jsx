import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './CandidateDashboard.css';

const CandidateDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [message, setMessage] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchJobs();
        fetchMyApplications();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('/api/jobs/all');
            setJobs(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            };
            const res = await axios.get('/api/applications/my', config);
            setMyApplications(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!resume || !selectedJob) return;

        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('jobId', selectedJob._id);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            };
            await axios.post('/api/applications/apply', formData, config);
            setMessage('Application submitted successfully!');
            fetchMyApplications();
            setSelectedJob(null);
            setResume(null);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error applying');
        }
    };

    const isApplied = (jobId) => {
        return myApplications.some(
            (app) => app.job._id === jobId || app.job === jobId
        );
    };

    return (
        <div className="candidate-dashboard">
            <h2>Welcome, {user?.name} 👋</h2>

            <div className="dashboard-grid">
                {/* Jobs */}
                <div>
                    <h3>Open Positions</h3>

                    {jobs.length === 0 ? (
                        <p className="empty-text">No jobs available.</p>
                    ) : (
                        jobs.map((job) => (
                            <div key={job._id} className="job-card">
                                <div className="job-header">
                                    <h4>{job.title}</h4>
                                    {isApplied(job._id) && (
                                        <span className="applied-badge">Applied</span>
                                    )}
                                </div>

                                <p className="job-exp">
                                    <strong>Experience:</strong> {job.experience}
                                </p>

                                <p className="job-desc">{job.description}</p>

                                <p className="job-skills">
                                    <strong>Skills:</strong> {job.requiredSkills.join(', ')}
                                </p>

                                {!isApplied(job._id) && (
                                    <button
                                        className="btn primary-btn"
                                        onClick={() => {
                                            setSelectedJob(job);
                                            setMessage('');
                                        }}
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Applications */}
                <div>
                    <h3>My Applications</h3>

                    {myApplications.length === 0 ? (
                        <p className="empty-text">No applications yet.</p>
                    ) : (
                        myApplications.map((app) => (
                            <div key={app._id} className="application-card">
                                <h4>{app.job.title}</h4>
                                <p>
                                    Status:{' '}
                                    <span className={`status ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </p>
                                <div className="ai-stats">
                                    <p className="ai-score">AI Match Score: <strong>{app.skillScore}%</strong></p>
                                    {(app.matchedSkills?.length > 0 || app.missingSkills?.length > 0) && (
                                        <div className="skill-breakdown">
                                            {app.matchedSkills?.length > 0 && (
                                                <p className="matched-skills">
                                                    ✅ {app.matchedSkills.join(', ')}
                                                </p>
                                            )}
                                            {app.missingSkills?.length > 0 && (
                                                <p className="missing-skills">
                                                    ❌ {app.missingSkills.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Apply Modal */}
            {selectedJob && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>Apply for {selectedJob.title}</h3>
                        <p className="modal-subtitle">
                            Upload your resume to get AI-matched
                        </p>

                        {message && (
                            <p
                                className={`message ${message.includes('success') ? 'success' : 'error'
                                    }`}
                            >
                                {message}
                            </p>
                        )}

                        <form onSubmit={handleApply}>
                            <div className="input-group">
                                <label>Resume</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn primary-btn">
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="btn outline-btn"
                                    onClick={() => setSelectedJob(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;
