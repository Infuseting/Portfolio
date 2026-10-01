import { getEnv } from "./env";

export async function getGiteaContributions(
  year: number,
  customUrl?: string,
  customUsername?: string,
  customToken?: string
): Promise<Map<string, number>> {
  const baseUrl = customUrl || getEnv("GITEA_URL");
  const username = customUsername || getEnv("GITEA_USERNAME");
  const token = customToken || getEnv("GITEA_TOKEN");
  const resultMap = new Map<string, number>();

  if (!baseUrl || !username || !token || token.startsWith("votre_token")) {
    return resultMap;
  }

  try {
    const cleanUrl = baseUrl.replace(/\/+$/, "");
    const endpoint = `${cleanUrl}/api/v1/users/${encodeURIComponent(username)}/heatmap`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`[Gitea API] HTTP error: ${response.status}`);
      return resultMap;
    }

    const data: Array<{ timestamp: number; contributions: number }> = await response.json();

    for (const item of data) {
      const date = new Date(item.timestamp * 1000);
      if (date.getFullYear() === year) {
        const dateStr = date.toISOString().split("T")[0];
        resultMap.set(dateStr, (resultMap.get(dateStr) || 0) + item.contributions);
      }
    }

    return resultMap;
  } catch (error) {
    console.error("[Gitea API] Fetch error:", error);
    return resultMap;
  }
}

export async function getGiteaLanguages(
  customUrl?: string,
  customUsername?: string,
  customToken?: string
): Promise<Map<string, number>> {
  const baseUrl = customUrl || getEnv("GITEA_URL");
  const username = customUsername || getEnv("GITEA_USERNAME");
  const token = customToken || getEnv("GITEA_TOKEN");
  const langMap = new Map<string, number>();

  if (!baseUrl || !username) {
    return langMap;
  }

  try {
    const cleanUrl = baseUrl.replace(/\/+$/, "");
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token && !token.startsWith("votre_token")) {
      headers["Authorization"] = `token ${token}`;
    }

    // Récupération conjointe des dépôts accessibles et des souscriptions/collaborations (ex: Arnaud/Kinect, Kinect/*, etc.)
    const [userReposRes, subsRes] = await Promise.all([
      fetch(`${cleanUrl}/api/v1/user/repos?limit=200`, {
        headers,
      }),
      fetch(`${cleanUrl}/api/v1/users/${encodeURIComponent(username)}/subscriptions?limit=200`, {
        headers,
      }),
    ]);

    const repoList: Array<{ full_name: string; name: string; owner?: { login?: string } }> = [];
    const seen = new Set<string>();

    const addRepos = (items: Array<{ full_name: string; name: string; owner?: { login?: string } }>) => {
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item?.full_name && !seen.has(item.full_name)) {
            seen.add(item.full_name);
            repoList.push(item);
          }
        }
      }
    };

    if (userReposRes.ok) {
      addRepos(await userReposRes.json());
    } else if (headers["Authorization"]) {
      // Fallback public si le token n'a pas la portée adéquate
      const pubRes = await fetch(`${cleanUrl}/api/v1/users/${encodeURIComponent(username)}/repos`, {
        headers: { Accept: "application/json" },
      });
      if (pubRes.ok) addRepos(await pubRes.json());
    }

    if (subsRes.ok) {
      addRepos(await subsRes.json());
    }

    if (repoList.length === 0) {
      return langMap;
    }

    await Promise.all(
      repoList.map(async (repo) => {
        let lRes = await fetch(
          `${cleanUrl}/api/v1/repos/${repo.full_name}/languages`,
          {
            headers,
          }
        );
        if (!lRes.ok && headers["Authorization"]) {
          lRes = await fetch(
            `${cleanUrl}/api/v1/repos/${repo.full_name}/languages`,
            {
              headers: { Accept: "application/json" },
            }
          );
        }
        if (lRes.ok) {
          const languages: Record<string, number> = await lRes.json();
          for (const [name, size] of Object.entries(languages)) {
            if (typeof size === "number" && size > 0) {
              langMap.set(name, (langMap.get(name) || 0) + size);
            }
          }
        }
      })
    );

    return langMap;
  } catch (error) {
    console.error("[Gitea API] Languages error:", error);
    return langMap;
  }
}

