import type { APIRoute } from "astro";
import { getUnifiedGitActivity } from "@/lib/api/activity";

export const GET: APIRoute = async ({ url }) => {
  try {
    const yearParam = url.searchParams.get("year");
    const currentYear = new Date().getFullYear();
    const year = yearParam ? parseInt(yearParam, 10) : currentYear;

    const activity = await getUnifiedGitActivity(isNaN(year) ? currentYear : year);

    return new Response(JSON.stringify(activity), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[API activity] Error fetching git activity:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch git activity" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
