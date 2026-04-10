import { useEffect, useState } from "react";
import styles from "./AnalyzePage.module.scss";
import Select from "react-select";

import {
  listFiles,
  analyzeFile,
  updatePrompt,
  getPrompt,
} from "../api/analyze";

import type { FileItem, AnalysisResponse } from "../api/analyze";

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

  const loadFiles = async () => {
    try {
      const data = await listFiles();
      console.log("FILES:", data);
      setFiles(data ?? []);
    } catch (err) {
      console.error("Failed loading files", err);
      setFiles([]);
    }
  };

  const loadPrompt = async () => {
    try {
      const res = await getPrompt();
      setPrompt(res?.prompt ?? "");
    } catch (err) {
      console.error("Prompt load error", err);
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const res = await analyzeFile(
        selectedFile.founder_id,
        selectedFile.file_id,
      );

      console.log("ANALYSIS RESPONSE:", res);

      setAnalysis(res ?? null);
    } catch (err) {
      console.error("Analysis error", err);
    } finally {
      setLoading(false);
    }
  };

  const getExplanation = (raw?: string) => {
    if (!raw) return "";

    // remove ``` blocks
    const cleaned = raw.replace(/```json|```/g, "").trim();

    // extract explanation before JSON
    const match = cleaned.split("{")[0];

    return match.replace("## EXPLANATION", "").trim();
  };

  const savePrompt = async () => {
    try {
      setSavingPrompt(true);
      await updatePrompt(prompt);
    } catch (err) {
      console.error("Save prompt error", err);
    } finally {
      setSavingPrompt(false);
    }
  };

  const formatNumber = (v: number | null) => {
    if (v === null || v === undefined) return "—";

    if (Math.abs(v) < 1) return (v * 100).toFixed(1) + "%";

    return v.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  const fileOptions = files.map((f) => ({
    value: f,
    label: `${f.company_name} — ${f.filename}`,
  }));

  return (
    <div className={styles.workspace}>
      {/* LEFT PANEL */}

      <div className={styles.leftPanel}>
        <h1>Financial Model Analyzer</h1>

        {/* MODEL SELECTOR */}

        <div className={styles.selector}>
          <label>Excel Model</label>

          <Select
            options={fileOptions}
            placeholder="Search Excel model..."
            value={
              selectedFile
                ? {
                    value: selectedFile,
                    label: `${selectedFile.company_name} — ${selectedFile.filename}`,
                  }
                : null
            }
            onChange={(option) => setSelectedFile(option?.value ?? null)}
            styles={{
              control: (base) => ({
                ...base,
                width: 420,
                borderRadius: 10,
                minHeight: 40,
              }),
              menu: (base) => ({
                ...base,
                width: 420,
                maxHeight: 260,
              }),
              menuList: (base) => ({
                ...base,
                maxHeight: 260,
              }),
            }}
          />

          <button disabled={!selectedFile} onClick={runAnalysis}>
            Analyze
          </button>
        </div>

        {loading && (
          <div className={styles.loading}>Analyzing financial model...</div>
        )}

        {/* RESULTS */}

        {analysis && (
          <>
            {/* HISTORICAL */}

            {analysis?.computed?.historical && (
              <div className={styles.metricsSection}>
                <h2>Historical Metrics</h2>

                <div className={styles.cardGrid}>
                  {Object.entries(analysis.computed.historical).map(
                    ([key, value]) => (
                      <div key={key} className={styles.metricCard}>
                        <div className={styles.metricLabel}>{key}</div>

                        <div className={styles.metricValue}>
                          {formatNumber(value)}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* PROFORMA */}

            {analysis?.computed?.proforma && (
              <div className={styles.metricsSection}>
                <h2>Pro Forma Metrics</h2>

                <div className={styles.cardGrid}>
                  {Object.entries(analysis.computed.proforma).map(
                    ([key, value]) => (
                      <div key={key} className={styles.metricCard}>
                        <div className={styles.metricLabel}>{key}</div>

                        <div className={styles.metricValue}>
                          {formatNumber(value)}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {analysis?.llama_raw && (
              <div className={styles.explanationBox}>
                <h2>LLaMA Explanation</h2>

                <div className={styles.explanationContent}>
                  {getExplanation(analysis.llama_raw)}
                </div>
              </div>
            )}

            {/* RAW METRICS */}

            <div className={styles.rawMetrics}>
              <h2>Raw Extracted Metrics</h2>

              <div className={styles.metricsTable}>
                {Object.entries(analysis.metrics).map(([key, value]) => (
                  <div key={key} className={styles.metricRow}>
                    <div className={styles.metricName}>
                      {key.replaceAll("_", " ")}
                    </div>

                    <div className={styles.metricValue}>
                      {formatNumber(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* PROMPT PANEL */}

      <div className={styles.promptPanel}>
        <h2>Prompt Editor</h2>

        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />

        <button onClick={savePrompt}>
          {savingPrompt ? "Saving..." : "Save Prompt"}
        </button>
      </div>
    </div>
  );
}
