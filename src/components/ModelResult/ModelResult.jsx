import {
  ScatterChart,
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

  const rawData = JSON.parse(localStorage.getItem("mas291_data")) || [];

  // ÉP KIỂU NUMBER (QUAN TRỌNG)
  const data = rawData.map(d => ({
    p: Number(d.p),
    a: Number(d.a),
    f: Number(d.f)
  }));

  if (!data.length || !model || model.beta0 === null) {
    return <p>No model or data available</p>;
  }

  /* ======================
      SORT DATA
  ====================== */
  const sortedP = [...data].sort((a, b) => a.p - b.p);
  const sortedA = [...data].sort((a, b) => a.a - b.a);

  /* ======================
      AVERAGE
  ====================== */
  const avgP = data.reduce((s, d) => s + d.p, 0) / data.length;
  const avgA = data.reduce((s, d) => s + d.a, 0) / data.length;

  /* ======================
      REGRESSION LINE (ĐÚNG)
  ====================== */

  const minP = Math.min(...data.map(d => d.p));
  const maxP = Math.max(...data.map(d => d.p));

  const processLine = [
    {
      p: minP,
      f: model.beta0 + model.beta1 * minP + model.beta2 * avgA
    },
    {
      p: maxP,
      f: model.beta0 + model.beta1 * maxP + model.beta2 * avgA
    }
  ];

  const minA = Math.min(...data.map(d => d.a));
  const maxA = Math.max(...data.map(d => d.a));

  const absenceLine = [
    {
      a: minA,
      f: model.beta0 + model.beta1 * avgP + model.beta2 * minA
    },
    {
      a: maxA,
      f: model.beta0 + model.beta1 * avgP + model.beta2 * maxA
    }
  ];

  /* ======================
      IMPACT
  ====================== */

  const impactP = Math.abs(model.beta1);
  const impactA = Math.abs(model.beta2);
  const total = impactP + impactA;

  const pPercent = total === 0 ? 0 : (impactP / total) * 100;
  const aPercent = total === 0 ? 0 : (impactA / total) * 100;

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>
        📊 Model Analysis Dashboard
      </h1>

      <div className={styles.grid}>

        {/* PROCESS */}
        <div className={styles.card}>
          <h2>📈 Process vs Final</h2>

          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart>
              <CartesianGrid stroke="#1e293b" />

              <XAxis
                type="number"
                dataKey="p"
                domain={["dataMin", "dataMax"]}
              />

              <YAxis
                type="number"
                dataKey="f"
              />

              <Tooltip />

              <Scatter data={sortedP} fill="#3b82f6" />

              <Line
                data={processLine}
                dataKey="f"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />

            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* ABSENCE */}
        <div className={styles.card}>
          <h2>📉 Absence vs Final</h2>

          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart>
              <CartesianGrid stroke="#1e293b" />

              <XAxis
                type="number"
                dataKey="a"
                domain={["dataMin", "dataMax"]}
              />

              <YAxis
                type="number"
                dataKey="f"
              />

              <Tooltip />

              <Scatter data={sortedA} fill="#ef4444" />

              <Line
                data={absenceLine}
                dataKey="f"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />

            </ScatterChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* IMPACT */}
      <div className={styles.impactBox}>

        <h2>🔥 Feature Impact</h2>

        <div className={styles.impactItem}>
          <span>Process ({pPercent.toFixed(1)}%)</span>
          <div className={styles.bar}>
            <div
              className={styles.fillBlue}
              style={{ width: `${pPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.impactItem}>
          <span>Absence ({aPercent.toFixed(1)}%)</span>
          <div className={styles.bar}>
            <div
              className={styles.fillRed}
              style={{ width: `${aPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* MODEL */}
      <div className={styles.modelInfo}>

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