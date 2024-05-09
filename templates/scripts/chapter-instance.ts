import * as d3 from "d3";


const marginTop = 15;
const marginRight = 20;
const marginBottom = 10;
const marginLeft = 85;
const barHeight = 25;
const barGap = 10;

const OTHERS = "secondary";
const DESCRIPTIONS = "no mentionings";

interface ChapterSections {
  chapter: string;
    sectionOccurence: {
        sectionID: number;
        name: string;
        index: number;
    }[];
}

function countMentionings(data:Record<string, Record<string, string | number>[]>) {
  const counts = []
  for(let i = 0; i < data.sectionTitles.length; i++) {
    const count = data.sectionOccurence.filter(obj => obj.sectionID === (i+1)).length
    counts.push(count)
  }
  return counts;
}

export function buildChapterInstance(data:Record<string, Record<string, string | number>[]>, ID: number) {
  const mains:string[] = ["George", "Lennie"]
  const keys = [...mains, OTHERS, DESCRIPTIONS];
  console.log("data", data)
  const counts = countMentionings(data);

  const maxEntities = Math.max(...counts);
  const sections: string[] = data.sectionTitles.map(title => title.sectionID.toString());
  const occurence: Record<string, string | number>[] = data.sectionOccurence;

  console.log("counts", counts)
  console.log("maxEntities", maxEntities)
  console.log("occurence", occurence)
  console.log("sections", sections);

  const height = data.sectionTitles.length * (barHeight + barGap);
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
  ].reverse().splice(0, keys.length - 1);



  // d3.schemeAccent
  const color = d3
    .scaleOrdinal([...divergingScheme, "#045a8d"])
    .domain(keys)

    console.log("color", color(OTHERS))
    console.log("keys", keys)

  const charactersDiv = document.getElementById("characters-1");
    keys.forEach((key) => {
      const div = document.createElement("div");
      div.innerHTML = `<div class='characters'>${key}</div><div class='color' style='background: ${color(
        key
      )}'></div>`;
      charactersDiv?.append(div);
    });

  // console.log("scheme", divergingScheme)
  // console.log("color", color("George"))
  // console.log("color", color("Lennie"))
  // console.log("color", color("Lennie"))

  const svg = d3
    .select(`div#chapter-instance-${ID}`)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMidYMin meet")
    .attr("viewBox", [viewBoxDim.x, viewBoxDim.y, width, height]);

  const lineWidth = 14.6;

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


  // Append the vertical axis
  svg
    .append("g")
    .style("font", "16px times")
    .attr("transform", `translate(${0},${marginTop})`)
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("g")
    .each(function (_, i) {
      const el: any = this;
      d3.select(el.parentNode)
        .insert("svg:a")
        .style("cursor", "pointer")
        .attr("xlink:href", "chapter-instance.xhtml")      // paths[i]
        .on("click", (d) => d.fill("blue"))
        .append(() => el);
    })
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("x", "-15")
        .attr("y", barHeight/2)
        .attr("text-decoration", "underline")
    );

  // append right axis line to mark end of bar
  svg
    .append("g")
    .attr("transform", `translate(${width - marginRight * 4.25},0)`)
    .call(d3.axisRight(y).tickSize(0))
    .style("font", "0px times");

  // append x axis for sentence count
  svg
    .append("g")
    .attr("transform", `translate(${0},${height + marginTop})`)
    .call(
      d3
        .axisBottom(x)
        .tickSize(1.5)
        .ticks(Math.round(maxEntities / 10))
    )
    .call((g) => g.selectAll(".domain").remove());

  const axisPosX = width / 2 - marginLeft / 2;
  const axisPosY = height + marginBottom * 4;
  // append x text at bottom chart
  svg
    .append("text")
    .attr("class", "x label")
    .attr("transform", "translate(" + axisPosX + ", " + axisPosY + ")")
    .attr("text-anchor", "end")
    .text("Sentences")
    .style("font", "16px times");
}
