import { useState, useRef, useEffect, useMemo, memo } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { GitActivitySummary, ContributionDay, LanguageStat } from "@/lib/api/types";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { GitCommit } from "lucide-react";
import { useTranslations } from "@/i18n/utils";
import { useCachedQuery } from "@/lib/cache/use-cached-query";

interface GitActivityCardProps {
  initialData?: GitActivitySummary | null;
  lang?: string;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

const getCellLevelClass = (level: number) => {
  switch (level) {
    case 1:
      return "heatmap__cell--level-1";
    case 2:
      return "heatmap__cell--level-2";
    case 3:
      return "heatmap__cell--level-3";
    case 4:
      return "heatmap__cell--level-4";
    default:
      return "heatmap__cell--level-0";
  }
};

/* ── Compound Subcomponent: Heatmap (Isolated hover state & memoized weeks) ── */
interface GitHeatmapProps {
  days: ContributionDay[];
  selectedYear: number;
  isAnimateActive: boolean;
  shouldReduceMotion: boolean | null;
  lang: string;
}

export const GitHeatmap = memo(function GitHeatmap({
  days,
  selectedYear,
  isAnimateActive,
  shouldReduceMotion,
  lang,
}: GitHeatmapProps) {
  const t = useTranslations(lang);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const todayStr = useMemo(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  }, []);

  // Memoized 53 weeks grouping (rerender-memo)
  const weeks = useMemo(() => {
    const list: Array<ContributionDay[]> = [];
    let currentWeek: ContributionDay[] = [];

    days.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === days.length - 1) {
        list.push(currentWeek);
        currentWeek = [];
      }
    });

    return list;
  }, [days]);

  return (
    <motion.div
      className="heatmap-wrap"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={isAnimateActive ? { opacity: 1 } : shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      <div className="heatmap__header">
        <span className="heatmap__title">
          {t("metrics.git.contributions")} ({selectedYear})
        </span>

        {hoveredDay ? (
          <span className="heatmap__status" style={{ color: "var(--color-fg)", fontWeight: "bold" }}>
            {hoveredDay.count} {hoveredDay.count > 1 ? "commits" : "commit"} · {hoveredDay.date}
            {hoveredDay.date === todayStr ? ` ${t("metrics.git.today")}` : ""}
          </span>
        ) : (
          <span className="heatmap__status" style={{ opacity: 0.6 }}>
            {t("metrics.git.hover_day")}
          </span>
        )}
      </div>

      <div className="heatmap__grid">
        {weeks.map((week, wIndex) => (
          <div key={`${selectedYear}-${wIndex}`} className="heatmap__column">
            {week.map((day) => {
              const isToday = day.date === todayStr;
              return (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`heatmap__cell ${getCellLevelClass(day.level)} ${isToday ? "heatmap__cell--today" : ""}`}
                  aria-label={`${day.count} commits le ${day.date}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
});

/* ── Compound Subcomponent: Languages Bar (Isolated hover state & memoized bounds) ── */
interface GitLanguagesBarProps {
  languages: LanguageStat[];
  isAnimateActive: boolean;
  shouldReduceMotion: boolean | null;
}

export const GitLanguagesBar = memo(function GitLanguagesBar({
  languages,
  isAnimateActive,
  shouldReduceMotion,
}: GitLanguagesBarProps) {
  const [hoveredLang, setHoveredLang] = useState<{
    name: string;
    color: string;
    percentage: number;
    size: number;
    midX: number;
  } | null>(null);

  const segmentsWithPos = useMemo(() => {
    const totalCodeBytes = languages.reduce((acc, curr) => acc + curr.size, 0);
    let accumulatedPercent = 0;
    return languages.map((item) => {
      const widthPercent = totalCodeBytes > 0 ? (item.size / totalCodeBytes) * 100 : item.percentage;
      const startX = accumulatedPercent;
      const midX = startX + widthPercent / 2;
      accumulatedPercent += widthPercent;
      return {
        ...item,
        widthPercent,
        midX,
      };
    });
  }, [languages]);

  if (languages.length === 0) return null;

  return (
    <div className="languages-bar-wrap">
      {hoveredLang && (
        <div
          className="languages-bar__tooltip"
          style={{
            left: `${hoveredLang.midX}%`,
            transform:
              hoveredLang.midX < 18
                ? "translateX(0%)"
                : hoveredLang.midX > 82
                ? "translateX(-100%)"
                : "translateX(-50%)",
          }}
        >
          <div className="languages-bar__tooltip-inner">
            <span className="languages-bar__dot" style={{ backgroundColor: hoveredLang.color }} />
            <span style={{ color: "var(--color-fg)" }}>{hoveredLang.name}</span>
            <span style={{ color: "var(--color-fg-muted)" }}>{hoveredLang.percentage}%</span>
            <span style={{ color: "var(--color-fg-subtle)" }}>({formatBytes(hoveredLang.size)})</span>
          </div>
        </div>
      )}

      <div className="languages-bar__track">
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={isAnimateActive ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 0.25,
                }
          }
          className="languages-bar__inner"
        >
          {segmentsWithPos.map((item) => {
            const isHovered = hoveredLang?.name === item.name;
            return (
              <div
                key={item.name}
                onMouseEnter={() =>
                  setHoveredLang({
                    name: item.name,
                    color: item.color,
                    percentage: item.percentage,
                    size: item.size,
                    midX: item.midX,
                  })
                }
                onMouseLeave={() => setHoveredLang(null)}
                className="languages-bar__segment"
                style={{
                  width: `${item.widthPercent}%`,
                  backgroundColor: item.color,
                  opacity: hoveredLang && !isHovered ? 0.75 : 1,
                }}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
});

export function GitActivityCardSkeletonContent() {
  const dummyYears = [1, 2, 3];

  const dummyWeeks = Array.from({ length: 53 }, (_, wIndex) =>
    Array.from({ length: 7 }, (_, dIndex) => {
      const pattern = (wIndex * 3 + dIndex * 5) % 11;
      let level = 0;
      if (pattern === 0 || pattern === 4) level = 1;
      else if (pattern === 7) level = 2;
      return {
        key: `${wIndex}-${dIndex}`,
        level,
      };
    })
  );

  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: "100%" }}
    >
      <div>
        {/* Header */}
        <div className="metrics-card__header">
          <div className="metrics-card__title-group">
            <div className="metrics-card__icon-box" style={{ background: "var(--color-bg-inset)" }} />
            <div>
              <div className="skeleton-box" style={{ width: "50px", height: "18px" }} />
            </div>
          </div>

          {/* Year Selector Skeleton */}
          <div className="metrics-card__year-selector">
            {dummyYears.map((i) => (
              <div
                key={i}
                className="skeleton-box"
                style={{ width: "46px", height: "26px", borderRadius: "var(--radius-sm)", opacity: i === 1 ? 0.9 : 0.5 }}
              />
            ))}
          </div>
        </div>

        {/* 4 Stats Tiles Skeleton */}
        <div className="metrics-card__tiles metrics-card__tiles--4">
          <div className="metrics-tile">
            <div className="skeleton-box" style={{ width: "65px", height: "10px", opacity: 0.6 }} />
            <div className="skeleton-box" style={{ width: "55px", height: "22px", margin: "5px 0" }} />
            <div className="skeleton-box" style={{ width: "70px", height: "10px", opacity: 0.5 }} />
          </div>

          <div className="metrics-tile">
            <div className="skeleton-box" style={{ width: "70px", height: "10px", opacity: 0.6 }} />
            <div className="skeleton-box" style={{ width: "45px", height: "22px", margin: "5px 0" }} />
            <div className="skeleton-box" style={{ width: "60px", height: "10px", opacity: 0.5 }} />
          </div>

          <div className="metrics-tile">
            <div className="skeleton-box" style={{ width: "65px", height: "10px", opacity: 0.6 }} />
            <div className="skeleton-box" style={{ width: "50px", height: "22px", margin: "5px 0" }} />
            <div className="skeleton-box" style={{ width: "65px", height: "10px", opacity: 0.5 }} />
          </div>

          <div className="metrics-tile">
            <div className="skeleton-box" style={{ width: "65px", height: "10px", opacity: 0.6 }} />
            <div className="skeleton-box" style={{ width: "50px", height: "22px", margin: "5px 0" }} />
            <div className="skeleton-box" style={{ width: "60px", height: "10px", opacity: 0.5 }} />
          </div>
        </div>

        {/* Heatmap Skeleton */}
        <div className="heatmap-wrap">
          <div className="heatmap__header">
            <div className="skeleton-box heatmap__header-skel-title" style={{ width: "100px", height: "12px", opacity: 0.7 }} />
            <div className="skeleton-box heatmap__header-skel-hint" style={{ width: "80px", height: "12px", opacity: 0.5 }} />
          </div>

          <div className="heatmap__grid">
            {dummyWeeks.map((week, wIndex) => (
              <div key={wIndex} className="heatmap__column">
                {week.map((cell) => (
                  <div
                    key={cell.key}
                    className={`heatmap__cell ${cell.level === 2 ? "heatmap__cell--level-2" : cell.level === 1 ? "heatmap__cell--level-1" : "heatmap__cell--level-0"}`}
                    style={{ opacity: cell.level > 0 ? 0.7 : 0.4 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Languages Bar Skeleton */}
        <div className="languages-bar-wrap" style={{ marginTop: "var(--space-4)" }}>
          <div className="languages-bar__track">
            <div className="languages-bar__inner" style={{ height: "8px", width: "100%", display: "flex", gap: "2px" }}>
              <div className="skeleton-box" style={{ width: "45%", height: "100%", opacity: 0.8 }} />
              <div className="skeleton-box" style={{ width: "25%", height: "100%", opacity: 0.65 }} />
              <div className="skeleton-box" style={{ width: "18%", height: "100%", opacity: 0.5 }} />
              <div className="skeleton-box" style={{ width: "12%", height: "100%", opacity: 0.35 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="metrics-card__footer">
        <div />
        <div className="metrics-card__legend-scale" style={{ opacity: 0.5 }}>
          <div className="skeleton-box" style={{ width: "30px", height: "10px" }} />
          <div className="metrics-card__legend-cell" style={{ backgroundColor: "var(--color-bg-inset)" }} />
          <div className="metrics-card__legend-cell" style={{ backgroundColor: "#a3d9de" }} />
          <div className="metrics-card__legend-cell" style={{ backgroundColor: "#4db3be" }} />
          <div className="metrics-card__legend-cell" style={{ backgroundColor: "var(--color-accent)" }} />
          <div className="metrics-card__legend-cell" style={{ backgroundColor: "var(--color-accent-dark)" }} />
          <div className="skeleton-box" style={{ width: "30px", height: "10px" }} />
        </div>
      </div>
    </div>
  );
}

export function GitActivityCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="metrics-card metrics-card--skeleton"
    >
      <GitActivityCardSkeletonContent />
    </div>
  );
}

export function GitActivityCard({ initialData, lang = "fr" }: GitActivityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations(lang);

  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [currentYear] = useState<number>(() => new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState<number>(() => initialData?.year || new Date().getFullYear());

  const { data: currentData, isLoading } = useCachedQuery<GitActivitySummary>({
    key: `portfolio_git_activity_${selectedYear}`,
    ttlMs: 1000 * 60 * 60 * 4,
    minLoadingMs: 800,
    initialData: selectedYear === initialData?.year ? initialData : null,
    fetcher: async (signal) => {
      let res = await fetch(`/api/activity/${selectedYear}.json`, { signal });
      if (!res.ok) {
        res = await fetch(`/api/activity.json?year=${selectedYear}`, { signal });
      }
      if (!res.ok) throw new Error(`Git activity API failed (${res.status})`);
      return res.json();
    },
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isContentReady = !isLoading && currentData !== null;
  const isAnimateActive = isContentReady && (isInView || hasMounted);

  const sortedYears = useMemo(() => {
    return [
      ...(currentData?.availableYears || [currentYear, currentYear - 1, currentYear - 2]),
    ].sort((a, b) => b - a);
  }, [currentData?.availableYears, currentYear]);

  const handleYearChange = (year: number) => {
    if (year === selectedYear) return;
    setSelectedYear(year);
  };

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
        delay: 0.08,
      }}
    >
      {!isContentReady || !currentData ? (
        <GitActivityCardSkeletonContent />
      ) : (
        <motion.div
          key="git-content"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: "100%" }}
        >
          <div>
            {/* Header */}
            <div className="metrics-card__header">
              <div className="metrics-card__title-group">
                <div className="metrics-card__icon-box">
                  <GitCommit style={{ width: "1.1rem", height: "1.1rem" }} />
                </div>
                <div>
                  <h3 className="metrics-card__title">Git</h3>
                </div>
              </div>

              {/* Year Selector */}
              <div className="metrics-card__year-selector">
                {sortedYears.map((year) => (
                  <motion.button
                    key={year}
                    type="button"
                    onClick={() => handleYearChange(year)}
                    className={`metrics-card__year-btn ${selectedYear === year ? "metrics-card__year-btn--active" : ""}`}
                    aria-label={`Année ${year}`}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                  >
                    {year}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 4 Stats Tiles */}
            <div className="metrics-card__tiles metrics-card__tiles--4">
              <div className="metrics-tile">
                <span className="metrics-tile__label">
                  {t("metrics.git.total_global")}
                </span>
                <div>
                  <span className="metrics-tile__value">
                    <AnimatedNumber value={currentData.allTimeTotal} start={isAnimateActive} stiffness={85} damping={18} />
                  </span>
                  <span className="metrics-tile__subtext">
                    <AnimatedNumber value={currentData.totalContributions} start={isAnimateActive} /> {t("metrics.git.in_year")} {selectedYear}
                  </span>
                </div>
              </div>

              <div className="metrics-tile">
                <span className="metrics-tile__label">
                  {t("metrics.git.avg_per_week")}
                </span>
                <span className="metrics-tile__value">
                  <AnimatedNumber value={currentData.averagePerWeek} decimals={1} start={isAnimateActive} stiffness={85} damping={18} />
                </span>
                <span className="metrics-tile__subtext">
                  ~<AnimatedNumber value={currentData.averagePerMonth} start={isAnimateActive} /> {t("metrics.git.per_month")}
                </span>
              </div>

              <div className="metrics-tile">
                <span className="metrics-tile__label">
                  {t("metrics.git.active_streak")}
                </span>
                <span className="metrics-tile__value">
                  <AnimatedNumber
                    value={currentData.currentStreak > 0 ? currentData.currentStreak : (initialData?.currentStreak || currentData.currentStreak)}
                    start={isAnimateActive}
                    stiffness={90}
                    damping={18}
                  />{" "}
                  <span style={{ fontSize: "11px", fontWeight: "normal", color: "var(--color-fg-muted)" }}>
                    {t("metrics.days")}
                  </span>
                </span>
                <span className="metrics-tile__subtext">
                  {t("metrics.git.max")}: <AnimatedNumber value={currentData.longestStreak} start={isAnimateActive} /> {t("metrics.days")}
                </span>
              </div>

              <div className="metrics-tile">
                <span className="metrics-tile__label">
                  {t("metrics.git.active_days")}
                </span>
                <span className="metrics-tile__value">
                  <AnimatedNumber value={currentData.activeDays} start={isAnimateActive} stiffness={85} damping={18} />{" "}
                  <span style={{ fontSize: "11px", fontWeight: "normal", color: "var(--color-fg-muted)" }}>
                    {t("metrics.days")}
                  </span>
                </span>
                <span className="metrics-tile__subtext">
                  {t("metrics.git.peak")}: <AnimatedNumber value={currentData.maxDayContributions} start={isAnimateActive} /> / {t("metrics.day")}
                </span>
              </div>
            </div>

            {/* Heatmap (Memoized Compound Component) */}
            <GitHeatmap
              days={currentData.days}
              selectedYear={selectedYear}
              isAnimateActive={isAnimateActive}
              shouldReduceMotion={shouldReduceMotion}
              lang={lang}
            />

            {/* Languages Bar (Memoized Compound Component) */}
            <GitLanguagesBar
              languages={currentData.languages}
              isAnimateActive={isAnimateActive}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>

          {/* Footer Legend */}
          <div className="metrics-card__footer">
            <div />
            <div className="metrics-card__legend-scale">
              <span>{t("metrics.git.less")}</span>
              <div className="metrics-card__legend-cell" style={{ backgroundColor: "var(--color-bg-inset)" }} />
              <div className="metrics-card__legend-cell" style={{ backgroundColor: "#a3d9de" }} />
              <div className="metrics-card__legend-cell" style={{ backgroundColor: "#4db3be" }} />
              <div className="metrics-card__legend-cell" style={{ backgroundColor: "var(--color-accent)" }} />
              <div className="metrics-card__legend-cell" style={{ backgroundColor: "var(--color-accent-dark)" }} />
              <span>{t("metrics.git.more")}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Compound exports adhering to component-skeleton-contract and vercel-composition-patterns
GitActivityCard.Skeleton = GitActivityCardSkeleton;
GitActivityCard.Heatmap = GitHeatmap;
GitActivityCard.Languages = GitLanguagesBar;
