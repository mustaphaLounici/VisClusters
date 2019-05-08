import createWhisper from "ngraph.cw";
import { createNgraph } from "./utils";
export default ({ nodes, links }) => {
  const graph = createNgraph({ nodes, links });

  // Graph is intance of ngraph.graph
  const whisper = createWhisper(graph);

  // The algorithm is iterative. We should continue running it until change
  // rate within clusters is large:

  const requiredChangeRate = 0; // 0 is complete convergence
  while (whisper.getChangeRate() > requiredChangeRate) {
    whisper.step();
  }

  // clusters is a Set object
  const clusters = whisper.createClusterMap();
  return {
    nodes,
    links,
    clusters: [...clusters].map(a => a[1])
  };
};
