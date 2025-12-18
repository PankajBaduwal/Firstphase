import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/api/auth/login', { email, password });
            login(res.data);

            if (res.data.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/candidate/dashboard');
            }
        } catch (err) {
            console.error('Login Error:', err);
            const errorMsg = err.response?.data?.message
                || (err.response ? `Error ${err.response.status}: ${err.response.statusText}` : 'Network Error or Backend Down');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Welcome Back 👋</h2>
                <p className="subtitle">Login to continue to GCC Hire AI</p>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn primary-btn full-width" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="switch-auth">
                    Don’t have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
