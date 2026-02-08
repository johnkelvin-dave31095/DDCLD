// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";

// // import Lottie from "lottie-react";
// // import loadingAnim from "../assets/orange-loading.json";

// // import { post } from "../api/http";
// // import { getFounderScore } from "../api/founders";
// // import type { FounderScore } from "../api/founders";

// // import FounderScoreTable from "../components/FounderScoreTable";
// // import StatusBadge from "../components/StatusBadge";

// // import styles from "./FounderDetail.module.scss";

// // /* ================= TYPES ================= */

// // type DetailResponse = {
// //   mode: "detail";
// //   founder_id: number;
// //   company_name: string;
// // };

// // /* ================= COMPONENT ================= */

// // export default function FounderDetail() {
// //   const { founderId } = useParams<{ founderId: string }>();
// //   const navigate = useNavigate();

// //   const [data, setData] = useState<DetailResponse | null>(null);
// //   const [score, setScore] = useState<FounderScore | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     if (!founderId) return;

// //     setLoading(true);

// //     Promise.all([
// //       post<DetailResponse>("/founders", {
// //         founder_id: Number(founderId),
// //       }),
// //       getFounderScore(Number(founderId)),
// //     ]).then(([detailRes, scoreRes]) => {
// //       setData(detailRes);
// //       setScore(scoreRes);
// //       setLoading(false);
// //     });
// //   }, [founderId]);

// //   if (loading || !data || !score) {
// //     return (
// //       <div className={styles.loadingWrap}>
// //         <Lottie
// //           animationData={loadingAnim}
// //           loop
// //           className={styles.loadingAnim}
// //         />
// //         <p className={styles.loadingText}>Loading assessment…</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className={styles.page}>
// //       {/* ================= Header ================= */}
// //       <div className={styles.header}>
// //         <button className={styles.back} onClick={() => navigate("/dashboard")}>
// //           ← Back to Dashboard
// //         </button>

// //         <div className={styles.headerMain}>
// //           <div>
// //             <h1>{data.company_name}</h1>
// //             <p className={styles.subtitle}>Founder ID: {data.founder_id}</p>
// //           </div>

// //           <StatusBadge status="almost_complete" />
// //         </div>
// //       </div>

// //       {/* ================= Overview Only ================= */}
// //       <div className={styles.content}>
// //         <FounderScoreTable founder_id={score.founder_id} areas={score.areas} />
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import Lottie from "lottie-react";
// import loadingAnim from "../assets/orange-loading.json";

// import { post } from "../api/http";
// import { getFounderScore } from "../api/founders";
// import type { FounderScore } from "../api/founders";

// import FounderScoreTable from "../components/FounderScoreTable";
// import StatusBadge from "../components/StatusBadge";

// import styles from "./FounderDetail.module.scss";

// /* ================= TYPES ================= */

// type DetailResponse = {
//   mode: "detail";
//   founder_id: number;
//   company_name: string;
// };

// /* ================= COMPONENT ================= */

// export default function FounderDetail() {
//   const { founderId } = useParams<{ founderId: string }>();
//   const navigate = useNavigate();

//   const [data, setData] = useState<DetailResponse | null>(null);
//   const [score, setScore] = useState<FounderScore | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!founderId) return;

//     setLoading(true);

//     Promise.all([
//       post<DetailResponse>("/founders", {
//         founder_id: Number(founderId),
//       }),
//       getFounderScore(Number(founderId)),
//     ]).then(([detailRes, scoreRes]) => {
//       setData(detailRes);
//       setScore(scoreRes);
//       setLoading(false);
//     });
//   }, [founderId]);

//   if (loading || !data || !score) {
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

//   const financials = score.financials;
//   const financialSummary = financials?.summary;
//   const revenueBlock = financials?.details?.revenue_and_margin;

//   const scorePct =
//     financialSummary?.score_pct != null
//       ? Math.round(financialSummary.score_pct * 100)
//       : null;

//   return (
//     <div className={styles.page}>
//       {/* ================= Header ================= */}
//       <div className={styles.header}>
//         <button className={styles.back} onClick={() => navigate("/dashboard")}>
//           ← Back to Dashboard
//         </button>

//         <div className={styles.headerMain}>
//           <div>
//             <h1>{data.company_name}</h1>
//             <p className={styles.subtitle}>Founder ID: {data.founder_id}</p>
//           </div>

//           <StatusBadge status="almost_complete" />
//         </div>
//       </div>

//       {/* ================= Content ================= */}
//       <div className={styles.content}>
//         <FounderScoreTable founder_id={score.founder_id} areas={score.areas} />

//         {/* ================= Financials ================= */}
//         {financials && (
//           <div className={styles.financialSection}>
//             {/* Financial Score */}
//             {financialSummary && (
//               <div className={styles.financialCard}>
//                 <h3>Financial Score</h3>

//                 <div className={styles.financialScoreRow}>
//                   <span className={styles.financialScore}>
//                     {financialSummary.total_score ?? "—"}
//                     <small> / {financialSummary.max_score ?? "—"}</small>
//                   </span>

//                   {scorePct !== null && (
//                     <span className={styles.financialPct}>{scorePct}%</span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Revenue & Margin Snapshot */}
//             {revenueBlock && (
//               <div className={styles.financialCard}>
//                 <h3>Revenue & Margin</h3>

//                 <ul className={styles.financialList}>
//                   {revenueBlock.revenue != null && (
//                     <li>
//                       <span>Revenue</span>
//                       <strong>
//                         ${Math.round(revenueBlock.revenue).toLocaleString()}
//                       </strong>
//                     </li>
//                   )}

//                   {revenueBlock.ebitda != null && (
//                     <li>
//                       <span>EBITDA</span>
//                       <strong>
//                         ${Math.round(revenueBlock.ebitda).toLocaleString()}
//                       </strong>
//                     </li>
//                   )}

//                   {revenueBlock.gross_margin_pct != null && (
//                     <li>
//                       <span>Gross Margin</span>
//                       <strong>
//                         {Math.round(revenueBlock.gross_margin_pct * 100)}%
//                       </strong>
//                     </li>
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
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

import styles from "./FounderDetail.module.scss";

/* ================= TYPES ================= */

type DetailResponse = {
  mode: "detail";
  founder_id: number;
  company_name: string;
};

type FinancialSummary = {
  total_score: number | null;
  max_score: number | null;
  score_pct: number | null;
};

type FinancialDetails = {
  financial_inputs?: Record<string, number | null>;
  revenue_and_margin?: Record<string, number | null>;
};

type FinancialsVM = {
  summary?: FinancialSummary | null;
  details?: FinancialDetails | null;
  metric_scores?: Record<string, number>;
};

type FounderScoreVM = FounderScore & {
  financials?: FinancialsVM | null;
};

/* ================= COMPONENT ================= */

export default function FounderDetail() {
  const { founderId } = useParams<{ founderId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<DetailResponse | null>(null);
  const [score, setScore] = useState<FounderScoreVM | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FINANCIAL ROWS ================= */

  const financialRows = [
    { key: "cac", label: "CAC" },
    { key: "cash_on_hand", label: "Cash on Hand" },
    { key: "annual_revenue_last_fye", label: "Annual Revenue (Last FYE)" },
    { key: "revenue", label: "Revenue" },
    { key: "ebitda", label: "EBITDA" },
    { key: "gross_margin_pct", label: "Gross Margin %" },
  ];

  /* ================= HELPERS ================= */

  const formatInput = (val: unknown) => {
    if (val === null || val === undefined) return "N/A";
    if (typeof val === "number") {
      if (Math.abs(val) < 1 && val !== 0) {
        return `${Math.round(val * 100)}%`;
      }
      return val.toLocaleString();
    }
    return String(val);
  };

  const getFinancialInput = (
    details: FinancialDetails | null | undefined,
    key: string,
  ) => {
    if (!details) return null;

    if (key in (details.financial_inputs ?? {}))
      return details.financial_inputs?.[key];

    if (key in (details.revenue_and_margin ?? {}))
      return details.revenue_and_margin?.[key];

    return null;
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!founderId) return;

    setLoading(true);

    Promise.all([
      post<DetailResponse>("/founders", {
        founder_id: Number(founderId),
      }),
      getFounderScore(Number(founderId)),
    ]).then(([detailRes, scoreRes]) => {
      setData(detailRes);
      setScore(scoreRes as FounderScoreVM);
      setLoading(false);
    });
  }, [founderId]);

  /* ================= LOADING ================= */

  if (loading || !data || !score) {
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

  const financials = score.financials;
  const summary = financials?.summary;
  const details = financials?.details;
  const metricScores = financials?.metric_scores ?? {};

  const scorePct =
    summary?.score_pct != null ? Math.round(summary.score_pct * 100) : null;

  /* ================= RENDER ================= */

  return (
    <div className={styles.page}>
      {/* ================= Header ================= */}
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <div className={styles.headerMain}>
          <div>
            <h1>{data.company_name}</h1>
            <p className={styles.subtitle}>Founder ID: {data.founder_id}</p>
          </div>

          <StatusBadge status="almost_complete" />
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className={styles.content}>
        {/* Assessment */}
        <FounderScoreTable founder_id={score.founder_id} areas={score.areas} />

        {/* ================= Financial Summary ================= */}
        {summary && (
          <div className={styles.financialSummary}>
            <h3>Financial Score</h3>
            <p>
              <strong>{summary.total_score ?? "—"}</strong> /{" "}
              {summary.max_score ?? "—"}
              {scorePct !== null && <span> ({scorePct}%)</span>}
            </p>
          </div>
        )}

        {/* ================= Financial Table ================= */}
        {details && (
          <div className={styles.financialTables}>
            <div className={styles.financialBlock}>
              <h3>Financial – Historical</h3>

              <table className={styles.financialTable}>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Input</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {financialRows.map((row) => (
                    <tr key={row.key}>
                      <td>{row.label}</td>
                      <td>
                        {formatInput(getFinancialInput(details, row.key))}
                      </td>
                      <td>{metricScores[row.key] ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
