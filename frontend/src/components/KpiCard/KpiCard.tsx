import styles from "./KpiCard.module.css";

interface KpiCardProps {
  label: string;
  value: string;
  icon: string;
  accentColor: string;
  valueColor?: string;
}

export default function KpiCard({
  label,
  value,
  icon,
  accentColor,
  valueColor,
}: KpiCardProps) {
  return (
    <div className={styles.card} style={{ borderTop: `2px solid ${accentColor}` }}>
      <div className={styles.topRow}>
        <span className={styles.label}>{label}</span>
        <span
          className={`material-symbols-outlined ${styles.icon}`}
          style={{ color: accentColor }}
        >
          {icon}
        </span>
      </div>
      <div className={styles.value} style={{ color: valueColor || accentColor }}>
        {value}
      </div>
      <div className={styles.sparkline} />
    </div>
  );
}
