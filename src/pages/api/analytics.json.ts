import type { APIRoute } from "astro";
import { getVercelAnalyticsStats } from "@/lib/api/vercel";

export const GET: APIRoute = async () => {
  try {
    const stats = await getVercelAnalyticsStats();
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[API analytics] Error fetching stats:", error);
    return new Response(JSON.stringify({ configured: false, pageviews: 0, visitors: 0 }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
