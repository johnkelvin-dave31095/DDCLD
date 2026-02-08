// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Lottie from "lottie-react";

// import { getFoundersDashboard } from "../api/founders";
// import type { FounderDashboardRow } from "../api/founders";

// import loadingAnim from "../assets/orange-loading.json";

// import StatusBadge from "../components/StatusBadge";

// import {
//   Building2,
//   ListChecks,
//   Users,
//   Globe,
//   TrendingUp,
//   Briefcase,
//   Folder,
//   BadgeCheck,
//   Loader,
// } from "lucide-react";

// import styles from "./Dashboard.module.scss";

// export default function Dashboard() {
//   const [rows, setRows] = useState<FounderDashboardRow[]>([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     getFoundersDashboard().then((res) => {
//       setRows(res.founders);
//       setLoading(false);
//     });
//   }, []);

//   if (loading) {
//     return (
//       <div className={styles.loadingWrap}>
//         <Lottie
//           animationData={loadingAnim}
//           loop
//           className={styles.loadingAnim}
//         />
//         <p className={styles.loadingText}>Loading founders…</p>
//       </div>
//     );
//   }

//   function renderProcessingStatus(status: string) {
//     switch (status) {
//       case "extracting_text":
//         return (
//           <span className={styles.processing}>
//             <Loader size={14} className={styles.spin} />
//             Extracting text…
//           </span>
//         );
//       case "summarizing_files":
//         return (
//           <span className={styles.processing}>
//             <Loader size={14} className={styles.spin} />
//             Summarizing files…
//           </span>
//         );
//       case "done":
//         return <span className={styles.done}>Complete</span>;
//       case "no_files":
//       default:
//         return <span className={styles.muted}>Waiting for files</span>;
//     }
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.header}>
//         <h1>Founders</h1>
//         <p className={styles.subtitle}>
//           Checklist completeness and processing state
//         </p>
//       </div>

//       <div className={styles.card}>
//         <table className={styles.table}>
//           <colgroup>
//             <col />
//             <col />
//             <col />
//             <col />
//             <col />
//             <col />
//             <col />
//             <col />
//             <col />
//           </colgroup>

//           <thead>
//             <tr>
//               <th>
//                 <span className={styles.th}>
//                   <Building2 size={14} />
//                   Company
//                 </span>
//               </th>
//               <th>
//                 <span className={styles.th}>
//                   <ListChecks size={14} />
//                   Checklist
//                 </span>
//               </th>
//               <th>
//                 <span className={styles.th}>
//                   <Users size={14} />
//                   Management
//                 </span>
//               </th>
//               <th>
//                 <span className={styles.th}>
//                   <Globe size={14} />
//                   Industry
//                 </span>
//               </th>
//               <th>
//                 <span className={styles.th}>
//                   <TrendingUp size={14} />
//                   Marketability
//                 </span>
//               </th>
//               <th>
//                 <span className={styles.th}>
//                   <Briefcase size={14} />
//                   Business
//                 </span>
//               </th>
//               <th>
//                 <span className={styles.th}>
//                   <Folder size={14} />
//                   Files
//                 </span>
//               </th>
//               <th>
//                 <span className={styles.th}>
//                   <BadgeCheck size={14} />
//                   Checklist Completeness
//                 </span>
//               </th>
//               <th>
//                 <span className={styles.th}>Processing Status</span>
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((row) => (
//               <tr
//                 key={row.founder_id}
//                 className={styles.row}
//                 onClick={() => navigate(`/founders/${row.founder_id}`)}
//               >
//                 <td className={styles.companyCell}>
//                   <div className={styles.companyName}>{row.company_name}</div>
//                   <div className={styles.companyMeta}>
//                     {row.file_count} files uploaded
//                   </div>
//                 </td>

//                 <td>
//                   <div className={styles.progressWrap}>
//                     <span className={styles.progressText}>
//                       {row.answered_items} / {row.total_items}
//                     </span>
//                     <div className={styles.progressBar}>
//                       <div
//                         className={styles.progressFill}
//                         style={{ width: `${row.completion_pct}%` }}
//                       />
//                     </div>
//                   </div>
//                 </td>

//                 <td className={styles.countCell}>
//                   {row.section_breakdown.management.answered}/
//                   {row.section_breakdown.management.total}
//                 </td>
//                 <td className={styles.countCell}>
//                   {row.section_breakdown.industry.answered}/
//                   {row.section_breakdown.industry.total}
//                 </td>
//                 <td className={styles.countCell}>
//                   {row.section_breakdown.marketability.answered}/
//                   {row.section_breakdown.marketability.total}
//                 </td>
//                 <td className={styles.countCell}>
//                   {row.section_breakdown.business.answered}/
//                   {row.section_breakdown.business.total}
//                 </td>

//                 <td className={styles.files}>{row.file_count}</td>

//                 {/* CHECKLIST COMPLETENESS */}
//                 <td className={styles.statusCell}>
//                   <StatusBadge status={row.status} />
//                 </td>

//                 {/* PROCESSING STATUS */}
//                 <td className={styles.processingCell}>
//                   {renderProcessingStatus(row.processing_status)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

import { getFoundersDashboard } from "../api/founders";
import type { FounderDashboardRow } from "../api/founders";

import loadingAnim from "../assets/orange-loading.json";

import StatusBadge from "../components/StatusBadge";

import {
  Building2,
  ListChecks,
  Users,
  Globe,
  TrendingUp,
  Briefcase,
  Folder,
  BadgeCheck,
  Loader,
  DollarSign,
} from "lucide-react";

import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  const [rows, setRows] = useState<FounderDashboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getFoundersDashboard().then((res) => {
      setRows(res.founders);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <Lottie
          animationData={loadingAnim}
          loop
          className={styles.loadingAnim}
        />
        <p className={styles.loadingText}>Loading Opportunities..</p>
      </div>
    );
  }

  function renderProcessingStatus(status: string) {
    switch (status) {
      case "extracting_text":
        return (
          <span className={styles.processing}>
            <Loader size={14} className={styles.spin} />
            Extracting text…
          </span>
        );
      case "summarizing_files":
        return (
          <span className={styles.processing}>
            <Loader size={14} className={styles.spin} />
            Summarizing files…
          </span>
        );
      case "done":
        return <span className={styles.done}>Complete</span>;
      case "no_files":
      default:
        return <span className={styles.muted}>Waiting for files</span>;
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Founders</h1>
        <p className={styles.subtitle}>
          Checklist completeness and processing state
        </p>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <colgroup>
            <col /> {/* Company */}
            <col /> {/* Checklist */}
            <col /> {/* Management */}
            <col /> {/* Industry */}
            <col /> {/* Marketability */}
            <col /> {/* Business */}
            <col /> {/* Financial */}
            <col /> {/* Files */}
            <col /> {/* Status */}
            <col /> {/* Processing */}
          </colgroup>

          <thead>
            <tr>
              <th>
                <span className={styles.th}>
                  <Building2 size={14} />
                  Company
                </span>
              </th>
              <th>
                <span className={styles.th}>
                  <ListChecks size={14} />
                  Checklist
                </span>
              </th>
              <th>
                <span className={styles.th}>
                  <Users size={14} />
                  Management
                </span>
              </th>
              <th>
                <span className={styles.th}>
                  <Globe size={14} />
                  Industry
                </span>
              </th>
              <th>
                <span className={styles.th}>
                  <TrendingUp size={14} />
                  Marketability
                </span>
              </th>
              <th>
                <span className={styles.th}>
                  <Briefcase size={14} />
                  Business
                </span>
              </th>
              <th>
                <span className={styles.th}>
                  <DollarSign size={14} />
                  Financial
                </span>
              </th>
              <th>
                <span className={styles.th}>
                  <Folder size={14} />
                  Files
                </span>
              </th>
              <th>
                <span className={styles.th}>
                  <BadgeCheck size={14} />
                  Checklist Completeness
                </span>
              </th>
              <th>
                <span className={styles.th}>Processing Status</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.founder_id}
                className={styles.row}
                onClick={() => navigate(`/founders/${row.founder_id}`)}
              >
                {/* COMPANY */}
                <td className={styles.companyCell}>
                  <div className={styles.companyName}>{row.company_name}</div>
                  <div className={styles.companyMeta}>
                    {row.file_count} files uploaded
                  </div>
                </td>

                {/* CHECKLIST */}
                <td>
                  <div className={styles.progressWrap}>
                    <span className={styles.progressText}>
                      {row.answered_items} / {row.total_items}
                    </span>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${row.completion_pct}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* MANAGEMENT */}
                <td className={styles.countCell}>
                  {row.section_breakdown.management.answered}/
                  {row.section_breakdown.management.total}
                </td>

                {/* INDUSTRY */}
                <td className={styles.countCell}>
                  {row.section_breakdown.industry.answered}/
                  {row.section_breakdown.industry.total}
                </td>

                {/* MARKETABILITY */}
                <td className={styles.countCell}>
                  {row.section_breakdown.marketability.answered}/
                  {row.section_breakdown.marketability.total}
                </td>

                {/* BUSINESS */}
                <td className={styles.countCell}>
                  {row.section_breakdown.business.answered}/
                  {row.section_breakdown.business.total}
                </td>

                {/* FINANCIAL (FIXED WIDTH) */}
                <td className={`${styles.countCell} ${styles.financialCell}`}>
                  {row.section_breakdown.financial.answered}/
                  {row.section_breakdown.financial.total}
                </td>

                {/* FILES */}
                <td className={styles.files}>{row.file_count}</td>

                {/* STATUS */}
                <td className={styles.statusCell}>
                  <StatusBadge status={row.status} />
                </td>

                {/* PROCESSING */}
                <td className={styles.processingCell}>
                  {renderProcessingStatus(row.processing_status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
