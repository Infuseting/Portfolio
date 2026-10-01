import { useState } from "react";
import { motion } from "motion/react";
import type { GitActivitySummary, ContributionDay } from "@/lib/api/types";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { GitCommit } from "lucide-react";
import { useTranslations } from "@/i18n/utils";

interface GitActivityCardProps {
  initialData: GitActivitySummary;
  yearCache?: Record<number, GitActivitySummary>;
  lang?: string;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function GitActivityCard({ initialData, yearCache: preloadedYearCache, lang = "fr" }: GitActivityCardProps) {
  const t = useTranslations(lang);
  const [yearCache, setYearCache] = useState<Record<number, GitActivitySummary>>(
    preloadedYearCache || { [initialData.year]: initialData }
  );
  const [selectedYear, setSelectedYear] = useState<number>(initialData.year);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [hoveredLang, setHoveredLang] = useState<{
    name: string;
    color: string;
    percentage: number;
    size: number;
    midX: number;
  } | null>(null);

  const sortedYears = [...initialData.availableYears].sort((a, b) => b - a);
  const currentData = yearCache[selectedYear] || initialData;

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];

  const handleYearChange = async (year: number) => {
    if (year === selectedYear) return;
    setSelectedYear(year);

    if (yearCache[year]) {
      return;
    }

    try {
      const res = await fetch(`/api/activity.json?year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setYearCache((prev) => ({ ...prev, [year]: data }));
      }
    } catch (e) {
      console.error("Failed to load year activity", e);
    }
  };

  const weeks: Array<ContributionDay[]> = [];
  let currentWeek: ContributionDay[] = [];

  currentData.days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === currentData.days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

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

  const languages = initialData.languages || currentData.languages || [];
  const totalCodeBytes = languages.reduce((acc, curr) => acc + curr.size, 0);

  let accumulatedPercent = 0;
  const segmentsWithPos = languages.map((item) => {
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

  return (
    <div className="metrics-card">
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
              <button
                key={year}
                type="button"
                onClick={() => handleYearChange(year)}
                className={`metrics-card__year-btn ${selectedYear === year ? "metrics-card__year-btn--active" : ""}`}
                aria-label={`Année ${year}`}
              >
                {year}
              </button>
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
                <AnimatedNumber value={currentData.allTimeTotal} stiffness={85} damping={18} />
              </span>
              <span className="metrics-tile__subtext">
                <AnimatedNumber value={currentData.totalContributions} /> {t("metrics.git.in_year")} {selectedYear}
              </span>
            </div>
          </div>

          <div className="metrics-tile">
            <span className="metrics-tile__label">
              {t("metrics.git.avg_per_week")}
            </span>
            <span className="metrics-tile__value">
              <AnimatedNumber value={currentData.averagePerWeek} decimals={1} stiffness={85} damping={18} />
            </span>
            <span className="metrics-tile__subtext">
              ~<AnimatedNumber value={currentData.averagePerMonth} /> {t("metrics.git.per_month")}
            </span>
          </div>

          <div className="metrics-tile">
            <span className="metrics-tile__label">
              {t("metrics.git.active_streak")}
            </span>
            <span className="metrics-tile__value">
              <AnimatedNumber value={currentData.currentStreak} stiffness={90} damping={18} />{" "}
              <span style={{ fontSize: "11px", fontWeight: "normal", color: "var(--color-fg-muted)" }}>
                {t("metrics.days")}
              </span>
            </span>
            <span className="metrics-tile__subtext">
              {t("metrics.git.max")}: <AnimatedNumber value={currentData.longestStreak} /> {t("metrics.days")}
            </span>
          </div>

          <div className="metrics-tile">
            <span className="metrics-tile__label">
              {t("metrics.git.active_days")}
            </span>
            <span className="metrics-tile__value">
              <AnimatedNumber value={currentData.activeDays} stiffness={85} damping={18} />{" "}
              <span style={{ fontSize: "11px", fontWeight: "normal", color: "var(--color-fg-muted)" }}>
                {t("metrics.days")}
              </span>
            </span>
            <span className="metrics-tile__subtext">
              {t("metrics.git.peak")}: <AnimatedNumber value={currentData.maxDayContributions} /> / {t("metrics.day")}
            </span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="heatmap-wrap">
          <div className="heatmap__header">
            <span>
              {t("metrics.git.contributions")} ({selectedYear})
            </span>

            {hoveredDay ? (
              <span style={{ color: "var(--color-fg)", fontWeight: "bold" }}>
                {hoveredDay.count} {hoveredDay.count > 1 ? "commits" : "commit"} · {hoveredDay.date}
                {hoveredDay.date === todayStr ? t("metrics.git.today") : ""}
              </span>
            ) : (
              <span style={{ opacity: 0.6 }}>
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
        </div>

        {/* Languages Bar with bounded tooltip */}
        {languages.length > 0 && (
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
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1,
                }}
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
        )}
      </div>

      {/* Footer Legend */}
      <div className="metrics-card__footer">
        <div>
        </div>
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
    </div>
  );
}
