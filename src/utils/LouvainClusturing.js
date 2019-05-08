import detectClusters from "ngraph.louvain";
import { createNgraph } from "./utils";

export default ({ nodes, links }) => {
  let graph = createNgraph({ nodes, links });

  // To detect clusters:
  let clusters = detectClusters(graph);
  let clustersOb = {};
  graph.forEachNode(function(node) {
    if (clustersOb[clusters.getClass(node.id)]) {
      clustersOb[clusters.getClass(node.id)].push(node.id);
    } else {
      clustersOb[clusters.getClass(node.id)] = [node.id];
    }
  });
  let clustersArr = [];
  for (const cluster in clustersOb) {
    if (clustersOb.hasOwnProperty(cluster)) {
      const elem = clustersOb[cluster];
      clustersArr.push(elem);
    }
  }
  return {
    nodes,
    links,
    clusters: clustersArr
  };
};
