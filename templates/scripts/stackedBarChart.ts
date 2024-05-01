import * as d3 from "d3";

// Specify the chart’s dimensions (except for the height).

const marginTop = 55;
const marginRight = 20;
const marginBottom = 10;
const marginLeft = 85;
const barHeight = 25;
const barGap = 35;
const numberOfMains = 4;

const OTHERS = "secondary";
const DESCRIPTIONS = "no mentionings";

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

function getChapterTitles(data: ChapterOccurence[]) {
  let keys: string[] = [];
  for (let i = 0; i < data.length; i++) {
    keys.push(data[i].chapterTitle);
  }
  return keys;
}

// get top n characters of the book
function getTops(data: ChapterOccurence[], n: number) {

  let countOccurence: Record<string, string | number>[] = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].characters.length; j++) {
      const character: string = data[i].characters[j].name;
      const index = countOccurence.findIndex((e) => e.name === character);
      const occurenceLength = data[i].characters[j].occurence.length;
      if (index !== -1) {
        const prevCount = Number(countOccurence[index].count);
        const newCount = prevCount + occurenceLength;
        countOccurence[index] = { name: character, count: newCount };
      } else {
        countOccurence.push({ name: character, count: occurenceLength });
      }
    }
  }
  const res = Object(countOccurence).sort(
    (a: Record<string, string | number>, b: Record<string, string | number>) =>
      Number(b.count) - Number(a.count)
  );

  const keys: string[] = res.map((e: Record<string, string | number>) =>
    String(e.name)
  );
  if (keys.length > n) {
    return keys.slice(0, n);
  }
  return keys;
}

// format data for stacked bar chart
function formatToChartData(data: ChapterOccurence[], main: string[]) {
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
      [DESCRIPTIONS]: data[i].sentenceCount - maxEntity,
    });
  }
  return Object(chartData);
}

// format data for instance chart
function formatToInstanceData(data: ChapterOccurence[], main: string[]) {
  const instanceData: Record<string, string | number>[] = [];
  for (let i = 0; i < data.length; i++) {
    const characters = data[i].characters;
    for (let j = 0; j < data[i].characters.length; j++) {
      let name = characters[j].name;
      if (main.findIndex((e) => e === name) === -1 && name !== DESCRIPTIONS) {
        name = OTHERS;
      }
      if(name === DESCRIPTIONS) {
        name = DESCRIPTIONS
      }
      characters[j].occurence.forEach((occur) =>
        instanceData.push({
          chapter: data[i].chapterTitle,
          name: name,
          occurence: occur,
        })
      );
    }
    data[i].description.forEach( d => instanceData.push({
      chapter: data[i].chapterTitle,
      name: DESCRIPTIONS,
      occurence: d,
    }))
  }

  return instanceData;
}

const sum = (n: number[]) => n.reduce((acc, i) => acc + i, 0);

export function buildStackedBarChart(
  data: ChapterOccurence[],
  paths: string[]
) {
  // Determine the series that need to be stacked.
  console.log("data", data);

  const groups = getChapterTitles(data);
  let topCharacters = getTops(data, numberOfMains);
  const stackKeys = [...topCharacters, OTHERS, DESCRIPTIONS];
  const chartData = formatToChartData(data, topCharacters);
  const instanceData = formatToInstanceData(data, topCharacters);

  // console.log("groups", groups);
  // console.log("stackKeys", stackKeys);
  console.log("chartdata", chartData);
  console.log("instancedata", instanceData);

  const stackedData = d3.stack().keys(stackKeys)(chartData);

  const maxEntities = Math.max(
    ...chartData.map((chapter: any) => {
      return sum(stackKeys.map((key) => chapter[key] ?? 0));
    })
  );

  console.log("max", maxEntities);
  console.log("stackedData", stackedData);

  // Compute the height from the number of stacks.
  const height = stackedData[0].length * (barHeight + barGap);
  const width = document.getElementById("stacked")?.clientWidth ?? 0;
  const viewBoxDim = {
    x: -marginLeft,
    y: -marginTop,
    width: width,
    height: height,
  };

  // Prepare the scales for positional and color encodings.
  const x = d3
    .scaleLinear()
    .domain([0, maxEntities])
    .range([0, width - marginLeft]);

  const y = d3
    .scaleBand<string>()
    .domain(groups)
    .range([0, height])
    .padding(0.08);

  const divergingScheme = [
    "#fdd49e",
    "#fdbb84",
    "#fc8d59",
    "#e34a33",
    "#b30000",
  ].reverse().splice(0, numberOfMains+1);
  // d3.schemeAccent
  const color = d3
    .scaleOrdinal<string>([...divergingScheme, "#045a8d"])
    .domain(stackKeys)
    // .unknown("#ccc");

  const charactersDiv = document.getElementById("characters");
  stackKeys.forEach((key) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class='character'>${key}</div><div class='color' style='background: ${color(
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
    .attr("x", (d) => x(d[0]))
    .attr("y", (d) => y(d.data.chapterTitle.toString())!)
    .attr("height", barHeight)
    .attr("width", (d) => x(d[1]) - x(d[0]))
  // .style("stroke", "white")
  // .style("stroke-dasharray", ('5, 5'));
  // .append("title")
  // .text((d) => `${d.data.chapterTitle}`);

  const lineWidth = 0.25;     //12.5 for instance chart
  // Append instance chart
  svg.append("g")
    .selectAll("g")
    .data(instanceData).enter().append("rect")
    .attr("class", (d) => d.name)
    .attr("width", lineWidth)
    .attr("height", barHeight)
    .attr("x", (d) => x(Number(d.occurence) - 1))
    .attr("y", (d) => y(d.chapter.toString())! + barHeight)
    .attr("fill", d => color(d.name.toString()))
    .attr("opacity", 0.75)
    .attr("stroke", d => color(d.name.toString()))
    // .attr("stroke-width", 1.5);

  // Append the vertical axis
  svg
    .append("g")
    .style("font", "16px times")
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("g")
    .each(function (_, i) {
      const el: any = this;
      d3.select(el.parentNode)
        .insert("svg:a")
        .style("cursor", "pointer")
        .attr("xlink:href", paths[i])
        .on("click", (d) => d.fill("blue"))
        .append(() => el);
    })
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("x", "-15")
        .attr("y", -barHeight / 3)
        .attr("text-decoration", "underline")
    );

  // append right axis line to mark end of bar
  svg
    .append("g")
    .attr("transform", `translate(${width - marginRight * 4.25},${0})`)
    .call(d3.axisRight(y).tickSize(0))
    .style("font", "0px times");

  // append x axis for sentence count
  svg
    .append("g")
    .attr("transform", `translate(${0},${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickSize(1.5)
        .ticks(Math.round(maxEntities / 100))
    )
    .call((g) => g.selectAll(".domain").remove());
  // .style("font", "0px times")

  // append x axis to mark chart top restriction
  // svg
  //   .append("g")
  //   .attr("transform", `translate(${0},${0})`)
  //   .call(d3.axisTop(x).tickSize(0))
  //   .style("font", "0px times")

  const axisLabelX = width / 2 - marginLeft / 2;
  const axisLabelY = height + marginBottom * 4;

  // append x text at top chart
  svg
    .append("text")
    .attr("class", "x label")
    .attr("transform", "translate(" + axisLabelX + ", " + axisLabelY + ")")
    .attr("text-anchor", "end")
    .text("Sentences")
    .style("font", "16px times");

  

  // // Append categorical legend
  // const size = 20;
  // const spaceSize = 45;
  // const posY = -105;
  // svg
  //   .append("g")
  //   .selectAll("legend")
  //   .data(stackKeys)
  //   .enter()
  //   .append("rect")
  //   .attr("x", (_, i) => i * (size * 2 + spaceSize))
  //   .attr("y", posY)
  //   .attr("width", size * 2)
  //   .attr("height", size)
  //   .style("fill", (d) => color(d));

  // svg
  //   .append("g")
  //   .selectAll("legend")
  //   .data(stackKeys)
  //   .enter()
  //   .append("text")
  //   .attr("x", (_, i) => i * (size * 2 + spaceSize))
  //   .attr("y", -115)
  //   .style("fill", "black")
  //   .text((d) => d)
  //   .attr("text-anchor", "top")
  //   .style("alignment baseline", "left");
}
