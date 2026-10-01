import { motion } from "motion/react";
import type { LeetCodeStats } from "@/lib/api/types";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Code2, ArrowUpRight } from "lucide-react";
import { useTranslations } from "@/i18n/utils";

interface LeetCodeCardProps {
  stats: LeetCodeStats;
  lang?: string;
}

export function LeetCodeCard({ stats, lang = "fr" }: LeetCodeCardProps) {
  const t = useTranslations(lang);
  const easyPercent = stats.totalEasy > 0 ? Math.min(Math.round((stats.easySolved / stats.totalEasy) * 100), 100) : 0;
  const mediumPercent = stats.totalMedium > 0 ? Math.min(Math.round((stats.mediumSolved / stats.totalMedium) * 100), 100) : 0;
  const hardPercent = stats.totalHard > 0 ? Math.min(Math.round((stats.hardSolved / stats.totalHard) * 100), 100) : 0;

  const startRanking = stats.ranking > 0 ? Math.min(Math.round(stats.ranking * 2.2), 999999) : 0;

  return (
    <div className="metrics-card">
      <div>
        {/* Card Header */}
        <div className="metrics-card__header">
          <div className="metrics-card__title-group">
            <div className="metrics-card__icon-box">
              <Code2 style={{ width: "1.1rem", height: "1.1rem" }} />
            </div>
            <div>
              <h3 className="metrics-card__title">LeetCode</h3>
              <a
                href={`https://leetcode.com/u/${stats.username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="metrics-card__profile-link"
                aria-label={`Profil LeetCode @${stats.username}`}
              >
                <span>@{stats.username || "profil"}</span>
                <ArrowUpRight style={{ width: "0.75rem", height: "0.75rem" }} />
              </a>
            </div>
          </div>

          {/* Clean Rank */}
          <div className="metrics-card__rank">
            <span className="metrics-card__rank-label">
              {t("metrics.leetcode.global_rank")}
            </span>
            <span className="metrics-card__rank-value">
              #<AnimatedNumber value={stats.ranking} startFrom={startRanking} stiffness={70} damping={16} />
            </span>
          </div>
        </div>

        {/* Hero Number */}
        <div className="leetcode-hero">
          <div className="leetcode-hero__number-row">
            <span className="leetcode-hero__big-number">
              <AnimatedNumber value={stats.totalSolved} stiffness={80} damping={18} />
            </span>
            <span className="leetcode-hero__total">
              / {stats.totalQuestions} {t("metrics.leetcode.solved")}
            </span>
          </div>

          {/* Difficulty Gauges */}
          <div className="difficulty-bars">
            {/* Easy */}
            <div>
              <div className="difficulty-bar__header">
                <span className="difficulty-bar__label difficulty-bar__label--easy">Easy</span>
                <span className="difficulty-bar__count">
                  <AnimatedNumber value={stats.easySolved} /> / {stats.totalEasy}
                </span>
              </div>
              <div className="difficulty-bar__track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${easyPercent}%` }}
                  transition={{ type: "spring", stiffness: 75, damping: 16, delay: 0.05 }}
                  className="difficulty-bar__fill difficulty-bar__fill--easy"
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="difficulty-bar__header">
                <span className="difficulty-bar__label difficulty-bar__label--medium">Medium</span>
                <span className="difficulty-bar__count">
                  <AnimatedNumber value={stats.mediumSolved} /> / {stats.totalMedium}
                </span>
              </div>
              <div className="difficulty-bar__track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mediumPercent}%` }}
                  transition={{ type: "spring", stiffness: 75, damping: 16, delay: 0.15 }}
                  className="difficulty-bar__fill difficulty-bar__fill--medium"
                />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="difficulty-bar__header">
                <span className="difficulty-bar__label difficulty-bar__label--hard">Hard</span>
                <span className="difficulty-bar__count">
                  <AnimatedNumber value={stats.hardSolved} /> / {stats.totalHard}
                </span>
              </div>
              <div className="difficulty-bar__track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${hardPercent}%` }}
                  transition={{ type: "spring", stiffness: 75, damping: 16, delay: 0.25 }}
                  className="difficulty-bar__fill difficulty-bar__fill--hard"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="metrics-card__tiles metrics-card__tiles--2" style={{ borderTop: "var(--border-width) solid var(--color-border-soft)", paddingTop: "var(--space-4)" }}>
        <div className="metrics-tile">
          <span className="metrics-tile__label">
            {t("metrics.leetcode.acceptance_rate")}
          </span>
          <span className="metrics-tile__value">
            <AnimatedNumber value={stats.acceptanceRate} decimals={1} />%
          </span>
        </div>

        <div className="metrics-tile">
          <span className="metrics-tile__label">
            {t("metrics.leetcode.active_streak")}
          </span>
          <span className="metrics-tile__value">
            <AnimatedNumber value={stats.streak} />{" "}
            <span style={{ fontSize: "11px", fontWeight: "normal", color: "var(--color-fg-muted)" }}>
              {t("metrics.days")}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
