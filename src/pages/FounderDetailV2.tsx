import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import loadingAnim from "../assets/search.json";

import { post } from "../api/http";
import { getFounderScore } from "../api/founders";
import type { FounderScore } from "../api/founders";

import FounderScoreTable from "../components/FounderScoreTable";

import FinancialHelpRef from "../components/FinancialHelpRef";

import GeneratePdfModal from "../components/GeneratePDFModal";

import { BarChart3, TrendingUp, FileText, FileDown } from "lucide-react";

import styles from "./FounderDetailV2.module.scss";

type DetailResponse = {
  company_name: string;
};

type FinancialDetails = {
  financial_assessment?: Record<string, number | null>;
  pro_forma_outputs?: Record<string, number | null>;
};

type FinancialsVM = {
  metric_scores?: {
    historical?: Record<string, number>;
    proforma?: Record<string, number>;
  };
  details?: FinancialDetails | null;
};

type RiskSummaryItem = {
  deal_type_id: string;
  financial_historical: { score: number; weight: number };
  financial_proforma: { score: number; weight: number };
  qualitative: { score: number; weight: number };
  total_weighted_score: number;
  risk_label: string;
  risk_code: number;
};

type FounderScoreVM = FounderScore & {
  financials?: FinancialsVM | null;
  risk_summary?: RiskSummaryItem[];
};

const DEAL_TYPES = [
  { id: "9578d377-8fb6-4519-bf05-c289de7da090", label: "Growth Equity" },
  { id: "df71eca9-342f-4e45-9931-2f5580a6d837", label: "Secondaries" },
  { id: "73be9f34-59a2-4f75-8944-98c883694c5b", label: "Venture Debt" },
  { id: "151ee764-a374-4886-b56c-f52ec315b7c1", label: "Venture Capital" },
];

const FINANCIAL_ROWS = [
  { key: "ARR_percent", label: "ARR %" },
  { key: "YoY_revenue_growth_pct", label: "YoY Revenue Growth" },
  { key: "Runway_months", label: "Runway" },
  { key: "Average_gross_margin_pct", label: "Average Gross Margin" },
  { key: "Recurring_revenue_pct", label: "% Avg. Recurring Revenue" },
  { key: "Total_assets_to_debt", label: "Total Assets / Total Debt" },
  { key: "LTV_to_CAC", label: "LTV / CAC" },
  { key: "CAC_payback_months", label: "CAC Payback" },
  { key: "DSCR", label: "DSCR" },
];

export default function FounderDetailV2() {
  const { founderId } = useParams<{ founderId: string }>();
  const navigate = useNavigate();
  const founder_id = Number(founderId);

  const [, setCompanyName] = useState("—");
  const [score, setScore] = useState<FounderScoreVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFinancialHelp, setShowFinancialHelp] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [activeDealType, setActiveDealType] = useState(DEAL_TYPES[0].id);

  useEffect(() => {
    if (!founder_id) return;

    Promise.all([
      post<DetailResponse>("/founders", { founder_id }),
      getFounderScore(founder_id),
    ]).then(([detailRes, scoreRes]) => {
      setCompanyName(detailRes.company_name ?? "—");
      setScore(scoreRes as FounderScoreVM);
      setLoading(false);
    });
  }, [founder_id]);

  useEffect(() => {
    if (!showFinancialHelp) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFinancialHelp(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [showFinancialHelp]);

  const metricScores = score?.financials?.metric_scores ?? {};
  const financialDetails = score?.financials?.details ?? null;

  const risk = score?.risk_summary?.find(
    (r) => r.deal_type_id === activeDealType,
  );

  const historicalTotal = useMemo(() => {
    if (!metricScores?.historical) return 0;
    return Object.values(metricScores.historical).reduce(
      (sum, val) => sum + Number(val || 0),
      0,
    );
  }, [metricScores]);

  const proformaTotal = useMemo(() => {
    if (!metricScores?.proforma) return 0;
    return Object.values(metricScores.proforma).reduce(
      (sum, val) => sum + Number(val || 0),
      0,
    );
  }, [metricScores]);

  // ✅ Added helper (no logic removed)
  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined) return "-";

    const num = Number(value);
    const lowerKey = key.toLowerCase();

    // Percent-based metrics (FIRST — important)
    if (lowerKey.includes("percent") || lowerKey.includes("pct")) {
      return `${num.toFixed(1)}%`;
    }

    // Months
    if (lowerKey.includes("months")) {
      return `${num.toFixed(1)} mo`;
    }

    // Currency (but exclude ARR_percent)
    if (
      lowerKey.includes("revenue") ||
      lowerKey.includes("cash") ||
      lowerKey.includes("debt") ||
      lowerKey.includes("assets")
    ) {
      return `$${num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`;
    }

    return num.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  // if (loading || !score) {
  //   return (
  //     <div className={styles.loadingWrap}>
  //       <Lottie animationData={loadingAnim} loop />
  //       <p>Loading assessment…</p>
  //     </div>
  //   );
  // }
  if (loading || !score) {
    return (
      <div className={styles.loadingWrap}>
        <Lottie
          animationData={loadingAnim}
          loop
          className={styles.loadingAnim}
        />
        {/* <p className={styles.loadingText}>Loading assessment…</p> */}
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <button
              className={styles.back}
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Opportunity
            </button>
            <p className={styles.subtitle}>Founder ID: {founder_id}</p>
          </div>

          {/* <button
            className={styles.ctaBtn}
            onClick={() => setShowFinancialHelp(true)}
          >
            <FileText size={18} />
            View Financial Sources
          </button> */}

          <div className={styles.topActions}>
            <button
              className={styles.ctaBtn}
              onClick={() => setShowFinancialHelp(true)}
            >
              <FileText size={18} />
              View Financial Sources
            </button>

            <button
              className={styles.ctaBtn}
              onClick={() => setShowPdfModal(true)}
            >
              <FileDown size={18} />
              Generate PDF Report
            </button>
          </div>
        </div>

        {risk && (
          <div className={styles.heroWrapper}>
            <div className={styles.heroCard}>
              <h2>Risk Assessment</h2>
              <div className={styles.heroScore}>
                {risk.total_weighted_score.toFixed(2)}
              </div>

              <div className={styles.riskBadge}>{risk.risk_label}</div>

              <div className={styles.dealTypeTabs}>
                {DEAL_TYPES.map((dt) => (
                  <button
                    key={dt.id}
                    className={`${styles.dealTab} ${
                      activeDealType === dt.id ? styles.active : ""
                    }`}
                    onClick={() => setActiveDealType(dt.id)}
                  >
                    {dt.label}
                  </button>
                ))}
              </div>

              <div className={styles.heroBreakdown}>
                <div className={styles.breakdownItem}>
                  <span>Historical</span>
                  <strong>{risk.financial_historical.score}</strong>
                  <div className={styles.progressMini}>
                    <div
                      className={`${styles.progressMiniFill} ${styles.greenBar}`}
                      style={{ width: `${risk.financial_historical.score}%` }}
                    />
                  </div>
                  <small>{risk.financial_historical.weight}% Weight</small>
                </div>

                <div className={styles.breakdownItem}>
                  <span>Pro Forma</span>
                  <strong>{risk.financial_proforma.score}</strong>
                  <div className={styles.progressMini}>
                    <div
                      className={`${styles.progressMiniFill} ${styles.grayBar}`}
                      style={{ width: `${risk.financial_proforma.score}%` }}
                    />
                  </div>
                  <small>{risk.financial_proforma.weight}% Weight</small>
                </div>

                <div className={styles.breakdownItem}>
                  <span>Qualitative</span>
                  <strong>{risk.qualitative.score}</strong>
                  <div className={styles.progressMini}>
                    <div
                      className={`${styles.progressMiniFill} ${styles.orangeBar}`}
                      style={{ width: `${risk.qualitative.score}%` }}
                    />
                  </div>
                  <small>{risk.qualitative.weight}% Weight</small>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.content}>
          <FounderScoreTable founder_id={founder_id} areas={score.areas} />

          <div className={styles.bottomGrid}>
            {/* Financial – Historical */}
            <div className={styles.card}>
              <h3>
                <BarChart3 size={16} /> Financial – Historical
              </h3>

              {FINANCIAL_ROWS.map((row) => {
                const scoreValue = metricScores?.historical?.[row.key] ?? 0;

                const inputValue =
                  financialDetails?.financial_assessment?.[row.key];

                return (
                  <div key={row.key} className={styles.metricBlock}>
                    <div className={styles.metricHeader}>
                      <span className={styles.metricLabel}>{row.label}</span>

                      <div className={styles.metricRight}>
                        <span className={styles.inputValue}>
                          {formatValue(inputValue, row.key)}
                        </span>

                        {/* Plain score number */}
                        <strong className={styles.scoreValue}>
                          {scoreValue}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${
                          scoreValue >= 75
                            ? styles.barHigh
                            : scoreValue >= 50
                              ? styles.barMid
                              : styles.barLow
                        }`}
                        style={{ width: `${scoreValue}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className={styles.totalRow}>
                Section Total
                <strong>{historicalTotal}</strong>
              </div>
            </div>

            {/* Financial – Pro Forma */}
            <div className={styles.card}>
              <h3>
                <TrendingUp size={16} /> Financial – Pro Forma
              </h3>

              {FINANCIAL_ROWS.map((row) => {
                const scoreValue = metricScores?.proforma?.[row.key] ?? 0;

                const inputValue =
                  financialDetails?.pro_forma_outputs?.[row.key];

                return (
                  <div key={row.key} className={styles.metricBlock}>
                    <div className={styles.metricHeader}>
                      <span>{row.label}</span>

                      <div className={styles.metricValues}>
                        <span className={styles.inputValue}>
                          {formatValue(inputValue, row.key)}
                        </span>
                        <strong>{scoreValue}</strong>
                      </div>
                    </div>

                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${scoreValue}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className={styles.totalRow}>
                Section Total
                <strong>{proformaTotal}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFinancialHelp && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCenter}>
            <div className={styles.modalShell}>
              <div className={styles.modalScroll}>
                <FinancialHelpRef
                  founder_id={founder_id}
                  onClose={() => setShowFinancialHelp(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showPdfModal && (
        <GeneratePdfModal
          founder_id={founder_id}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
}
