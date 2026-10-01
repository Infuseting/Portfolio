import { getGitHubContributions, getGitHubLanguages } from "./github";
import { getGiteaContributions, getGiteaLanguages } from "./gitea";
import type { ContributionDay, GitActivitySummary, LanguageStat } from "./types";

const LINGUIST_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  PHP: "#4F5D95",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Lua: "#000080",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Shell: "#89e051",
  Astro: "#ff5a03",
  Vue: "#41b883",
  Swift: "#F05138",
  Ruby: "#701516",
  SCSS: "#c6538c",
  Dockerfile: "#384d54",
  Hack: "#878787",
  PowerShell: "#012456",
  Blade: "#f7523f",
  CMake: "#DA3434",
  PureBasic: "#5a6986",
  Fluent: "#0078d4",
  Autres: "#64748b",
  Other: "#64748b",
};

let languagesCache: LanguageStat[] | null = null;

export async function getUnifiedLanguages(): Promise<LanguageStat[]> {
  if (languagesCache) {
    return languagesCache;
  }

  const [ghMap, gtMap] = await Promise.all([
    getGitHubLanguages(),
    getGiteaLanguages(),
  ]);

  const combinedMap = new Map<string, { size: number; color: string }>();

  // Ingestion GitHub
  for (const [name, { size, color }] of ghMap.entries()) {
    if (name === "PureBasic") continue;
    combinedMap.set(name, {
      size,
      color: color || LINGUIST_COLORS[name] || "#888888",
    });
  }

  // Ingestion Gitea
  for (const [name, size] of gtMap.entries()) {
    // Exclusion du faux positif PureBasic (fichiers modèles TensorFlow/Protobuf .pb)
    if (name === "PureBasic") continue;

    const existing = combinedMap.get(name);
    if (existing) {
      existing.size += size;
    } else {
      combinedMap.set(name, {
        size,
        color: LINGUIST_COLORS[name] || "#888888",
      });
    }
  }

  let totalBytes = 0;
  for (const { size } of combinedMap.values()) {
    totalBytes += size;
  }

  if (totalBytes === 0) return [];

  // Tri par taille de code décroissante
  const rawList = Array.from(combinedMap.entries())
    .map(([name, { size, color }]) => ({
      name,
      color,
      size,
      percentage: Number(((size / totalBytes) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.size - a.size);

  const mainLanguages: LanguageStat[] = [];
  let otherBytes = 0;
  const otherNames: string[] = [];

  for (const item of rawList) {
    if (item.percentage >= 0.8) {
      mainLanguages.push(item);
    } else {
      otherBytes += item.size;
      otherNames.push(item.name);
    }
  }

  if (otherBytes > 0) {
    const otherPct = Number(((otherBytes / totalBytes) * 100).toFixed(1));
    mainLanguages.push({
      name: "Autres",
      color: "#64748b",
      size: otherBytes,
      percentage: otherPct,
      details: otherNames.slice(0, 6).join(", ") + (otherNames.length > 6 ? "…" : ""),
    });
  }

  languagesCache = mainLanguages;
  return mainLanguages;
}

const activityCache = new Map<number, GitActivitySummary>();

export async function getUnifiedGitActivity(targetYear?: number): Promise<GitActivitySummary> {
  const currentYear = new Date().getFullYear();
  const year = targetYear || currentYear;

  if (activityCache.has(year)) {
    return activityCache.get(year)!;
  }

  // Calcul dynamique des années en fonction de l'année actuelle (ex: 2026, 2025, 2024)
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  // Exécution parallèle pour l'année ciblée et les langages unifiés (GitHub + Gitea)
  const [githubMap, giteaMap, languages] = await Promise.all([
    getGitHubContributions(year),
    getGiteaContributions(year),
    getUnifiedLanguages(),
  ]);

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const now = new Date();

  const days: ContributionDay[] = [];
  let githubTotal = 0;
  let giteaTotal = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let elapsedDaysCount = 0;
  let activeDays = 0;
  let maxDayContributions = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const isFuture = d > now;
    const dateStr = d.toISOString().split("T")[0];
    const ghCount = isFuture ? 0 : githubMap.get(dateStr) || 0;
    const gtCount = isFuture ? 0 : giteaMap.get(dateStr) || 0;
    const combinedCount = ghCount + gtCount;

    if (!isFuture) {
      githubTotal += ghCount;
      giteaTotal += gtCount;
      elapsedDaysCount += 1;
    }

    // Calcul du niveau d'activité (0 à 4)
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (combinedCount >= 10) level = 4;
    else if (combinedCount >= 6) level = 3;
    else if (combinedCount >= 3) level = 2;
    else if (combinedCount >= 1) level = 1;

    days.push({
      date: dateStr,
      count: combinedCount,
      githubCount: ghCount,
      giteaCount: gtCount,
      level,
    });

    // Calcul des streaks et jours actifs
    if (!isFuture) {
      if (combinedCount > 0) {
        activeDays += 1;
        if (combinedCount > maxDayContributions) {
          maxDayContributions = combinedCount;
        }
        tempStreak += 1;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
  }

  currentStreak = tempStreak;
  const totalContributions = githubTotal + giteaTotal;

  // Calcul du grand total absolu combinant toutes les années disponibles ("affiche vraiment tout")
  const otherYearsPromises = availableYears
    .filter((y) => y !== year)
    .map(async (y) => {
      const [gh, gt] = await Promise.all([
        getGitHubContributions(y),
        getGiteaContributions(y),
      ]);
      let sum = 0;
      for (const val of gh.values()) sum += val;
      for (const val of gt.values()) sum += val;
      return sum;
    });

  const otherSums = await Promise.all(otherYearsPromises);
  const allTimeTotal = totalContributions + otherSums.reduce((acc, s) => acc + s, 0);

  // Moyennes sur les jours écoulés de l'année sélectionnée
  const elapsedWeeks = Math.max(Math.ceil(elapsedDaysCount / 7), 1);
  const averagePerWeek = Number((totalContributions / elapsedWeeks).toFixed(1));
  const elapsedMonths = Math.max(Math.ceil(elapsedDaysCount / 30.4), 1);
  const averagePerMonth = Math.round(totalContributions / elapsedMonths);

  const ratioGitHub =
    totalContributions > 0 ? Math.round((githubTotal / totalContributions) * 100) : 0;
  const ratioGitea =
    totalContributions > 0 ? 100 - ratioGitHub : 0;

  const result: GitActivitySummary = {
    year,
    totalContributions,
    averagePerWeek,
    averagePerMonth,
    currentStreak: year === currentYear ? currentStreak : 0,
    longestStreak,
    githubTotal,
    giteaTotal,
    ratioGitHub,
    ratioGitea,
    days,
    availableYears,
    allTimeTotal,
    activeDays,
    maxDayContributions,
    languages,
  };

  activityCache.set(year, result);
  return result;
}
