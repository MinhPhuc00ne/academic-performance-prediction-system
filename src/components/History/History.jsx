import { useState } from "react";
import styles from "./History.module.scss";

function History({ searchId }) {
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem("mas291_history");
        return saved ? JSON.parse(saved) : [];
    });
    const [confirmState, setConfirmState] = useState({ open: false, type: null, index: null });

    const normalize = (value) =>
        String(value || "")
            .trim()
            .toLowerCase();
    const keyword = normalize(searchId);

    const filtered = history
        .map((item, index) => ({ ...item, sourceIndex: index }))
        .filter((item) => (keyword ? normalize(item.id) === keyword : true));

    const openDeleteOne = (index) => {
        setConfirmState({ open: true, type: "one", index });
    };

    const openDeleteAll = () => {
        if (!history.length) return;
        setConfirmState({ open: true, type: "all", index: null });
    };

    const closeConfirm = () => {
        setConfirmState({ open: false, type: null, index: null });
    };

    const handleConfirmDelete = () => {
        let nextHistory = history;

        if (confirmState.type === "one" && confirmState.index !== null) {
            nextHistory = history.filter((_, index) => index !== confirmState.index);
        }

        if (confirmState.type === "all") {
            nextHistory = [];
        }

        setHistory(nextHistory);
        localStorage.setItem("mas291_history", JSON.stringify(nextHistory));
        closeConfirm();
    };

    return (
        <div className={styles.container}>
            {/* TITLE */}
            <h1 className="slide delay1">📜 History</h1>

            {/* EMPTY */}
            {searchId && filtered.length === 0 && (
                <p className={`${styles.empty} slide delay2`}>❌ No student found with ID: {searchId}</p>
            )}

            {/* TABLE */}
            <div className={`${styles.tableWrap} slide delay3`}>
                <div className={styles.actions}>
                    <button className={styles.deleteAllBtn} onClick={openDeleteAll}>
                        Delete Permanently All
                    </button>
                </div>

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
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((item) => (
                            <tr key={`${item.time}-${item.id}-${item.sourceIndex}`}>
                                <td>{item.time}</td>
                                <td>{item.type}</td>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>
                                    P:{item.p} A:{item.a}
                                </td>
                                <td>{item.grade}</td>
                                <td>{item.conf}%</td>
                                <td>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => openDeleteOne(item.sourceIndex)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {confirmState.open && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox}>
                        <h3>Confirm Permanent Delete</h3>
                        <p>
                            {confirmState.type === "all"
                                ? "This will permanently remove all history items from data."
                                : "This will permanently remove this history item from data."}
                        </p>

                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={closeConfirm}>
                                Cancel
                            </button>
                            <button className={styles.confirmBtn} onClick={handleConfirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default History;
