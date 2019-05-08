/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { createPackData } from "../utils/utils";

function PackClusters({ graph }) {
  const SVG = useRef(null);
  const [data, setData] = useState(null);
  const createPack = () => {
    const node = SVG.current;

    var packLayout = d3.pack().size([300, 300]);

    var rootNode = d3.hierarchy(data);
    rootNode.sum(function(d) {
      return d.value;
    });

    packLayout(rootNode);
    d3.select(node)
      .selectAll("circle")
      .remove();
    d3.select(node)
      .selectAll("text")
      .remove();

    const p = d3
      .select(node)
      .selectAll("circle")
      .data(rootNode.descendants())
      .enter()
      .append("g");

    p.append("circle")
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
      .attr("r", function(d) {
        return d.r;
      })
      .style("opacity", d => {
        if (d.parent) {
          if (d.parent.parent) {
            return 1;
          } else return 0.5;
        }
      })
      .style("fill", (d, i) => {
        if (d.parent && d.parent.parent) {
          return d3.interpolateSinebow(
            d3
              .scaleLinear()
              .domain([
                0,
                rootNode.descendants().filter(n => n.height === 1).length
              ])
              .range([0, 1])(
              rootNode
                .descendants()
                .filter(n => n.height === 1)
                .findIndex(a => a === d.parent)
            )
          );
        } else if (d.parent && d.parent.parent === null) {
          return d3.interpolateSinebow(
            d3
              .scaleLinear()
              .domain([
                0,
                rootNode.descendants().filter(n => n.height === 1).length
              ])
              .range([0, 1])(
              rootNode
                .descendants()
                .filter(n => n.height === 1)
                .findIndex(a => a === d)
            )
          );
        }
      });

    p.append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(d => d.data.name);
  };
  useEffect(() => {
    if (graph) setData(createPackData(graph));
  }, [graph]);
  useEffect(() => {
    if (SVG && data) {
      createPack();
    }
  }, [SVG, data]);
  return (
    <div className="w-100">
      <svg width="50%" height="320" ref={SVG}>
        <g />
      </svg>
    </div>
  );
}

export default PackClusters;
