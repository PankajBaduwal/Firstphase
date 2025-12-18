import { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

interface DecodedToken {
    id: string;
    email: string;
    role?: string;
    name?: string;
}

interface UserData {
    token: string;
    role: string;
    name: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                // Basic check for expiry could be added here
                const role = localStorage.getItem('role');
                const name = localStorage.getItem('name');

                if (role && name) {
                    setUser({
                        _id: decoded.id,
                        email: decoded.email,
                        role: role as 'candidate' | 'recruiter',
                        name: name
                    });
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

    const login = (userData: UserData): void => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('name', userData.name);

        const decoded = jwtDecode<DecodedToken>(userData.token);
        setUser({
            _id: decoded.id,
            email: decoded.email,
            role: userData.role as 'candidate' | 'recruiter',
            name: userData.name
        });
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        setUser(null);
        window.location.href = '/login'; // Force redirect
    };

    const value: AuthContextType = {
        user,
        loading,
        login: async () => { }, // Placeholder - actual login happens in Login component
        signup: async () => { }, // Placeholder - actual signup happens in Signup component
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
