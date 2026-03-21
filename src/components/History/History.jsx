import { useEffect, useState } from "react";
import styles from "./History.module.scss";

function History({ searchId }) {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("mas291_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const filtered = searchId
    ? history.filter(h => h.id === searchId)
    : history;

  return (
    <div className={styles.container}>

      {/* TITLE */}
      <h1 className="slide delay1">
        📜 History
      </h1>

      {/* EMPTY */}
      {searchId && filtered.length === 0 && (
        <p className={`${styles.empty} slide delay2`}>
          ❌ No student found with ID: {searchId}
        </p>
      )}

      {/* TABLE */}
      <div className="slide delay3">

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>ID</th>
              <th>Name</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Conf</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item, i) => (
              <tr key={i}>
                <td>{item.time}</td>
                <td>{item.type}</td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>P:{item.p} A:{item.a} B:{item.b}</td>
                <td>{item.grade}</td>
                <td>{item.conf}%</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default History;