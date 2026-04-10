import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";

import { post } from "../api/http";
import { getFounderScore } from "../api/founders";
import type { FounderScore } from "../api/founders";
import loadingAnim from "../assets/search.json";

import FinancialHelpRef from "../components/FinancialHelpRef";
import FounderScoreTable from "../components/FounderScoreTable";
import GeneratePdfModal from "../components/GeneratePDFModal";

import {
  ArrowLeft,
  BarChart3,
  BadgeCheck,
  FileDown,
  FileText,
  Scale,
  TrendingUp,
} from "lucide-react";

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

  const [companyName, setCompanyName] = useState("Opportunity");
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
      setCompanyName(detailRes.company_name || "Opportunity");
      setScore(scoreRes as FounderScoreVM);
      setLoading(false);
    });
  }, [founder_id]);

  useEffect(() => {
    if (!showFinancialHelp) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowFinancialHelp(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [showFinancialHelp]);

  const metricScores = useMemo(
    () => score?.financials?.metric_scores ?? {},
    [score],
  );
  const financialDetails = score?.financials?.details ?? null;

  const risk = score?.risk_summary?.find(
    (item) => item.deal_type_id === activeDealType,
  );

  const historicalTotal = useMemo(() => {
    if (!metricScores.historical) return 0;
    return Object.values(metricScores.historical).reduce(
      (sum, value) => sum + Number(value || 0),
      0,
    );
  }, [metricScores]);

  const proformaTotal = useMemo(() => {
    if (!metricScores.proforma) return 0;
    return Object.values(metricScores.proforma).reduce(
      (sum, value) => sum + Number(value || 0),
      0,
    );
  }, [metricScores]);

  const qualitativeAverage = useMemo(() => {
    if (!score?.areas?.length) return 0;

    const total = score.areas.reduce(
      (sum, area) => sum + Number(area.score_summary?.average || 0),
      0,
    );

    return total / score.areas.length;
  }, [score]);

  if (loading || !score) {
    return (
      <div className={styles.loadingWrap}>
        <Lottie animationData={loadingAnim} loop className={styles.loadingAnim} />
        <p className={styles.loadingText}>Loading assessment...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={16} />
          Back to Opportunity
        </button>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setShowFinancialHelp(true)}
          >
            <FileText size={18} />
            Financial Sources
          </button>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => setShowPdfModal(true)}
          >
            <FileDown size={18} />
            Generate PDF
          </button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Founder ID {founder_id}</span>
          <h1>{companyName}</h1>
          <p>
            Review risk posture, qualitative criteria, and financial assessment
            outputs for this opportunity.
          </p>
        </div>

        <div className={styles.riskPanel}>
          <span className={styles.riskLabel}>Risk Assessment</span>
          <strong>{risk ? risk.total_weighted_score.toFixed(2) : "-"}</strong>
          <div className={styles.riskBadge}>
            {risk?.risk_label || "No risk summary"}
          </div>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <SummaryCard
          icon={<Scale size={19} />}
          label="Active deal type"
          value={DEAL_TYPES.find((deal) => deal.id === activeDealType)?.label || "-"}
        />
        <SummaryCard
          icon={<BarChart3 size={19} />}
          label="Historical total"
          value={historicalTotal.toLocaleString()}
        />
        <SummaryCard
          icon={<TrendingUp size={19} />}
          label="Pro forma total"
          value={proformaTotal.toLocaleString()}
        />
        <SummaryCard
          icon={<BadgeCheck size={19} />}
          label="Qualitative avg."
          value={qualitativeAverage.toFixed(2)}
        />
      </section>

      {risk && (
        <section className={styles.riskCard}>
          <div className={styles.riskHeader}>
            <div>
              <h2>Risk model</h2>
              <p>
                Switch deal type to compare how historical, pro forma, and
                qualitative scores contribute to the weighted result.
              </p>
            </div>

            <div className={styles.dealTypeTabs}>
              {DEAL_TYPES.map((dealType) => (
                <button
                  type="button"
                  key={dealType.id}
                  className={`${styles.dealTab} ${
                    activeDealType === dealType.id ? styles.active : ""
                  }`}
                  onClick={() => setActiveDealType(dealType.id)}
                >
                  {dealType.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.breakdownGrid}>
            <BreakdownItem
              label="Historical"
              score={risk.financial_historical.score}
              weight={risk.financial_historical.weight}
            />
            <BreakdownItem
              label="Pro Forma"
              score={risk.financial_proforma.score}
              weight={risk.financial_proforma.weight}
            />
            <BreakdownItem
              label="Qualitative"
              score={risk.qualitative.score}
              weight={risk.qualitative.weight}
            />
          </div>
        </section>
      )}

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <div>
            <span>Qualitative review</span>
            <h2>Assessment areas</h2>
          </div>
        </div>

        <FounderScoreTable founder_id={founder_id} areas={score.areas} />
      </section>

      <section className={styles.financialGrid}>
        <FinancialCard
          title="Financial - Historical"
          icon={<BarChart3 size={17} />}
          rows={FINANCIAL_ROWS.map((row) => ({
            ...row,
            score: metricScores.historical?.[row.key] ?? 0,
            value: financialDetails?.financial_assessment?.[row.key],
          }))}
          total={historicalTotal}
        />

        <FinancialCard
          title="Financial - Pro Forma"
          icon={<TrendingUp size={17} />}
          rows={FINANCIAL_ROWS.map((row) => ({
            ...row,
            score: metricScores.proforma?.[row.key] ?? 0,
            value: financialDetails?.pro_forma_outputs?.[row.key],
          }))}
          total={proformaTotal}
        />
      </section>

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

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className={styles.summaryCard}>
      <div className={styles.summaryIcon}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function BreakdownItem({
  label,
  score,
  weight,
}: {
  label: string;
  score: number;
  weight: number;
}) {
  return (
    <div className={styles.breakdownItem}>
      <div className={styles.breakdownTop}>
        <span>{label}</span>
        <strong>{score}</strong>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${clampScore(score)}%` }}
        />
      </div>
      <small>{weight}% weight</small>
    </div>
  );
}

function FinancialCard({
  title,
  icon,
  rows,
  total,
}: {
  title: string;
  icon: React.ReactNode;
  rows: Array<{
    key: string;
    label: string;
    score: number;
    value: number | null | undefined;
  }>;
  total: number;
}) {
  return (
    <div className={styles.financialCard}>
      <h3>
        {icon}
        {title}
      </h3>

      {rows.map((row) => (
        <div key={row.key} className={styles.metricBlock}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>{row.label}</span>
            <div className={styles.metricValues}>
              <span className={styles.inputValue}>
                {formatValue(row.value, row.key)}
              </span>
              <strong>{row.score}</strong>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${
                row.score >= 75
                  ? styles.barHigh
                  : row.score >= 50
                    ? styles.barMid
                    : styles.barLow
              }`}
              style={{ width: `${clampScore(row.score)}%` }}
            />
          </div>
        </div>
      ))}

      <div className={styles.totalRow}>
        Section Total
        <strong>{total}</strong>
      </div>
    </div>
  );
}

function formatValue(value: number | null | undefined, key: string) {
  if (value === null || value === undefined) return "-";

  const num = Number(value);
  const lowerKey = key.toLowerCase();

  if (lowerKey.includes("percent") || lowerKey.includes("pct")) {
    return `${num.toFixed(1)}%`;
  }

  if (lowerKey.includes("months")) {
    return `${num.toFixed(1)} mo`;
  }

  if (
    lowerKey.includes("revenue") ||
    lowerKey.includes("cash") ||
    lowerKey.includes("debt") ||
    lowerKey.includes("assets")
  ) {
    return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }

  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Number(score) || 0));
}
