import React, { useState, useEffect } from "react";
import "./App.css";
import PackClusters from "./components/PackClusters";
import ForceClusters from "./components/ForceClusters";
import defaultData from "./utils/data";
import { GraphFromMat } from "./utils/utils";
import LPClusturing from "./utils/LPClusturing";
import LouvainClusturing from "./utils/LouvainClusturing";
import Options from "./components/Options";
import ClustersList from "./components/ClustersList";
// cluster using d3 pack
// cluster using force layout

function App() {
  const [data, setData] = useState(defaultData); // adj mat
  const [algo, setAlgo] = useState(0); // 0: LP // 1 : Louvain
  const [graph, setGraph] = useState(null);
  useEffect(() => {
    const g = GraphFromMat(data);
    let newGraph = null;
    if (parseInt(algo) === 0) {
      newGraph = LPClusturing(g);
    } else {
      newGraph = LouvainClusturing(g);
    }
    setGraph(newGraph);
  }, [algo, data]);

  const optionChange = (newAlgo, newData) => {
    setAlgo(newAlgo);
    setData(newData);
  };
  return (
    <div className="App">
      <div className="d-flex border p-4">
        {graph && <PackClusters graph={graph} />}

        <Options algo={algo} data={data} onSubmit={optionChange} />
      </div>
      <div className="d-flex">
        {graph && <ForceClusters graph={graph} />}
        {graph && <ClustersList clusters={graph.clusters} />}
      </div>
    </div>
  );
}

export default App;
