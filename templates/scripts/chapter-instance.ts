import * as d3 from "d3";


const marginTop = 55;
const marginRight = 20;
const marginBottom = 10;
const marginLeft = 85;
const barHeight = 25;
const barGap = 35;

interface ChapterSections {
  chapter: string;
    sectionOccurence: {
        sectionID: number;
        name: string;
        index: number;
    }[];
}

export function buildChapterInstance(data:Record<string, Record<string, string | number>[]>, ID: number) {
  const mains:string[] = ["George, Lennie"]
  const maxEntities = 0;
  const sections:string[] = Object.keys(data.sectionTitles);
  const occurence: Record<string, string | number>[] = data.sectionOccurence;
  console.log("data.", occurence)
  console.log("sections", sections);

  const height = data.sectionOccurence.length * (barHeight + barGap);
  const width = document.getElementById(`chapter-instance-${ID}`)?.clientWidth ?? 0;
  const viewBoxDim = {
    x: -marginLeft,
    y: -marginTop,
    width: width,
    height: height,
  };

  const x = d3
    .scaleLinear()
    .domain([0, maxEntities])
    .range([0, width - marginLeft]);

  const y = d3
    .scaleBand<string>()
    .domain(sections)
    .range([0, height])
    .padding(0.08);

  const divergingScheme = [
    "#fdd49e",
    "#fdbb84",
    "#fc8d59",
    "#e34a33",
    "#b30000",
  ].reverse().splice(0, mains.length + 1);
  // d3.schemeAccent
  const color = d3
    .scaleOrdinal<string>([...divergingScheme, "#045a8d"])
    .domain(mains)



  const svg = d3
    .select("div#chapter-instance")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMidYMin meet")
    .attr("viewBox", [viewBoxDim.x, viewBoxDim.y, width, height]);

  const lineWidth = 0.25;

  // Append section instances
  svg
    .append("g")
    .selectAll("g")
    .data(occurence).enter().append("rect")
    .attr("class", (d) => d.name)
    .attr("width", lineWidth)
    .attr("height", barHeight)
    .attr("x", (d) => x(Number(d.index) - 1))
    .attr("y", (d) => y(d.sectionID.toString())! + barHeight)
    .attr("fill", d => color(d.name.toString()))
    .attr("opacity", 0.75)
    .attr("stroke", d => color(d.name.toString()))
}
