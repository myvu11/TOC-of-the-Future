import { buildStackedBarChart } from "./stackedBarChart";
import { buildChapterInstance } from "./chapter-instance";
import * as chaptersOccurences from "../chapterInstances/stackedData.json";
import * as bookOccurence from "../chapterInstances/BookOccurence.json";
import { getTops, OTHERS, DESCRIPTIONS, getChapterTops } from "./utils";

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
const bookData: ChapterOccurence[] = bookOccurence;
const topCharacters = getTops(occurences);
const entities = [...topCharacters, OTHERS, DESCRIPTIONS];

function move(input: any[], from: number, to: number) {
  let numberOfDeletedElm = 1;
  const elm = input.splice(from, numberOfDeletedElm)[0];
  numberOfDeletedElm = 0;
  input.splice(to, numberOfDeletedElm, elm);
}

for (let i = 0; i < entities.length; i++) {
  const entityOrder = [...entities];
  move(entityOrder, i, 0);
  buildStackedBarChart(occurences, topCharacters, entityOrder, i + 1);
}

for (let i = 0; i < bookData.length; i++) {
  buildChapterInstance(bookData[i].occurenceSet[0], `${i+1}`, entities);
}

for (let i = 0; i < bookData.length; i++) {
  const chapterTops = getChapterTops(occurences[i]);
  const chapterEntities = [...chapterTops, OTHERS, DESCRIPTIONS]
  buildChapterInstance(bookData[i].occurenceSet[0], `${i+1}-1`, chapterEntities);
}
