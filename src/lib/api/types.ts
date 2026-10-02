export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  streak: number;
}

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number; // Somme ou moyenne combinée
  githubCount: number;
  giteaCount: number;
  level: 0 | 1 | 2 | 3 | 4; // Intensité d'activité
}

export interface GitActivitySummary {
  year: number;
  totalContributions: number;
  averagePerWeek: number;
  averagePerMonth: number;
  currentStreak: number;
  longestStreak: number;
  githubTotal: number;
  giteaTotal: number;
  ratioGitHub: number; // 0 - 100%
  ratioGitea: number; // 0 - 100%
  days: ContributionDay[];
  availableYears: number[];
  allTimeTotal: number;
  activeDays: number;
  maxDayContributions: number;
  languages: LanguageStat[];
}

export interface LanguageStat {
  name: string;
  color: string;
  size: number; // Taille en octets
  percentage: number; // 0 - 100%
  details?: string; // Détails des langages mineurs (ex: pour "Autres")
}

export interface VercelAnalyticsStats {
  configured: boolean;
  pageviews: number;
  visitors: number;
}
