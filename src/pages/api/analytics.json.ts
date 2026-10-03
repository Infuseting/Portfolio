import type { APIRoute } from "astro";
import { getVercelAnalyticsStats } from "@/lib/api/vercel";
import { METRICS_CACHE_CONTROL } from "@/lib/cache/metrics-cache-policy";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const stats = await getVercelAnalyticsStats();
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": METRICS_CACHE_CONTROL,
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
