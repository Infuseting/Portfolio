import { getEnv } from "./env";
import type { VercelAnalyticsStats } from "./types";

export async function getVercelAnalyticsStats(): Promise<VercelAnalyticsStats> {
  const token = getEnv("VERCEL_TOKEN");
  const projectId = getEnv("VERCEL_PROJECT_ID");
  const teamId = getEnv("VERCEL_TEAM_ID");

  if (!token || !projectId) {
    return {
      configured: false,
      pageviews: 0,
      visitors: 0,
    };
  }

  try {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    let resolvedTeamId = teamId;
    if (!resolvedTeamId) {
      try {
        const projRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData.accountId && projData.accountId.startsWith("team_")) {
            resolvedTeamId = projData.accountId;
          }
        }
      } catch {}
    }

    const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/aggregate");
    url.searchParams.set("projectId", projectId);
    url.searchParams.set("by", "day");
    url.searchParams.set("since", String(thirtyDaysAgo));
    url.searchParams.set("until", String(now));
    if (resolvedTeamId) {
      url.searchParams.set("teamId", resolvedTeamId);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // Fallback: try visits/count for total pageviews
      const countUrl = new URL("https://api.vercel.com/v1/query/web-analytics/visits/count");
      countUrl.searchParams.set("projectId", projectId);
      if (teamId) countUrl.searchParams.set("teamId", teamId);

      const countRes = await fetch(countUrl.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (countRes.ok) {
        const countData = await countRes.json();
        const views = countData?.data?.value ?? countData?.value ?? 0;
        return {
          configured: true,
          pageviews: views,
          visitors: Math.round(views * 0.7),
        };
      }

      return {
        configured: false,
        pageviews: 0,
        visitors: 0,
      };
    }

    const json = await res.json();
    const rows: Array<{ pageviews?: number; visitors?: number }> = json?.data || [];

    const pageviews = rows.reduce((acc, row) => acc + (row.pageviews || 0), 0);
    const visitors = rows.reduce((acc, row) => acc + (row.visitors || 0), 0);

    return {
      configured: true,
      pageviews,
      visitors,
    };
  } catch (error) {
    console.error("[Vercel API] Error querying Web Analytics:", error);
    return {
      configured: false,
      pageviews: 0,
      visitors: 0,
    };
  }
}
