import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { LeetCodeStats } from "@/lib/api/types";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Code2, ArrowUpRight } from "lucide-react";
import { useTranslations } from "@/i18n/utils";

interface LeetCodeCardProps {
  stats: LeetCodeStats;
  lang?: string;
}

export function LeetCodeCard({ stats, lang = "fr" }: LeetCodeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations(lang);

  const easyPercent = stats.totalEasy > 0 ? Math.min(Math.round((stats.easySolved / stats.totalEasy) * 100), 100) : 0;
  const mediumPercent = stats.totalMedium > 0 ? Math.min(Math.round((stats.mediumSolved / stats.totalMedium) * 100), 100) : 0;
  const hardPercent = stats.totalHard > 0 ? Math.min(Math.round((stats.hardSolved / stats.totalHard) * 100), 100) : 0;

  const startRanking = stats.ranking > 0 ? Math.min(Math.round(stats.ranking * 2.2), 999999) : 0;

  return (
    <motion.div
      ref={cardRef}
      className="metrics-card"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 28,
        mass: 0.8,
      }}
    >
      <div>
        {/* Card Header */}
        <div className="metrics-card__header">
          <div className="metrics-card__title-group">
            <div className="metrics-card__icon-box">
              <Code2 style={{ width: "1.1rem", height: "1.1rem" }} />
            </div>
            <div>
              <h3 className="metrics-card__title">LeetCode</h3>
              <motion.a
                href={`https://leetcode.com/u/${stats.username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="metrics-card__profile-link"
                aria-label={`Profil LeetCode @${stats.username}`}
                whileHover={shouldReduceMotion ? {} : { x: 3 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
              >
                <span>@{stats.username || "profil"}</span>
                <ArrowUpRight style={{ width: "0.75rem", height: "0.75rem" }} />
              </motion.a>
            </div>
          </div>

          {/* Clean Rank */}
          <div className="metrics-card__rank">
            <span className="metrics-card__rank-label">
              {t("metrics.leetcode.global_rank")}
            </span>
            <span className="metrics-card__rank-value">
              #<AnimatedNumber
                value={stats.ranking}
                startFrom={startRanking}
                start={isInView}
                stiffness={75}
                damping={18}
              />
            </span>
          </div>
        </div>

        {/* Hero Number */}
        <div className="leetcode-hero">
          <div className="leetcode-hero__number-row">
            <span className="leetcode-hero__big-number">
              <AnimatedNumber
                value={stats.totalSolved}
                start={isInView}
                stiffness={80}
                damping={18}
              />
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
                  <AnimatedNumber value={stats.easySolved} start={isInView} /> / {stats.totalEasy}
                </span>
              </div>
              <div className="difficulty-bar__track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${easyPercent}%` } : { width: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 85, damping: 17, delay: 0.1 }
                  }
                  className="difficulty-bar__fill difficulty-bar__fill--easy"
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="difficulty-bar__header">
                <span className="difficulty-bar__label difficulty-bar__label--medium">Medium</span>
                <span className="difficulty-bar__count">
                  <AnimatedNumber value={stats.mediumSolved} start={isInView} /> / {stats.totalMedium}
                </span>
              </div>
              <div className="difficulty-bar__track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${mediumPercent}%` } : { width: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 85, damping: 17, delay: 0.2 }
                  }
                  className="difficulty-bar__fill difficulty-bar__fill--medium"
                />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="difficulty-bar__header">
                <span className="difficulty-bar__label difficulty-bar__label--hard">Hard</span>
                <span className="difficulty-bar__count">
                  <AnimatedNumber value={stats.hardSolved} start={isInView} /> / {stats.totalHard}
                </span>
              </div>
              <div className="difficulty-bar__track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${hardPercent}%` } : { width: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 85, damping: 17, delay: 0.3 }
                  }
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
            <AnimatedNumber value={stats.acceptanceRate} decimals={1} start={isInView} />%
          </span>
        </div>

        <div className="metrics-tile">
          <span className="metrics-tile__label">
            {t("metrics.leetcode.active_streak")}
          </span>
          <span className="metrics-tile__value">
            <AnimatedNumber value={stats.streak} start={isInView} />{" "}
            <span style={{ fontSize: "11px", fontWeight: "normal", color: "var(--color-fg-muted)" }}>
              {t("metrics.days")}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
