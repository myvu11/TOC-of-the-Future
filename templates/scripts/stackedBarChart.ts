import * as d3 from "d3";
import { getLegendColors, OTHERS, DESCRIPTIONS, groupBy } from "./utils";

// Specify the chart’s dimensions

const marginTop = 35;
const marginRight = 20;
const marginBottom = 10;
const marginLeft = 85;
const barHeight = 25;
const barGap = 35;


interface ChapterOccurence {
  chapterTitle: string;
  sentenceCount: number;
  characters: {
    name: string;
    occurence: number[];
  }[];
  locations: {
    name: string;
    occurence: number[];
  }[];
  description: number[];
}

interface InstanceData {
  chapter: string,
  name: string,
  index: number}

function getChapterTitles(data: ChapterOccurence[]) {
  let keys: string[] = [];
  for (let i = 0; i < data.length; i++) {
    keys.push(data[i].chapterTitle);
  }
  return keys;
}


// format data for stacked bar chart
function formatToStackData(data: ChapterOccurence[], main: string[]) {
  const chartData: Record<string, string | number>[] = [];
  for (let i = 0; i < data.length; i++) {
    const charactersCount = data[i].characters.length;
    const countEntities: Record<string, number> = {};
    for (let j = 0; j < charactersCount; j++) {
      let name = data[i].characters[j].name;
      const occurenceCount = data[i].characters[j].occurence.length;
      if (main.findIndex((e) => e === name) === -1) {
        name = OTHERS;
      }
      if (countEntities[name]) {
        countEntities[name] += occurenceCount;
      } else {
        countEntities[name] = occurenceCount;
      }
    }
    const entities = [...main, OTHERS, DESCRIPTIONS];
    entities.map((e) => {
      if (!(e in countEntities)) {
        countEntities[e] = 0;
      }
    });
    const maxEntity = sum(Object.values(countEntities));
    chartData.push({
      chapterTitle: data[i].chapterTitle,
      sentenceCount: data[i].sentenceCount,
      ...countEntities,
      // [DESCRIPTIONS]: data[i].description.length,
      [DESCRIPTIONS]: data[i].sentenceCount - maxEntity,
    });
  }
  return Object(chartData);
}

// format data for instance chart
function formatToInstanceData(data: ChapterOccurence[], main: string[]) {
  // const instanceData: Record<string, string | number>[] = [];
  const instanceData: InstanceData[] = [];
  for (let i = 0; i < data.length; i++) {
    const characters = data[i].characters;
    for (let j = 0; j < data[i].characters.length; j++) {
      let name = characters[j].name;
      if (main.findIndex((e) => e === name) === -1 && name !== DESCRIPTIONS) {
        name = OTHERS;
      }
      if (name === DESCRIPTIONS) {
        name = DESCRIPTIONS;
      }
      characters[j].occurence.forEach((occur) =>
        instanceData.push({
          chapter: data[i].chapterTitle,
          name: name,
          index: occur,
        })
      );
    }
    data[i].description.forEach((d) =>
      instanceData.push({
        chapter: data[i].chapterTitle,
        name: DESCRIPTIONS,
        index: d,
      })
    );
  }

  return instanceData;
}

function getCommonData(instanceData: InstanceData[]) {

  const groupChapters = groupBy(instanceData, d => d.chapter)
  const instances = Object.values(groupChapters)
    .map(chapter => groupBy(chapter, d => d.index))
    .map(chapter => Object.values(chapter).map((group) => group.map((instance, index) => [{
    ...instance,
    numberInGroup: group.length,
    groupIndex: index
    }
  ])))
  .reduce((x, y) => x.concat(y), [])
  .reduce((x, y) => x.concat(y), [])
  .reduce((x, y) => x.concat(y), [])

  return instances

}

const sum = (n: number[]) => n.reduce((acc, i) => acc + i, 0);

export function buildStackedBarChart(
  data: ChapterOccurence[],
  topCharacters: string[],
  stackOrder: string[],
  ID = 0
) {
  const groups = getChapterTitles(data);
  const stackKeys = [...topCharacters, OTHERS, DESCRIPTIONS];
  const chartData = formatToStackData(data, topCharacters);
  const instanceData = formatToInstanceData(data, topCharacters);
  const commonData = getCommonData(instanceData)

  // console.log("data stacked", data)
  // console.log("groups", groups);
  // console.log("stackKeys", stackKeys);
  // console.log("chartdata", chartData);
  // console.log("instancedata", instanceData);
  // console.log("stacked commonData", commonData);

  const stackedData = d3.stack().keys(stackOrder)(chartData);

  const maxSumCharacter= Math.max(
    ...chartData.map((chapter: any) => {
      return sum(stackKeys.map((key) => chapter[key] ?? 0));
    })
  );

  const maxSentence = Math.max(
    ...chartData.map((chapter: any) => {
      return chapter.sentenceCount;
    })
  );

  const maxEntities = Math.max(maxSumCharacter, maxSentence)

  // console.log("max", maxEntities);
  // console.log("stackedData", stackedData);

  // Compute the height from the number of stacks.
  const height = stackedData[0].length * (barHeight + barGap);
  const clientWidth = document.getElementById("stacked")?.clientWidth ?? 400
  // const width = clientWidth < 457 ? clientWidth : 457;
  const width = clientWidth
  const viewBoxDim = {
    x: -marginLeft,
    y: -marginTop,
    width: width,
    height: height,
  };

  // Prepare the scales for positional and color encodings.
  const xScale = d3
    .scaleLinear()
    .domain([0, maxEntities])
    .range([0, width - marginLeft]);

  const yScale = d3
    .scaleBand<string>()
    .domain(groups)
    .range([0, height])
    .padding(0.08);

  const color = getLegendColors(stackKeys);

  const charactersDiv = document.getElementById("characters");
  stackOrder.forEach((key) => {
    const div = document.createElement("div");
    div.classList.add("legend");
    div.innerHTML = `<div>${key}</div><div class='color' style='background: ${color(
      key
    )}'></div>`;
    charactersDiv?.append(div);
  });

  // Create the SVG container.
  const svg = d3
    .select("div#stacked")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMidYMin meet")
    .attr("viewBox", [viewBoxDim.x, viewBoxDim.y, width, height]);

  // Append a group for each series, and a rect for each element in the series.
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("x", (d) => xScale(d[0]))
    .attr("y", (d) => yScale(d.data.chapterTitle.toString())!)
    .attr("height", barHeight)
    .attr("width", (d) => xScale(d[1]) - xScale(d[0]));
  // .style("stroke", "white")
  // .style("stroke-dasharray", ('5, 5'));
  // .append("title")
  // .text((d) => `${d.data.chapterTitle}`);

  const lineWidth = 0.25;
  // Append instance chart
  svg
    .append("g")
    .selectAll("g")
    .data(commonData)
    .enter()
    .append("rect")
    .attr("class", (d) => d.name)
    .attr("width", lineWidth)
    .attr("height", d => barHeight / d.numberInGroup)
    .attr("x", (d) => xScale(Number(d.index) - 1))
    .attr("y", (d) => yScale(d.chapter)! + barHeight + (barHeight / d.numberInGroup) * d.groupIndex)
    .attr("fill", (d) => color(d.name))
    .attr("stroke", (d) => color(d.name));

  // Append the vertical left axis
  svg
    .append("g")
    .style("font", "16px times")
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisLeft(yScale).tickSize(0))
    .selectAll("g")
    .each(function (_, i) {
      const el: any = this;
      d3.select(el.parentNode)
        .insert("svg:a")
        .style("cursor", "pointer")
        .attr("xlink:href", `future-toc-chapter-${i + 1}.xhtml`) // paths[i]
        .on("click", (d) => d.fill("blue"))
        .append(() => el);
    })
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("x", "-15")
        .attr("y", -barHeight / 1.5)
        .attr("text-decoration", "underline")
    );

  // append right axis line to mark end of bar
  svg
    .append("g")
    .attr("transform", `translate(${width - marginRight * 4.25},${0})`)
    .call(d3.axisRight(yScale).tickSize(0))
    .style("font", "0px times");

  // append x axis for sentence count
  svg
    .append("g")
    .attr("transform", `translate(${0},${height})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickSize(1.5)
        .ticks(Math.round(maxEntities / 100))
    )
    .call((g) => g.selectAll(".domain").remove());
  // .style("font", "0px times")

  svg
  const axisLabelX = width / 2 - marginLeft / 2;
  const axisLabelY = height + marginBottom * 4;

  // append x text at bottom chart
  svg
    .append("text")
    .attr("class", "x label")
    .attr("transform", "translate(" + axisLabelX + ", " + axisLabelY + ")")
    .attr("text-anchor", "end")
    .text("Sentences")
    .style("font", "16px times");

}
