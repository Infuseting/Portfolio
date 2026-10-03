import type { APIRoute } from "astro";
import { getUnifiedGitActivity } from "@/lib/api/activity";
import { METRICS_CACHE_CONTROL } from "@/lib/cache/metrics-cache-policy";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const year = params.year ? parseInt(params.year, 10) : currentYear;

  try {
    const activity = await getUnifiedGitActivity(isNaN(year) ? currentYear : year);

    return new Response(JSON.stringify(activity), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": METRICS_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error(`[API activity/${year}] Error:`, error);
    return new Response(JSON.stringify({ error: `Failed to fetch activity for ${year}` }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
