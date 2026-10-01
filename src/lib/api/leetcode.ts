import type { LeetCodeStats } from "./types";
import { getEnv } from "./env";

const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const LEETCODE_QUERY = `
query getUserProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    username
    profile {
      ranking
    }
    userCalendar {
      streak
      totalActiveDays
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
      totalSubmissionNum {
        difficulty
        count
      }
    }
  }
}
`;

const EMPTY_STATS: LeetCodeStats = {
  username: "",
  totalSolved: 0,
  totalQuestions: 0,
  easySolved: 0,
  totalEasy: 0,
  mediumSolved: 0,
  totalMedium: 0,
  hardSolved: 0,
  totalHard: 0,
  acceptanceRate: 0,
  ranking: 0,
  streak: 0,
};

let leetcodeCache: LeetCodeStats | null = null;

export async function getLeetCodeStats(customUsername?: string): Promise<LeetCodeStats> {
  if (leetcodeCache && !customUsername) {
    return leetcodeCache;
  }

  const username = customUsername || getEnv("LEETCODE_USERNAME");

  if (!username || username === "votre_pseudo_leetcode") {
    return EMPTY_STATS;
  }

  try {
    const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username },
      }),
    });

    if (!response.ok) {
      console.warn(`[LeetCode API] HTTP error: ${response.status}`);
      return { ...EMPTY_STATS, username };
    }

    const data = await response.json();
    const matchedUser = data?.data?.matchedUser;
    const allQuestions = data?.data?.allQuestionsCount || [];

    if (!matchedUser) {
      console.warn(`[LeetCode API] User ${username} not found.`);
      return { ...EMPTY_STATS, username };
    }

    const acSubmissions = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
    const totalSubmissions = matchedUser.submitStatsGlobal?.totalSubmissionNum || [];

    const getCount = (arr: Array<{ difficulty: string; count: number }>, diff: string) =>
      arr.find((item) => item.difficulty === diff)?.count || 0;

    const totalSolved = getCount(acSubmissions, "All");
    const easySolved = getCount(acSubmissions, "Easy");
    const mediumSolved = getCount(acSubmissions, "Medium");
    const hardSolved = getCount(acSubmissions, "Hard");

    const totalQuestions = getCount(allQuestions, "All") || 0;
    const totalEasy = getCount(allQuestions, "Easy") || 0;
    const totalMedium = getCount(allQuestions, "Medium") || 0;
    const totalHard = getCount(allQuestions, "Hard") || 0;

    const totalAttempts = getCount(totalSubmissions, "All");
    const acceptanceRate =
      totalAttempts > 0 ? Number(((totalSolved / totalAttempts) * 100).toFixed(1)) : 0;

    const result: LeetCodeStats = {
      username: matchedUser.username,
      totalSolved,
      totalQuestions,
      easySolved,
      totalEasy,
      mediumSolved,
      totalMedium,
      hardSolved,
      totalHard,
      acceptanceRate,
      ranking: matchedUser.profile?.ranking || 0,
      streak: matchedUser.userCalendar?.streak || 0,
    };
    if (!customUsername) {
      leetcodeCache = result;
    }
    return result;
  } catch (error) {
    console.error("[LeetCode API] Fetch error:", error);
    return { ...EMPTY_STATS, username };
  }
}
