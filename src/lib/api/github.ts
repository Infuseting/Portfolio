import type { LanguageStat } from "./types";
import { getEnv } from "./env";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const GITHUB_CONTRIBUTIONS_QUERY = `
query getContributions($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

const GITHUB_TOP_LANGUAGES_QUERY = `
query getTopLanguages($username: String!) {
  user(login: $username) {
    repositories(first: 100, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        languages(first: 20, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;

export async function getGitHubContributions(
  year: number,
  customUsername?: string,
  customToken?: string
): Promise<Map<string, number>> {
  const username = customUsername || getEnv("GITHUB_USERNAME");
  const token = customToken || getEnv("GITHUB_TOKEN");
  const resultMap = new Map<string, number>();

  if (!username || !token || token.startsWith("ghp_votre")) {
    return resultMap;
  }

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GITHUB_CONTRIBUTIONS_QUERY,
        variables: { username, from, to },
      }),
    });

    if (!response.ok) {
      console.warn(`[GitHub API] HTTP error: ${response.status}`);
      return resultMap;
    }

    const data = await response.json();
    const weeks =
      data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

    for (const week of weeks) {
      for (const day of week.contributionDays || []) {
        resultMap.set(day.date, day.contributionCount);
      }
    }

    return resultMap;
  } catch (error) {
    console.error("[GitHub API] Fetch error:", error);
    return resultMap;
  }
}

export async function getGitHubLanguages(
  customUsername?: string,
  customToken?: string
): Promise<Map<string, { size: number; color: string }>> {
  const username = customUsername || getEnv("GITHUB_USERNAME");
  const token = customToken || getEnv("GITHUB_TOKEN");
  const langMap = new Map<string, { size: number; color: string }>();

  if (!username || !token || token.startsWith("ghp_votre")) {
    return langMap;
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GITHUB_TOP_LANGUAGES_QUERY,
        variables: { username },
      }),
    });

    if (!response.ok) {
      console.warn(`[GitHub Languages API] HTTP error: ${response.status}`);
      return langMap;
    }

    const data = await response.json();
    const repos = data?.data?.user?.repositories?.nodes || [];

    for (const repo of repos) {
      for (const edge of repo?.languages?.edges || []) {
        const name = edge?.node?.name;
        const color = edge?.node?.color || "#888888";
        const size = edge?.size || 0;
        if (name && size > 0) {
          const current = langMap.get(name) || { size: 0, color };
          langMap.set(name, {
            size: current.size + size,
            color: color || current.color,
          });
        }
      }
    }

    return langMap;
  } catch (error) {
    console.error("[GitHub Languages API] Fetch error:", error);
    return langMap;
  }
}

export async function getTopLanguages(
  customUsername?: string,
  customToken?: string
): Promise<LanguageStat[]> {
  const langMap = await getGitHubLanguages(customUsername, customToken);
  let totalBytes = 0;
  for (const { size } of langMap.values()) {
    totalBytes += size;
  }

  if (totalBytes === 0) return [];

  return Array.from(langMap.entries())
    .map(([name, { size, color }]) => ({
      name,
      color,
      size,
      percentage: Number(((size / totalBytes) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.size - a.size);
}
