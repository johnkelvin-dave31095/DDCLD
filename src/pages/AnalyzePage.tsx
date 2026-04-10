import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import {
  BarChart3,
  FileSpreadsheet,
  Loader,
  Play,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react";

import {
  analyzeFile,
  getPrompt,
  listFiles,
  updatePrompt,
} from "../api/analyze";
import type { AnalysisResponse, FileItem } from "../api/analyze";

import styles from "./AnalyzePage.module.scss";

type FileOption = {
  value: FileItem;
  label: string;
};

const selectStyles: StylesConfig<FileOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    borderRadius: 18,
    borderColor: state.isFocused ? "#8b2f3c" : "#ead0d5",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(139, 47, 60, 0.12)" : "none",
    "&:hover": {
      borderColor: "#8b2f3c",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 30,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 20px 48px rgba(88, 28, 38, 0.16)",
  }),
  option: (base, state) => ({
    ...base,
    color: state.isSelected ? "#ffffff" : "#241b1d",
    backgroundColor: state.isSelected
      ? "#8b2f3c"
      : state.isFocused
        ? "#fff5f6"
        : "#ffffff",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9d8b8f",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#241b1d",
    fontWeight: 800,
  }),
};

export default function AnalyzePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);

  useEffect(() => {
    loadFiles();
    loadPrompt();
  }, []);

  async function loadFiles() {
    try {
      const data = await listFiles();
      setFiles(data ?? []);
    } catch (err) {
      console.error("Failed loading files", err);
      setFiles([]);
    }
  }

  async function loadPrompt() {
    try {
      const res = await getPrompt();
      setPrompt(res?.prompt ?? "");
    } catch (err) {
      console.error("Prompt load error", err);
    }
  }

  async function runAnalysis() {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const res = await analyzeFile(
        selectedFile.founder_id,
        selectedFile.file_id,
      );

      setAnalysis(res ?? null);
    } catch (err) {
      console.error("Analysis error", err);
    } finally {
      setLoading(false);
    }
  }

  async function savePrompt() {
    try {
      setSavingPrompt(true);
      await updatePrompt(prompt);
    } catch (err) {
      console.error("Save prompt error", err);
    } finally {
      setSavingPrompt(false);
    }
  }

  const fileOptions = useMemo(
    () =>
      files.map((file) => ({
        value: file,
        label: `${file.company_name} - ${file.filename}`,
      })),
    [files],
  );

  const selectedOption = selectedFile
    ? {
        value: selectedFile,
        label: `${selectedFile.company_name} - ${selectedFile.filename}`,
      }
    : null;

  const historicalMetrics = analysis?.computed?.historical
    ? Object.entries(analysis.computed.historical)
    : [];
  const proformaMetrics = analysis?.computed?.proforma
    ? Object.entries(analysis.computed.proforma)
    : [];
  const rawMetrics = analysis?.metrics ? Object.entries(analysis.metrics) : [];
  const explanation = getExplanation(analysis?.llama_raw);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <span className={styles.kicker}>Excel Analyzer</span>
            <h1>Financial model analyzer</h1>
            <p>
              Select an uploaded Excel model, run the analyzer, and review
              extracted historical, pro forma, and raw financial metrics.
            </p>
          </div>

          <div className={styles.heroBadge}>
            <FileSpreadsheet size={18} />
            <span>{files.length} models available</span>
          </div>
        </section>

        <section className={styles.launchCard}>
          <div className={styles.launchHeader}>
            <div className={styles.launchIcon}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2>Run analysis</h2>
              <p>Choose the model you want to inspect.</p>
            </div>
          </div>

          <div className={styles.selector}>
            <label htmlFor="excel-model">Excel model</label>
            <div className={styles.selectWrap}>
              <Select<FileOption>
                inputId="excel-model"
                options={fileOptions}
                placeholder="Search Excel model..."
                value={selectedOption}
                onChange={(option) => setSelectedFile(option?.value ?? null)}
                styles={selectStyles}
              />
            </div>

            <button
              type="button"
              disabled={!selectedFile || loading}
              onClick={runAnalysis}
            >
              {loading ? (
                <>
                  <Loader size={16} className={styles.spin} />
                  Analyzing
                </>
              ) : (
                <>
                  <Play size={16} />
                  Analyze
                </>
              )}
            </button>
          </div>

          {selectedFile && (
            <div className={styles.filePreview}>
              <FileSpreadsheet size={18} />
              <div>
                <strong>{selectedFile.company_name}</strong>
                <span>{selectedFile.filename}</span>
              </div>
            </div>
          )}
        </section>

        {loading && (
          <div className={styles.loading}>
            <Loader size={18} className={styles.spin} />
            Analyzing financial model...
          </div>
        )}

        {!analysis && !loading && (
          <section className={styles.emptyState}>
            <BarChart3 size={36} />
            <h2>No analysis yet</h2>
            <p>Select an Excel model and click Analyze to see extracted metrics.</p>
          </section>
        )}

        {analysis && (
          <section className={styles.results}>
            {historicalMetrics.length > 0 && (
              <MetricsSection
                title="Historical metrics"
                metrics={historicalMetrics}
              />
            )}

            {proformaMetrics.length > 0 && (
              <MetricsSection title="Pro forma metrics" metrics={proformaMetrics} />
            )}

            {explanation && (
              <div className={styles.explanationBox}>
                <div className={styles.sectionHeading}>
                  <Sparkles size={18} />
                  <h2>Model explanation</h2>
                </div>
                <div className={styles.explanationContent}>{explanation}</div>
              </div>
            )}

            {rawMetrics.length > 0 && (
              <div className={styles.rawMetrics}>
                <div className={styles.sectionHeading}>
                  <BarChart3 size={18} />
                  <h2>Raw extracted metrics</h2>
                </div>

                <div className={styles.metricsTable}>
                  {rawMetrics.map(([key, value]) => (
                    <div key={key} className={styles.metricRow}>
                      <div className={styles.metricName}>
                        {formatMetricLabel(key)}
                      </div>
                      <div className={styles.rowValue}>
                        {formatNumber(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <aside className={styles.promptPanel}>
        <div className={styles.promptHeader}>
          <div className={styles.promptIcon}>
            <Settings2 size={19} />
          </div>
          <div>
            <h2>Prompt editor</h2>
            <p>Update the extraction instructions used by the analyzer.</p>
          </div>
        </div>

        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />

        <button type="button" onClick={savePrompt} disabled={savingPrompt}>
          {savingPrompt ? (
            <>
              <Loader size={16} className={styles.spin} />
              Saving
            </>
          ) : (
            <>
              <Save size={16} />
              Save Prompt
            </>
          )}
        </button>
      </aside>
    </div>
  );
}

function MetricsSection({
  title,
  metrics,
}: {
  title: string;
  metrics: [string, number | null][];
}) {
  return (
    <div className={styles.metricsSection}>
      <div className={styles.sectionHeading}>
        <BarChart3 size={18} />
        <h2>{title}</h2>
      </div>

      <div className={styles.cardGrid}>
        {metrics.map(([key, value]) => (
          <div key={key} className={styles.metricCard}>
            <div className={styles.metricLabel}>{formatMetricLabel(key)}</div>
            <div className={styles.metricValue}>{formatNumber(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getExplanation(raw?: string) {
  if (!raw) return "";

  const cleaned = raw.replace(/```json|```/g, "").trim();
  const match = cleaned.split("{")[0];

  return match.replace("## EXPLANATION", "").trim();
}

function formatMetricLabel(value: string) {
  return value.replaceAll("_", " ");
}

function formatNumber(value: number | null) {
  if (value === null || value === undefined) return "-";

  if (Math.abs(value) < 1) return `${(value * 100).toFixed(1)}%`;

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}
