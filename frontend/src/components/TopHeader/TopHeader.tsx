"use client";

import { useState, useEffect } from "react";
import styles from "./TopHeader.module.css";

export default function TopHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + " UTC");
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.header}>
      {/* Search */}
      <div className={styles.searchBox}>
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>
          search
        </span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Global search..."
        />
      </div>

      {/* Status & Clock */}
      <div className={styles.rightSection}>
        <div className={styles.statusChip}>
          <div className={styles.statusDot} />
          <span className={styles.statusText}>System Operational</span>
        </div>

        <div className={styles.clockSection}>
          <span className="material-symbols-outlined">schedule</span>
          <span className={styles.clockTime}>{time}</span>
        </div>
      </div>
    </header>
  );
}
