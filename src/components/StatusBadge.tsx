import styles from "./StatusBadge.module.scss";

type Status = "almost_complete" | "needs_more_data" | "incomplete";

type StatusConfig = {
  label: string;
  color: string;
  background: string;
  tooltip: string;
};

const STATUS_CONFIG: Record<Status, StatusConfig> = {
  almost_complete: {
    label: "Almost Complete",
    color: "#15803d",
    background: "#dcfce7",
    tooltip: "At least 80% of checklist items are completed.",
  },
  needs_more_data: {
    label: "Needs More Data",
    color: "#b45309",
    background: "#fef3c7",
    tooltip: "40–79% of checklist items are completed.",
  },
  incomplete: {
    label: "Incomplete",
    color: "#b91c1c",
    background: "#fee2e2",
    tooltip: "Less than 40% of checklist items are completed.",
  },
};

export type StatusBadgeProps = {
  status: string; // runtime-safe
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as Status] ?? STATUS_CONFIG["incomplete"];

  return (
    <span
      className={styles.statusBadge}
      data-tooltip={config.tooltip}
      style={{
        color: config.color,
        backgroundColor: config.background,
      }}
    >
      {config.label}
    </span>
  );
}
