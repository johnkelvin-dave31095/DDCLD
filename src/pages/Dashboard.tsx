import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

import { getFoundersDashboard } from "../api/founders";
import type { FounderDashboardRow } from "../api/founders";
import loadingAnim from "../assets/orange-loading.json";
import StatusBadge from "../components/StatusBadge";

import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Folder,
  Loader,
  PieChart,
} from "lucide-react";

import styles from "./Dashboard.module.scss";

const sectionLabels = {
  management: "Mgmt",
  industry: "Industry",
  marketability: "Market",
  business: "Business",
  financial: "Finance",
} as const;

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
        <p className={styles.loadingText}>Loading opportunities...</p>
      </div>
    );
  }

  const completeCount = rows.filter((row) => row.status === "almost_complete").length;
  const needsDataCount = rows.filter((row) => row.status !== "almost_complete").length;
  const processingCount = rows.filter(
    (row) =>
      row.processing_status === "extracting_text" ||
      row.processing_status === "summarizing_files",
  ).length;
  const totalFiles = rows.reduce((sum, row) => sum + row.file_count, 0);
  const averageCompletion = rows.length
    ? Math.round(
        rows.reduce((sum, row) => sum + row.completion_pct, 0) / rows.length,
      )
    : 0;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>Opportunity pipeline</span>
          <h1>Founder opportunities</h1>
          <p>
            Track submitted companies, diligence readiness, document activity,
            and processing progress from one focused workspace.
          </p>
        </div>

        <div className={styles.heroBadge}>
          <PieChart size={18} />
          <span>{averageCompletion}% avg. checklist completion</span>
        </div>
      </section>

      <section className={styles.statsGrid} aria-label="Opportunity summary">
        <StatCard
          icon={<Building2 size={20} />}
          label="Total opportunities"
          value={rows.length}
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Near complete"
          value={completeCount}
        />
        <StatCard
          icon={<Clock3 size={20} />}
          label="Need more data"
          value={needsDataCount}
        />
        <StatCard
          icon={<Folder size={20} />}
          label="Files uploaded"
          value={totalFiles}
        />
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Opportunity review queue</h2>
            <p>
              Select a company to open the detail workspace and continue the
              review.
            </p>
          </div>

          <span className={styles.queueMeta}>
            {processingCount} currently processing
          </span>
        </div>

        {rows.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={34} />
            <h3>No opportunities yet</h3>
            <p>New founder submissions will appear here once received.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Checklist</th>
                  <th>Sections</th>
                  <th>Files</th>
                  <th>Status</th>
                  <th>Processing</th>
                  <th aria-label="Open opportunity" />
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.founder_id}
                    className={styles.row}
                    onClick={() => navigate(`/founders/${row.founder_id}`)}
                  >
                    <td data-label="Company" className={styles.companyCell}>
                      <div className={styles.companyMark}>
                        {getInitials(row.company_name)}
                      </div>
                      <div>
                        <div className={styles.companyName}>
                          {row.company_name || "Untitled company"}
                        </div>
                        <div className={styles.companyMeta}>
                          Founder ID {row.founder_id}
                        </div>
                      </div>
                    </td>

                    <td data-label="Checklist">
                      <div className={styles.progressWrap}>
                        <div className={styles.progressTopline}>
                          <span>{row.completion_pct}%</span>
                          <small>
                            {row.answered_items}/{row.total_items}
                          </small>
                        </div>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${row.completion_pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td data-label="Sections">
                      <div className={styles.sectionGrid}>
                        {Object.entries(sectionLabels).map(([key, label]) => {
                          const section =
                            row.section_breakdown[
                              key as keyof typeof row.section_breakdown
                            ];

                          return (
                            <span className={styles.sectionChip} key={key}>
                              <strong>{label}</strong>
                              {section.answered}/{section.total}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    <td data-label="Files">
                      <span className={styles.filePill}>
                        <Folder size={14} />
                        {row.file_count}
                      </span>
                    </td>

                    <td data-label="Status" className={styles.statusCell}>
                      <StatusBadge status={row.status} />
                    </td>

                    <td data-label="Processing" className={styles.processingCell}>
                      {renderProcessingStatus(row.processing_status)}
                    </td>

                    <td className={styles.openCell}>
                      <ArrowUpRight size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function renderProcessingStatus(status: FounderDashboardRow["processing_status"]) {
  switch (status) {
    case "extracting_text":
      return (
        <span className={styles.processing}>
          <Loader size={14} className={styles.spin} />
          Extracting text
        </span>
      );
    case "summarizing_files":
      return (
        <span className={styles.processing}>
          <Loader size={14} className={styles.spin} />
          Summarizing files
        </span>
      );
    case "done":
      return (
        <span className={styles.done}>
          <BadgeCheck size={14} />
          Complete
        </span>
      );
    case "no_files":
    default:
      return <span className={styles.muted}>Waiting for files</span>;
  }
}

function getInitials(name: string) {
  return (name || "Opportunity")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
