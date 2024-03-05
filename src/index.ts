import { modifyOPF, compressToEpub, decompressEpub, moveFilesToFolder, modifyTOC } from "./utils/zipping.js";
import { getReadingTimeFromChapters } from "./utils/readDuration.js";


// const epubPath = "./epub-files/okakura-book-of-tea.epub";
// const extractedFolder = "extracted/okakura";
const epubPath = "./epub-files/smashwords-shannon-cook-no-weird-or-fancy-stuff.epub";
const extractedFolder = "extracted/okakura";
const manifestItem = {id: "id-test", href: "test.xhtml", 'media-type': "application/xhtml+xml"}
const spineItem = {idref:"id-test"}

const bookPath = "epub-files/okakura-book-of-tea.epub"



// decompressEpub(epubPath, extractedFolder);
// modifyOPF(epubPath, manifestItem, spineItem, "extracted/okakura/OEBPS/package.opf")
// modifyTOC(epubPath)
// moveFilesToFolder("templates/test.xhtml", "extracted/okakura/OEBPS/test.xhtml")
// compressToEpub("eggs");



// reading time
getReadingTimeFromChapters(bookPath, extractedFolder)
