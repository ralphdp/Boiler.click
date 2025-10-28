/* GitHub utility functions for generating repository URLs */
export function getGitHubUrl(path: string = ""): string {
  const user = process.env.NEXT_PUBLIC_GITHUB_USER || "ralphdp";
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "boiler";
  const baseUrl = `https://github.com/${user}/${repo}`;
  return path ? `${baseUrl}/${path}` : baseUrl;
}

export function getGitHubCloneUrl(): string {
  const user = process.env.NEXT_PUBLIC_GITHUB_USER || "ralphdp";
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "boiler";
  return `https://github.com/${user}/${repo}.git`;
}

export function getGitHubCloneCommand(): string {
  return `git clone ${getGitHubCloneUrl()}`;
}
