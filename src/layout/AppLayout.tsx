import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/footer";

import styles from "./AppLayout.module.scss";

export default function AppLayout() {
  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Topbar />

        <div className={styles.content}>
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  );
}
