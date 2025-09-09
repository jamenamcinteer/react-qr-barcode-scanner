const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: token });

// Extract repository owner and name
const [OWNER, REPO] = process.env.GITHUB_REPOSITORY.split('/');

// Get the latest issue created by the workflow
async function getLatestIssue() {
  const { data: issues } = await octokit.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'open',
    per_page: 1,
    sort: 'created',
    direction: 'desc',
  });

  return issues[0];
}

// Create the pull request
async function createPullRequest() {
  const { data: pr } = await octokit.pulls.create({
    owner: OWNER,
    repo: REPO,
    title: 'chore: Upgrade Dependencies',
    head: 'dependency-updates',
    base: 'next-release', // Use next-release as the base branch
    body: 'This PR updates all dependencies.',
  });

  console.log('Pull request created successfully!');
  return pr;
}

// Link the PR to the issue by commenting on the issue
async function linkPrToIssue(issueNumber, pr) {
  await octokit.issues.createComment({
    owner: OWNER,
    repo: REPO,
    issue_number: issueNumber,
    body: `Linked pull request: [#${pr.number}](${pr.html_url})`,
  });

  console.log('Issue linked to pull request successfully!');
}

(async () => {
  try {
    const latestIssue = await getLatestIssue();
    const pr = await createPullRequest();
    await linkPrToIssue(latestIssue.number, pr);
  } catch (err) {
    console.error('Error creating pull request or linking it to the issue:', err);
  }
})();
