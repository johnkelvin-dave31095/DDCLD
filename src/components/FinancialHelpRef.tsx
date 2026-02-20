import { useEffect, useMemo, useState } from "react";
import { X, FileText } from "lucide-react";
import { getFounderFinancialRef } from "../api/founders";
import type { FinancialMetric } from "../api/founders";
import styles from "./FinancialHelpRef.module.scss";

type Props = {
  founder_id: number;
  onClose: () => void;
};

/* ================= HELPERS ================= */

function formatNumericValue(value: number): string {
  // Percent-style values
  if (value > 0 && value < 1) {
    return `${(value * 100).toFixed(0)}%`;
  }

  // Billions
  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)} billion`;
  }

  // Millions
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)} M`;
  }

  // Thousands
  if (Math.abs(value) >= 1_000) {
    return value.toLocaleString();
  }

  return value.toFixed(2);
}

/* ================= COMPONENT ================= */

export default function FinancialHelpRef({ founder_id, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!founder_id) return;

    let mounted = true;
    setLoading(true);

    async function load() {
      try {
        const res = await getFounderFinancialRef({ founder_id });
        if (mounted && res.success) {
          setMetrics(res.metrics);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [founder_id]);

  /* ================= GROUP BY FILE ================= */

  const files = useMemo(() => {
    return metrics.reduce<Record<string, FinancialMetric[]>>((acc, m) => {
      const key = m.filename ?? `File #${m.file_id}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    }, {});
  }, [metrics]);

  const fileEntries = Object.entries(files);

  /* ================= RENDER ================= */

  return (
    <aside className={styles.panel}>
      {/* HEADER */}
      <div className={styles.header}>
        <h3>Financial References</h3>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {loading && (
        <p className={styles.loading}>Loading financial references…</p>
      )}

      {!loading && fileEntries.length === 0 && (
        <p className={styles.empty}>No financial reference data found.</p>
      )}

      {!loading && fileEntries.length > 0 && (
        <div className={styles.fileList}>
          {fileEntries.map(([filename, rows]) => (
            <div key={filename} className={styles.fileCard}>
              {/* FILE HEADER */}
              <div className={styles.fileHeader}>
                <FileText size={14} />
                {rows[0].sharepoint_url ? (
                  <a
                    href={rows[0].sharepoint_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.fileLink}
                  >
                    {filename}
                  </a>
                ) : (
                  <span className={styles.fileName}>{filename}</span>
                )}
              </div>

              {/* METRICS */}
              <div className={styles.metricList}>
                {rows.map((m, index) => (
                  <div
                    key={`${m.metric_key}-${m.sub_key}-${index}`}
                    className={styles.metricRow}
                  >
                    {/* 1️⃣ metric_key */}
                    <div className={styles.metricKey}>
                      {m.metric_key}
                      {m.sub_key && (
                        <span className={styles.metricSubKey}>
                          {" "}
                          ({m.sub_key})
                        </span>
                      )}
                    </div>

                    {/* 2️⃣ value */}
                    {typeof m.value_numeric === "number" && (
                      <div className={styles.metricValue}>
                        {formatNumericValue(m.value_numeric)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
