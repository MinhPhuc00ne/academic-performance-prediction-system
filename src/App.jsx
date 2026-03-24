import { useState, useEffect } from "react";
import Training from "./components/Training/Training";
import ModelResult from "./components/ModelResult/ModelResult";
import Predict from "./components/Predict/Predict";
import Sidebar from "./components/Sidebar/Sidebar";
import History from "./components/History/History"; // 🔥 THÊM

function App() {
    const [activeTab, setActiveTab] = useState(() => {
        const savedTab = localStorage.getItem("mas291_activeTab");
        const validTabs = ["training", "predict", "model", "history"];
        return validTabs.includes(savedTab) ? savedTab : "training";
    });

    /* SEARCH */
    const [searchId, setSearchId] = useState("");
    const [predictSearchRequest, setPredictSearchRequest] = useState(null);

    const [data, setData] = useState(() => {
        const savedData = localStorage.getItem("mas291_data");
        return savedData ? JSON.parse(savedData) : [];
    });

    const [model, setModel] = useState(() => {
        const savedModel = localStorage.getItem("mas291_model");
        return savedModel ? JSON.parse(savedModel) : { beta0: null, beta1: null, beta2: null, rSquared: null };
    });

    useEffect(() => {
        localStorage.setItem("mas291_data", JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        localStorage.setItem("mas291_model", JSON.stringify(model));
    }, [model]);

    useEffect(() => {
        localStorage.setItem("mas291_activeTab", activeTab);
    }, [activeTab]);

    const handleSearchPrediction = () => {
        const keyword = searchId.trim();
        if (!keyword) return;

        const savedPredictions = localStorage.getItem("mas291_predictions");
        const predictions = savedPredictions ? JSON.parse(savedPredictions) : [];

        const normalizedKeyword = keyword.toLowerCase();
        const found = [...predictions].reverse().find(
            (item) =>
                String(item.id || "")
                    .trim()
                    .toLowerCase() === normalizedKeyword,
        );

        if (!found) {
            alert(`No prediction found for ID: ${keyword}`);
            return;
        }

        setPredictSearchRequest({ id: keyword, token: Date.now() });
        setActiveTab("predict");
    };

    return (
        <div style={styles.app}>
            {/* TOPBAR */}
            <header style={styles.topbar}>
                <div style={styles.brand}>
                    <img src="/images/logo.png" alt="logo" style={styles.logo} />
                    <span style={styles.systemName}>Academic Performance Prediction System</span>
                </div>

                <div style={styles.searchGroup}>
                    {/* SEARCH CONNECT */}
                    <input
                        type="text"
                        placeholder="Search Student ID..."
                        style={styles.search}
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearchPrediction();
                        }}
                    />

                    <button style={styles.searchBtn} onClick={handleSearchPrediction}>
                        Search
                    </button>
                </div>

                <nav style={styles.nav}>
                    <span
                        style={activeTab === "training" ? styles.activeNav : styles.navItem}
                        onClick={() => setActiveTab("training")}
                    >
                        Training
                    </span>

                    <span
                        style={activeTab === "predict" ? styles.activeNav : styles.navItem}
                        onClick={() => setActiveTab("predict")}
                    >
                        Predict
                    </span>

                    <span
                        style={activeTab === "model" ? styles.activeNav : styles.navItem}
                        onClick={() => setActiveTab("model")}
                    >
                        Model Result
                    </span>

                    {/* 🔥 TAB HISTORY */}
                    <span
                        style={activeTab === "history" ? styles.activeNav : styles.navItem}
                        onClick={() => setActiveTab("history")}
                    >
                        History
                    </span>
                </nav>
            </header>

            {/* MAIN LAYOUT */}
            <div style={styles.main}>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                <main style={styles.content}>
                    {activeTab === "training" && <Training data={data} setData={setData} setModel={setModel} />}

                    {activeTab === "predict" && <Predict model={model} searchRequest={predictSearchRequest} />}

                    {activeTab === "model" && <ModelResult model={model} data={data} />}

                    {/* 🔥 HISTORY PAGE */}
                    {activeTab === "history" && <History searchId={searchId} />}
                </main>
            </div>
        </div>
    );
}

const styles = {
    app: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        color: "white",
    },

    topbar: {
        height: "60px",
        minHeight: "60px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        background: "#020617",
        borderBottom: "1px solid #1e293b",
    },

    brand: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    logo: {
        width: "30px",
        height: "30px",
    },

    systemName: {
        fontWeight: "600",
        fontSize: "15px",
    },

    search: {
        width: "260px",
        padding: "8px 12px",
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "6px",
        color: "white",
        outline: "none",
    },

    searchGroup: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    searchBtn: {
        padding: "8px 14px",
        background: "#2563eb",
        border: "none",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    },

    nav: {
        display: "flex",
        gap: "22px",
    },

    navItem: {
        cursor: "pointer",
        color: "#94a3b8",
    },

    activeNav: {
        cursor: "pointer",
        color: "#3b82f6",
        fontWeight: "500",
    },

    main: {
        flex: 1,
        display: "flex",
        overflow: "hidden",
    },

    content: {
        flex: 1,
        padding: "30px",
        overflowY: "auto",
    },
};

export default App;
