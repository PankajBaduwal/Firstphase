import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './ApplyFromExternal.css';

const ApplyFromExternal = () => {
    const { jobId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const source = searchParams.get('source') || 'direct';

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Fetch job details
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/jobs/all`);
                const jobs = response.data;
                const foundJob = jobs.find(j => j._id === jobId);

                if (foundJob) {
                    setJob(foundJob);
                } else {
                    setError('Job not found');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching job:', err);
                setError('Failed to load job details');
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            setError('');
        } else {
            setError('Please upload a PDF file');
            setResumeFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resumeFile) {
            setError('Please upload your resume');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);
            formData.append('jobId', jobId);
            formData.append('source', source); // Track the source!

            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:5000/api/applications/apply', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Application submitted:', response.data);
            setSuccess(true);

            // Redirect to candidate dashboard after 2 seconds
            setTimeout(() => {
                navigate('/candidate/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Error submitting application:', err);
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="apply-external-container">
                <div className="loading-spinner">Loading job details...</div>
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="apply-external-container">
                <div className="error-card">
                    <h2>❌ {error}</h2>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // If user is not logged in, show login/signup options
    if (!user) {
        return (
            <div className="apply-external-container">
                <div className="apply-card">
                    <div className="job-header">
                        <h1>{job?.title}</h1>
                        <p className="job-company">
                            {job?.postedBy?.name || 'Company'}
                        </p>
                        <p className="source-badge">
                            Source: <span>{source}</span>
                        </p>
                    </div>

                    <div className="auth-required">
                        <div className="auth-icon">🔐</div>
                        <h2>Login Required</h2>
                        <p>Please login or create an account to apply for this position.</p>

                        <div className="auth-buttons">
                            <button
                                onClick={() => navigate(`/login?redirect=/apply/${jobId}&source=${source}`)}
                                className="btn-primary"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate(`/signup?redirect=/apply/${jobId}&source=${source}`)}
                                className="btn-secondary"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show success message
    if (success) {
        return (
            <div className="apply-external-container">
                <div className="success-card">
                    <div className="success-icon">✅</div>
                    <h2>Application Submitted Successfully!</h2>
                    <p>Your application has been received and is being processed.</p>
                    <p className="redirect-message">Redirecting to your dashboard...</p>
                </div>
            </div>
        );
    }

    // Show application form for logged-in users
    return (
        <div className="apply-external-container">
            <div className="apply-card">
                <div className="job-header">
                    <h1>Apply for: {job?.title}</h1>
                    <p className="job-company">
                        {job?.postedBy?.name || 'Company'}
                    </p>
                    <p className="job-description">{job?.description}</p>

                    {job?.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="required-skills">
                            <h3>Required Skills:</h3>
                            <div className="skills-list">
                                {job.requiredSkills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="source-badge">
                        Application Source: <span>{source}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="application-form">
                    <div className="form-group">
                        <label htmlFor="resume">
                            Upload Resume (PDF) <span className="required">*</span>
                        </label>
                        <input
                            type="file"
                            id="resume"
                            accept=".pdf"
                            onChange={handleResumeChange}
                            required
                            className="file-input"
                        />
                        {resumeFile && (
                            <p className="file-name">
                                ✓ Selected: {resumeFile.name}
                            </p>
                        )}
                    </div>

                    {error && <div className="error-message">❌ {error}</div>}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={uploading || !resumeFile}
                    >
                        {uploading ? (
                            <>
                                <span className="spinner"></span>
                                Submitting...
                            </>
                        ) : (
                            'Submit Application'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyFromExternal;
