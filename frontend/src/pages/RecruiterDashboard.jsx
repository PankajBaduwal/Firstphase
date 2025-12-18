import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecruiterDashboard.css'; // Import the CSS file

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [showJobModal, setShowJobModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        experience: '',
        department: '', // Department/Domain field
    });
    const [message, setMessage] = useState('');
    const [stats] = useState({
        activeCandidates: 1234,
        candidateGrowth: 12,
        openRoles: 42,
        newRoles: 4,
        avgTimeToHire: 18,
        timeImprovement: -2.5,
        offerAcceptance: 94,
        acceptanceGrowth: 5
    });
    const [applicationVolume] = useState([45, 32, 28, 38, 52, 61, 48]);
    const [recentActivity] = useState([
        { name: 'Sarah Chen', action: 'moved to Interview', role: 'Product Designer Role', time: '2h ago', initials: 'SC', color: 'blue' },
        { name: 'Mike Ross', action: 'completed assessment', role: 'Senior Backend Engineer', time: '4h ago', initials: 'MR', color: 'green' },
        { name: 'AI System', action: 'flagged high potential', role: 'Data Scientist Candidate', time: '5h ago', initials: 'AI', color: 'purple' }
    ]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('/api/jobs/all');
            setJobs(res.data);
        } catch (error) {
            console.error(error);
            // Mock data for demo
            setJobs([
                { _id: '1', title: 'Senior React Developer', createdAt: new Date(), applicants: 24 },
                { _id: '2', title: 'Backend Engineer', createdAt: new Date(), applicants: 18 },
                { _id: '3', title: 'Full Stack Developer', createdAt: new Date(), applicants: 31 }
            ]);
        }
    };

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            };
            const skillsArray = formData.requiredSkills.split(',').map(s => s.trim());

            await axios.post('/api/jobs/create', { ...formData, requiredSkills: skillsArray }, config);
            setMessage('Job Posted Successfully!');
            setFormData({ title: '', description: '', requiredSkills: '', experience: '', department: '' });
            setShowJobModal(false);
            fetchJobs();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error creating job');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // SVG Icons (same as before)
    const UsersIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const BriefcaseIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    const ClockIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const CheckCircleIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const PlusIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );

    const EyeIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const XIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    const CalendarIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const SearchIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    const BellIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );

    const SettingsIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const BarChartIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );

    const LogOutIcon = () => (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <div className="brand-icon">
                            <BriefcaseIcon />
                        </div>
                        <span className="brand-name">TalentOS</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
                    >
                        <BarChartIcon />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`nav-button ${activeTab === 'jobs' ? 'active' : ''}`}
                    >
                        <BriefcaseIcon />
                        <span>Jobs</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('candidates')}
                        className={`nav-button ${activeTab === 'candidates' ? 'active' : ''}`}
                    >
                        <UsersIcon />
                        <span>Talent Discovery</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`nav-button ${activeTab === 'analytics' ? 'active' : ''}`}
                    >
                        <BarChartIcon />
                        <span>Analytics</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
                    >
                        <SettingsIcon />
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">JD</div>
                        <div className="user-info">
                            <div className="user-name">Jane Doe</div>
                            <div className="user-role">Recruiter Lead</div>
                        </div>
                    </div>
                    <button className="logout-button">
                        <LogOutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1 className="header-title">Dashboard</h1>
                        <div className="header-actions">
                            <div className="search-box">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Search candidates, jobs..."
                                    className="search-input"
                                />
                            </div>
                            <button className="icon-button">
                                <BellIcon />
                                <span className="notification-badge"></span>
                            </button>
                            <button className="icon-button">
                                <SettingsIcon />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="content-area">
                    {/* Success/Error Message */}
                    {message && (
                        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                            {message}
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <>
                            {/* Stats Grid */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-header">
                                        <div className="stat-icon blue">
                                            <UsersIcon />
                                        </div>
                                        <span className={`stat-change ${stats.candidateGrowth >= 0 ? 'positive' : 'negative'}`}>
                                            {stats.candidateGrowth >= 0 ? '↑' : '↓'} +{Math.abs(stats.candidateGrowth)}%
                                        </span>
                                    </div>
                                    <div className="stat-label">Active Candidates</div>
                                    <div className="stat-value">{stats.activeCandidates.toLocaleString()}</div>
                                    <div className="stat-info">from last month</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <div className="stat-icon green">
                                            <BriefcaseIcon />
                                        </div>
                                        <span className="stat-change positive">
                                            ↑ +{stats.newRoles}
                                        </span>
                                    </div>
                                    <div className="stat-label">Open Roles</div>
                                    <div className="stat-value">{stats.openRoles}</div>
                                    <div className="stat-info">new this week</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <div className="stat-icon orange">
                                            <ClockIcon />
                                        </div>
                                        <span className="stat-change positive">
                                            ↓ {Math.abs(stats.timeImprovement)} days
                                        </span>
                                    </div>
                                    <div className="stat-label">Time to Hire</div>
                                    <div className="stat-value">{stats.avgTimeToHire} days</div>
                                    <div className="stat-info">improvement</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <div className="stat-icon purple">
                                            <CheckCircleIcon />
                                        </div>
                                        <span className="stat-change positive">
                                            ↑ +{stats.acceptanceGrowth}%
                                        </span>
                                    </div>
                                    <div className="stat-label">Offer Acceptance</div>
                                    <div className="stat-value">{stats.offerAcceptance}%</div>
                                    <div className="stat-info">vs industry avg</div>
                                </div>
                            </div>

                            {/* Charts and Activity */}
                            <div className="charts-grid">
                                {/* Application Volume Chart */}
                                <div className="chart-card">
                                    <h3 className="chart-title">Application Volume</h3>
                                    <p className="chart-subtitle">Incoming applications over the last 7 days</p>

                                    <div className="chart-container">
                                        <div className="chart-y-axis">
                                            <span>60</span>
                                            <span>45</span>
                                            <span>30</span>
                                            <span>15</span>
                                            <span>0</span>
                                        </div>

                                        <div className="chart-bars">
                                            {applicationVolume.map((value, i) => (
                                                <div key={i} className="chart-bar-wrapper">
                                                    <div
                                                        className="chart-bar"
                                                        style={{ height: `${(value / 60) * 200}px` }}
                                                    >
                                                        <div className="chart-tooltip">
                                                            {value} applications
                                                        </div>
                                                    </div>
                                                    <span className="chart-label">
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="chart-card">
                                    <h3 className="chart-title">Recent Activity</h3>
                                    <p className="chart-subtitle">Latest updates from your team</p>

                                    <div className="activity-list">
                                        {recentActivity.map((activity, i) => (
                                            <div key={i} className="activity-item">
                                                <div className={`activity-avatar ${activity.color}`}>
                                                    {activity.initials}
                                                </div>
                                                <div className="activity-content">
                                                    <p className="activity-text">
                                                        <strong>{activity.name}</strong> {activity.action}{' '}
                                                        <strong>{activity.role}</strong>
                                                    </p>
                                                    <p className="activity-time">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="view-all-button">
                                        View All Activity
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'jobs' && (
                        <>
                            <div className="jobs-header">
                                <div className="jobs-header-content">
                                    <h2>Active Job Postings</h2>
                                    <p>Manage and track your open positions</p>
                                </div>
                                <button
                                    onClick={() => setShowJobModal(true)}
                                    className="primary-button"
                                >
                                    <PlusIcon />
                                    <span>Post New Job</span>
                                </button>
                            </div>

                            <div className="jobs-grid">
                                {jobs.length === 0 ? (
                                    <div className="empty-state">
                                        <BriefcaseIcon />
                                        <h3>No jobs posted yet</h3>
                                        <p>Start by posting your first job opening</p>
                                        <button
                                            onClick={() => setShowJobModal(true)}
                                            className="primary-button"
                                        >
                                            <PlusIcon />
                                            <span>Post Your First Job</span>
                                        </button>
                                    </div>
                                ) : (
                                    jobs.map(job => (
                                        <div key={job._id} className="job-card">
                                            <div className="job-card-content">
                                                <div className="job-info">
                                                    <h3 className="job-title">{job.title}</h3>
                                                    <div className="job-meta">
                                                        <span className="job-meta-item">
                                                            <CalendarIcon />
                                                            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                                        </span>
                                                        <span className="job-meta-item">
                                                            <UsersIcon />
                                                            <span>{job.applicants || 0} Applicants</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/recruiter/job/${job._id}`}
                                                    className="secondary-button"
                                                >
                                                    <EyeIcon />
                                                    <span>View Applicants</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'candidates' && (
                        <div className="empty-state">
                            <UsersIcon />
                            <h3>Talent Discovery</h3>
                            <p>View and manage all candidate applications</p>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="empty-state">
                            <BarChartIcon />
                            <h3>Analytics Dashboard</h3>
                            <p>Detailed hiring metrics and insights</p>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="empty-state">
                            <SettingsIcon />
                            <h3>Settings</h3>
                            <p>Manage your account and preferences</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Job Modal */}
            {showJobModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2 className="modal-title">Post New Job</h2>
                            <button
                                onClick={() => setShowJobModal(false)}
                                className="modal-close"
                            >
                                <XIcon />
                            </button>
                        </div>

                        <form onSubmit={handleCreateJob} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={onChange}
                                    className="form-input"
                                    placeholder="e.g. Senior React Developer"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={onChange}
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Required Skills (comma separated)</label>
                                <input
                                    type="text"
                                    name="requiredSkills"
                                    value={formData.requiredSkills}
                                    onChange={onChange}
                                    className="form-input"
                                    placeholder="React, Node.js, MongoDB, TypeScript"
                                    required
                                />
                                <p className="form-hint">Separate skills with commas</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Experience Required</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={onChange}
                                    className="form-input"
                                    placeholder="e.g. 3-5 Years"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Department/Domain (Optional)</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={onChange}
                                    className="form-input"
                                >
                                    <option value="">Select Department (Optional)</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Software Development">Software Development</option>
                                    <option value="Frontend Development">Frontend Development</option>
                                    <option value="Backend Development">Backend Development</option>
                                    <option value="Full Stack Development">Full Stack Development</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Data Analytics">Data Analytics</option>
                                    <option value="DevOps">DevOps</option>
                                    <option value="Cloud Engineering">Cloud Engineering</option>
                                    <option value="Mobile Development">Mobile Development</option>
                                    <option value="QA/Testing">QA/Testing</option>
                                    <option value="Product Management">Product Management</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="HR">HR</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Operations">Operations</option>
                                </select>
                                <p className="form-hint">Helps improve candidate matching accuracy</p>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowJobModal(false)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    Post Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;