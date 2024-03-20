import { startGPT } from "./utils/chatGPT-api.js";
import { generateTOC } from "./utils/generateTOC.js";
import { modifyOPF, compressToEpub, decompressEpub, copyFilesToFolder, insertTOCFiles } from "./utils/zipping.js";



// const epubPath = "./epub-files/okakura-book-of-tea.epub";
// const extractedFolder = "extracted/okakura";
// const epubPath = "./epub-files/Lewis Carroll - Alice's Adventures in Wonderland.epub";
const epubPath = "./epub-files/Austen, Jane - Pride and Prejudice.epub";
// const extractedFolder = "extracted/carroll";
const extractedFolder = "extracted/austen";
const compressFolder = "carroll"
const manifestItem = {id: "id-test", href: "toc.xhtml", 'media-type': "application/xhtml+xml"}
const manifestItemJS = {id: "id-toc", href: "toc.js", 'media-type': "text/javascript"}
const spineItem = {idref:"id-test"}
let opfFile = "content.opf"



// decompressEpub(epubPath, extractedFolder);
// generateTOC(epubPath)
// insertTOCFiles(extractedFolder);
// modifyOPF(epubPath, manifestItem, manifestItemJS, spineItem, extractedFolder + "/OEBPS/" + opfFile);
// compressToEpub(compressFolder);

startGPT();
