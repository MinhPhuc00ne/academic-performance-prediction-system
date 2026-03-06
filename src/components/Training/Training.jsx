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
        final: ""
    });

    const [isTrained, setIsTrained] = useState(() => {
        const saved = localStorage.getItem("mas291_isTrained");
        return saved === "true";
    });

    useEffect(() => {
        localStorage.setItem("mas291_isTrained", isTrained);
    }, [isTrained]);

    const handleFileUpload = (file) => {
        if (!file) return;

        Papa.parse(file, {
            complete: (results) => {

                const formatted = results.data
                    .filter((row) => row.length >= 3)
                    .map((row) => ({
                        p: parseFloat(row[0]),
                        a: parseFloat(row[1]),
                        f: parseFloat(row[2])
                    }))
                    .filter(
                        (d) => !isNaN(d.p) && !isNaN(d.a) && !isNaN(d.f)
                    );

                if (formatted.length > 0) {
                    setData((prev) => [...prev, ...formatted]);
                    setIsTrained(false);
                }
            },
            header: false,
            skipEmptyLines: true
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    };

    const handleAddData = () => {

        if (!inputs.process || !inputs.absence || !inputs.final) return;

        setData([
            ...data,
            {
                p: parseFloat(inputs.process),
                a: parseFloat(inputs.absence),
                f: parseFloat(inputs.final)
            }
        ]);

        setInputs({
            process: "",
            absence: "",
            final: ""
        });

        setIsTrained(false);
    };

    const handleDelete = (index) => {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
        setIsTrained(false);
    };

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

            <div className={styles.header}>

                <div>
                    <h1 className={styles.title}>
                        Model Training – Final Grade Prediction
                    </h1>

                    <p className={styles.subtitle}>
                        Academic Performance Prediction System (SAP)
                    </p>
                </div>

            </div>

            {/* STATUS */}

            <div className={`${styles.banner} ${isTrained ? styles.success : styles.warning}`}>
                {isTrained
                    ? "Model trained successfully"
                    : "Data changed. Please train the model"}
            </div>

            {/* SWITCH MODE */}

            <div className={styles.modeSwitch}>

                <button
                    className={mode === "upload" ? styles.active : ""}
                    onClick={() => setMode("upload")}
                >
                    Batch Upload
                </button>

                <button
                    className={mode === "manual" ? styles.active : ""}
                    onClick={() => setMode("manual")}
                >
                    Manual Entry
                </button>

            </div>

            {/* UPLOAD */}

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

                    <p>
                        Drag and drop your .csv student record files here
                    </p>

                    <button className={styles.selectBtn}>
                        Select Files
                    </button>

                </div>

            )}

            {/* MANUAL */}

            {mode === "manual" && (

                <div className={styles.form}>

                    <input
                        placeholder="Process Score"
                        value={inputs.process}
                        onChange={(e) =>
                            setInputs({ ...inputs, process: e.target.value })
                        }
                    />

                    <input
                        placeholder="Absence Days"
                        value={inputs.absence}
                        onChange={(e) =>
                            setInputs({ ...inputs, absence: e.target.value })
                        }
                    />

                    <input
                        placeholder="Final Score"
                        value={inputs.final}
                        onChange={(e) =>
                            setInputs({ ...inputs, final: e.target.value })
                        }
                    />

                    <button onClick={handleAddData}>
                        Add Data
                    </button>

                </div>

            )}

            {/* DATASET */}

            <div className={styles.datasetCard}>

                <h3>
                    Dataset ({data.length})
                </h3>

                <table>

                    <thead>
                        <tr>
                            <th>Process</th>
                            <th>Absence</th>
                            <th>Final</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>

                        {data.map((row, index) => (

                            <tr key={index}>

                                <td>{row.p}</td>
                                <td>{row.a}</td>
                                <td>{row.f}</td>

                                <td className={styles.deleteCell}>

                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(index)}
                                    >

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6L18 20H6L5 6"/>
                                            <path d="M10 11v6"/>
                                            <path d="M14 11v6"/>
                                            <path d="M9 6V4h6v2"/>
                                        </svg>

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <div className={styles.trainWrapper}>

                    <button
                        className={styles.trainBtn}
                        onClick={handleTrain}
                    >
                        Train Model
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Training;