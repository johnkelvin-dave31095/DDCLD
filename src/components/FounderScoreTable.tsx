import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Factory, Megaphone, Briefcase, X } from "lucide-react";

import styles from "./FounderScoreTable.module.scss";

/* ================= TYPES ================= */

type Criterion = {
  key: string;
  name: string;
  score_key: "weak" | "neutral" | "strong";
  score_value: number;
  rule_description: string;
  answer: string | null;
  sources?: string[];
};

type Area = {
  key: string;
  name: string;
  score_summary: {
    average: number | null;
  };
  criteria: Criterion[];
};

type Props = {
  founder_id: number;
  areas: Area[];
};

/* ================= ICON MAP ================= */

const AREA_ICONS: Record<string, ReactNode> = {
  management: <Users size={16} />,
  industry: <Factory size={16} />,
  marketability: <Megaphone size={16} />,
  business: <Briefcase size={16} />,
};

export default function FounderScoreTable({ areas }: Props) {
  const [activeArea, setActiveArea] = useState<Area | null>(null);

  /* ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveArea(null);
    };

    if (activeArea) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [activeArea]);

  return (
    <>
      <div className={styles.grid}>
        {areas.map((area) => {
          const totalPoints = area.criteria.reduce(
            (sum, c) => sum + c.score_value,
            0,
          );
          const maxPoints = area.criteria.length * 5;
          const avg = area.score_summary?.average ?? 0;
          const progressPercent = maxPoints ? (totalPoints / maxPoints) * 100 : 0;

          const areaColorClass =
            area.key === "management"
              ? styles.management
              : area.key === "industry"
                ? styles.industry
                : area.key === "marketability"
                  ? styles.marketability
                  : styles.business;

          return (
            <div key={area.key} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.title}>
                  <span className={`${styles.iconWrapper} ${areaColorClass}`}>
                    {AREA_ICONS[area.key]}
                  </span>

                  <span className={styles.titleText}>{area.name}</span>
                </div>

                <div className={styles.points}>
                  {totalPoints} / {maxPoints}
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${areaColorClass}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <button
                type="button"
                className={styles.breakdownBtn}
                onClick={() => setActiveArea(area)}
              >
                View Breakdown
              </button>

              <div className={styles.footerRow}>
                <span>Average Score</span>
                <strong>{avg.toFixed(2)}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}

      <AnimatePresence>
        {activeArea && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveArea(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>{activeArea.name}</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setActiveArea(null)}
                  aria-label="Close breakdown"
                >
                  <X size={18} />
                </button>
              </div>

              <div className={styles.modalContent}>
                {activeArea.criteria.map((c) => (
                  <div key={c.key} className={styles.criterion}>
                    <div className={styles.criterionHeader}>
                      <span>{c.name}</span>
                      <span
                        className={`${styles.score} ${styles[c.score_key]}`}
                      >
                        {c.score_value}
                      </span>
                    </div>

                    <div className={styles.answerBox}>{c.answer || "-"}</div>

                    <div className={styles.rule}>
                      <strong>Rule:</strong> {c.rule_description}
                    </div>

                    {c.sources && c.sources.length > 0 && (
                      <div className={styles.sources}>
                        <strong>Sources:</strong> {c.sources.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
