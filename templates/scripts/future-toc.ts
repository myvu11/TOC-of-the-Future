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
// for(let i = 0; i < occurences.length; i++) {
//   buildInstanceChart(String(i+1), occurences[i].characters, occurences[i].sentenceCount);
// }

// buildChapterInstance(bookData[0].occurenceSet[0], 0 + 1, paths);
for(let i = 1; i < entities.length; i++) {
  const entityOrder = [...entities];
  // swapElements(entityOrder, 0, i)
  move(entityOrder, i, 0)
  console.log("entityOrder", entityOrder)
}
const stackOrder = [...entities]
console.log("stackOrder", stackOrder)
move(stackOrder, 2, 0)
console.log("after stackOrder", stackOrder)
buildStackedBarChart(occurences, topCharacters, stackOrder, 0);

for (let i = 0; i < bookData.length; i++) {
  buildChapterInstance(bookData[i].occurenceSet[0], i + 1, paths, topCharacters);
}

// buildChapterInstance(sections[0], 2);
