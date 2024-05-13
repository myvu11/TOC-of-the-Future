import { generateTOC } from "./utils/generateTOC.js";
import {
  modifyOPF,
  compressToEpub,
  decompressEpub,
  copyFilesToFolder,
  insertTOCFiles,
  zipToEpub,
} from "./utils/zipping.js";
import {
  chapterHandler,
  getChapterCount,
  getReadingTimeChapters,
} from "./utils/chapterHandling.js";
import { writeFileSync } from "fs";
import { sectionHandler } from "./utils/sectionHandlling.js";

// const epubPath = "./epub-files/okakura-book-of-tea.epub";

// const epubPath = "./epub-files/Alice's Adventure in Wonderland by Lewis Carroll - Project Gutenberg.epub";
// const epubPath = "./epub-files/Oliver Twist by Charles Dickens - Project Gutenberg.epub";
// const epubPath = "./epub-files/Austen, Jane - Pride and Prejudice.epub";
// const epubPath = "./epub-files/jane-austen_pride-and-prejudice - standardebooks.epub"
const epubPath = "./epub-files/steinbeck-of-mice-and-men - Epubbooks.epub";
// const epubPath = "./epub-files/lewis-prince-caspian - Epubbooks.epub";

// const extractedFolder = "extracted/okakura";
// const extractedFolder ='extracted/austen - pocketbook'
// const extractedFolder ='extracted/carroll - gutenberg'
// const extractedFolder ='extracted/lewis - epubbooks'
// const extractedFolder = "./extracted/austen - standardebooks";
const extractedFolder = "./extracted/steinbeck - epubbooks";

// const compressFolder = "austen"
// const compressFolder = "carroll"
const compressFolder = "steinbeck5-chapter-instance";
const folderName = "steinbeck/"
const manifestItems = [
  { id: "future-toc-css", href: "future-toc.css", "media-type": "text/css" },
  {
    id: "future-toc-svg-css",
    href: "future-svg.css",
    "media-type": "text/css",
  },
  {
    id: "future-toc-script",
    href: "future-toc.js",
    "media-type": "text/javascript",
  },
  {
    id: "future-toc",
    href: "future-toc.xhtml",
    "media-type": "application/xhtml+xml",
  },
];

const spineItem = {idref: "future-toc"}

// <itemref idref="future-toc-chapter-instance" linear="no"/>
const spineItemsExtra: { idref: string; linear: string}[] = [];
let opfFile = "package.opf";

// decompressEpub(epubPath, extractedFolder);
const chapterCount = getChapterCount(epubPath);
for (let i = 0; i < chapterCount; i++) {
  spineItemsExtra.push({
    idref: `future-toc-chapter-${i + 1}`,
    linear: "no",
  });
  manifestItems.push({
    id: `future-toc-chapter-${i + 1}`,
    href: `future-toc-chapter-${i + 1}.xhtml`,
    "media-type": "application/xhtml+xml",
  });
}

// const durations = getReadingTimeChapters(epubPath, extractedFolder)
// console.log("duration,", durations)

// generateTOC(epubPath)

// insertTOCFiles(extractedFolder);
// modifyOPF(epubPath, manifestItem, manifestItemJS, spineItem, extractedFolder + "/OEBPS/" + opfFile, manifestItemExtra);
modifyOPF(epubPath, manifestItems, spineItem, spineItemsExtra, extractedFolder + "/OEBPS/" + opfFile);
// zipToEpub(extractedFolder, compressFolder);

// chapterHandler(epubPath, extractedFolder)
sectionHandler(folderName)
