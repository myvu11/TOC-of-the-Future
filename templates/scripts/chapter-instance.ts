import * as d3 from "d3";
import { getLegendColors, groupBy } from "./utils";


const CHAPTER = "future-toc-chapter";
const marginTop = 15;
const marginRight = 20;
const marginBottom = 10;
const marginLeft = 90;
const barHeight = 25;
const barGap = 10;

// const OTHERS = "secondary";
// const DESCRIPTIONS = "no mentionings";

type ChapterSections = {
  sectionTitles: { sectionID: string; sectionTitle: string }[];
  sectionOccurence: {
    sectionID: number;
    name: string;
    index: number;
  }[];
};

// get the counts of each chapter section
function countMentionings(data: ChapterSections) {
  const counts = [];
  for (let i = 0; i < data.sectionTitles.length; i++) {
    const count = data.sectionOccurence.filter(
      (obj) => obj.sectionID === i + 1
    ).length;
    counts.push(count);
  }
  return counts;
}

// get max section length
function getMaxSectionLength(
  sectionOccurence: Record<string, string | number>[]
) {
  const max = sectionOccurence.reduce((acc, obj) => {
    acc = Number(obj.index) > acc ? Number(obj.index) : acc;
    return acc;
  }, 0);
  return max;
}

// get the sentences with multiple characters
function detectCommonInstances(data: ChapterSections) {
  const commonData: (ChapterSections["sectionOccurence"][number] & {
    numberInGroup: number;
    groupIndex: number;
  })[] = [];

  for (let i = 0; i < data.sectionTitles.length; i++) {
    const sectionData = data.sectionOccurence.filter(
      (e) => e.sectionID === i + 1
    );

    const groups = groupBy(sectionData, (data) => data.index);
    // console.log("groups", groups)
    const instances = Object.keys(groups)
      .map((key) => groups[key as any])
      .map(
        (group) =>
          group?.map((instance, index) => ({
            ...instance,
            numberInGroup: group.length,
            groupIndex: index,
          })) ?? []
      )
      .reduce((x, y) => x.concat(y), []);

    commonData.push(...instances);
  }
  return commonData;
}

const debug = (label: string) => {
  document.body.append(label);
};

// build the chapterInstance
export function buildChapterInstance(
  data: ChapterSections,
  ID: number,
  paths: string[],
  entities: string[]
) {
  const counts = countMentionings(data);
  const maxEntities = Math.max(...counts);
  const sections: string[] = data.sectionTitles.map(
    (title) => "Section " + title.sectionID.toString()
  );

  const occurence: Record<string, string | number>[] = data.sectionOccurence;
  const commonData = detectCommonInstances(data);
  const maxLength = getMaxSectionLength(occurence);
  // console.log("data instance", data)
  // console.log("commonData", commonData)

  // dimensions of svg
  const height = data.sectionTitles.length * (barHeight + barGap);
  const clientWidth =
    document.getElementById(`${CHAPTER}-${ID}`)?.clientWidth ?? 457;
  // const width = clientWidth < 457 ? clientWidth : 457;
  const width = clientWidth;
  const viewBoxDim = {
    x: -marginLeft,
    y: -marginTop,
    width: width,
    height: height,
  };

  const lineWidth = Math.floor(width / maxLength);

  const xScale = d3
    .scaleLinear()
    .domain([0, maxLength])
    .range([0, width - marginLeft]);

  const yScale = d3
    .scaleBand<string>()
    .domain(sections)
    .range([0, height])
    .padding(0.08);


  const color = getLegendColors(entities);

  const legendsDiv = document.getElementsByClassName("legends");

  Array.from(legendsDiv).forEach((legends) => {
    entities.forEach((key) => {
      const div = document.createElement("div");
      div.classList.add("legend");
      div.innerHTML = `<div>${key}</div><div class='color' style='background: ${color(
        key
      )}'></div>`;
      if (legends.id === `future-toc-legend-ch-${ID}`) {
        legends?.append(div);
      }
    });
  });

  const svg = d3
    .select(`div#${CHAPTER}-${ID}`)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMidYMin meet")
    .attr("viewBox", [viewBoxDim.x, viewBoxDim.y, width, height]);

  // Append section instances
  svg
    .append("g")
    .selectAll("g")
    .data(commonData)
    .enter()
    .append("rect")
    .attr("class", (d) => d.name)
    .attr("width", lineWidth)
    .attr("height", (d) => barHeight / d.numberInGroup)
    .attr("x", (d) => xScale(Number(d.index) - 1))
    .attr(
      "y",
      (d) =>
        yScale("Section " + d.sectionID.toString())! +
        barHeight +
        (barHeight / d.numberInGroup) * d.groupIndex
    )
    .attr("fill", (d) => color(d.name.toString()))
    .attr("stroke", (d) => color(d.name.toString()));

  // Append the vertical left axis
  svg
    .append("g")
    .style("font", "16px times")
    .attr("transform", `translate(${0},${marginTop+10})`)
    .call(d3.axisLeft(yScale).tickSize(0))
    .selectAll("g")
    .each(function (_, i) {
      const el: any = this;
      d3.select(el.parentNode)
        .insert("svg:a")
        // .style("cursor", "pointer")
        // .attr("xlink:href", paths[i])
        .append(() => el);
    })
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("x", -15)
        .attr("y", -barHeight/5)
        // .attr("text-decoration", "underline")
    );

  // append vertical right axis line to mark end of bar
  svg
    .append("g")
    .attr("transform", `translate(${width - marginRight * 4.25},${marginTop})`)
    .call(d3.axisRight(yScale).tickSize(0))
    .style("font", "0px times");

  // append x axis for sentence count
  svg
    .append("g")
    .attr("transform", `translate(${0},${height + marginTop + 10})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickSize(1.5)
        .ticks(Math.floor(maxEntities / 10))
    )
    .call((g) => g.selectAll(".domain").remove());

  const axisPosX = width / 2 - marginLeft / 2;
  const axisPosY = height + marginBottom * 6;

  // append x text at bottom chart
  svg
    .append("text")
    .attr("class", "x label")
    .attr("transform", "translate(" + axisPosX + ", " + axisPosY + ")")
    .attr("text-anchor", "end")
    .text("Sentences")
    .style("font", "16px times");
}
