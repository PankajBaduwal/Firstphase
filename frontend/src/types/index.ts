// Type Definitions for AI-Powered ATS

// User Types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'candidate' | 'recruiter';
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: any) => void;
    signup: () => Promise<void>;
    logout: () => void;
}


// Job Types
export interface Job {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    experience: string;
    department?: string;
    postedBy: {
        _id: string;
        name: string;
        email?: string;
    };
    createdAt: string;
    updatedAt?: string;
}

export interface PublicJob {
    _id: string;
    title: string;
    company: string;
    location: string;
    shortDescription: string;
    department?: string;
    experience: string;
    requiredSkills: string[];
    postedDate: string;
}

// Application Types
export interface Application {
    _id: string;
    job: string | Job;
    candidate: string | User;
    resumeUrl: string;
    resumeText?: string;
    skillScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    status: 'received' | 'shortlisted' | 'rejected';
    source: string;
    appliedAt: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApplicationWithDetails extends Application {
    job: Job;
    candidate: User;
}

// API Response Types
export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface SignupResponse {
    token: string;
    user: User;
}

// Form Types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    role: 'candidate' | 'recruiter';
}

export interface JobFormData {
    title: string;
    description: string;
    requiredSkills: string;
    experience: string;
    department?: string;
}

// Component Props Types
export interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export interface ScoreExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: Application | ApplicationWithDetails;
}

export interface NavbarProps {
    // Add any navbar specific props
}

export interface FooterProps {
    // Add any footer specific props
}

// Context Props
export interface AuthProviderProps {
    children: React.ReactNode;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorState {
    message: string;
    code?: string;
}

// API Request Types
export interface ApplyJobRequest {
    jobId: string;
    source?: string;
}

export interface CreateJobRequest {
    title: string;
    description: string;
    requiredSkills: string[];
    experience: string;
    department?: string;
}

// Match Score Types
export interface MatchScoreBreakdown {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation?: string;
}
