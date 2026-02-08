// import { useEffect, useState } from "react";
// import type { ReactNode } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Briefcase,
//   Building2,
//   Users,
//   TrendingUp,
//   FileText,
//   DollarSign,
// } from "lucide-react";

// import styles from "./MissingInfo.module.scss";
// import {
//   getFounderMissingInfo,
//   updateFounderMissingInfo,
// } from "../api/founders";
// import type { GetMissingInfoResponse } from "../api/founders";

// /* ======================================================
//  * TYPES
//  * ====================================================== */

// type Criterion = {
//   criteria_id: string;
//   key: string;
//   name: string;
//   description?: string;
//   data_type: string;
// };

// type Area = {
//   area_id: string;
//   area_key: string;
//   area_name: string;
//   description?: string;
//   criteria: Criterion[];
// };

// type FinancialField = {
//   section: string;
//   key: string;
//   label: string;
//   type: string;
// };

// type DirtyField = {
//   areaKey: string;
//   criterionKey: string;
// };

// /* ======================================================
//  * ICONS PER TAB
//  * ====================================================== */

// const TAB_ICONS: Record<string, ReactNode> = {
//   business: <Briefcase size={18} />,
//   industry: <TrendingUp size={18} />,
//   management: <Users size={18} />,
//   marketability: <Building2 size={18} />,
//   financial: <DollarSign size={18} />,
// };

// /* ======================================================
//  * COMPONENT
//  * ====================================================== */

// type SubmitStatus = "idle" | "saving" | "success" | "error";

// export default function MissingInfo() {
//   const { founderId } = useParams<{ founderId: string }>();

//   if (!founderId) {
//     return <div className={styles.error}>Invalid link.</div>;
//   }

//   const numericFounderId = Number(founderId);

//   const [data, setData] = useState<GetMissingInfoResponse | null>(null);
//   const [activeTab, setActiveTab] = useState<string | null>(null);
//   const [values, setValues] = useState<Record<string, string>>({});
//   const [files, setFiles] = useState<File[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [dirtyFields, setDirtyFields] = useState<DirtyField[]>([]);
//   const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

//   /* ======================================================
//    * FETCH MISSING INFO
//    * ====================================================== */

//   useEffect(() => {
//     setLoading(true);

//     getFounderMissingInfo(numericFounderId)
//       .then((res) => {
//         setData(res);

//         // Default tab = first assessment area
//         setActiveTab(res.assessment_areas[0]?.area_key ?? "financial");
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [numericFounderId]);

//   /* ======================================================
//    * HANDLERS
//    * ====================================================== */

//   function markDirty(areaKey: string, criterionKey: string) {
//     setDirtyFields((prev) => {
//       const exists = prev.some(
//         (f) => f.areaKey === areaKey && f.criterionKey === criterionKey,
//       );
//       if (exists) return prev;
//       return [...prev, { areaKey, criterionKey }];
//     });
//   }

//   function handleChange(areaKey: string, criterionKey: string, value: string) {
//     setValues((prev) => ({ ...prev, [criterionKey]: value }));
//     markDirty(areaKey, criterionKey);
//     setSubmitStatus("idle");
//   }

//   async function handleSubmit() {
//     if (!data || dirtyFields.length === 0) return;

//     try {
//       setSubmitStatus("saving");

//       for (const { areaKey, criterionKey } of dirtyFields) {
//         const value = values[criterionKey];
//         if (!value?.trim()) continue;

//         await updateFounderMissingInfo({
//           founder_id: numericFounderId,
//           area_key: areaKey,
//           criterion_key: criterionKey,
//           value: {
//             summary: value,
//             sources: ["User input"],
//           },
//         });
//       }

//       setDirtyFields([]);
//       setSubmitStatus("success");
//     } catch {
//       setSubmitStatus("error");
//     }
//   }

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const fileList = e.target.files;
//     if (!fileList) return;

//     const incoming = Array.from(fileList);

//     setFiles((prev) => {
//       const existingKeys = new Set(prev.map((f) => `${f.name}-${f.size}`));
//       return [
//         ...prev,
//         ...incoming.filter((f) => !existingKeys.has(`${f.name}-${f.size}`)),
//       ];
//     });

//     e.target.value = "";
//   }

//   function removeFile(index: number) {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   }

//   /* ======================================================
//    * STATES
//    * ====================================================== */

//   if (loading) {
//     return <div className={styles.loading}>Loading…</div>;
//   }

//   if (!data) {
//     return <div className={styles.error}>Unable to load information.</div>;
//   }

//   const areas: Area[] = data.assessment_areas;
//   const activeArea = areas.find((a) => a.area_key === activeTab);

//   /* ======================================================
//    * RENDER
//    * ====================================================== */

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.card}>
//         <h1>Complete Due Diligence</h1>

//         <p className={styles.subtitle}>
//           We’ve reviewed your data room. To complete the first step of due
//           diligence, please provide the additional information below.
//         </p>

//         {/* ===========================
//             TABS
//         ============================ */}
//         <div className={styles.tabs}>
//           {areas.map((area) => (
//             <button
//               key={area.area_id}
//               className={`${styles.tab} ${
//                 activeTab === area.area_key ? styles.active : ""
//               }`}
//               onClick={() => setActiveTab(area.area_key)}
//               type="button"
//             >
//               <span className={styles.icon}>
//                 {TAB_ICONS[area.area_key] ?? <FileText size={18} />}
//               </span>
//               {area.area_name}
//             </button>
//           ))}

//           {/* Financial Tab */}
//           <button
//             className={`${styles.tab} ${
//               activeTab === "financial" ? styles.active : ""
//             }`}
//             onClick={() => setActiveTab("financial")}
//             type="button"
//           >
//             <span className={styles.icon}>{TAB_ICONS.financial}</span>
//             Financials
//           </button>
//         </div>

//         {/* ===========================
//             ASSESSMENT TAB CONTENT
//         ============================ */}
//         {activeArea && activeTab !== "financial" && (
//           <div className={styles.panel}>
//             {activeArea.description && (
//               <p className={styles.areaDescription}>{activeArea.description}</p>
//             )}

//             {activeArea.criteria.map((criterion) => (
//               <div key={criterion.criteria_id} className={styles.field}>
//                 <label>{criterion.name}</label>

//                 {criterion.description && (
//                   <div className={styles.fieldHint}>
//                     {criterion.description}
//                   </div>
//                 )}

//                 <input
//                   type={
//                     criterion.data_type === "number" ||
//                     criterion.data_type === "currency"
//                       ? "number"
//                       : "text"
//                   }
//                   // placeholder={`Enter ${criterion.name.toLowerCase()}`}
//                   value={values[criterion.key] || ""}
//                   onChange={(e) =>
//                     handleChange(
//                       activeArea.area_key,
//                       criterion.key,
//                       e.target.value,
//                     )
//                   }
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ===========================
//             FINANCIAL TAB CONTENT
//         ============================ */}
//         {activeTab === "financial" && (
//           <div className={styles.panel}>
//             <h2 className={styles.sectionTitle}>Financial Information</h2>

//             {data.financial.map((field: FinancialField) => (
//               <div key={field.key} className={styles.field}>
//                 <label>{field.label}</label>

//                 <input
//                   type={field.type === "number" ? "number" : "text"}
//                   // placeholder={`Enter ${field.label.toLowerCase()}`}
//                   value={values[field.key] || ""}
//                   onChange={(e) =>
//                     handleChange("financial", field.key, e.target.value)
//                   }
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ===========================
//             FILE UPLOAD
//         ============================ */}
//         {data.requires_files && (
//           <div className={styles.upload}>
//             <h2>Supporting Documents</h2>
//             <p>
//               Upload any updated or supporting documents. Files will remain
//               attached as you move between sections.
//             </p>

//             <label className={styles.filePicker}>
//               Choose files
//               <input type="file" multiple hidden onChange={handleFileChange} />
//             </label>

//             {files.length > 0 && (
//               <ul className={styles.fileList}>
//                 {files.map((file, idx) => (
//                   <li key={`${file.name}-${idx}`}>
//                     <span>
//                       {file.name}
//                       <em>{(file.size / 1024).toFixed(1)} KB</em>
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => removeFile(idx)}
//                       aria-label="Remove file"
//                     >
//                       ✕
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}

//         {/* ===========================
//             ACTIONS
//         ============================ */}
//         <div className={styles.actions}>
//           <button
//             className={styles.primary}
//             onClick={handleSubmit}
//             disabled={submitStatus === "saving" || dirtyFields.length === 0}
//           >
//             {submitStatus === "saving" ? "Saving…" : "Submit & Continue"}
//           </button>

//           <div className={styles.submitStatus}>
//             {submitStatus === "success" && (
//               <span className={styles.success}>Saved</span>
//             )}
//             {submitStatus === "error" && (
//               <span className={styles.error}>
//                 Something went wrong. Please try again.
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  FileText,
  DollarSign,
} from "lucide-react";

import styles from "./MissingInfo.module.scss";
import {
  getFounderMissingInfo,
  updateFounderMissingInfo,
} from "../api/founders";
import type { GetMissingInfoResponse } from "../api/founders";

/* ======================================================
 * TYPES
 * ====================================================== */

type Criterion = {
  criteria_id: string;
  key: string;
  name: string;
  description?: string;
  data_type: string;
};

type Area = {
  area_id: string;
  area_key: string;
  area_name: string;
  description?: string;
  criteria: Criterion[];
};

type FinancialField = {
  section: string;
  key: string;
  label: string;
  type: string;
};

type DirtyField = {
  areaKey: string;
  criterionKey: string;
};

/* ======================================================
 * ICONS PER TAB
 * ====================================================== */

const TAB_ICONS: Record<string, ReactNode> = {
  business: <Briefcase size={18} />,
  industry: <TrendingUp size={18} />,
  management: <Users size={18} />,
  marketability: <Building2 size={18} />,
  financial: <DollarSign size={18} />,
};

/* ======================================================
 * COMPONENT
 * ====================================================== */

type SubmitStatus = "idle" | "saving" | "success" | "error";

export default function MissingInfo() {
  const { founderId } = useParams<{ founderId: string }>();

  if (!founderId) {
    return <div className={styles.error}>Invalid link.</div>;
  }

  const numericFounderId = Number(founderId);

  const [data, setData] = useState<GetMissingInfoResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const [dirtyFields, setDirtyFields] = useState<DirtyField[]>([]);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  /* ======================================================
   * FETCH MISSING INFO
   * ====================================================== */

  useEffect(() => {
    setLoading(true);

    getFounderMissingInfo(numericFounderId)
      .then((res) => {
        setData(res);
        setActiveTab(res.assessment_areas[0]?.area_key ?? "financial");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [numericFounderId]);

  /* ======================================================
   * HANDLERS
   * ====================================================== */

  function markDirty(areaKey: string, criterionKey: string) {
    setDirtyFields((prev) => {
      const exists = prev.some(
        (f) => f.areaKey === areaKey && f.criterionKey === criterionKey,
      );
      if (exists) return prev;
      return [...prev, { areaKey, criterionKey }];
    });
  }

  function handleChange(areaKey: string, criterionKey: string, value: string) {
    setValues((prev) => ({ ...prev, [criterionKey]: value }));
    markDirty(areaKey, criterionKey);
    setSubmitStatus("idle");
  }

  async function handleSubmit() {
    if (!data || dirtyFields.length === 0) return;

    try {
      setSubmitStatus("saving");

      for (const { areaKey, criterionKey } of dirtyFields) {
        const rawValue = values[criterionKey];
        if (!rawValue?.trim()) continue;

        const value =
          areaKey === "financial_inputs"
            ? Number(rawValue)
            : {
                summary: rawValue,
                sources: ["User input"],
              };

        await updateFounderMissingInfo({
          founder_id: numericFounderId,
          area_key: areaKey,
          criterion_key: criterionKey,
          value,
        });
      }

      setDirtyFields([]);
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  }

  /* ======================================================
   * STATES
   * ====================================================== */

  if (loading) {
    return <div className={styles.loading}>Loading…</div>;
  }

  if (!data) {
    return <div className={styles.error}>Unable to load information.</div>;
  }

  const areas: Area[] = data.assessment_areas;
  const activeArea = areas.find((a) => a.area_key === activeTab);

  /* ======================================================
   * RENDER
   * ====================================================== */

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1>Complete Due Diligence</h1>

        <p className={styles.subtitle}>
          We’ve reviewed your data room. To complete the first step of due
          diligence, please provide the additional information below.
        </p>

        {/* ===========================
            TABS
        ============================ */}
        <div className={styles.tabs}>
          {areas.map((area) => (
            <button
              key={area.area_id}
              className={`${styles.tab} ${
                activeTab === area.area_key ? styles.active : ""
              }`}
              onClick={() => setActiveTab(area.area_key)}
              type="button"
            >
              <span className={styles.icon}>
                {TAB_ICONS[area.area_key] ?? <FileText size={18} />}
              </span>
              {area.area_name}
            </button>
          ))}

          <button
            className={`${styles.tab} ${
              activeTab === "financial" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("financial")}
            type="button"
          >
            <span className={styles.icon}>{TAB_ICONS.financial}</span>
            Financials
          </button>
        </div>

        {/* ===========================
            QUALITATIVE
        ============================ */}
        {activeArea && activeTab !== "financial" && (
          <div className={styles.panel}>
            {activeArea.criteria.map((criterion) => (
              <div key={criterion.criteria_id} className={styles.field}>
                <label>{criterion.name}</label>

                <input
                  type={
                    criterion.data_type === "number" ||
                    criterion.data_type === "currency"
                      ? "number"
                      : "text"
                  }
                  value={values[criterion.key] || ""}
                  onChange={(e) =>
                    handleChange(
                      activeArea.area_key,
                      criterion.key,
                      e.target.value,
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* ===========================
            FINANCIAL
        ============================ */}
        {activeTab === "financial" && (
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Financial Information</h2>

            {data.financial.map((field: FinancialField) => (
              <div key={field.key} className={styles.field}>
                <label>{field.label}</label>

                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={values[field.key] || ""}
                  onChange={(e) =>
                    handleChange("financial_inputs", field.key, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* ===========================
            ACTIONS
        ============================ */}
        <div className={styles.actions}>
          <button
            className={styles.primary}
            onClick={handleSubmit}
            disabled={submitStatus === "saving" || dirtyFields.length === 0}
          >
            {submitStatus === "saving" ? "Saving…" : "Submit & Continue"}
          </button>

          <div className={styles.submitStatus}>
            {submitStatus === "success" && (
              <span className={styles.success}>Saved</span>
            )}
            {submitStatus === "error" && (
              <span className={styles.error}>
                Something went wrong. Please try again.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
