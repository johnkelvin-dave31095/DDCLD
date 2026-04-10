import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";

import styles from "./Topbar.module.scss";

type StoredUser = {
  first_name?: string;
  email?: string;
};

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const rawUser = localStorage.getItem("user");
  const user: StoredUser | null = rawUser ? JSON.parse(rawUser) : null;
  const userName = user?.first_name || "User";
  const userEmail = user?.email || localStorage.getItem("user_email") || "";

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.titleBlock}>
          <span>Due Diligence Center</span>
          <strong>Workspace</strong>
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search across DDC" readOnly />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} type="button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className={styles.userMenu} ref={menuRef}>
          <button
            type="button"
            className={styles.user}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <div className={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>

            <div className={styles.userInfo}>
              <div className={styles.name}>{userName}</div>
              {userEmail && <div className={styles.email}>{userEmail}</div>}
            </div>

            <ChevronDown
              size={16}
              className={`${styles.caret} ${menuOpen ? styles.caretOpen : ""}`}
            />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownName}>{userName}</div>
                {userEmail && (
                  <div className={styles.dropdownEmail}>{userEmail}</div>
                )}
              </div>

              <div className={styles.divider} />

              <button className={styles.dropdownItem} type="button" disabled>
                Profile
              </button>

              <button className={styles.dropdownItem} type="button" disabled>
                Settings
              </button>

              <button className={styles.dropdownItem} type="button" disabled>
                Help & Support
              </button>

              <div className={styles.divider} />

              <button
                type="button"
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
