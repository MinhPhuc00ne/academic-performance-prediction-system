import { useState } from "react"; // 🔥 THÊM
import styles from "./Layout.module.scss";

function Layout({ children, setSearchId }) { // 🔥 THÊM PROP

    const [value, setValue] = useState(""); // 🔥 STATE SEARCH

    return (
        <div className={styles.layout}>

            {/* SIDEBAR */}
            <div className={styles.sidebar}>

                <div className={styles.logo}>
                    <img src="/images/logo.png" alt="logo" />
                    <div>
                        <h3>Academic</h3>
                        <p>Prediction System</p>
                    </div>
                </div>

                <div className={styles.menu}>

                    <div className={styles.menuItem}>Dashboard</div>

                    <div className={`${styles.menuItem} ${styles.active}`}>
                        Training
                    </div>

                    <div className={styles.menuItem}>Predict</div>

                    <div className={styles.menuItem}>Model Result</div>

                    <div className={styles.menuItem}>History</div>

                </div>

            </div>

            {/* MAIN AREA */}
            <div className={styles.main}>

                {/* TOPBAR */}
                <div className={styles.topbar}>

                    <div className={styles.brand}>
                        <img src="/images/favicon.png" alt="logo" />
                        Academic Performance Prediction System
                    </div>

                    {/* 🔥 SEARCH CONNECT */}
                    <input
                        className={styles.search}
                        placeholder="Search student ID..."
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);      // hiển thị input
                            setSearchId(e.target.value);  // 🔥 truyền ra ngoài
                        }}
                    />

                    <div className={styles.nav}>

                        <span>Dashboard</span>
                        <span className={styles.active}>Training</span>
                        <span>Predict</span>
                        <span>Model Result</span>

                    </div>

                </div>

                {/* PAGE CONTENT */}
                <div className={styles.content}>
                    {children}
                </div>

            </div>

        </div>
    );
}

export default Layout;