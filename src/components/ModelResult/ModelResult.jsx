import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import styles from "./ModelResult.module.scss";

function ModelResult({ model }) {

  const predictions =
    JSON.parse(localStorage.getItem("mas291_predictions")) || [];

  const data = predictions.map(d => ({
    id: d.id,
    name: d.name,
    p: Number(d.p),
    a: Number(d.a),
    f: Number(d.grade)
  }));

  if (!data.length || !model || model.beta0 === null) {
    return <p className="slide delay1">No prediction data available</p>;
  }

  /* ================= KPI ================= */

  const total = data.length;
  const avg = data.reduce((s, d) => s + d.f, 0) / total;
  const max = Math.max(...data.map(d => d.f));
  const min = Math.min(...data.map(d => d.f));

  /* ================= SORT ================= */

  const sortedP = [...data].sort((a, b) => a.p - b.p);
  const sortedA = [...data].sort((a, b) => a.a - b.a);

  /* ================= AVG ================= */

  const avgP = data.reduce((s, d) => s + d.p, 0) / total;
  const avgA = data.reduce((s, d) => s + d.a, 0) / total;

  /* ================= LINE ================= */

  const minP = Math.min(...data.map(d => d.p));
  const maxP = Math.max(...data.map(d => d.p));

  const processLine = Array.from({ length: 50 }, (_, i) => {
    const x = minP + (i / 49) * (maxP - minP);
    return {
      p: x,
      f: model.beta0 + model.beta1 * x + model.beta2 * avgA
    };
  });

  const minA = Math.min(...data.map(d => d.a));
  const maxA = Math.max(...data.map(d => d.a));

  const absenceLine = Array.from({ length: 50 }, (_, i) => {
    const x = minA + (i / 49) * (maxA - minA);
    return {
      a: x,
      f: model.beta0 + model.beta1 * avgP + model.beta2 * x
    };
  });

  return (
    <div className={styles.container}>

      {/* TITLE */}
      <h1 className={`${styles.title} slide delay1`}>
        📊 Model Result Dashboard
      </h1>

      {/* KPI */}
      <div className={`${styles.kpiGrid} slide delay2`}>

        <div className={styles.kpiCard}>
          <p>Total Students</p>
          <h2>{total}</h2>
        </div>

        <div className={styles.kpiCard}>
          <p>Average Score</p>
          <h2>{avg.toFixed(2)}</h2>
        </div>

        <div className={styles.kpiCard}>
          <p>Highest Score</p>
          <h2>{max.toFixed(2)}</h2>
        </div>

        <div className={styles.kpiCard}>
          <p>Lowest Score</p>
          <h2>{min.toFixed(2)}</h2>
        </div>

      </div>

      {/* CHART */}
      <div className={`${styles.grid} slide delay3`}>

        {/* PROCESS */}
        <div className={styles.card}>
          <h2>📈 Process vs Final</h2>

          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart>

              <CartesianGrid stroke="#1e293b" />

              <XAxis type="number" dataKey="p" domain={["dataMin", "dataMax"]} />
              <YAxis type="number" dataKey="f" />
              <Tooltip />

              <Scatter data={sortedP} fill="#3b82f6" />

              <Line
                data={processLine}
                dataKey="f"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />

            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ABSENCE */}
        <div className={styles.card}>
          <h2>📉 Absence vs Final</h2>

          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart>

              <CartesianGrid stroke="#1e293b" />

              <XAxis type="number" dataKey="a" domain={["dataMin", "dataMax"]} />
              <YAxis type="number" dataKey="f" />
              <Tooltip />

              <Scatter data={sortedA} fill="#ef4444" />

              <Line
                data={absenceLine}
                dataKey="f"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />

            </ComposedChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* TABLE */}
      <div className={`${styles.tableCard} slide delay4`}>

        <h2>Prediction Dataset</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Process</th>
              <th>Absence</th>
              <th>Predicted</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.p}</td>
                <td>{row.a}</td>
                <td>{row.f.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* MODEL */}
      <div className={`${styles.modelBox} slide delay5`}>

        <h2>📌 Model Equation</h2>

        <p>
          Final = {model.beta0.toFixed(2)}
          + {model.beta1.toFixed(2)} × Process
          + {model.beta2.toFixed(2)} × Absence
        </p>

        <p>
          🎯 R²: {(model.rSquared * 100).toFixed(2)}%
        </p>

      </div>

    </div>
  );
}

export default ModelResult;