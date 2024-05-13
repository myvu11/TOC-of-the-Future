import { buildInstanceChart } from "./instancechart";
import { buildStackedBarChart } from "./stackedBarChart";
import { buildLayoutRectangle } from "./layout-rectangle";
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
  chapter: string,
  occurenceSet: ChapterSections[]
}

const occurences = chaptersOccurences;
const paths = chapterPaths;
// const sections: ChapterSections[] = chapterSection2;
const bookData: ChapterOccurence[] = bookOccurence;
console.log("book", bookData[1]);

// for(let i = 0; i < occurences.length; i++) {
//   buildInstanceChart(String(i+1), occurences[i].characters, occurences[i].sentenceCount);
// }



for(let i = 0; i < bookData.length; i++) {
  buildChapterInstance(bookData[i].occurenceSet[0], i+1);
}
buildStackedBarChart(occurences, paths);
// buildChapterInstance(sections[0], 2);
