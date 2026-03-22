import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { calculateRegression } from "../../utils/regression";
import styles from "./Training.module.scss";

function Training({ data, setData, setModel }) {
    const fileInputRef = useRef(null);

    const [mode, setMode] = useState("upload");

    const [inputs, setInputs] = useState({
        process: "",
        absence: "",
        final: "",
    });

    const [isTrained, setIsTrained] = useState(() => {
        const saved = localStorage.getItem("mas291_isTrained");
        return saved === "true";
    });

    useEffect(() => {
        localStorage.setItem("mas291_isTrained", isTrained);
    }, [isTrained]);

    /* =========================
        CSV UPLOAD
    ========================= */

    const handleFileUpload = (file) => {
        if (!file) return;

        Papa.parse(file, {
            skipEmptyLines: true,

            complete: (results) => {
                let rows = results.data;

                const first = rows[0];

                if (
                    first?.[0]?.toLowerCase().includes("process") ||
                    first?.[1]?.toLowerCase().includes("absence") ||
                    first?.[2]?.toLowerCase().includes("final")
                ) {
                    rows = rows.slice(1);
                }

                const formatted = rows
                    .filter((row) => row.length >= 3)
                    .map((row) => ({
                        id: "-",
                        name: "-",
                        p: parseFloat(row[0]),
                        a: parseFloat(row[1]),
                        f: parseFloat(row[2]),
                    }))
                    .filter((d) => !isNaN(d.p) && !isNaN(d.a) && !isNaN(d.f));

                if (formatted.length > 0) {
                    setData((prev) => [...prev, ...formatted]);
                    setIsTrained(false);
                }
            },
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    };

    /* =========================
        MANUAL ENTRY
    ========================= */

    const handleAddData = () => {
        if (!inputs.process || !inputs.absence || !inputs.final) return;

        setData([
            ...data,
            {
                id: "-",
                name: "-",
                p: parseFloat(inputs.process),
                a: parseFloat(inputs.absence),
                f: parseFloat(inputs.final),
            },
        ]);

        setInputs({
            process: "",
            absence: "",
            final: "",
        });

        setIsTrained(false);
    };

    const handleDelete = (index) => {
        const newData = data.filter((_, i) => i !== index);

        setData(newData);

        setIsTrained(false);
    };

    const handleDeleteAll = () => {
        setData([]);
        setIsTrained(false);
    };

    /* =========================
        TRAIN MODEL
    ========================= */

    const handleTrain = () => {
        if (data.length < 2) return;

        const model = calculateRegression(data);

        if (model) {
            setModel(model);
            setIsTrained(true);
        }
    };

    return (
        <div className={styles.container}>
            {/* HEADER */}

            <div className={`${styles.header} slide delay1`}>
                <div>
                    <h1 className={styles.title}>Model Training – Final Grade Prediction</h1>

                    <p className={styles.subtitle}>Academic Performance Prediction System (SAP)</p>
                </div>
            </div>

            {/* STATUS */}

            <div className={`slide delay2 ${styles.banner} ${isTrained ? styles.success : styles.warning}`}>
                {isTrained ? "Model trained successfully" : "Data changed. Please train the model"}
            </div>

            {/* DATA SOURCE */}

            <div className={`${styles.sectionCard} slide delay3`}>
                <h2 className={styles.sectionTitle}>1. Data Source</h2>

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

                        <h3>Upload Dataset</h3>

                        <p>CSV format: process, absence, final</p>

                        <button className={styles.selectBtn}>Select Files</button>
                    </div>
                )}

                {mode === "manual" && (
                    <div className={styles.form}>
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

                        <input
                            placeholder="Final Score"
                            value={inputs.final}
                            onChange={(e) => setInputs({ ...inputs, final: e.target.value })}
                        />

                        <button onClick={handleAddData}>Add Data</button>
                    </div>
                )}
            </div>

            {/* DATASET */}

            <div className={`${styles.datasetCard} slide delay4`}>
                <div className={styles.datasetHeader}>
                    <h2 className={styles.sectionTitle}>2. Training Features</h2>

                    <div className={styles.actionBtns}>
                        <button className={styles.trainBtn} onClick={handleTrain}>
                            Train Model
                        </button>

                        <button className={styles.deleteAllBtn} onClick={handleDeleteAll}>
                            Delete Dataset
                        </button>
                    </div>
                </div>

                <h3>Dataset ({data.length})</h3>

                <div className={styles.tableWrap}>
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Process</th>
                                <th>Absence</th>
                                <th>Final</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{row.p}</td>
                                    <td>{row.a}</td>
                                    <td>{row.f}</td>

                                    <td className={styles.deleteCell}>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(index)}>
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FOOTER */}

            <div className={`${styles.footer} slide delay5`}>
                MAS-SPRING 2026 – Academic Performance Prediction System (SAP)
            </div>
        </div>
    );
}

export default Training;
