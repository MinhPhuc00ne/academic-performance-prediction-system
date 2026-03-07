import { useState, useEffect } from "react";
import Training from "./components/Training/Training";
import ModelResult from "./components/ModelResult/ModelResult";
import Predict from "./components/Predict/Predict";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {

  const [activeTab, setActiveTab] = useState("dashboard");

  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("mas291_data");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [model, setModel] = useState(() => {
    const savedModel = localStorage.getItem("mas291_model");
    return savedModel
      ? JSON.parse(savedModel)
      : { beta0: null, beta1: null, beta2: null, rSquared: null };
  });

  useEffect(() => {
    localStorage.setItem("mas291_data", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("mas291_model", JSON.stringify(model));
  }, [model]);

  return (

    <div style={styles.app}>

      {/* TOPBAR */}

      <header style={styles.topbar}>

        <div style={styles.left}>

          <img
            src="/images/logo.png"
            alt="logo"
            style={styles.logo}
          />

          <span style={styles.systemName}>
            Academic Performance Prediction System
          </span>

        </div>

        <input
          placeholder="Search Student ID..."
          style={styles.search}
        />

        <div style={styles.nav}>

          <span
            style={activeTab === "dashboard" ? styles.activeNav : styles.navItem}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </span>

          <span
            style={activeTab === "training" ? styles.activeNav : styles.navItem}
            onClick={() => setActiveTab("training")}
          >
            Training
          </span>

          <span
            style={activeTab === "predict" ? styles.activeNav : styles.navItem}
            onClick={() => setActiveTab("predict")}
          >
            Predict
          </span>

          <span
            style={activeTab === "model" ? styles.activeNav : styles.navItem}
            onClick={() => setActiveTab("model")}
          >
            Model Result
          </span>

        </div>

      </header>


      {/* MAIN AREA */}

      <div style={styles.main}>

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main style={styles.content}>

          {activeTab === "dashboard" && (
            <h2>Dashboard</h2>
          )}

          {activeTab === "training" && (
            <Training
              data={data}
              setData={setData}
              setModel={setModel}
            />
          )}

          {activeTab === "predict" && (
            <Predict model={model} />
          )}

          {activeTab === "model" && (
            <ModelResult model={model} />
          )}

        </main>

      </div>

    </div>

  );

}

const styles = {

  app:{
    height:"100vh",
    display:"flex",
    flexDirection:"column",
    background:"#0f172a",
    color:"white"
  },

  topbar:{
    height:"60px",
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    padding:"0 30px",
    background:"#020617",
    borderBottom:"1px solid #1e293b"
  },

  left:{
    display:"flex",
    alignItems:"center",
    gap:"10px"
  },

  logo:{
    width:"28px"
  },

  systemName:{
    fontWeight:"600"
  },

  search:{
    width:"260px",
    padding:"8px 12px",
    background:"#0f172a",
    border:"1px solid #334155",
    borderRadius:"6px",
    color:"white"
  },

  nav:{
    display:"flex",
    gap:"20px"
  },

  navItem:{
    cursor:"pointer",
    color:"#94a3b8"
  },

  activeNav:{
    cursor:"pointer",
    color:"#3b82f6"
  },

  main:{
    flex:1,
    display:"flex"
  },

  content:{
    flex:1,
    padding:"30px",
    overflow:"auto"
  }

};

export default App;