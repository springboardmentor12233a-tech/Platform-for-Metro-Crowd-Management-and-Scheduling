"use client";

import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";
import styles from "./Sidebar.module.css";

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Network Map", icon: "map", active: false },
  { label: "Schedules", icon: "calendar_today", active: false },
  { label: "AI Analytics", icon: "psychology", active: false },
  { label: "Settings", icon: "settings", active: false },
];

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brand}>
          <span className={styles.brandText}>METROFLOW</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a
              key={item.label}
              className={`${styles.navLink}${item.active ? ` ${styles.navLinkActive}` : ""}`}
              href="#"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className={styles.profileSection}>
        <div className={styles.profileRow}>
          <div className={styles.avatar} />
          <div>
            <div className={styles.profileName}>System Admin</div>
            <div className={styles.profileRole}>Sector 7G Control</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          Disconnect
        </button>
      </div>
    </aside>
  );
}
