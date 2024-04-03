import * as d3 from "d3";

// dimensions outside container
const margin = { top: 1, right: 5, bottom: 25, left: 75 };
const width = 555 / 2 - margin.left - margin.right;
const height = 120 - margin.top - margin.bottom;

// container dimensions
const viewBoxDim = { x: 0, y: 0, width: 950, height: 250 };
const lineWidth = 1;
const lineLength = viewBoxDim.height / 5;

let characterOccurence: Record<string, string | number[]>[] = [];
let chapterLength = 0;

const inputCharacterOccurence = [
  {
    name: "Watson",
    occurence: [
      144, 250, 259, 323, 331, 381, 410, 422, 425, 452, 487, 551, 554, 573, 582,
      643, 683, 700,
    ],
  },
  {
    name: "Holmes",
    occurence: [
      427, 431, 440, 447, 454, 520, 547, 564, 587, 635, 703, 728, 777, 839, 856,
      861, 909, 916, 950, 973, 978, 992, 1025, 1103, 1120, 1125, 1146, 1163,
      1168, 1196, 1201, 1220, 1275, 1293, 1306, 1328, 1376, 1412, 1416, 1429,
    ],
  },
  {
    name: "Stamford",
    occurence: [
      222, 260, 280, 338, 341, 885, 1033, 1121, 1143, 1210, 1257, 1354, 1377,
    ],
  },
  { name: "Murray", occurence: [26] },
  { name: "Candahar", occurence: [66] },
];

const inputChapterLength = 2106;

// set the character occurence data
export function setCharacterOccurence(input: any) {
  characterOccurence = input;
}

export function setChapterLength(input: number) {
  chapterLength = input;
}

setCharacterOccurence(inputCharacterOccurence);
setChapterLength(inputChapterLength);

function toDataFormat(input: Record<string, string | number[]>[]) {
  let data = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].occurence.length; j++) {
      data.push({ name: input[i].name, occurence: input[i].occurence[j] });
    }
  }
  return data;
}

export function buildInstanceChart() {
  // source from:
  // https://github.com/gcgruen/d3-template-frequency/blob/master/make-frequency-code/make-frequency.js

  // sort character occurence in descending order
  characterOccurence.sort((a, b) => {
    if (a.occurence.length < b.occurence.length) return -1;
    if (a.occurence.length > b.occurence.length) return 1;
    return 0;
  });

  // setting x values
  const xVals = characterOccurence.map((occurence) => occurence.occurence);
  const xScale = d3.scaleLinear().range([0, viewBoxDim.width - margin.right]).domain([0, chapterLength]);

  // setting the y values
  const yVals = characterOccurence.map((occurence) => occurence.name as string);
  const yScale = d3.scalePoint().range([viewBoxDim.height - margin.top - margin.bottom, 0]).domain(yVals);

  console.log("xVals", xVals);
  console.log("yVals", yVals);

  const data = toDataFormat(characterOccurence);
  console.log("data", data);

  //   const svg = d3
  //     .select("#instance-chart")
  //     .append("svg")
  //     .attr("height", height + margin.top + margin.bottom)
  //     .attr("width", width + margin.left + margin.right)
  //     .append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //   svg
  //     .selectAll("rect")
  //     .data(data)
  //     .enter()
  //     .append("rect")
  //     .attr("class", (d) => d.name)
  //     .attr("width", lineWidth)
  //     .attr("height", lineLength)
  //     .attr("x", (d) => xScale(d.occurence as number))
  //     .attr("y", (d) =>
  //       yScale(d.name as string) !== undefined
  //         ? yScale(d.name as string)! - lineLength / 2
  //         : 0
  //     );

  //   const yAxis = d3.axisLeft(yScale).ticks(9);

  //   svg.append("g").attr("class", "axis y-axis").call(yAxis);

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
      .attr("opacity", 0.35)

  const yAxis = d3.axisLeft(yScale).ticks(9);

  svgContainer.append("g").attr("class", "axis y-axis").call(yAxis)
}
