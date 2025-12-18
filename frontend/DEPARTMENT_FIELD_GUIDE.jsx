/**
 * DEPARTMENT FIELD INTEGRATION GUIDE
 * 
 * This guide shows how to add a department input field to your job posting form
 */

// ============================================================
// STEP 1: Update Your Job Posting Form Component
// ============================================================

// File: frontend/src/components/JobPostingForm.jsx (or wherever your form is)

import React, { useState } from 'react';
import axios from 'axios';

const JobPostingForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        experience: '',
        department: '', // ⭐ NEW FIELD
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert skills string to array
        const skillsArray = formData.requiredSkills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

        const jobData = {
            title: formData.title,
            description: formData.description,
            requiredSkills: skillsArray,
            experience: formData.experience,
            department: formData.department, // ⭐ INCLUDE IN SUBMISSION
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/jobs',
                jobData,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            alert('Job posted successfully!');
            // Reset form or redirect
            setFormData({
                title: '',
                description: '',
                requiredSkills: '',
                experience: '',
                department: '',
            });
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Failed to post job');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="job-posting-form">
            <h2>Post a New Job</h2>

            {/* Job Title */}
            <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Senior Full Stack Developer"
                    required
                />
            </div>

            {/* Job Description */}
            <div className="form-group">
                <label htmlFor="description">Job Description *</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows="6"
                    required
                />
            </div>

            {/* Required Skills */}
            <div className="form-group">
                <label htmlFor="requiredSkills">Required Skills *</label>
                <input
                    type="text"
                    id="requiredSkills"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    placeholder="e.g., JavaScript, React, Node.js, MongoDB (comma-separated)"
                    required
                />
                <small>Enter skills separated by commas</small>
            </div>

            {/* Experience */}
            <div className="form-group">
                <label htmlFor="experience">Experience Required *</label>
                <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g., 2-5 years"
                    required
                />
            </div>

            {/* ⭐ DEPARTMENT FIELD - NEW */}
            <div className="form-group">
                <label htmlFor="department">Department/Domain</label>
                <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                >
                    <option value="">Select Department (Optional)</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Cloud Engineering">Cloud Engineering</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="QA/Testing">QA/Testing</option>
                    <option value="Product Management">Product Management</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                </select>
                <small>This helps improve candidate matching accuracy</small>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit">
                Post Job
            </button>
        </form>
    );
};

export default JobPostingForm;


// ============================================================
// ALTERNATIVE: Text Input Instead of Dropdown
// ============================================================

// If you prefer a text input instead of dropdown:

const DepartmentTextInput = () => (
    <div className="form-group">
        <label htmlFor="department">Department/Domain</label>
        <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Software Engineering, Data Science"
        />
        <small>Specify the department or domain for this role (optional)</small>
    </div>
);


// ============================================================
// STEP 2: Add CSS Styling
// ============================================================

const formCSS = `
.job-posting-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.job-posting-form h2 {
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-group small {
  display: block;
  margin-top: 6px;
  color: #666;
  font-size: 12px;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #0056b3;
}
`;


// ============================================================
// STEP 3: Update Existing Jobs (Optional)
// ============================================================

// If you want to add department to existing jobs, you can:

// Option 1: Add an "Edit Job" feature
const EditJobForm = ({ jobId, currentJobData }) => {
    const [formData, setFormData] = useState({
        ...currentJobData,
        department: currentJobData.department || '', // Default to empty if not set
    });

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/jobs/${jobId}`,
                formData,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            alert('Job updated successfully!');
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    // Rest of the form similar to above...
};


// ============================================================
// STEP 4: Display Department in Job Listings
// ============================================================

const JobCard = ({ job }) => (
    <div className="job-card">
        <h3>{job.title}</h3>

        {/* Show department if available */}
        {job.department && (
            <div className="job-department">
                <span className="department-badge">
                    🏢 {job.department}
                </span>
            </div>
        )}

        <p>{job.description}</p>

        <div className="job-meta">
            <span>📅 {job.experience}</span>
            <span>💼 {job.requiredSkills.length} skills required</span>
        </div>
    </div>
);


// ============================================================
// BACKEND VALIDATION (Optional but Recommended)
// ============================================================

// If you want to validate department on the backend, update jobController.js:

/*
const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, experience, department } = req.body;

    // Validate department if provided
    const validDepartments = [
      'Engineering', 'Software Development', 'Frontend Development',
      'Backend Development', 'Full Stack Development', 'Data Science',
      'Data Analytics', 'DevOps', 'Cloud Engineering', 'Mobile Development',
      'QA/Testing', 'Product Management', 'UI/UX Design', 'Marketing',
      'Sales', 'HR', 'Finance', 'Operations'
    ];

    if (department && !validDepartments.includes(department)) {
      return res.status(400).json({
        message: 'Invalid department. Please select from the provided options.'
      });
    }

    const job = await Job.create({
      title,
      description,
      requiredSkills,
      experience,
      department: department || undefined, // Only include if provided
      postedBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
*/


// ============================================================
// SUMMARY
// ============================================================

/*
✅ What You Need to Do:

1. Add department field to your job posting form (dropdown or text input)
2. Include department in the form submission data
3. (Optional) Add CSS styling for the new field
4. (Optional) Display department in job listings
5. (Optional) Add backend validation

The backend model is already updated and ready to accept the department field!

Note: The department field is OPTIONAL, so existing jobs without a department
will still work fine. The AI score explanation will handle missing departments gracefully.
*/
