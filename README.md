# 🚀 AI-Powered Intelligent Hiring Platform

An intelligent, AI-driven Applicant Tracking System (ATS) that transforms traditional hiring processes into a smart, automated, and data-driven system.

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🤖 AI-Powered Features
- **Intelligent Resume Parsing** - Automatic extraction of candidate information
- **AI Skill Matching** - Smart matching of candidate skills with job requirements
- **Match Score Calculation** - Explainable AI scoring system
- **Skill Gap Analysis** - Identifies matched and missing skills

### 👥 User Roles
- **Recruiters** - Post jobs, view applications, manage hiring pipeline
- **Candidates** - Browse jobs, apply with resume, track applications

### 🔄 Integration
- **External Job Board Integration** - REST API for external job boards
- **Source Tracking** - Track application origins for analytics
- **Real-time Job Sync** - Jobs automatically sync to external platforms

### 📊 Dashboard Features
- Job posting and management
- Application tracking and ranking
- AI match score visualization
- Candidate filtering and sorting

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication

### AI/ML
- **Python** - AI processing
- **PyPDF2** - PDF parsing
- **spaCy** - NLP for skill extraction
- **Custom AI algorithms** - Match scoring

## 📁 Project Structure

```
project/
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── utils/           # AI utilities & resume parser
│   ├── services/        # Skill matching service
│   ├── uploads/         # Resume storage
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app
│   └── public/
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/PankajBaduwal/Firstphase.git
cd Firstphase
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Python Dependencies**
```bash
cd backend/utils
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

4. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

5. **Configure Environment Variables**

Create `.env` file in `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

2. **Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

3. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Jobs
- `POST /api/jobs/create` - Create job (Recruiter)
- `GET /api/jobs/all` - Get all jobs
- `GET /api/jobs/public` - Get jobs for external boards (No auth)

### Applications
- `POST /api/applications/apply` - Apply for job (Candidate)
- `GET /api/applications/:jobId` - Get job applications (Recruiter)
- `GET /api/applications/my` - Get my applications (Candidate)

### Resumes
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes/parse/:id` - Parse resume

### Matches
- `GET /api/matches/job/:jobId` - Get matches for job
- `GET /api/matches/candidate/:candidateId` - Get matches for candidate

## 🎯 Key Features Implementation

### 1. AI Resume Parsing
```javascript
// Automatic extraction of:
- Name, Email, Phone
- Skills
- Experience
- Education
```

### 2. Skill Matching Algorithm
```javascript
// Calculates:
- Match percentage
- Matched skills
- Missing skills
- Skill gap analysis
```

### 3. External Job Board Integration
```javascript
// Features:
- Public API endpoint
- Source tracking
- Real-time sync
- Apply redirect
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration
- Input validation

## 📊 Database Schema

### User Model
- name, email, password
- role (candidate/recruiter)
- timestamps

### Job Model
- title, description
- requiredSkills, experience
- postedBy (recruiter reference)
- timestamps

### Application Model
- job, candidate references
- resumeUrl, resumeText
- skillScore, matchedSkills, missingSkills
- source (tracking)
- status
- timestamps

## 🎨 UI Features

- Modern, responsive design
- Gradient themes
- Smooth animations
- Loading states
- Error handling
- Empty states
- Modal dialogs

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Import repository to Vercel
3. Configure build settings
4. Deploy

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### Frontend (if needed)
```env
VITE_API_URL=https://your-backend-url.com
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pankaj Baduwal**
- GitHub: [@PankajBaduwal](https://github.com/PankajBaduwal)

## 🙏 Acknowledgments

- Built for hackathon demonstration
- AI-powered hiring automation
- Modern full-stack architecture
- Production-ready codebase

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [Your Email]

---

**Made with ❤️ for intelligent hiring automation**
