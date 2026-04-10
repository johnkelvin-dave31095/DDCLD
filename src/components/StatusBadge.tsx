import styles from "./StatusBadge.module.scss";

type Status = "almost_complete" | "needs_more_data" | "incomplete";

type StatusConfig = {
  label: string;
  tooltip: string;
  className: string;
};

const STATUS_CONFIG: Record<Status, StatusConfig> = {
  almost_complete: {
    label: "Almost Complete",
    tooltip: "At least 80% of checklist items are completed.",
    className: styles.almostComplete,
  },
  needs_more_data: {
    label: "Needs More Data",
    tooltip: "40-79% of checklist items are completed.",
    className: styles.needsMoreData,
  },
  incomplete: {
    label: "Incomplete",
    tooltip: "Less than 40% of checklist items are completed.",
    className: styles.incomplete,
  },
};

export type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as Status] ?? STATUS_CONFIG.incomplete;

  return (
    <span
      className={`${styles.statusBadge} ${config.className}`}
      data-tooltip={config.tooltip}
    >
      {config.label}
    </span>
  );
}
