import { modifyOPF, compressToEpub, decompressEpub, copyFilesToFolder, modifyTOC } from "./utils/zipping.js";
import { getReadingTimeFromChapters } from "./utils/readDuration.js";


// const epubPath = "./epub-files/okakura-book-of-tea.epub";
// const extractedFolder = "extracted/okakura";
const epubPath = "./epub-files/Lewis Carroll - Alice's Adventures in Wonderland.epub";
const extractedFolder = "extracted/carroll";
const manifestItem = {id: "id-test", href: "layoutRectangle.xhtml", 'media-type': "application/xhtml+xml"}
const manifestItemJS = {id: "id-toc", href: "toc.js", 'media-type': "text/javascript"}
const spineItem = {idref:"id-test"}





// decompressEpub(epubPath, extractedFolder);
// modifyOPF(epubPath, manifestItem, manifestItemJS,spineItem, "extracted/carroll/OEBPS/content.opf")
// modifyTOC(epubPath)
// copyFilesToFolder("dist/layoutRectangle.xhtml", "extracted/carroll/OEBPS", "layoutRectangle.xhtml")
// copyFilesToFolder("dist/toc.js", "extracted/carroll/OEBPS", "toc.js")
// compressToEpub("carroll");



// reading time
// getReadingTimeFromChapters(epubPath, extractedFolder)
