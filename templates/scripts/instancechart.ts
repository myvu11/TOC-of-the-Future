import * as d3 from "d3";

// dimensions outside container
const margin = { top: 20, right: 50, bottom: 20, left: 120 };
const width = 555 / 2 - margin.left - margin.right;
const height = 120 - margin.top - margin.bottom;

// container dimensions
const viewBoxDim = { x: -margin.left, y: -margin.top, width: 950, height: 250 };
const lineWidth = 1.2;
const lineLength = (viewBoxDim.height - margin.top) / 5;

let characterOccurence: Record<string, string | number[]>[] = [];
let chapterLength = 0;



function toDataFormat(input: Record<string, string | number[]>[]) {
  let data = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].occurence.length; j++) {
      data.push({ name: input[i].name, occurence: input[i].occurence[j] });
    }
  }
  return data;
}

export function buildInstanceChart(chapterID: string, inputCharacterOccurence: Record<string, string | number[]>[], inputChapterLength: number) {
  // source from:
  // https://github.com/gcgruen/d3-template-frequency/blob/master/make-frequency-code/make-frequency.js

    // set the character occurence data
  function setCharacterOccurence(input: any) {
    characterOccurence = input;
  }

  function setChapterLength(input: number) {
    chapterLength = input;
  }

  setCharacterOccurence(inputCharacterOccurence);
  setChapterLength(inputChapterLength);

  // sort character occurence in descending order
  characterOccurence.sort((a, b) => {
    if (a.occurence.length < b.occurence.length) return -1;
    if (a.occurence.length > b.occurence.length) return 1;
    return 0;
  });

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
    .select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", viewBoxDim.x + " " + viewBoxDim.y + " " + viewBoxDim.width + " " + viewBoxDim.height)
    .classed("svg-content", true);

  const graph = svgContainer
    .selectAll(".div#container")
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
      .selectAll(".div#container")
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
