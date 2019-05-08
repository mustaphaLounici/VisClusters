/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
// import graph from "./data.json";

function ForceClusters({ graph }) {
  const SVG = useRef(null);
  const { nodes = {}, links = {}, clusters } = graph;

  const width = 900;
  const height = 700;
  const radius = d3
    .scaleLinear()
    .domain([1, 10000])
    .range([8, 2])(nodes.length);

  useEffect(() => {
    const createViz = (Nodes, clusters) => {
      const nodes = Nodes;
      d3.forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink()
            .links(links)
            .distance(d => {
              let myLength = (1 / clusters.length + 15) * radius;
              const { source, target } = d;
              const sourceNode = nodes.find(n => n.id === source.id);
              const targetNode = nodes.find(n => n.id === target.id);
              clusters.forEach(group => {
                if (group.includes(source.id) && group.includes(target.id)) {
                  myLength *=
                    0.15 *
                    (sourceNode.group.length > 1
                      ? sourceNode.group.length * 1.2
                      : sourceNode.group.length) *
                    (targetNode.group.length > 1
                      ? targetNode.group.length * 1.2
                      : targetNode.group.length);
                } else {
                  myLength *= 1 / clusters.length + 1;
                }
              });

              return myLength;
            })
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2 - 100))
        .force("collision", d3.forceCollide().radius(radius))
        .on("tick", ticked);

      function updateLinks() {
        d3.select(".links")
          .selectAll("line")
          .remove();

        const u = d3
          .select(SVG.current)
          .selectAll("line")
          .data(links);

        u.enter()
          .append("line")
          .merge(u)
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });

        u.exit().remove();
      }

      function updateNodes() {
        d3.select(".nodes")
          .selectAll("circle")
          .remove();

        var u = d3
          .select(SVG.current)
          .selectAll("circle")
          .data(nodes);

        u.enter()
          .append("circle")
          .attr("r", radius)
          .merge(u)
          .attr("cx", function(d) {
            return (d.x = Math.max(radius, Math.min(width - radius, d.x)));
          })
          .attr("cy", function(d) {
            return (d.y = Math.max(radius, Math.min(height - radius, d.y)));
          })
          .style("fill", (d, i) =>
            d3.interpolateSinebow(
              d3
                .scaleLinear()
                .domain([0, clusters.length])
                .range([0, 1])(clusters.findIndex(g => g.includes(i)))
            )
          );

        u.exit().remove();
      }

      function drawCluster(group) {
        let l = [];
        const offset = 10;
        const groupNodes = nodes.filter(n => group.includes(n.id));
        groupNodes.forEach(n => {
          l.push([n.x - offset, n.y - offset]);
          l.push([n.x - offset, n.y + offset]);
          l.push([n.x + offset, n.y - offset]);
          l.push([n.x + offset, n.y + offset]);
        });

        return "M" + d3.polygonHull(l).join("L") + "Z";
      }

      const updateClusters = () => {
        d3.select(".ghull")
          .selectAll("path.hull")
          .remove();

        d3.select(".ghull")
          .selectAll("path.hull")
          .data(clusters)
          .enter()
          .insert("path", "cicrle")
          .attr("d", drawCluster)
          .attr("class", "hull")
          .style("fill", (d, i) =>
            d3.interpolateSinebow(
              d3
                .scaleLinear()
                .domain([0, clusters.length])
                .range([0, 1])(i)
            )
          )
          .style("stroke", (d, i) =>
            d3.interpolateSinebow(
              d3
                .scaleLinear()
                .domain([0, clusters.length])
                .range([0, 1])(i)
            )
          );
      };

      function ticked() {
        updateLinks();
        updateNodes();
        updateClusters();
      }
    };
    let newNodes = nodes.map(n => ({
      ...n,
      group: [...clusters.filter(g => g.includes(n.id)).map((g, i) => i)]
    }));
    if (SVG.current && graph && newNodes) {
      createViz(newNodes, graph.clusters);
    }
  }, [SVG, graph]);

  return (
    <div>
      <svg width={width} height={height} ref={SVG}>
        <g className="links" />
        <g className="nodes" />
        <g className="ghull" />
      </svg>
    </div>
  );
}

export default ForceClusters;
