const calculateMatchScore = (resumeText, requiredSkills) => {
    if (!resumeText || !requiredSkills || requiredSkills.length === 0) {
        return 0;
    }

    const lowerCaseText = resumeText.toLowerCase();
    let matchCount = 0;

    requiredSkills.forEach((skill) => {
        if (lowerCaseText.includes(skill.toLowerCase())) {
            matchCount++;
        }
    });

    const score = (matchCount / requiredSkills.length) * 100;
    return Math.round(score);
};

module.exports = calculateMatchScore;
