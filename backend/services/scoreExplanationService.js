const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const Resume = require('../models/resumeModel');
const { extractSkillsAI } = require('../utils/aiSkillMatcher');

/**
 * AI Score Explanation Service
 * Provides detailed breakdown of matching scores for explainable AI
 * 
 * Score Distribution (out of 100):
 * - Skills: 50 points
 * - Experience: 20 points
 * - Department: 10 points (if available)
 * - Description: 20 points
 */

/**
 * Generate detailed score explanation for a job-candidate match
 * 
 * @param {string} jobId - MongoDB ObjectId of the job
 * @param {string} candidateId - MongoDB ObjectId of the candidate
 * @returns {Promise<Object>} - Detailed score breakdown
 */
const generateScoreExplanation = async (jobId, candidateId) => {
    try {
        // Fetch application data
        const application = await Application.findOne({ 
            job: jobId, 
            candidate: candidateId 
        }).populate('job candidate');

        if (!application) {
            throw new Error('Application not found');
        }

        const job = await Job.findById(jobId);
        const resume = await Resume.findOne({ candidateId });

        if (!job) {
            throw new Error('Job not found');
        }

        // Calculate breakdown
        const skillsBreakdown = calculateSkillsScore(
            application.matchedSkills,
            application.missingSkills,
            job.requiredSkills
        );

        const experienceBreakdown = calculateExperienceScore(
            application.resumeText,
            job.experience
        );

        const departmentBreakdown = calculateDepartmentScore(
            resume?.extractedText || application.resumeText,
            job.description
        );

        const descriptionBreakdown = calculateDescriptionScore(
            resume?.extractedSkills || [],
            job.description
        );

        // Calculate total score
        const totalScore = 
            skillsBreakdown.score + 
            experienceBreakdown.score + 
            departmentBreakdown.score + 
            descriptionBreakdown.score;

        // Generate human-readable explanation
        const explanation = generateHumanExplanation({
            totalScore,
            skillsBreakdown,
            experienceBreakdown,
            departmentBreakdown,
            descriptionBreakdown
        });

        return {
            totalScore: Math.round(totalScore),
            breakdown: {
                skills: skillsBreakdown,
                experience: experienceBreakdown,
                department: departmentBreakdown,
                description: descriptionBreakdown
            },
            explanation
        };

    } catch (error) {
        console.error('Error generating score explanation:', error);
        throw error;
    }
};

/**
 * Calculate skills matching score (max 50 points)
 */
const calculateSkillsScore = (matchedSkills, missingSkills, requiredSkills) => {
    const totalRequired = requiredSkills.length;
    const matched = matchedSkills.length;
    const missing = missingSkills.length;

    const matchPercentage = totalRequired > 0 ? (matched / totalRequired) : 0;
    const score = matchPercentage * 50; // Max 50 points

    return {
        score: Math.round(score),
        max: 50,
        matched: matchedSkills,
        missing: missingSkills,
        matchPercentage: Math.round(matchPercentage * 100)
    };
};

/**
 * Calculate experience matching score (max 20 points)
 * Extracts years from resume text and compares with job requirement
 */
const calculateExperienceScore = (resumeText, jobExperience) => {
    // Extract years from job requirement (e.g., "2-5 years" -> 2)
    const jobYearsMatch = jobExperience.match(/(\d+)/);
    const requiredYears = jobYearsMatch ? parseInt(jobYearsMatch[0]) : 0;

    // Extract years from resume text (look for patterns like "3 years", "5+ years")
    const resumeYearsMatches = resumeText.match(/(\d+)\s*\+?\s*(years?|yrs?)/gi);
    let candidateYears = 0;

    if (resumeYearsMatches && resumeYearsMatches.length > 0) {
        // Take the highest years mentioned
        const years = resumeYearsMatches.map(match => {
            const num = match.match(/(\d+)/);
            return num ? parseInt(num[0]) : 0;
        });
        candidateYears = Math.max(...years);
    }

    // Calculate score based on experience match
    let score = 0;
    let status = '';

    if (candidateYears >= requiredYears) {
        score = 20; // Full points if meets or exceeds
        status = 'Meets or exceeds requirement';
    } else if (candidateYears >= requiredYears * 0.7) {
        score = 15; // 75% points if close
        status = 'Close to requirement';
    } else if (candidateYears > 0) {
        score = 10; // 50% points if has some experience
        status = 'Below requirement';
    } else {
        score = 5; // Minimal points if no experience found
        status = 'Experience not clearly stated';
    }

    return {
        score,
        max: 20,
        candidateExperience: candidateYears > 0 ? `${candidateYears} years` : 'Not specified',
        requiredExperience: jobExperience,
        status
    };
};

/**
 * Calculate department matching score (max 10 points)
 * Checks if resume mentions relevant department/domain keywords
 */
const calculateDepartmentScore = (resumeText, jobDescription) => {
    // Common department/domain keywords
    const departments = [
        'engineering', 'software', 'development', 'frontend', 'backend',
        'fullstack', 'data', 'analytics', 'marketing', 'sales', 'hr',
        'finance', 'operations', 'design', 'product', 'devops'
    ];

    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Find departments mentioned in job description
    const jobDepartments = departments.filter(dept => jobLower.includes(dept));

    if (jobDepartments.length === 0) {
        // No specific department mentioned, give neutral score
        return {
            score: 7,
            max: 10,
            status: 'Department not specified in job',
            matched: false
        };
    }

    // Check if resume mentions same departments
    const matchedDepartments = jobDepartments.filter(dept => resumeLower.includes(dept));

    const matchPercentage = matchedDepartments.length / jobDepartments.length;
    const score = matchPercentage * 10;

    return {
        score: Math.round(score),
        max: 10,
        jobDepartments,
        candidateDepartments: matchedDepartments,
        status: matchedDepartments.length > 0 ? 'Matched' : 'Not matched',
        matched: matchedDepartments.length > 0
    };
};

/**
 * Calculate description/keyword matching score (max 20 points)
 * Checks how well candidate skills align with job description keywords
 */
const calculateDescriptionScore = (candidateSkills, jobDescription) => {
    // Extract keywords from job description
    const descriptionSkills = extractSkillsAI(jobDescription);

    if (descriptionSkills.length === 0) {
        return {
            score: 15,
            max: 20,
            keywordMatches: 0,
            totalKeywords: 0,
            status: 'No specific keywords in description'
        };
    }

    // Count how many description keywords match candidate skills
    const matches = descriptionSkills.filter(skill => 
        candidateSkills.includes(skill)
    );

    const matchPercentage = matches.length / descriptionSkills.length;
    const score = matchPercentage * 20;

    return {
        score: Math.round(score),
        max: 20,
        keywordMatches: matches.length,
        totalKeywords: descriptionSkills.length,
        matchPercentage: Math.round(matchPercentage * 100),
        status: `${matches.length} of ${descriptionSkills.length} keywords matched`
    };
};

/**
 * Generate human-readable explanation of the score
 */
const generateHumanExplanation = (data) => {
    const { totalScore, skillsBreakdown, experienceBreakdown, departmentBreakdown, descriptionBreakdown } = data;

    let explanation = '';

    // Overall assessment
    if (totalScore >= 80) {
        explanation = 'This candidate is an excellent match for the role. ';
    } else if (totalScore >= 60) {
        explanation = 'This candidate is a good match for the role. ';
    } else if (totalScore >= 40) {
        explanation = 'This candidate is a moderate match for the role. ';
    } else {
        explanation = 'This candidate may not be the best fit for the role. ';
    }

    // Skills explanation
    if (skillsBreakdown.matchPercentage >= 80) {
        explanation += 'They possess most of the required technical skills. ';
    } else if (skillsBreakdown.matchPercentage >= 50) {
        explanation += 'They have some of the required skills but are missing key competencies. ';
    } else {
        explanation += 'They are missing several critical skills. ';
    }

    // Experience explanation
    if (experienceBreakdown.score >= 18) {
        explanation += 'Their experience level aligns well with the requirements. ';
    } else if (experienceBreakdown.score >= 12) {
        explanation += 'Their experience is close to what is needed. ';
    } else {
        explanation += 'They may need more experience for this role. ';
    }

    // Department/Domain explanation
    if (departmentBreakdown.matched) {
        explanation += 'They have relevant domain experience. ';
    }

    // Description match
    if (descriptionBreakdown.matchPercentage >= 70) {
        explanation += 'Their background strongly aligns with the job description.';
    } else if (descriptionBreakdown.matchPercentage >= 40) {
        explanation += 'Their background partially aligns with the job description.';
    }

    return explanation;
};

module.exports = {
    generateScoreExplanation
};
