/**
 * AI-Assisted Skill Matching & Auto-Ranking Utility
 * 
 * Provides deterministic, explainable AI logic for:
 * 1. Semantic Skill Extraction
 * 2. Weighted Match Scoring
 * 3. Candidate Ranking
 */

// Skill Ontology for Semantic Matching
// Maps canonical skill names to their aliases/variations
const skillOntology = {
    "javascript": ["js", "javascript", "ecmascript", "es6"],
    "react": ["react", "reactjs", "react.js", "react.native"],
    "node": ["node", "nodejs", "node.js"],
    "mongodb": ["mongo", "mongodb", "mongoose", "nosql"],
    "express": ["express", "expressjs", "express.js"],
    "python": ["python", "py", "pandas", "numpy"],
    "java": ["java", "spring", "springboot"],
    "html": ["html", "html5"],
    "css": ["css", "css3", "scss", "sass", "tailwind", "bootstrap"],
    "sql": ["sql", "mysql", "postgresql", "postgres"],
    "git": ["git", "github", "gitlab"],
    "aws": ["aws", "amazon web services", "ec2", "s3", "lambda"],
    "docker": ["docker", "kubernetes", "k8s"]
};

/**
 * Normalizes text and extracts key skills using the ontology.
 * @param {string} resumeText - The raw text content of the resume.
 * @returns {string[]} - Array of unique canonical skills found.
 */
const extractSkillsAI = (resumeText) => {
    if (!resumeText) return [];

    const normalizedText = resumeText.toLowerCase()
        .replace(/[^a-z0-9\s.+]/g, ' ') // Keep . and + for C++, node.js etc
        .replace(/\s+/g, ' '); // Collapse whitespace

    const foundSkills = new Set();

    // Iterate through ontology to find semantic matches
    Object.keys(skillOntology).forEach(canonicalSkill => {
        const variations = skillOntology[canonicalSkill];
        
        // Check if any variation produces a match in the text
        const isMatch = variations.some(variation => {
            // Create regex for whole word matching to avoid partial matches (e.g., "java" in "javascript")
            // Escape special chars like + in C++
            const escapedVar = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedVar}\\b`, 'i');
            return regex.test(normalizedText);
        });

        if (isMatch) {
            foundSkills.add(canonicalSkill);
        }
    });

    return Array.from(foundSkills);
};

/**
 * Generates an explainable match score based on job requirements.
 * Logic: 
 * - First 50% of job skills are CORE (Weights 70%)
 * - Remaining 50% are SECONDARY (Weights 30%)
 * 
 * @param {string[]} resumeSkills - Skills extracted from resume.
 * @param {string[]} jobSkills - Required skills from job posting.
 * @returns {object} - { score, matchedSkills, missingSkills }
 */
const generateMatchScoreAI = (resumeSkills, jobSkills) => {
    if (!jobSkills || jobSkills.length === 0) {
        return { score: 0, matchedSkills: [], missingSkills: [] };
    }

    // Normalize job skills to canonical form if possible, otherwise keep as is
    // This handles cases where job string might be "React.js" but ontology has "react"
    const canonicalJobSkills = jobSkills.map(skill => {
        const s = skill.toLowerCase();
        // Try to find it in ontology
        const found = Object.keys(skillOntology).find(key => 
            skillOntology[key].includes(s) || key === s
        );
        return found || s; // Fallback to original lowercase if not in ontology
    });

    const totalSkills = canonicalJobSkills.length;
    const coreCount = Math.ceil(totalSkills / 2);
    
    const coreSkills = canonicalJobSkills.slice(0, coreCount);
    const secondarySkills = canonicalJobSkills.slice(coreCount);

    const matchedSkills = [];
    const missingSkills = [];

    let coreMatches = 0;
    let secondaryMatches = 0;

    // Check Core Skills
    coreSkills.forEach(skill => {
        if (resumeSkills.includes(skill)) {
            coreMatches++;
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });

    // Check Secondary Skills
    secondarySkills.forEach(skill => {
        if (resumeSkills.includes(skill)) {
            secondaryMatches++;
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });

    // Calculate Weighted Score
    // Core weight total = 70%, Secondary weight total = 30%
    const coreWeight = 70;
    const secondaryWeight = 30;

    const coreScore = (coreMatches / coreSkills.length) * coreWeight;
    const secondaryScore = secondarySkills.length > 0 
        ? (secondaryMatches / secondarySkills.length) * secondaryWeight 
        : 0;

    // Adjust if no secondary skills exist (everything is core, so 100%)
    let finalScore;
    if (secondarySkills.length === 0) {
        finalScore = (coreMatches / coreSkills.length) * 100;
    } else {
        finalScore = coreScore + secondaryScore;
    }

    return {
        score: Math.round(finalScore),
        matchedSkills,
        missingSkills
    };
};

/**
 * Sorts applications based on AI Match Score (Auto-Ranking).
 * @param {Array} applications - List of application objects.
 * @returns {Array} - Sorted applications (Highest score first).
 */
const rankCandidates = (applications) => {
    return applications.sort((a, b) => b.skillScore - a.skillScore);
};

module.exports = {
    extractSkillsAI,
    generateMatchScoreAI,
    rankCandidates
};
