import { useState, useContext, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Signup.css';

interface SignupFormData {
    name: string;
    email: string;
    password: string;
    role: 'candidate' | 'recruiter';
}

interface SignupResponse {
    token: string;
    role: string;
    name: string;
}

interface ErrorResponse {
    message?: string;
}

const Signup: React.FC = () => {
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        role: 'candidate',
    });

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    if (!authContext) {
        throw new Error('AuthContext must be used within AuthProvider');
    }

    const { login } = authContext;
    const { name, email, password, role } = formData;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post<SignupResponse>('/api/auth/signup', formData);
            login(res.data);

            if (res.data.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/candidate/dashboard');
            }
        } catch (err) {
            console.error('Signup Error:', err);
            const axiosError = err as AxiosError<ErrorResponse>;
            const errorMsg = axiosError.response?.data?.message
                || (axiosError.response ? `Error ${axiosError.response.status}: ${axiosError.response.statusText}` : 'Network Error or Backend Down');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h2>Create Account 🚀</h2>
                <p className="subtitle">Join GCC Hire AI today</p>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            placeholder="Your name"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Select Role</label>
                        <select name="role" value={role} onChange={onChange}>
                            <option value="candidate">Candidate</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn primary-btn full-width"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="switch-auth">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
