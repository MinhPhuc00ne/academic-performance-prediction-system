function Sidebar({ activeTab, setActiveTab }) {

  const styles = {

    sidebar:{
      width:"220px",
      background:"#020617",
      borderRight:"1px solid #1e293b",
      padding:"20px",
      display:"flex",
      flexDirection:"column",
      gap:"12px"
    },

    item:{
      padding:"10px 14px",
      borderRadius:"6px",
      color:"#94a3b8",
      cursor:"pointer"
    },

    active:{
      background:"#2563eb",
      color:"white"
    }

  };

  const getStyle = (tab) =>
    activeTab === tab
      ? { ...styles.item, ...styles.active }
      : styles.item;

  return (

    <aside style={styles.sidebar}>

      <div
        style={getStyle("dashboard")}
        onClick={() => setActiveTab("dashboard")}
      >
        📊 Dashboard
      </div>

      <div
        style={getStyle("training")}
        onClick={() => setActiveTab("training")}
      >
       📈 Training
      </div>

      <div
        style={getStyle("predict")}
        onClick={() => setActiveTab("predict")}
      >
       🧮 Prediction
      </div>

      <div
        style={getStyle("model")}
        onClick={() => setActiveTab("model")}
      >
       📈 Model Result
      </div>

      <div
        style={getStyle("history")}
        onClick={() => setActiveTab("history")}
      >
       🕘 History
      </div>

    </aside>

  );

}

export default Sidebar;