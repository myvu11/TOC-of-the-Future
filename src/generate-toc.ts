import { generateTOC } from "./utils/generateTOC.js";
import { decompressEpub } from "./utils/zipping.js";
import { chapterHandler } from "./utils/chapterHandling.js";
import { sectionHandler } from "./utils/sectionHandlling.js";

export const epubPath =
  "./epub-files/steinbeck-of-mice-and-men - Epubbooks.epub";
export const extractedFolder = "./extracted/steinbeck - epubbooks";
export const folderName = "steinbeck/";

decompressEpub(epubPath, extractedFolder);
chapterHandler(epubPath, extractedFolder, folderName);
sectionHandler(folderName);
generateTOC(epubPath);
