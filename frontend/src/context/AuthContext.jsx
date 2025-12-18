import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Basic check for expiry could be added here
                setUser(decoded);
                // Optionally fetch full user details if needed, but token has id/role
                // We'll store role in token or localStorage for easy access
                const role = localStorage.getItem('role');
                const name = localStorage.getItem('name');
                if (role && name) {
                    setUser({ ...decoded, role, name });
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('name');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('name', userData.name);
        const decoded = jwtDecode(userData.token);
        setUser({ ...decoded, role: userData.role, name: userData.name });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        setUser(null);
        window.location.href = '/login'; // Force redirect
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
