import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import styles from "./Predict.module.scss";

function Predict({ model }) {

  const fileInputRef = useRef(null);

  const [mode, setMode] = useState("upload");

  const [inputs, setInputs] = useState({
    id: "",
    name: "",
    process: "",
    absence: "",
    bonus: ""
  });

  const [predictionResult, setPredictionResult] = useState(null);

  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem("mas291_predictions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "mas291_predictions",
      JSON.stringify(predictions)
    );
  }, [predictions]);


  /* ========================
        PREDICT FUNCTION
  ======================== */

  const predictGrade = (p, a, b) => {

    if (!model || model.beta0 === null) {
      alert("Please train the model first.");
      return 0;
    }

    const grade =
      model.beta0 +
      model.beta1 * p +
      model.beta2 * a +
      (b || 0);

    return Math.max(0, Math.min(100, grade));
  };


  const confidence = () => {

    if (!model || !model.rSquared) return "-";

    return Math.round(model.rSquared * 100);

  };


  /* ========================
        CSV UPLOAD
  ======================== */

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
          first[0]?.toLowerCase().includes("student") ||
          first[1]?.toLowerCase().includes("name")
        ) {
          rows = rows.slice(1);
        }

        const formatted = rows
          .filter(row => row.length >= 4)
          .map(row => {

            const p = parseFloat(row[2]);
            const a = parseFloat(row[3]);
            const b = parseFloat(row[4] || 0);

            if (isNaN(p) || isNaN(a)) return null;

            const grade = predictGrade(p, a, b);

            const item = {
              id: row[0] || "-",
              name: row[1] || "-",
              p,
              a,
              b,
              grade: grade.toFixed(2),
              conf: confidence()
            };

            setPredictionResult(item);

            return item;

          })
          .filter(Boolean);

        setPredictions(prev => [...prev, ...formatted]);

      }

    });

  };


  const handleDrop = (e) => {

    e.preventDefault();

    const file = e.dataTransfer.files[0];

    handleFileUpload(file);

  };


  /* ========================
        MANUAL ENTRY
  ======================== */

  const handlePredict = () => {

    if (!inputs.process || !inputs.absence) return;

    if (!model || model.beta0 === null) {
      alert("Please train the model first.");
      return;
    }

    const p = parseFloat(inputs.process);
    const a = parseFloat(inputs.absence);
    const b = parseFloat(inputs.bonus || 0);

    const grade = predictGrade(p, a, b);

    const item = {

      id: inputs.id || "-",
      name: inputs.name || "-",

      p,
      a,
      b,

      grade: grade.toFixed(2),

      conf: confidence()

    };

    setPredictionResult(item);

    setPredictions(prev => [...prev, item]);

    setInputs({
      id: "",
      name: "",
      process: "",
      absence: "",
      bonus: ""
    });

  };


  /* ========================
        DELETE
  ======================== */

  const handleDeleteAll = () => {
    setPredictions([]);
  };


const handleView = (row) => {

  setPredictionResult(row);

};


  return (

    <div className={styles.container}>


      {/* HEADER */}

      <div className={styles.header}>

        <div>

          <h1 className={styles.title}>
            Final Grade Prediction
          </h1>

          <p className={styles.subtitle}>
            Academic Performance Prediction System (SAP)
          </p>

        </div>

      </div>


      {/* PREDICTION CARD */}

      <div className={styles.resultWrapper}>

        <div className={styles.resultCard}>

          <p className={styles.resultLabel}>
            PREDICTED FINAL GRADE
          </p>

          <div className={styles.resultValue}>
            {predictionResult ? predictionResult.grade : "--"}
            <span>/100</span>
          </div>

          <div className={styles.gradeBadge}>
            {predictionResult ? `Confidence ${predictionResult.conf}%` : "No Prediction"}
          </div>

          <div className={styles.confidenceBox}>

            <div className={styles.confHeader}>
              <span>Confidence Score</span>
              <span>
                {predictionResult ? predictionResult.conf : "--"}%
              </span>
            </div>

            <div className={styles.confBar}>
              <div
                className={styles.confFill}
                style={{
                  width: predictionResult
                    ? predictionResult.conf + "%"
                    : "0%"
                }}
              />
            </div>

          </div>

        </div>

      </div>


      {/* DATA SOURCE */}

      <div className={styles.sectionCard}>

        <h2 className={styles.sectionTitle}>
          ☁ 1. Prediction Input
        </h2>


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

            <p>
              Drag and drop CSV file containing student scores
            </p>

            <button className={styles.selectBtn}>
              Select Files
            </button>

          </div>

        )}


        {mode === "manual" && (

          <div className={styles.form}>

            <input
              placeholder="Student ID"
              value={inputs.id}
              onChange={(e) =>
                setInputs({ ...inputs, id: e.target.value })
              }
            />

            <input
              placeholder="Name"
              value={inputs.name}
              onChange={(e) =>
                setInputs({ ...inputs, name: e.target.value })
              }
            />

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
              placeholder="Bonus"
              value={inputs.bonus}
              onChange={(e) =>
                setInputs({ ...inputs, bonus: e.target.value })
              }
            />

            <button onClick={handlePredict}>
              Predict
            </button>

          </div>

        )}

      </div>


      {/* RESULT TABLE */}

      <div className={styles.datasetCard}>

        <div className={styles.datasetHeader}>

          <h2 className={styles.sectionTitle}>
            2. Prediction Results
          </h2>

          <button
            className={styles.deleteAllBtn}
            onClick={handleDeleteAll}
          >
            Delete All
          </button>

        </div>

        <h3>
          Results ({predictions.length})
        </h3>

        <table>

          <thead>

            <tr>

              <th>Student ID</th>
              <th>Name</th>
              <th>Input Metrics</th>
              <th>Predicted Grade</th>
              <th>Confidence</th>
              <th></th>

            </tr>

          </thead>

          <tbody>

            {predictions.map((row, index) => (

              <tr key={index}>

                <td>{row.id}</td>

                <td>{row.name}</td>

                <td>
                  P:{row.p} | A:{row.a} | B:{row.b}
                </td>

                <td>{row.grade}</td>

                <td>{row.conf}%</td>

                <td>

                  <button
                    className={styles.viewBtn}
                    onClick={() => handleView(row)}
                  >
                    👁
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      <div className={styles.footer}>
        MAS-SPRING 2026 – Academic Performance Prediction System (SAP)
      </div>

    </div>

  );

}

export default Predict;