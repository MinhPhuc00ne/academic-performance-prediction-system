function Sidebar({ activeTab, setActiveTab }) {

  const styles = {
    sidebar: {
      width: "250px",
      height: "100vh",
      background: "#020617",
      borderRight: "1px solid #1e293b",
      padding: "20px",
      color: "#f1f5f9"
    },

    logo: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "30px"
    },

    menu: {
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },

    menuItem: {
      padding: "10px 14px",
      borderRadius: "6px",
      color: "#94a3b8",
      cursor: "pointer",
      transition: "0.2s"
    },

    active: {
      background: "#2563eb",
      color: "white"
    }
  };

  const getItemStyle = (tab) => {
    return activeTab === tab
      ? { ...styles.menuItem, ...styles.active }
      : styles.menuItem;
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        Academic Performance
      </div>

      <div style={styles.menu}>
        <div
          style={getItemStyle("training")}
          onClick={() => setActiveTab("training")}
        >
         📊  Training
        </div>

        <div
          style={getItemStyle("predict")}
          onClick={() => setActiveTab("predict")}
        >
         🧮 Predict
        </div>

        <div
          style={getItemStyle("model")}
          onClick={() => setActiveTab("model")}
        >
         📈 Model Result
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;