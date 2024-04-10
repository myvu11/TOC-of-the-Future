import { generateTOC } from "./utils/generateTOC.js";
import { modifyOPF, compressToEpub, decompressEpub, copyFilesToFolder, insertTOCFiles } from "./utils/zipping.js";
import { chapterHandler, getChapterCount, getReadingTimeChapters } from "./utils/chapterHandling.js";
import { writeFileSync } from "fs";



// const epubPath = "./epub-files/okakura-book-of-tea.epub";
// const extractedFolder = "extracted/okakura";
// const epubPath = "./epub-files/Alice's Adventure in Wonderland by Lewis Carroll - Project Gutenberg.epub";
// const epubPath = "./epub-files/Oliver Twist by Charles Dickens - Project Gutenberg.epub";
// const epubPath = "./epub-files/Austen, Jane - Pride and Prejudice.epub";
const epubPath = "./epub-files/steinbeck-of-mice-and-men - Epubbooks.epub";
// const epubPath = "./epub-files/lewis-prince-caspian - Epubbooks.epub";

// const epubPath = "./epub-files/lewis-prince-caspian.epub";

// const extractedFolder = "extracted/carroll";
const extractedFolder = "extracted/steinbeck - epubbooks";


const compressFolder = "steinbeck"
const manifestItem = {id: "future-toc", href: "future-toc.xhtml", 'media-type': "application/xhtml+xml"}
const manifestItemJS = {id: "future-toc-script", href: "future-toc.js", 'media-type': "text/javascript"}
const spineItem = {idref:"future-toc"}
let opfFile = "content.opf"



// decompressEpub(epubPath, extractedFolder);
// const chapters = extractChapterText(epubPath, extractedFolder)
// console.log("Try", chapters[0]['OEBPS/ch01.xhtml'])
// writeFileSync( 'src/chapters/ch03.txt',chapters[2]['OEBPS/ch03.xhtml'])

// console.log("chapters", chapters[1])
// getChapterCount(epubPath)
// const durations = getReadingTimeChapters(epubPath, extractedFolder)
// console.log("duration,", durations)

// generateTOC(epubPath)

// insertTOCFiles(extractedFolder);
// modifyOPF(epubPath, manifestItem, manifestItemJS, spineItem, extractedFolder + "/OEBPS/" + opfFile);
// compressToEpub(extractedFolder, compressFolder);


chapterHandler()
