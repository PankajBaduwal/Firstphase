const { extractSkillsAI, generateMatchScoreAI } = require('./utils/aiSkillMatcher');

console.log('--- AI Skill Matching Test ---\n');

// 1. Test Extraction
console.log('Test 1: Skill Extraction');
const sampleResume = "I am a Full Stack Developer with experience in React.js, Node.js, and MongoDB. I also know Python and some C++.";
console.log('Input Text:', sampleResume);
const extracted = extractSkillsAI(sampleResume);
console.log('Extracted Skills:', extracted);
console.log('\n');

// 2. Test Scoring (Perfect Match)
console.log('Test 2: Scoring (High Match)');
const jobSkills1 = ['React', 'Node', 'MongoDB'];
const result1 = generateMatchScoreAI(extracted, jobSkills1);
console.log('Job Skills:', jobSkills1);
console.log('Score:', result1.score);
console.log('Matched:', result1.matchedSkills);
console.log('Missing:', result1.missingSkills);
console.log('\n');

// 3. Test Scoring (Partial Match)
console.log('Test 3: Scoring (Partial Match)');
const jobSkills2 = ['React', 'Node', 'Python', 'Java', 'Docker']; 
// Core: React, Node, Python (Weights 70%)
// Secondary: Java, Docker (Weights 30%)
// Resume has: React, Node, Python (All Core matched -> 70 points). No Secondary -> 0 points.
// Score should be approx 70.
const result2 = generateMatchScoreAI(extracted, jobSkills2);
console.log('Job Skills:', jobSkills2);
console.log('Score:', result2.score);
console.log('Matched:', result2.matchedSkills);
console.log('Missing:', result2.missingSkills);
console.log('\n');

// 4. Test Scoring (Synonyms)
console.log('Test 4: Ontology Check');
const resumeWithJs = "I use JS and ExpressJS.";
const jobWithFullNames = ["JavaScript", "Express"];
const extractedJs = extractSkillsAI(resumeWithJs);
console.log('Resume:', resumeWithJs);
console.log('Extracted:', extractedJs);
const result3 = generateMatchScoreAI(extractedJs, jobWithFullNames);
console.log('Score:', result3.score); // Should be 100
console.log('Matched:', result3.matchedSkills);
