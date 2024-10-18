const fs = require('fs');
const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: token });

// Extract repository owner and name
const [OWNER, REPO] = process.env.GITHUB_REPOSITORY.split('/');

// Read and parse the JSON output from yarn outdated
const data = fs.readFileSync('outdated.json', 'utf8');
const parsed = JSON.parse(data);

// Check if the data type is "table" and extract dependencies
if (parsed.type !== 'table' || !parsed.data || !parsed.data.body) {
  console.error('Unexpected JSON structure:', parsed);
  process.exit(1);
}

const dependencies = parsed.data.body;

// Function to determine the type of version upgrade
function getUpgradeType(current, latest) {
  const [curMajor, curMinor] = current.split('.').map(Number);
  const [latMajor, latMinor] = latest.split('.').map(Number);

  if (curMajor < latMajor) return 'major';
  if (curMinor < latMinor) return 'minor';
  return 'patch';
}

// Group dependencies by upgrade type
const upgrades = { major: [], minor: [], patch: [] };

dependencies.forEach(([pkg, current, wanted, latest]) => {
  const upgradeType = getUpgradeType(current, latest);
  upgrades[upgradeType].push({ pkg, current, wanted, latest });
});

// Prepare the issue body with headers for each upgrade type
let issueBody = '### Outdated Yarn Dependencies\n\n';

for (const [type, deps] of Object.entries(upgrades)) {
  if (deps.length === 0) continue;

  issueBody += `## ${type.charAt(0).toUpperCase() + type.slice(1)} Upgrades\n\n`;
  issueBody += '| Package | Current | Wanted | Latest |\n';
  issueBody += '|---------|---------|--------|--------|\n';

  deps.forEach(({ pkg, current, wanted, latest }) => {
    issueBody += `| ${pkg} | ${current} | ${wanted} | ${latest} |\n`;
  });

  issueBody += '\n';
}

// Create the issue and assign it to code owners
octokit.issues
  .create({
    owner: OWNER,
    repo: REPO,
    title: `Dependency Update - ${new Date().toISOString().slice(0, 10)}`,
    body: issueBody,
    assignees: ['codeowners'], // Adjust if necessary
  })
  .then(() => {
    console.log('Issue created successfully!');
  })
  .catch((err) => {
    console.error('Error creating issue:', err);
  });
