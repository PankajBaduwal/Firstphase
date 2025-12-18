import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import AuthContext from '../context/AuthContext';
import './ApplyFromExternal.css';

interface Job {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    postedBy?: {
        name: string;
    };
}

interface ErrorResponse {
    message?: string;
}

const ApplyFromExternal: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const source = searchParams.get('source') || 'direct';

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const user = authContext?.user || null;

    useEffect(() => {
        const fetchJob = async (): Promise<void> => {
            try {
                const response = await axios.get<Job[]>(`http://localhost:5000/api/jobs/all`);
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

    const handleResumeChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            setError('');
        } else {
            setError('Please upload a PDF file');
            setResumeFile(null);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
            formData.append('jobId', jobId || '');
            formData.append('source', source);

            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:5000/api/applications/apply', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Application submitted:', response.data);
            setSuccess(true);

            setTimeout(() => {
                navigate('/candidate/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Error submitting application:', err);
            const axiosError = err as AxiosError<ErrorResponse>;
            setError(axiosError.response?.data?.message || 'Failed to submit application');
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
