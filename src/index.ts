import { modifyEpub, compressToEpub, decompressEpub } from "./utils/zipping.js";



const filePath = "./epub-files/okakura-book-of-tea.epub";
const extractFolder = "extracted/okakura";
const manifestItem = {id: "id-test", href: "test.xhtml", 'media-type': "application/xhtml+xml"}
const spineItem = {idref:"id-test"}


// decompressEpub(filePath, extractFolder);
modifyEpub(filePath, manifestItem, spineItem)
// compressToEpub("okakura");
