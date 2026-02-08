import { useState } from "react";
import type { ReactNode } from "react";

import { Users, Factory, Megaphone, Briefcase } from "lucide-react";

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
    min: number | null;
    max: number | null;
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

/* ================= COMPONENT ================= */

export default function FounderScoreTable({ areas }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  // 🔑 TOTAL SCORE = SUM of all criteria scores
  // const totalScore = areas.reduce(
  //   (sum, area) => sum + area.criteria.reduce((s, c) => s + c.score_value, 0),
  //   0,
  // );

  // const risk = getRiskProfile(totalScore);

  return (
    <div className={styles.wrapper}>
      {/* ================= LEFT: SCORE CARDS ================= */}
      <div className={styles.grid}>
        {areas.map((area) => (
          <div key={area.key} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                {AREA_ICONS[area.key] && (
                  <span className={styles.titleIcon}>
                    {AREA_ICONS[area.key]}
                  </span>
                )}
                {area.name}
              </h3>
            </div>

            <div className={styles.criteria}>
              {area.criteria.map((c) => {
                const key = `${area.key}:${c.key}`;
                const isOpen = openKey === key;

                return (
                  <div key={key} className={styles.criterionRow}>
                    <button
                      type="button"
                      className={`${styles.criterionHeader} ${
                        isOpen ? styles.active : ""
                      }`}
                      onClick={() => setOpenKey(isOpen ? null : key)}
                    >
                      <span className={styles.criterionName}>{c.name}</span>

                      <span
                        className={`${styles.score} ${styles[c.score_key]}`}
                      >
                        {c.score_value}
                      </span>
                    </button>

                    {isOpen && (
                      <div className={styles.details}>
                        <div
                          className={
                            c.answer === "Not mentioned in provided materials."
                              ? styles.missing
                              : styles.answer
                          }
                        >
                          {c.answer || "—"}
                        </div>

                        <div className={styles.rule}>
                          Rule: {c.rule_description}
                        </div>

                        {c.sources && c.sources.length > 0 && (
                          <div className={styles.sources}>
                            Sources: {c.sources.join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ================= RIGHT: TOTAL SCORE ================= */}
      {/* <div className={styles.scoreHero}>
        <div className={`${styles.scoreCircle} ${styles[risk.className]}`}>
          <span className={styles.scoreValue}>{totalScore}</span>
        </div>

        <div className={styles.scoreMeta}>
          <div className={styles.scoreLabel}>{risk.label}</div>
          <div className={styles.scoreRange}>Score Range: {risk.range}</div>
        </div>
      </div> */}
    </div>
  );
}

/* ================= HELPERS ================= */

// function getRiskProfile(score: number) {
//   if (score >= 85)
//     return {
//       label: "Very Attractive",
//       range: "85 – 100",
//       className: "veryAttractive",
//     };
//   if (score >= 65)
//     return {
//       label: "Attractive",
//       range: "65 – 84",
//       className: "attractive",
//     };
//   if (score >= 45)
//     return {
//       label: "Acceptable",
//       range: "45 – 64",
//       className: "acceptable",
//     };
//   if (score >= 30)
//     return {
//       label: "Cautionary",
//       range: "30 – 44",
//       className: "cautionary",
//     };
//   if (score >= 15)
//     return {
//       label: "Unsatisfactory",
//       range: "15 – 29",
//       className: "unsatisfactory",
//     };
//   return {
//     label: "Unacceptable",
//     range: "0 – 14",
//     className: "unacceptable",
//   };
// }
