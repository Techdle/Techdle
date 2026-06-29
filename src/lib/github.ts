export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
}

export async function getGitHubReleases(): Promise<GitHubRelease[]> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    return [];
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Techdle-App',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
      headers,
      next: { revalidate: 1800 }, // 30 minutes cache
    });

    if (!response.ok) {
      console.error(`Failed to fetch GitHub releases: ${response.status} ${response.statusText}`);
      return [];
    }

    const releases: GitHubRelease[] = await response.json();
    // Only return fully published, non-prerelease releases
    return releases.filter((release: GitHubRelease) => !release.prerelease);
  } catch (error) {
    console.error('Error fetching GitHub releases:', error);
    return [];
  }
}
