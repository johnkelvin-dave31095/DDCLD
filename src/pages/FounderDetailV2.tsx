// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import Lottie from "lottie-react";
// import loadingAnim from "../assets/orange-loading.json";

// import { post } from "../api/http";
// import { getFounderScore } from "../api/founders";
// import type { FounderScore } from "../api/founders";

// import FounderScoreTable from "../components/FounderScoreTable";
// import StatusBadge from "../components/StatusBadge";
// import FinancialHelpRef from "../components/FinancialHelpRef";

// import { BarChart3, TrendingUp, ShieldAlert, HelpCircle } from "lucide-react";

// import styles from "./FounderDetailV2.module.scss";

// /* ================= TYPES ================= */

// type DetailResponse = {
//   company_name: string;
// };

// type FinancialDetails = {
//   financial_assessment?: Record<string, number | null>;
//   pro_forma_outputs?: Record<string, number | null>;
// };

// type FinancialsVM = {
//   metric_scores?: Record<string, number>;
//   details?: FinancialDetails | null;
// };

// type FounderScoreVM = FounderScore & {
//   financials?: FinancialsVM | null;
//   risk_summary?: {
//     financial_historical: { score: number; weight: number };
//     financial_proforma: { score: number; weight: number };
//     qualitative: { score: number; weight: number };
//     total_weighted_score: number;
//     risk_label: string;
//     risk_code: number;
//   };
// };

// /* ================= CONFIG ================= */

// const HISTORICAL_ROWS = [
//   { key: "arr", label: "ARR" },
//   { key: "yoy_revenue_growth_pct", label: "YoY Revenue Growth" },
//   { key: "runway_months", label: "Runway" },
//   { key: "gross_margin_pct", label: "Average Gross Margin" },
//   { key: "avg_recurring_revenue_pct", label: "Avg % Recurring Revenue" },
//   { key: "total_assets_to_debt", label: "Total Assets / Total Debt" },
//   { key: "cac_payback_assessment", label: "CAC Payback" },
//   { key: "dscr", label: "DSCR" },
// ];

// const PRO_FORMA_ROWS = [
//   { key: "proforma_arr", label: "ARR" },
//   { key: "proforma_yoy_growth_pct", label: "YoY Revenue Growth" },
//   { key: "proforma_runway_months", label: "Runway" },
//   { key: "proforma_avg_gross_margin", label: "Average Gross Margin" },
//   {
//     key: "proforma_avg_recurring_revenue_pct",
//     label: "Avg % Recurring Revenue",
//   },
//   { key: "proforma_total_assets_to_debt", label: "Total Assets / Total Debt" },
//   { key: "proforma_cac_payback", label: "CAC Payback" },
//   { key: "proforma_dscr", label: "DSCR" },
// ];

// /* ================= HELPERS ================= */

// const riskClass = (code?: number) => {
//   switch (code) {
//     case 1:
//       return styles.riskVeryAttractive;
//     case 2:
//       return styles.riskAttractive;
//     case 3:
//       return styles.riskAcceptable;
//     case 4:
//       return styles.riskCautionary;
//     case 5:
//       return styles.riskUnsatisfactory;
//     case 6:
//     default:
//       return styles.riskUnacceptable;
//   }
// };

// const formatNumber = (val: number | null | undefined) => {
//   if (val === null || val === undefined) return "—";
//   if (Math.abs(val) < 1 && val !== 0) {
//     return `${Math.round(val * 100)}%`;
//   }
//   return val.toLocaleString();
// };

// /* ================= COMPONENT ================= */

// export default function FounderDetailV2() {
//   const { founderId } = useParams<{ founderId: string }>();
//   const navigate = useNavigate();

//   // 🔑 SOURCE OF TRUTH
//   const founder_id = Number(founderId);

//   // console.log(founder_id);

//   const [companyName, setCompanyName] = useState<string>("—");
//   const [score, setScore] = useState<FounderScoreVM | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [showFinancialHelp, setShowFinancialHelp] = useState(false);

//   useEffect(() => {
//     if (!founder_id) return;

//     Promise.all([
//       post<{ company_name: string }>("/founders", {
//         founder_id,
//       }),
//       getFounderScore(founder_id),
//     ]).then(([detailRes, scoreRes]) => {
//       setCompanyName(detailRes.company_name ?? "—");
//       setScore(scoreRes as FounderScoreVM);
//       setLoading(false);
//     });
//   }, [founder_id]);

//   // if (loading || !score) {
//   //   return (
//   //     <div className={styles.loadingWrap}>
//   //       <Lottie animationData={loadingAnim} loop />
//   //       <p className={styles.loadingText}>Loading assessment…</p>
//   //     </div>
//   //   );
//   // }

//   if (loading || !score) {
//     return (
//       <div className={styles.loadingWrap}>
//         <Lottie
//           animationData={loadingAnim}
//           loop
//           className={styles.loadingAnim}
//         />
//         <p className={styles.loadingText}>Loading assessment…</p>
//       </div>
//     );
//   }

//   const details = score.financials?.details;
//   const metricScores = score.financials?.metric_scores ?? {};
//   const risk = score.risk_summary;

//   return (
//     <div className={styles.page}>
//       <div className={styles.mainContent}>
//         {/* ================= HEADER ================= */}
//         <div className={styles.header}>
//           <button
//             className={styles.back}
//             onClick={() => navigate("/dashboard")}
//           >
//             ← Back to Dashboard
//           </button>

//           <div className={styles.headerMain}>
//             <div>
//               <h1>{companyName}</h1>
//               <p className={styles.subtitle}>Founder ID: {founder_id}</p>
//             </div>

//             <div className={styles.headerActions}>
//               <button
//                 className={styles.helpIconBtn}
//                 onClick={() => {
//                   console.log("HELP BUTTON CLICKED");
//                   setShowFinancialHelp(true);
//                 }}
//                 title="View financial references"
//               >
//                 <HelpCircle size={16} />
//               </button>

//               <StatusBadge
//                 status={risk?.risk_label?.toLowerCase() ?? "almost_complete"}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ================= CONTENT ================= */}
//         <div className={styles.content}>
//           <FounderScoreTable founder_id={founder_id} areas={score.areas} />

//           <div className={styles.bottomGrid}>
//             <div className={styles.card}>
//               <h3>
//                 <BarChart3 size={16} /> Financial – Historical
//               </h3>

//               {HISTORICAL_ROWS.map((row) => (
//                 <div key={row.key} className={styles.metricRow}>
//                   <span className={styles.metricLabel}>{row.label}</span>
//                   <span className={styles.metricValue}>
//                     {formatNumber(details?.financial_assessment?.[row.key])}
//                   </span>
//                   <span className={styles.metricScore}>
//                     {formatNumber(metricScores[row.key])}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className={styles.card}>
//               <h3>
//                 <TrendingUp size={16} /> Financial – Pro Forma
//               </h3>

//               {PRO_FORMA_ROWS.map((row) => (
//                 <div key={row.key} className={styles.metricRow}>
//                   <span className={styles.metricLabel}>{row.label}</span>
//                   <span className={styles.metricValue}>
//                     {formatNumber(details?.pro_forma_outputs?.[row.key])}
//                   </span>
//                   <span className={styles.metricScore}>
//                     {formatNumber(metricScores[row.key])}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* {risk && (
//               <div className={`${styles.card} ${riskClass(risk.risk_code)}`}>
//                 <h3>
//                   <ShieldAlert size={16} /> Risk Summary
//                 </h3>

//                 <div className={styles.metricRow}>
//                   <span>Financial – Historical</span>
//                   <span>{risk.financial_historical.score.toFixed(2)}</span>
//                 </div>

//                 <div className={styles.metricRow}>
//                   <span>Financial – Pro Forma</span>
//                   <span>{risk.financial_proforma.score.toFixed(2)}</span>
//                 </div>

//                 <div className={styles.metricRow}>
//                   <span>Qualitative</span>
//                   <span>{risk.qualitative.score.toFixed(2)}</span>
//                 </div>

//                 <div className={styles.riskFinal}>
//                   <strong>{risk.risk_label}</strong>
//                   <span>{risk.total_weighted_score.toFixed(2)}</span>
//                 </div>
//               </div>
//             )} */}
//           </div>
//         </div>
//       </div>

//       {/* ================= FINANCIAL HELP PANEL ================= */}
//       {showFinancialHelp && founder_id && (
//         <FinancialHelpRef
//           founder_id={founder_id}
//           onClose={() => setShowFinancialHelp(false)}
//         />
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import loadingAnim from "../assets/orange-loading.json";

import { post } from "../api/http";
import { getFounderScore } from "../api/founders";
import type { FounderScore } from "../api/founders";

import FounderScoreTable from "../components/FounderScoreTable";
import StatusBadge from "../components/StatusBadge";
import FinancialHelpRef from "../components/FinancialHelpRef";

import { BarChart3, TrendingUp, ShieldAlert, HelpCircle } from "lucide-react";

import styles from "./FounderDetailV2.module.scss";

/* ================= TYPES ================= */

type DetailResponse = {
  company_name: string;
};

type FinancialDetails = {
  financial_assessment?: Record<string, number | null>;
  pro_forma_outputs?: Record<string, number | null>;
};

type FinancialsVM = {
  metric_scores?: Record<string, number>;
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

/* ================= DEAL TYPES ================= */

const DEAL_TYPES = [
  {
    id: "9578d377-8fb6-4519-bf05-c289de7da090",
    label: "Growth Equity",
  },
  {
    id: "df71eca9-342f-4e45-9931-2f5580a6d837",
    label: "Secondaries",
  },
  {
    id: "73be9f34-59a2-4f75-8944-98c883694c5b",
    label: "Venture Debt",
  },
  {
    id: "151ee764-a374-4886-b56c-f52ec315b7c1",
    label: "Venture Capital",
  },
];

/* ================= HELPERS ================= */

const riskClass = (code?: number) => {
  switch (code) {
    case 1:
      return styles.riskVeryAttractive;
    case 2:
      return styles.riskAttractive;
    case 3:
      return styles.riskAcceptable;
    case 4:
      return styles.riskCautionary;
    case 5:
      return styles.riskUnsatisfactory;
    case 6:
    default:
      return styles.riskUnacceptable;
  }
};

const formatNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined) return "—";
  if (Math.abs(val) < 1 && val !== 0) {
    return `${Math.round(val * 100)}%`;
  }
  return val.toLocaleString();
};

/* ================= CONFIG ================= */

const HISTORICAL_ROWS = [
  { key: "arr", label: "ARR" },
  { key: "yoy_revenue_growth_pct", label: "YoY Revenue Growth" },
  { key: "runway_months", label: "Runway" },
  { key: "gross_margin_pct", label: "Average Gross Margin" },
  { key: "avg_recurring_revenue_pct", label: "Avg % Recurring Revenue" },
  { key: "total_assets_to_debt", label: "Total Assets / Total Debt" },
  { key: "cac_payback_assessment", label: "CAC Payback" },
  { key: "dscr", label: "DSCR" },
];

const PRO_FORMA_ROWS = [
  { key: "proforma_arr", label: "ARR" },
  { key: "proforma_yoy_growth_pct", label: "YoY Revenue Growth" },
  { key: "proforma_runway_months", label: "Runway" },
  { key: "proforma_avg_gross_margin", label: "Average Gross Margin" },
  {
    key: "proforma_avg_recurring_revenue_pct",
    label: "Avg % Recurring Revenue",
  },
  { key: "proforma_total_assets_to_debt", label: "Total Assets / Total Debt" },
  { key: "proforma_cac_payback", label: "CAC Payback" },
  { key: "proforma_dscr", label: "DSCR" },
];

/* ================= COMPONENT ================= */

export default function FounderDetailV2() {
  const { founderId } = useParams<{ founderId: string }>();
  const navigate = useNavigate();

  const founder_id = Number(founderId);

  const [companyName, setCompanyName] = useState("—");
  const [score, setScore] = useState<FounderScoreVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFinancialHelp, setShowFinancialHelp] = useState(false);

  const [showBreakdown, setShowBreakdown] = useState(false);

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

  if (loading || !score) {
    return (
      <div className={styles.loadingWrap}>
        <Lottie
          animationData={loadingAnim}
          loop
          className={styles.loadingAnim}
        />
        <p className={styles.loadingText}>Loading assessment…</p>
      </div>
    );
  }

  const details = score.financials?.details;
  const metricScores = score.financials?.metric_scores ?? {};

  const risk = score.risk_summary?.find(
    (r) => r.deal_type_id === activeDealType,
  );

  return (
    <div className={styles.page}>
      <div className={styles.mainContent}>
        {/* ================= HEADER ================= */}
        <div className={styles.header}>
          <button
            className={styles.back}
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <div className={styles.headerMain}>
            <div>
              <h1>{companyName}</h1>
              <p className={styles.subtitle}>Founder ID: {founder_id}</p>
            </div>

            {risk && (
              <div className={`${styles.card} ${riskClass(risk.risk_code)}`}>
                <h3>
                  <ShieldAlert size={16} /> Risk Summary
                </h3>

                {/* Deal Type Tabs */}
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

                {/* Compact headline row */}
                <div
                  className={styles.riskHeadline}
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  role="button"
                >
                  <strong>{risk.risk_label}</strong>
                  <span className={styles.scoreMain}>
                    {risk.total_weighted_score}
                  </span>
                </div>

                {/* Collapsed hint */}
                {/* {!showBreakdown && (
                  <div className={styles.breakdownHint}>
                    View score breakdown
                  </div>
                )} */}

                {/* Expanded breakdown */}
                {showBreakdown && (
                  <div className={styles.breakdown}>
                    <div className={styles.metricRowMuted}>
                      <span>Financial – Historical</span>
                      <span>{risk.financial_historical.score}</span>
                    </div>

                    <div className={styles.metricRowMuted}>
                      <span>Financial – Pro Forma</span>
                      <span>{risk.financial_proforma.score}</span>
                    </div>

                    <div className={styles.metricRowMuted}>
                      <span>Qualitative</span>
                      <span>{risk.qualitative.score}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={styles.headerActions}>
              <button
                className={styles.helpIconBtn}
                onClick={() => setShowFinancialHelp(true)}
                title="View financial references"
              >
                <HelpCircle size={16} />
              </button>

              <StatusBadge
                status={risk?.risk_label?.toLowerCase() ?? "almost_complete"}
              />
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className={styles.content}>
          <FounderScoreTable founder_id={founder_id} areas={score.areas} />

          <div className={styles.bottomGrid}>
            <div className={styles.card}>
              <h3>
                <BarChart3 size={16} /> Financial – Historical
              </h3>

              {HISTORICAL_ROWS.map((row) => (
                <div key={row.key} className={styles.metricRow}>
                  <span className={styles.metricLabel}>{row.label}</span>
                  <span className={styles.metricValue}>
                    {formatNumber(details?.financial_assessment?.[row.key])}
                  </span>
                  <span className={styles.metricScore}>
                    {formatNumber(metricScores[row.key])}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.card}>
              <h3>
                <TrendingUp size={16} /> Financial – Pro Forma
              </h3>

              {PRO_FORMA_ROWS.map((row) => (
                <div key={row.key} className={styles.metricRow}>
                  <span className={styles.metricLabel}>{row.label}</span>
                  <span className={styles.metricValue}>
                    {formatNumber(details?.pro_forma_outputs?.[row.key])}
                  </span>
                  <span className={styles.metricScore}>
                    {formatNumber(metricScores[row.key])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showFinancialHelp && (
        <FinancialHelpRef
          founder_id={founder_id}
          onClose={() => setShowFinancialHelp(false)}
        />
      )}
    </div>
  );
}
