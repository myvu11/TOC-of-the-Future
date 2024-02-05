import { modifyEpub, compressToEpub, decompressEpub } from "./utils/zipping.js";



const filePath = "./epub-files/okakura-book-of-tea.epub";
const extractFolder = "extracted/okakura";
const manifestItem = "<item id=\"id-test\" href=\"test.xhtml\" media-type=\"application/xhtml+xml\"/>"
const spineItem = "<itemref idref=\"id-test\"/>"


// decompressEpub(filePath, extractFolder);
modifyEpub(filePath, manifestItem, spineItem)
// compressToEpub("okakura");
