import { useEffect, useMemo, useState } from "react";
import { X, FileText, ShieldCheck } from "lucide-react";
import { getFounderFinancialRef } from "../api/founders";
import type { FinancialMetric } from "../api/founders";
import styles from "./FinancialHelpRef.module.scss";

type Props = {
  founder_id: number;
  onClose: () => void;
};

function formatNumericValue(value: number): string {
  if (value > 0 && value < 1) {
    return `${(value * 100).toFixed(0)}%`;
  }

  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return value.toLocaleString();
  }

  return value.toFixed(2);
}

export default function FinancialHelpRef({ founder_id, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);

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

  const files = useMemo(() => {
    return metrics.reduce<Record<string, FinancialMetric[]>>((acc, m) => {
      const key = m.filename ?? `File #${m.file_id}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    }, {});
  }, [metrics]);

  const fileEntries = Object.entries(files);

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrap}>
            <FileText size={20} strokeWidth={2.2} />
          </div>

          <div>
            <div className={styles.title}>Financial References</div>
            <div className={styles.subtitle}>
              <ShieldCheck size={14} strokeWidth={2} />
              <span>Verified source documents & extracted metrics</span>
            </div>
          </div>
        </div>

        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} strokeWidth={2.2} />
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
              <div className={styles.fileHeader}>
                <FileText size={18} strokeWidth={2} />
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

              <div className={styles.metricGrid}>
                {rows.map((m, index) => (
                  <div
                    key={`${m.metric_key}-${m.sub_key}-${index}`}
                    className={styles.metricCard}
                  >
                    <div className={styles.metricLabel}>{m.metric_key}</div>

                    {m.sub_key && (
                      <div className={styles.metricSub}>{m.sub_key}</div>
                    )}

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
    </div>
  );
}
