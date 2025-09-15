const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: token });

// Extract repository owner and name
const [OWNER, REPO] = process.env.GITHUB_REPOSITORY.split('/');

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

(async () => {
  try {
    await createPullRequest();
  } catch (err) {
    console.error('Error creating pull request', err);
  }
})();
