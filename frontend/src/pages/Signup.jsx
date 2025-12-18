import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'candidate',
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, role } = formData;

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/api/auth/signup', formData);
            login(res.data);

            if (res.data.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/candidate/dashboard');
            }
        } catch (err) {
            console.error('Signup Error:', err);
            const errorMsg = err.response?.data?.message
                || (err.response ? `Error ${err.response.status}: ${err.response.statusText}` : 'Network Error or Backend Down');
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
