import { useState, useEffect, useContext, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import AuthContext from '../context/AuthContext';
import './CandidateDashboard.css';

interface Job {
    _id: string;
    title: string;
    description: string;
    experience: string;
    requiredSkills: string[];
}

interface Application {
    _id: string;
    job: {
        _id: string;
        title: string;
    };
    status: string;
    skillScore: number;
    matchedSkills?: string[];
    missingSkills?: string[];
}

interface ErrorResponse {
    message?: string;
}

const CandidateDashboard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [myApplications, setMyApplications] = useState<Application[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [resume, setResume] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const authContext = useContext(AuthContext);

    const user = authContext?.user || null;

    useEffect(() => {
        fetchJobs();
        fetchMyApplications();
    }, []);

    const fetchJobs = async (): Promise<void> => {
        try {
            const res = await axios.get<Job[]>('/api/jobs/all');
            setJobs(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyApplications = async (): Promise<void> => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            };
            const res = await axios.get<Application[]>('/api/applications/my', config);
            setMyApplications(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            setResume(file);
        }
    };

    const handleApply = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
            const axiosError = error as AxiosError<ErrorResponse>;
            setMessage(axiosError.response?.data?.message || 'Error applying');
        }
    };

    const isApplied = (jobId: string): boolean => {
        return myApplications.some(
            (app) => app.job._id === jobId || (app.job as any) === jobId
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
                                    {(app.matchedSkills?.length || 0) > 0 || (app.missingSkills?.length || 0) > 0 ? (
                                        <div className="skill-breakdown">
                                            {app.matchedSkills && app.matchedSkills.length > 0 && (
                                                <p className="matched-skills">
                                                    ✅ {app.matchedSkills.join(', ')}
                                                </p>
                                            )}
                                            {app.missingSkills && app.missingSkills.length > 0 && (
                                                <p className="missing-skills">
                                                    ❌ {app.missingSkills.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    ) : null}
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
