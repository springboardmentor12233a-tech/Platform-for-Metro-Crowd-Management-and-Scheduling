'use client';

import styles from "./AlertFeed.module.css";
import { AlertListData, acknowledgeAlert } from "@/lib/api";
import { useState } from "react";

interface AlertFeedProps {
  alerts: AlertListData | null;
  onRefetch: () => Promise<void>;
}

export default function AlertFeed({ alerts, onRefetch }: AlertFeedProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleAcknowledge = async (id: number) => {
    setLoadingId(id);
    try {
      await acknowledgeAlert(id);
      await onRefetch();
    } catch (e) {
      console.error("Failed to acknowledge alert", e);
    } finally {
      setLoadingId(null);
    }
  };

  const getRelativeTime = (isoString: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = new Date(isoString).getTime() - new Date().getTime();
    const diffMinutes = Math.round(diff / 60000);
    const diffHours = Math.round(diff / 3600000);
    
    if (Math.abs(diffMinutes) < 60) {
      return rtf.format(diffMinutes, 'minute');
    } else {
      return rtf.format(diffHours, 'hour');
    }
  };

  const getAlertClasses = (severity: string) => {
    const s = severity.toLowerCase();
    if (s === 'critical' || s === 'high') {
      return { card: styles.alertCritical, accent: styles.accentCritical, text: styles.severityCritical };
    } else if (s === 'warning' || s === 'medium') {
      return { card: styles.alertWarning, accent: styles.accentWarning, text: styles.severityWarning };
    }
    return { card: '', accent: '', text: '' };
  };

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={`material-symbols-outlined ${styles.headerIcon}`}>
            warning
          </span>
          <h2 className={styles.headerTitle}>Active Alerts</h2>
        </div>
        <span className={styles.badge}>{alerts?.active_count || 0}</span>
      </div>

      {/* Scrollable Alert Body */}
      <div className={styles.body}>
        {!alerts ? (
          <div className={styles.alertDesc} style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>
        ) : alerts.alerts.length === 0 ? (
          <div className={styles.alertDesc} style={{ textAlign: 'center', marginTop: '20px' }}>All Clear</div>
        ) : (
          alerts.alerts.map(alert => {
            const classes = getAlertClasses(alert.severity);
            return (
              <div key={alert.id} className={`${styles.alertCard} ${classes.card}`}>
                <div className={`${styles.alertAccent} ${classes.accent}`} />
                <div className={styles.alertMeta}>
                  <span className={classes.text}>{alert.severity.toUpperCase()}</span>
                  <span className={styles.timestamp}>{getRelativeTime(alert.created_at)}</span>
                </div>
                <h3 className={styles.alertTitle}>{alert.title || alert.alert_type}</h3>
                <p className={styles.alertDesc}>{alert.message}</p>
                <div className={styles.alertActions}>
                  {alert.status !== 'Acknowledged' && alert.status !== 'Resolved' && (
                    <button 
                      className={styles.btnDanger} 
                      onClick={() => handleAcknowledge(alert.id)}
                      disabled={loadingId === alert.id}
                    >
                      {loadingId === alert.id ? 'ACKNOWLEDGING...' : 'ACKNOWLEDGE'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
