import * as d3 from "d3";

// dimensions outside container
const margin = { top: 20, right: 50, bottom: 20, left: 120 };
const width = 555 / 2 - margin.left - margin.right;
const height = 120 - margin.top - margin.bottom;

// container dimensions
const viewBoxDim = { x: -margin.left, y: -margin.top, width: 950, height: 250 };
const lineWidth = 1.2;
const lineLength = (viewBoxDim.height - margin.top) / 5;



function toDataFormat(input: Record<string, string | number[]>[]) {
  let data = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].occurence.length; j++) {
      data.push({ name: input[i].name, occurence: input[i].occurence[j] });
    }
  }
  return data;
}

function getTopFive(occurences: Record<string, string | number[]>[]) {
  occurences.sort((a, b) => {
    if (a.occurence.length < b.occurence.length) return -1;
    if (a.occurence.length > b.occurence.length) return 1;
    return 0;
  });
  if(occurences.length > 5) {
    return occurences.slice(1).slice(-5)
  }
  return occurences
}

export function buildInstanceChart(chapterID: string, occurences: Record<string, string | number[]>[], chapterLength: number) {
  // source from:
  // https://github.com/gcgruen/d3-template-frequency/blob/master/make-frequency-code/make-frequency.js


  // sort character occurence in descending order
  // characterOccurence.sort((a, b) => {
  //   if (a.occurence.length < b.occurence.length) return -1;
  //   if (a.occurence.length > b.occurence.length) return 1;
  //   return 0;
  // });
  console.log("characterOccurence", occurences)
  const characterOccurence = getTopFive(occurences)
  // setting x values
  const xVals = characterOccurence.map((occurence) => occurence.occurence);
  const xScale = d3.scaleLinear().range([0, viewBoxDim.width - margin.right - margin.left]).domain([0, chapterLength]);

  // setting the y values
  const yVals = characterOccurence.map((occurence) => occurence.name as string);
  const yScale = d3.scalePoint().range([viewBoxDim.height - margin.top - margin.bottom, 0]).domain(yVals);

  console.log("xVals", xVals);
  console.log("yVals", yVals);

  const data = toDataFormat(characterOccurence);
  console.log("data", data);


  const svgContainer = d3
    .select("div#container" + chapterID)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", viewBoxDim.x + " " + viewBoxDim.y + " " + viewBoxDim.width + " " + viewBoxDim.height)
    .classed("svg-content", true);

  const graph = svgContainer
    .selectAll(".div#container" + chapterID)
    .data(data)
    .enter()
    .append("rect")
    .attr("class", (d) => d.name)
    .attr("width", lineWidth)
    .attr("height", lineLength)
    .attr("x", (d) => xScale(d.occurence as number))
    .attr("y", (d) =>
      yScale(d.name as string) !== undefined
        ? yScale(d.name as string)! - lineLength / 2
        : 0
    );

    svgContainer
      .selectAll(".div#container" + chapterID)
      .data(yVals)
      .enter()
      .append("rect")
      .attr("width", xScale(chapterLength))
      .attr("height", lineLength)
      .attr("x", d => xScale(0))
      .attr("y", d => yScale(d as string) !== undefined
      ? yScale(d as string)! - lineLength / 2
      : 0)
      .attr("fill", "grey")
      .attr("opacity", 0.30)

  const yAxis = d3.axisLeft(yScale).ticks(9)

  d3.select('.yAxis').style("font-size", "154px")

  svgContainer.append("g").attr("class", "axis y-axis").attr("style", "font-size: xx-large").call(yAxis)
}
