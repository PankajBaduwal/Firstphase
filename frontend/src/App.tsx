import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobApplicants from './pages/JobApplicants';
import ApplyFromExternal from './pages/ApplyFromExternal';
import { AuthProvider } from './context/AuthContext';
import { useContext, ReactNode } from 'react';
import AuthContext from './context/AuthContext';
import Footer from './components/Footer';
import './App.css';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return <Navigate to="/login" />;
    }

    const { user, loading } = authContext;

    if (loading) return <div className="loader">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

    return <>{children}</>;
};

function App(): React.ReactElement {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        <Route
                            path="/"
                            element={
                                <div className="home">
                                    <div className="home-card">
                                        <h1>GCC Hire AI</h1>
                                        <p>
                                            An intelligent hiring platform connecting top talent with
                                            world-class recruiters.
                                        </p>
                                        <div className="home-actions">
                                            <a href="/login" className="btn primary">Login</a>
                                            <a href="/signup" className="btn secondary">Sign Up</a>
                                        </div>
                                    </div>
                                </div>
                            }
                        />

                        <Route
                            path="/candidate/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['candidate']}>
                                    <CandidateDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/recruiter/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['recruiter']}>
                                    <RecruiterDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/recruiter/job/:jobId"
                            element={
                                <ProtectedRoute allowedRoles={['recruiter']}>
                                    <JobApplicants />
                                </ProtectedRoute>
                            }
                        />

                        {/* Public route for external job applications */}
                        <Route path="/apply/:jobId" element={<ApplyFromExternal />} />
                    </Routes>
                </div>
            </Router>
            <Footer />
        </AuthProvider>
    );
}

export default App;
