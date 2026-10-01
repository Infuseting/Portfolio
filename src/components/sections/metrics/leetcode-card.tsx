import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { LeetCodeStats } from "@/lib/api/types";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Code2, ArrowUpRight } from "lucide-react";
import { useTranslations } from "@/i18n/utils";

interface LeetCodeCardProps {
  stats?: LeetCodeStats | null;
  lang?: string;
}

export function LeetCodeCardSkeletonContent() {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: "100%" }}
    >
      <div>
        {/* Card Header Skeleton */}
        <div className="metrics-card__header">
          <div className="metrics-card__title-group">
            <div className="metrics-card__icon-box" style={{ background: "var(--color-bg-inset)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div className="skeleton-box" style={{ width: "90px", height: "18px" }} />
              <div className="skeleton-box" style={{ width: "65px", height: "12px", opacity: 0.7 }} />
            </div>
          </div>

          {/* Clean Rank Skeleton */}
          <div className="metrics-card__rank" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
            <div className="skeleton-box" style={{ width: "65px", height: "10px", opacity: 0.6 }} />
            <div className="skeleton-box" style={{ width: "55px", height: "18px" }} />
          </div>
        </div>

        {/* Hero Number Skeleton */}
        <div className="leetcode-hero">
          <div className="leetcode-hero__number-row" style={{ alignItems: "baseline", gap: "10px" }}>
            <div className="skeleton-box" style={{ width: "75px", height: "46px" }} />
            <div className="skeleton-box" style={{ width: "120px", height: "18px", opacity: 0.7 }} />
          </div>

          {/* Difficulty Gauges Skeleton */}
          <div className="difficulty-bars">
            {/* Easy */}
            <div>
              <div className="difficulty-bar__header">
                <div className="skeleton-box" style={{ width: "42px", height: "13px" }} />
                <div className="skeleton-box" style={{ width: "55px", height: "13px", opacity: 0.7 }} />
              </div>
              <div className="difficulty-bar__track">
                <div className="skeleton-box" style={{ width: "35%", height: "100%", opacity: 0.75 }} />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="difficulty-bar__header">
                <div className="skeleton-box" style={{ width: "52px", height: "13px" }} />
                <div className="skeleton-box" style={{ width: "55px", height: "13px", opacity: 0.7 }} />
              </div>
              <div className="difficulty-bar__track">
                <div className="skeleton-box" style={{ width: "20%", height: "100%", opacity: 0.75 }} />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="difficulty-bar__header">
                <div className="skeleton-box" style={{ width: "40px", height: "13px" }} />
                <div className="skeleton-box" style={{ width: "55px", height: "13px", opacity: 0.7 }} />
              </div>
              <div className="difficulty-bar__track">
                <div className="skeleton-box" style={{ width: "10%", height: "100%", opacity: 0.75 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Skeleton */}
      <div
        className="metrics-card__tiles metrics-card__tiles--2"
        style={{ borderTop: "var(--border-width) solid var(--color-border-soft)", paddingTop: "var(--space-4)" }}
      >
        <div className="metrics-tile">
          <div className="skeleton-box" style={{ width: "85px", height: "11px", opacity: 0.6 }} />
          <div className="skeleton-box" style={{ width: "60px", height: "22px", marginTop: "6px" }} />
        </div>

        <div className="metrics-tile">
          <div className="skeleton-box" style={{ width: "80px", height: "11px", opacity: 0.6 }} />
          <div className="skeleton-box" style={{ width: "65px", height: "22px", marginTop: "6px" }} />
        </div>
      </div>
    </div>
  );
}

export function LeetCodeCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="metrics-card metrics-card--skeleton"
    >
      <LeetCodeCardSkeletonContent />
    </div>
  );
}

export function LeetCodeCard({ stats: initialStats, lang = "fr" }: LeetCodeCardProps) {
  const [stats, setStats] = useState<LeetCodeStats | null>(initialStats ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialStats);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations(lang);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/leetcode.json");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setStats(data);
            setIsLoading(false);
          }
        } else {
          console.warn("[LeetCodeCard] /api/leetcode.json returned status", res.status);
          if (isMounted) setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load LeetCode stats", err);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [initialStats]);

  const isContentReady = !isLoading && stats !== null;
  const isAnimateActive = isContentReady && (isInView || hasMounted);

  const easyPercent = stats && stats.totalEasy > 0 ? Math.min(Math.round((stats.easySolved / stats.totalEasy) * 100), 100) : 0;
  const mediumPercent = stats && stats.totalMedium > 0 ? Math.min(Math.round((stats.mediumSolved / stats.totalMedium) * 100), 100) : 0;
  const hardPercent = stats && stats.totalHard > 0 ? Math.min(Math.round((stats.hardSolved / stats.totalHard) * 100), 100) : 0;

  const startRanking = stats && stats.ranking > 0 ? Math.min(Math.round(stats.ranking * 2.2), 999999) : 0;

  return (
    <motion.div
      ref={cardRef}
      className={`metrics-card ${!isContentReady ? "metrics-card--skeleton" : ""}`}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      animate={isInView || hasMounted ? { opacity: 1, y: 0 } : shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 28,
        mass: 0.8,
      }}
    >
      {!isContentReady || !stats ? (
        <LeetCodeCardSkeletonContent />
      ) : (
        <>
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
                    start={isAnimateActive}
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
                    start={isAnimateActive}
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
                      <AnimatedNumber value={stats.easySolved} start={isAnimateActive} /> / {stats.totalEasy}
                    </span>
                  </div>
                  <div className="difficulty-bar__track">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isAnimateActive ? { width: `${easyPercent}%` } : { width: 0 }}
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
                      <AnimatedNumber value={stats.mediumSolved} start={isAnimateActive} /> / {stats.totalMedium}
                    </span>
                  </div>
                  <div className="difficulty-bar__track">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isAnimateActive ? { width: `${mediumPercent}%` } : { width: 0 }}
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
                      <AnimatedNumber value={stats.hardSolved} start={isAnimateActive} /> / {stats.totalHard}
                    </span>
                  </div>
                  <div className="difficulty-bar__track">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isAnimateActive ? { width: `${hardPercent}%` } : { width: 0 }}
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
                <AnimatedNumber value={stats.acceptanceRate} decimals={1} start={isAnimateActive} />%
              </span>
            </div>

            <div className="metrics-tile">
              <span className="metrics-tile__label">
                {t("metrics.leetcode.active_streak")}
              </span>
              <span className="metrics-tile__value">
                <AnimatedNumber value={stats.streak} start={isAnimateActive} />{" "}
                <span style={{ fontSize: "11px", fontWeight: "normal", color: "var(--color-fg-muted)" }}>
                  {t("metrics.days")}
                </span>
              </span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// Compound export adhering to component-skeleton-contract
LeetCodeCard.Skeleton = LeetCodeCardSkeleton;
