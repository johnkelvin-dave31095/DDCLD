import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  KeyRound,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
} from "lucide-react";

import logo from "../assets/logo.png";

// import logo from "../assets/white-logo.png";

import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  // CHANGE: collapsed state
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* LOGO + TOGGLE */}
      <div className={styles.logoRow}>
        {/* {!collapsed && (
          <img src={logo} alt="Ametryx" className={styles.logoImage} />
        )} */}

        {/* CHANGE: collapse button */}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      <img src={logo} alt="Lotus Domaine" className={styles.brandLogo} />

      <nav className={styles.nav}>
        {/* OVERVIEW */}
        <div className={styles.section}>
          {!collapsed && <div className={styles.sectionTitle}>Overview</div>}

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

        {/* ENRICHMENT */}
        {/* <div className={styles.section}>
          {!collapsed && <div className={styles.sectionTitle}>Enrichment</div>}

          <NavItem
            to="/enrichment/batches"
            icon={<Zap size={18} />}
            label="Batch Enrichment"
            collapsed={collapsed}
          />

          <NavItem
            to="/enrichment/people"
            icon={<Users size={18} />}
            label="People *coming soon*"
            collapsed={collapsed}
          />

          <NavItem
            to="/enrichment/companies"
            icon={<Building2 size={18} />}
            label="Companies *coming soon*"
            collapsed={collapsed}
          />
        </div> */}

        {/* ADMIN */}
        {isAdmin && (
          <div className={styles.section}>
            {!collapsed && <div className={styles.sectionTitle}>Admin</div>}

            <NavItem
              to="/admin/tokens"
              icon={<KeyRound size={18} />}
              label="Add Tokens"
              collapsed={collapsed}
            />
          </div>
        )}

        {/* LOGOUT */}
        {/* <div className={styles.section}>
          <button className={styles.logoutLink} onClick={handleLogout}>
            <span className={styles.activeBar} />
            <span className={styles.icon}>
              <LogOut size={18} />
            </span>

            {!collapsed && <span className={styles.label}>Logout</span>}
          </button>
        </div> */}
      </nav>
    </aside>
  );
}

/* =====================
   NAV ITEM
===================== */
function NavItem({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.active : ""}`
      }
    >
      <span className={styles.activeBar} />
      <span className={styles.icon}>{icon}</span>

      {/* CHANGE: hide label when collapsed */}
      {!collapsed && <span className={styles.label}>{label}</span>}
    </NavLink>
  );
}
