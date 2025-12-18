import { useState, useContext, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Login.css';

interface LoginResponse {
    token: string;
    role: 'candidate' | 'recruiter';
    name: string;
    email: string;
}

interface ErrorResponse {
    message?: string;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    if (!authContext) {
        throw new Error('AuthContext must be used within AuthProvider');
    }

    const { login } = authContext;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post<LoginResponse>('/api/auth/login', { email, password });
            login(res.data);

            if (res.data.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/candidate/dashboard');
            }
        } catch (err) {
            console.error('Login Error:', err);
            const axiosError = err as AxiosError<ErrorResponse>;
            const errorMsg = axiosError.response?.data?.message
                || (axiosError.response ? `Error ${axiosError.response.status}: ${axiosError.response.statusText}` : 'Network Error or Backend Down');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
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
                            onChange={handleEmailChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn primary-btn full-width" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="switch-auth">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
