import { useState, useEffect } from "react";
import Training from "./components/Training/Training";
import ModelResult from "./components/ModelResult/ModelResult";
import Predict from "./components/Predict/Predict";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  const [activeTab, setActiveTab] = useState("training");

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
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content page-enter">
        {activeTab === "training" && (
          <Training data={data} setData={setData} setModel={setModel} />
        )}

        {activeTab === "model" && <ModelResult model={model} />}

        {activeTab === "predict" && <Predict model={model} />}
      </main>
    </div>
  );
}

export default App;