import { useEffect, useRef, useState } from "react";
import { Search, Coins, Bell, ChevronDown, LogOut } from "lucide-react";

import styles from "./Topbar.module.scss";

const API_URL = "https://bs0lamxw7h.execute-api.us-east-1.amazonaws.com/dev";

export default function Topbar() {
  const [credits, setCredits] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const userName = user.first_name;
  const userEmail = localStorage.getItem("user_email") || "";
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) return;
    fetchCredits();
  }, [userId]);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await fetch(`${API_URL}/GetCredits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      setCredits(data.credits_remaining);
    } catch (err) {
      console.error("Error loading credits:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className={styles.topbar}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search across DDC" readOnly />
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        {/* CREDITS */}
        <div className={styles.credits}>
          <Coins size={16} />
          <span className={styles.creditValue}>
            {credits !== null ? credits : "—"}
          </span>
        </div>

        {/* NOTIFICATIONS */}
        <button className={styles.iconBtn}>
          <Bell size={18} />
        </button>

        {/* USER MENU */}
        <div className={styles.userMenu} ref={menuRef}>
          <button
            className={styles.user}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className={styles.avatar}>
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className={styles.userInfo}>
              <div className={styles.name}>{userName}</div>
              <div className={styles.email}>{userEmail}</div>
            </div>

            <ChevronDown
              size={16}
              className={`${styles.caret} ${menuOpen ? styles.caretOpen : ""}`}
            />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              {/* IDENTITY */}
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownName}>{userName}</div>
                <div className={styles.dropdownEmail}>{userEmail}</div>
              </div>

              <div className={styles.divider} />

              {/* ACTIONS */}
              <button className={styles.dropdownItem} disabled>
                Profile
              </button>

              <button className={styles.dropdownItem} disabled>
                Settings
              </button>

              <button className={styles.dropdownItem} disabled>
                Help & Support
              </button>

              <div className={styles.divider} />

              {/* LOGOUT */}
              <button
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
