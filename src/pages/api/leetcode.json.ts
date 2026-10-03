import type { APIRoute } from "astro";
import { getLeetCodeStats } from "@/lib/api/leetcode";
import { METRICS_CACHE_CONTROL } from "@/lib/cache/metrics-cache-policy";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const stats = await getLeetCodeStats();
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": METRICS_CACHE_CONTROL,
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
