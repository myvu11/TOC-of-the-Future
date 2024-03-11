import * as d3 from "d3";

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 1050 - margin.left - margin.right;
const height = 1050 - margin.top - margin.bottom;

const rectWidth = 200;
const rectHeight = 200;

const rectData = [0, rectWidth + 60, rectWidth * 2 + 60 * 2];

// create svg element:
const svg = d3
  .select("#rect")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const g = svg
  .selectAll(".rect")
  .data(rectData)
  .enter()
  .append("g")
  .classed("rect", true);

g.append("rect")
  .attr("width", rectWidth)
  .attr("height", rectHeight)
  .attr("x", function (d) {
    return d;
  })
  .attr("y", 0)
  .attr("stroke", "black")
  .attr("fill", "white");
