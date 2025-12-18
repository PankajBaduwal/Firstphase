import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) return null;

    const { user, logout } = authContext;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    GCC<span>Hire</span>AI
                </Link>

                <div className="nav-links">
                    {user ? (
                        <>
                            <span className="welcome-text">
                                Hi, <strong>{user.name}</strong>
                            </span>

                            {user.role === 'recruiter' && (
                                <Link to="/recruiter/dashboard" className="nav-link">
                                    Recruiter Dashboard
                                </Link>
                            )}

                            {user.role === 'candidate' && (
                                <Link to="/candidate/dashboard" className="nav-link">
                                    Candidate Dashboard
                                </Link>
                            )}

                            <button onClick={logout} className="btn logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/signup" className="btn signup-btn">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
