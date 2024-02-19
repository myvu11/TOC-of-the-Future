import { modifyOPF, compressToEpub, decompressEpub, moveFilesToFolder, modifyTOC } from "./utils/zipping.js";



// const epubPath = "./epub-files/okakura-book-of-tea.epub";
// const extractFolder = "extracted/okakura";
const epubPath = "./epub-files/smashwords-effortless-anti-inflammatory-diet-cookbook.epub";
const extractFolder = "extracted/anti-inflammatory";
const manifestItem = {id: "id-test", href: "test.xhtml", 'media-type': "application/xhtml+xml"}
const spineItem = {idref:"id-test"}


// decompressEpub(epubPath, extractFolder);
// modifyOPF(epubPath, manifestItem, spineItem)
// modifyTOC(epubPath)
// moveFilesToFolder("templates/test.xhtml", "extracted/okakura/OEBPS/test.xhtml")
compressToEpub("eggs");
