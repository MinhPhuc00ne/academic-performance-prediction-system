import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import styles from "./Predict.module.scss";

function Predict({ model, searchRequest }) {
    const fileInputRef = useRef(null);

    const [mode, setMode] = useState("upload");

    const [inputs, setInputs] = useState({
        id: "",
        name: "",
        process: "",
        absence: "",
    });

    const [predictionResult, setPredictionResult] = useState(null);

    const [predictions, setPredictions] = useState(() => {
        const saved = localStorage.getItem("mas291_predictions");
        return saved ? JSON.parse(saved) : [];
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem("mas291_history");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("mas291_predictions", JSON.stringify(predictions));
    }, [predictions]);

    useEffect(() => {
        localStorage.setItem("mas291_history", JSON.stringify(history));
    }, [history]);

    const addToHistory = (item, type) => {
        const newItem = {
            ...item,
            type,
            time: new Date().toLocaleString(),
        };
        setHistory((prev) => [newItem, ...prev]);
    };

    /* ======================== */
    const predictGrade = (p, a) => {
        if (!model || model.beta0 === null) {
            alert("Please train the model first.");
            return 0;
        }

        const grade = model.beta0 + model.beta1 * p + model.beta2 * a;

        return Math.max(0, Math.min(100, grade));
    };

    const confidence = () => {
        if (!model || !model.rSquared) return "-";
        return Math.round(model.rSquared * 100);
    };

    const getAbsenceStatus = (result) => {
        if (!result) return null;

        const a = parseFloat(result.a);

        if (a === 0) {
            return {
                label: "Perfect Attendance",
                message: "Excellent! Student has no absences.",
                type: "success",
            };
        }

        if (a > 0 && a <= 4) {
            return {
                label: "Warning",
                message: "Absence is within limit (≤20%) but needs attention.",
                type: "warning",
            };
        }

        return {
            label: "FAILED (ABSENCE)",
            message: "Absence exceeds 20%. Student fails.",
            type: "danger",
        };
    };

    /* ======================== */
    const handleFileUpload = (file) => {
        if (!file) return;

        if (!model || model.beta0 === null) {
            alert("Please train the model first.");
            return;
        }

        Papa.parse(file, {
            skipEmptyLines: true,
            complete: (results) => {
                let rows = results.data;

                const first = rows[0];

                if (
                    first?.[0]?.toLowerCase().includes("id") ||
                    first?.[1]?.toLowerCase().includes("name") ||
                    first?.[2]?.toLowerCase().includes("process") ||
                    first?.[3]?.toLowerCase().includes("absence")
                ) {
                    rows = rows.slice(1);
                }

                const formatted = rows
                    .filter((row) => row.length >= 4)
                    .map((row) => {
                        const p = parseFloat(row[2]);
                        const a = parseFloat(row[3]);

                        if (isNaN(p) || isNaN(a)) return null;

                        const grade = predictGrade(p, a);

                        const item = {
                            id: row[0] || "-",
                            name: row[1] || "-",
                            p,
                            a,
                            grade: grade.toFixed(2),
                            conf: confidence(),
                        };

                        setPredictionResult(item);
                        addToHistory(item, "upload");

                        return item;
                    })
                    .filter(Boolean);

                setPredictions((prev) => [...prev, ...formatted]);
            },
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFileUpload(e.dataTransfer.files[0]);
    };

    const handlePredict = () => {
        if (!inputs.process || !inputs.absence) return;

        if (!model || model.beta0 === null) {
            alert("Please train the model first.");
            return;
        }

        const p = parseFloat(inputs.process);
        const a = parseFloat(inputs.absence);
        const grade = predictGrade(p, a);

        const item = {
            id: inputs.id || "-",
            name: inputs.name || "-",
            p,
            a,
            grade: grade.toFixed(2),
            conf: confidence(),
        };

        setPredictionResult(item);
        setPredictions((prev) => [...prev, item]);
        addToHistory(item, "manual");

        setInputs({
            id: "",
            name: "",
            process: "",
            absence: "",
        });
    };

    const handleDeleteAll = () => setPredictions([]);
    const handleView = (row) => setPredictionResult(row);

    const searchedPrediction = searchRequest?.id
        ? [...predictions].reverse().find(
              (item) =>
                  String(item.id || "")
                      .trim()
                      .toLowerCase() === String(searchRequest.id).trim().toLowerCase(),
          )
        : null;

    const activePredictionResult = searchedPrediction || predictionResult;
    const absenceStatus = getAbsenceStatus(activePredictionResult);

    return (
        <div className={styles.container}>
            {/* HEADER */}
            <div className={`${styles.header} slide delay1`}>
                <div>
                    <h1 className={styles.title}>Final Grade Prediction</h1>
                    <p className={styles.subtitle}>Academic Performance Prediction System (SAP)</p>
                </div>
            </div>

            {/* RESULT */}
            <div className={`${styles.resultWrapper} slide delay2`}>
                <div className={styles.resultCard}>
                    <p className={styles.resultLabel}>PREDICTED FINAL GRADE</p>

                    <div className={styles.resultValue}>
                        {activePredictionResult ? activePredictionResult.grade : "--"}
                        <span>/100</span>
                    </div>

                    <div className={styles.gradeBadge}>
                        {activePredictionResult ? `Confidence ${activePredictionResult.conf}%` : "No Prediction"}
                    </div>
                </div>

                <div className={styles.absenceCard}>
                    <p className={styles.resultLabel}>ATTENDANCE STATUS</p>

                    {activePredictionResult ? (
                        <>
                            <div className={styles.absenceValue}>
                                {activePredictionResult.a}
                                <span>/4</span>
                            </div>

                            <div className={`${styles.absenceBadge} ${styles[absenceStatus.type]}`}>
                                {absenceStatus.label}
                            </div>

                            <p className={styles.absenceMessage}>{absenceStatus.message}</p>
                        </>
                    ) : (
                        <div className={styles.noData}>No Data</div>
                    )}
                </div>
            </div>

            {/* INPUT */}
            <div className={`${styles.sectionCard} slide delay3`}>
                <h2 className={styles.sectionTitle}>1. Prediction Input</h2>

                <div className={styles.modeSwitch}>
                    <button className={mode === "upload" ? styles.active : ""} onClick={() => setMode("upload")}>
                        Batch Upload
                    </button>

                    <button className={mode === "manual" ? styles.active : ""} onClick={() => setMode("manual")}>
                        Manual Entry
                    </button>
                </div>

                {mode === "upload" && (
                    <div
                        className={styles.uploadBox}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            hidden
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                        />

                        <div className={styles.uploadIcon}>☁</div>
                        <h3>Upload Student Data</h3>
                        <p>CSV format: id, name, process, absence</p>

                        <button className={styles.selectBtn}>Select Files</button>
                    </div>
                )}

                {mode === "manual" && (
                    <div className={styles.form}>
                        <input
                            placeholder="Student ID"
                            value={inputs.id}
                            onChange={(e) => setInputs({ ...inputs, id: e.target.value })}
                        />

                        <input
                            placeholder="Name"
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                        />

                        <input
                            placeholder="Process Score"
                            value={inputs.process}
                            onChange={(e) => setInputs({ ...inputs, process: e.target.value })}
                        />

                        <input
                            placeholder="Absence Days"
                            value={inputs.absence}
                            onChange={(e) => setInputs({ ...inputs, absence: e.target.value })}
                        />

                        <button onClick={handlePredict}>Predict</button>
                    </div>
                )}
            </div>

            {/* TABLE */}
            <div className={`${styles.datasetCard} slide delay4`}>
                <div className={styles.datasetHeader}>
                    <h2 className={styles.sectionTitle}>2. Prediction Results</h2>

                    <button className={styles.deleteAllBtn} onClick={handleDeleteAll}>
                        Delete All
                    </button>
                </div>

                <h3>Results ({predictions.length})</h3>

                <div className={styles.tableWrap}>
                    <table>
                        <tbody>
                            {predictions.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.id}</td>
                                    <td>{row.name}</td>
                                    <td>
                                        P:{row.p} | A:{row.a}
                                    </td>
                                    <td>{row.grade}</td>
                                    <td>{row.conf}%</td>
                                    <td>
                                        <button onClick={() => handleView(row)}>👁</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={`${styles.footer} slide delay5`}>MAS-SPRING 2026 – SAP</div>
        </div>
    );
}

export default Predict;
