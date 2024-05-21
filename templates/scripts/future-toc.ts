import { buildInstanceChart } from "../deprecated/instancechart";
import { buildStackedBarChart } from "./stackedBarChart";
import { buildChapterInstance } from "./chapter-instance";
import * as chaptersOccurences from "../chapterInstances/steinbeck.json";
import * as chapterPaths from "../chapterInstances/chapterPaths.json";
import * as bookOccurence from "../chapterInstances/BookOccurence.json";
import { getTops, OTHERS, DESCRIPTIONS } from "./utils";

type ChapterSections = {
  sectionTitles: { sectionID: string; sectionTitle: string }[];
  sectionOccurence: {
    sectionID: number;
    name: string;
    index: number;
  }[];
};

type ChapterOccurence = {
  chapter: string;
  occurenceSet: ChapterSections[];
};

const occurences = chaptersOccurences;
const paths = chapterPaths;
const bookData: ChapterOccurence[] = bookOccurence;
const topCharacters = getTops(occurences);
const entities = [...topCharacters, OTHERS, DESCRIPTIONS];

function move(input: any[], from: number, to: number) {
  let numberOfDeletedElm = 1;
  const elm = input.splice(from, numberOfDeletedElm)[0];
  numberOfDeletedElm = 0;
  input.splice(to, numberOfDeletedElm, elm);
}


// function changeOrderForStackedBarChart(i: number) {
//   document.getElementById("future-toc-entity-legend-0")!.innerHTML = "";
//   // document.getElementById("future-toc-entity-0")!.innerHTML = "";

//   const entityOrder = [...entities];
//   move(entityOrder, i, 0);
//   buildStackedBarChart(
//     occurences,
//     topCharacters,
//     entityOrder,
//     i,
//     changeOrderForStackedBarChart
//   );
//   return true;
// }

// buildStackedBarChart(
//   occurences,
//   topCharacters,
//   entities,
//   0,
//   changeOrderForStackedBarChart
// );

for (let i = 0; i < entities.length; i++) {
  const entityOrder = [...entities];
  move(entityOrder, i, 0);
  buildStackedBarChart(occurences, topCharacters, entityOrder, i + 1);
}

for (let i = 0; i < bookData.length; i++) {
  buildChapterInstance(bookData[i].occurenceSet[0], i + 1, paths, entities);
}
