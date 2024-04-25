import { buildInstanceChart } from "./instancechart";
import { buildStackedBarChart } from "./stackedBarChart";
import { buildLayoutRectangle } from "./layout-rectangle";
import * as chaptersOccurences from '../chapterInstances/steinbeck.json';



const occurences = chaptersOccurences

// for(let i = 0; i < occurences.length; i++) {
//   buildInstanceChart(String(i+1), occurences[i].characters, occurences[i].sentenceCount);
// }


buildStackedBarChart(occurences);
