import type { APIRoute } from "astro";
import { getUnifiedGitActivity } from "@/lib/api/activity";

export function getStaticPaths() {
  const currentYear = new Date().getFullYear();
  return [
    { params: { year: String(currentYear) } },
    { params: { year: String(currentYear - 1) } },
    { params: { year: String(currentYear - 2) } },
  ];
}

export const GET: APIRoute = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const year = params.year ? parseInt(params.year, 10) : currentYear;

  try {
    const activity = await getUnifiedGitActivity(isNaN(year) ? currentYear : year);

    return new Response(JSON.stringify(activity), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
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
