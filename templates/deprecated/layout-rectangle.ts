import * as d3 from "d3";

const margin = { top: 5, right: 5, bottom: 5, left: 5 };
const width = 375 - margin.left - margin.right;
const height = 455 - margin.top - margin.bottom;

const chapterCount = 5;
const colCount = 4;
const rectSpacingHorizontal = 10;
const rectSpacingVertical = 20;
const rectWidth = Math.floor(width / (colCount + 1) - rectSpacingHorizontal);
const rectHeight = 50;
const rowCount = Math.round(chapterCount / colCount);

// const rectData = [0, rectWidth + rectSpacing, rectWidth * 2 + rectSpacing * 2];

// make chapter matrix layout
function initChapterRectangles() {
  let rectData = [];

  for (let i = 0; i < colCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      if (rectData.length < chapterCount) {
        rectData.push({
          x: rectWidth * i + rectSpacingHorizontal * i,
          y: rectHeight * j + rectSpacingVertical * j,
        });
      }
    }
  }
  return rectData;
}

export function buildLayoutRectangle() {
  const rectData = initChapterRectangles();
  console.log("rectData", rectData);

  // create svg element:
  const svg = d3.select("#rect").append("svg").attr("width", width);
  // .attr("height", height);

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
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    })
    .attr("stroke", "black")
    .attr("fill", "white");

  var svgContainer = d3
    .select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 300 300")
    .classed("svg-content", true);

  const graph = svgContainer
    .selectAll(".div#container")
    .data(rectData)
    .enter()
    .append("g")
    .classed("rect", true);

  graph
    .append("rect")
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    })
    .attr("stroke", "black")
    .attr("fill", "white");
}
