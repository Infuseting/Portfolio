import type { APIRoute } from "astro";
import { getLeetCodeStats } from "@/lib/api/leetcode";

export const GET: APIRoute = async () => {
  try {
    const stats = await getLeetCodeStats();
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[API leetcode] Error fetching stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch LeetCode stats" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
