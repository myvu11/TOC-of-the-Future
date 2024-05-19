import { buildInstanceChart } from "../deprecated/instancechart";
import { buildStackedBarChart } from "./stackedBarChart";
import { buildLayoutRectangle } from "../deprecated/layout-rectangle";
import { buildChapterInstance } from "./chapter-instance";
import * as chaptersOccurences from "../chapterInstances/steinbeck.json";
import * as chapterPaths from "../chapterInstances/chapterPaths.json";
import * as chapterSections from "../chapterInstances/sectionInstance.json";
import * as bookOccurence from "../chapterInstances/BookOccurence.json";

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
// const sections: ChapterSections[] = chapterSection2;
const bookData: ChapterOccurence[] = bookOccurence;
// console.log("book", bookData[1]);

// for(let i = 0; i < occurences.length; i++) {
//   buildInstanceChart(String(i+1), occurences[i].characters, occurences[i].sentenceCount);
// }

// buildChapterInstance(bookData[0].occurenceSet[0], 0 + 1, paths);
buildStackedBarChart(occurences, paths);
for (let i = 0; i < bookData.length; i++) {
  buildChapterInstance(bookData[i].occurenceSet[0], i + 1, paths);
}

// buildChapterInstance(sections[0], 2);
