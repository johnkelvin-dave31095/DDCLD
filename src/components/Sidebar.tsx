import { useState } from "react";
import type { ReactNode } from "react";
import { Layers, PanelLeftClose, PanelLeftOpen, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import logo from "../assets/logo.png";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.collapseBtn}
          onClick={() => setCollapsed((value) => !value)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>

        <img src={logo} alt="Lotus Domaine" className={styles.brandLogo} />

      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.section}>
          {!collapsed && <div className={styles.sectionTitle}>Workspace</div>}

          <NavItem
            to="/dashboard"
            icon={<Users size={18} />}
            label="Opportunity"
            collapsed={collapsed}
          />

          <NavItem
            to="/excelanalyzer"
            icon={<Layers size={18} />}
            label="Excel Analyzer"
            collapsed={collapsed}
          />
        </div>
      </nav>
    </aside>
  );
}

function NavItem({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.active : ""}`
      }
    >
      <span className={styles.activeBar} />
      <span className={styles.icon}>{icon}</span>
      {!collapsed && <span className={styles.label}>{label}</span>}
    </NavLink>
  );
}
