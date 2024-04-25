import * as d3 from "d3";

// Specify the chart’s dimensions (except for the height).

const marginTop = 30;
const marginRight = 20;
const marginBottom = 10;
const marginLeft = 20;

const OTHERS = "others";
const DESCRIPTIONS = "description";

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
}

function getChapterTitles(data: ChapterOccurence[]) {
  let keys: string[] = [];
  for (let i = 0; i < data.length; i++) {
    keys.push(data[i].chapterTitle);
  }
  return keys;
}

function getMaxCount(data: ChapterOccurence[]) {
  let max = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].characters.length; j++) {
      const count = data[i].characters[j].occurence.length;
      max = count > max ? count : max;
    }
  }
  return max;
}

function getMaxLength(data: ChapterOccurence[]) {
  let max = 0;
  for (let i = 0; i < data.length; i++) {
    max = data[i].sentenceCount > max ? data[i].sentenceCount : max;
  }
  return max;
}

// get top five characters of the book
function getTopFive(data: ChapterOccurence[]) {
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
  if (keys.length > 4) {
    return keys.slice(0, 4);
  }
  return keys;
}

// format data to a format for stacked bar chart
function formatToChartData(data: ChapterOccurence[], main: string[]) {
  const chartData: Record<string, string | number>[] = [];
  for (let i = 0; i < data.length; i++) {
    const charactersCount = data[i].characters.length;
    const entities: Record<string, number> = {};
    for (let j = 0; j < charactersCount; j++) {
      let name = data[i].characters[j].name;
      const occurenceCount = data[i].characters[j].occurence.length;
      if (main.findIndex((e) => e === name) === -1) {
        name = OTHERS;
      }
      if (entities[name]) {
        entities[name] += occurenceCount;
      } else {
        entities[name] = occurenceCount;
      }
    }
    chartData.push({
      chapterTitle: data[i].chapterTitle,
      sentenceCount: data[i].sentenceCount,
      ...entities,
    });
  }
  return Object(chartData);
}

const sum = (n: number[]) => n.reduce((acc, i) => acc + i, 0);

export function buildStackedBarChart(data: ChapterOccurence[]) {
  // Determine the series that need to be stacked.
  console.log("data", data);

  const maxOccurence = getMaxCount(data);
  const groups = getChapterTitles(data);
  let topCharacters = getTopFive(data);
  const stackKeys = [...topCharacters, OTHERS];
  const chartData = formatToChartData(data, topCharacters);

  // console.log("max", maxOccurence);
  // console.log("groups", groups);
  // console.log("stackKeys", stackKeys);
  console.log("chartdata", chartData);

  const stackedData = d3.stack().keys(stackKeys)(chartData);
  // .keys(d3.union(data.map(d => d.age))) // distinct series keys, in input order
  // .value(([, D], key) => D.get(key).population) // get value for each series key and stack
  // (d3.index(data, d => d.state, d => d.age)); // group by stack then series key

  const max = Math.max(
    ...chartData.map((chapter: any) => {
      return sum(stackKeys.map((key) => chapter[key] ?? 0));
    })
  );

  console.log("max", max);
  console.log("stackedData", stackedData);

  // Compute the height from the number of stacks.
  const height = stackedData[0].length * 75 + marginTop + marginBottom;
  const width = getMaxLength(data);
  const viewBoxDim = {
    x: -marginLeft,
    y: -marginTop,
    width: width,
    height: height,
  };
  console.log("width", width);

  // const occurenceCounts: number[] = Object(chartData).map((d:any) => d.occurenceCount)

  // Prepare the scales for positional and color encodings.
  const x = d3.scaleLinear().domain([0, max]).range([0, width]);

  const y = d3
    .scaleBand<string>()
    .domain(groups)
    .range([0, height])
    .padding(0.08);

  const keyColors = d3.schemeSpectral[stackedData.length];

  const color = d3
    .scaleOrdinal<string>()
    .domain(stackKeys)
    .range(keyColors)
    .unknown("#ccc");

  // A function to format the value in the tooltip.
  const formatValue = (x: any) => (isNaN(x) ? "N/A" : x.toLocaleString("en"));

  // Create the SVG container.
  const svg = d3
    .select("div#stacked")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMaxYMax meet")
    .attr("viewBox", [0, viewBoxDim.y, width, height]);

  // Append a group for each series, and a rect for each element in the series.
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    // .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
    .attr("x", (d) => x(d[0]))
    .attr("y", (d) => y(d.data.chapterTitle.toString())!)
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d[1]) - x(d[0]))
    .append("title")
    .text((d) => `${d.data.chapterTitle}`);

  // Append the vertical axis.
  svg
    .append("g")
    .attr("transform", `translate(${-0.5 * marginLeft},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call((g) => g.selectAll(".domain").remove());
}
