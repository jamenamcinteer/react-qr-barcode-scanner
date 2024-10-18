const fs = require('fs');
const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: token });

// Extract repository owner and name
const [OWNER, REPO] = process.env.GITHUB_REPOSITORY.split('/');

// Read outdated dependencies from the JSON file
const data = fs.readFileSync('outdated.json', 'utf8');
const outdated = JSON.parse(data);

// Prepare the date for the issue title
const today = new Date().toISOString().slice(0, 10);
const issueTitle = `Dependency Update - ${today}`;

// Function to determine the type of version upgrade
function getUpgradeType(current, latest) {
  const [curMajor, curMinor] = current.split('.').map(Number);
  const [latMajor, latMinor] = latest.split('.').map(Number);

  if (curMajor < latMajor) return 'major';
  if (curMinor < latMinor) return 'minor';
  return 'patch';
}

// Group dependencies by major, minor, and patch updates
const upgrades = { major: [], minor: [], patch: [] };
const dependencies = outdated.data?.body || [];

if (dependencies.length === 0) {
  console.log('No outdated dependencies found. Skipping issue creation.');
  process.exit(0);
}

// Organize dependencies into their respective categories
for (const dep of dependencies) {
  const upgradeType = getUpgradeType(dep.current, dep.latest);
  upgrades[upgradeType].push(dep);
}

// Prepare the issue body with headers
let issueBody = '### Outdated Yarn Dependencies\n\n';

for (const [type, deps] of Object.entries(upgrades)) {
  if (deps.length === 0) continue;

  issueBody += `## ${type.charAt(0).toUpperCase() + type.slice(1)} Upgrades\n\n`;
  issueBody += '| Package | Current | Wanted | Latest |\n';
  issueBody += '|---------|---------|--------|--------|\n';

  for (const dep of deps) {
    issueBody += `| ${dep.name} | ${dep.current} | ${dep.wanted} | ${dep.latest} |\n`;
  }

  issueBody += '\n';
}

// Create the issue and assign it to code owners
octokit.issues
  .create({
    owner: OWNER,
    repo: REPO,
    title: issueTitle,
    body: issueBody,
    assignees: ['codeowners'],
  })
  .then(() => {
    console.log('Issue created successfully!');
  })
  .catch((err) => {
    console.error('Error creating issue:', err);
  });
