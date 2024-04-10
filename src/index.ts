import { generateTOC } from "./utils/generateTOC.js";
import { modifyOPF, compressToEpub, decompressEpub, copyFilesToFolder, insertTOCFiles, zipToEpub } from "./utils/zipping.js";
import { chapterHandler, getChapterCount, getReadingTimeChapters } from "./utils/chapterHandling.js";
import { writeFileSync } from "fs";



// const epubPath = "./epub-files/okakura-book-of-tea.epub";
// const extractedFolder = "extracted/okakura";
// const epubPath = "./epub-files/Alice's Adventure in Wonderland by Lewis Carroll - Project Gutenberg.epub";
// const epubPath = "./epub-files/Oliver Twist by Charles Dickens - Project Gutenberg.epub";
// const epubPath = "./epub-files/Austen, Jane - Pride and Prejudice.epub";
const epubPath = "./epub-files/steinbeck-of-mice-and-men - Epubbooks.epub";
// const epubPath = "./epub-files/lewis-prince-caspian - Epubbooks.epub";

// const extractedFolder ='extracted/austen - pocketbook'
// const extractedFolder ='extracted/carroll - gutenberg'
// const extractedFolder ='extracted/lewis - epubbooks'
const extractedFolder = "./extracted/steinbeck - epubbooks";

// const compressFolder = "austen"
// const compressFolder = "carroll"
const compressFolder = "steinbeck2"
const manifestItem = {id: "future-toc", href: "future-toc.xhtml", 'media-type': "application/xhtml+xml"}
const manifestItemJS = {id: "future-toc-script", href: "future-toc.js", 'media-type': "text/javascript"}
const spineItem = {idref:"future-toc"}
let opfFile = "package.opf"



// decompressEpub(epubPath, extractedFolder);
// getChapterCount(epubPath)
// const durations = getReadingTimeChapters(epubPath, extractedFolder)
// console.log("duration,", durations)

// generateTOC(epubPath)

insertTOCFiles(extractedFolder);
modifyOPF(epubPath, manifestItem, manifestItemJS, spineItem, extractedFolder + "/OEBPS/" + opfFile);
// compressToEpub(extractedFolder, compressFolder);
zipToEpub(extractedFolder, compressFolder)


// chapterHandler(epubPath, extractedFolder)
