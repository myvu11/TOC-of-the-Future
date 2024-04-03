import { startGPT } from "./utils/gpt-character-extract.js";
import { generateTOC } from "./utils/generateTOC.js";
import { modifyOPF, compressToEpub, decompressEpub, copyFilesToFolder, insertTOCFiles } from "./utils/zipping.js";
import { getChapterCount } from "./utils/chapterHandling.js";



// const epubPath = "./epub-files/okakura-book-of-tea.epub";
// const extractedFolder = "extracted/okakura";
// const epubPath = "./epub-files/Lewis Carroll - Alice's Adventures in Wonderland.epub";
// const epubPath = "./epub-files/lewis-prince-caspian.epub";
const epubPath = "./epub-files/Doyle, Artur Conan - Sherlock Holmes.epub";
// const extractedFolder = "extracted/carroll";
const extractedFolder = "extracted/conan";
const compressFolder = "conan3"
const manifestItem = {id: "id-test", href: "future-toc.xhtml", 'media-type': "application/xhtml+xml"}
const manifestItemJS = {id: "id-toc", href: "future-toc.js", 'media-type': "text/javascript"}
const spineItem = {idref:"id-test"}
let opfFile = "content.opf"



// decompressEpub(epubPath, extractedFolder);
// generateTOC(epubPath)
insertTOCFiles(extractedFolder);
modifyOPF(epubPath, manifestItem, manifestItemJS, spineItem, extractedFolder + "/OEBPS/" + opfFile);
compressToEpub(extractedFolder, compressFolder);

// getChapterCount(epubPath)

// startGPT();

