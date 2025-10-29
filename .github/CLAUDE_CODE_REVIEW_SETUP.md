# Claude Code Review Setup

This repository is configured to use Claude AI for automated code reviews on pull requests.

## How It Works

When a pull request is opened, synchronized, or reopened targeting the `main` or `next-release` branches, the Claude Code Review workflow automatically:

1. Fetches the PR diff
2. Sends the changes to Claude AI for analysis
3. Receives a comprehensive code review
4. Posts the review as a comment on the PR

## Setup Instructions

### 1. Get an Anthropic API Key

You need an Anthropic API key to use Claude:

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key

### 2. Add API Key to GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ANTHROPIC_API_KEY`
5. Value: Your Anthropic API key
6. Click **Add secret**

### 3. Workflow Configuration

The workflow is already configured in `.github/workflows/claude-code-review.yml`

**Key Features:**
- Triggers on PR events (opened, synchronize, reopened)
- Targets `main` and `next-release` branches
- Skips Dependabot PRs
- Uses Claude Sonnet 4 model
- Posts reviews as PR comments

## What Claude Reviews

Claude provides feedback on:

1. **Summary of Changes** - Overview of what was modified
2. **Potential Issues or Bugs** - Logic errors, edge cases, potential runtime issues
3. **Code Quality** - Best practices, readability, maintainability
4. **Security Concerns** - Security vulnerabilities or risky patterns
5. **Performance Considerations** - Optimization opportunities
6. **Testing Recommendations** - Suggested tests or test improvements

## Customization

### Change Target Branches

Edit `.github/workflows/claude-code-review.yml`:

```yaml
on:
  pull_request:
    branches:
      - main          # Add or remove branches
      - next-release
      - your-branch
```

### Adjust Review Prompt

Edit the `prompt` variable in the workflow file to customize what Claude focuses on.

### Change Claude Model

Update the `model` field in the API call:

```javascript
model: 'claude-sonnet-4-20250514',  // or claude-opus-4-20250514 for more detailed reviews
```

## Cost Considerations

- Each review consumes API tokens based on the size of the diff
- Large PRs may cost more to review
- The workflow limits diffs to 50,000 characters to control costs
- Monitor your Anthropic API usage in the console

## Troubleshooting

### "ANTHROPIC_API_KEY is not set" Error

Make sure you've added the API key as a repository secret (see Setup Instructions above).

### Reviews Not Posting

1. Check the Actions tab for workflow run details
2. Verify the `ANTHROPIC_API_KEY` secret is set correctly
3. Ensure the workflow has `pull-requests: write` permission

### Large PRs

Very large PRs (>50,000 characters in diff) will be truncated. Consider:
- Breaking large changes into smaller PRs
- Increasing the `maxDiffLength` in the workflow
- Using a more powerful model with higher token limits

## Disabling Code Reviews

To temporarily disable automated reviews:

1. Go to **Settings** → **Actions** → **General**
2. Find the workflow in the list
3. Click the toggle to disable it

Or delete/rename the `.github/workflows/claude-code-review.yml` file.

## Security Notes

- The `ANTHROPIC_API_KEY` is stored securely as a GitHub secret
- Code diffs are sent to Anthropic's API for review
- Review comments are posted using the GitHub token
- No sensitive data should be committed to the repository

## Support

For issues with:
- **This workflow**: Open an issue in this repository
- **Anthropic API**: Check [Anthropic's documentation](https://docs.anthropic.com/)
- **GitHub Actions**: Check [GitHub Actions documentation](https://docs.github.com/en/actions)
