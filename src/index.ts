import { generateTOC } from "./utils/generateTOC.js";
import {
  modifyOPF,
  decompressEpub,
  insertTOCFiles,
  zipToEpub,
} from "./utils/zipping.js";
import {
  chapterHandler,
  getChapterCount,
} from "./utils/chapterHandling.js";
import { sectionHandler } from "./utils/sectionHandlling.js";
import { getTops, OTHERS, DESCRIPTIONS } from "../templates/scripts/utils.js"
import chaptersOccurences from "../templates/chapterInstances/steinbeck.json" assert { type: "json" };

const FILENAMEENTITY = "future-toc-entity";
const FILENAMECHAPTER = "future-toc-echapter";

// const epubPath = "./epub-files/okakura-book-of-tea.epub";
// const epubPath = "./epub-files/Alice's Adventure in Wonderland by Lewis Carroll - Project Gutenberg.epub";
// const epubPath = "./epub-files/Oliver Twist by Charles Dickens - Project Gutenberg.epub";
// const epubPath = "./epub-files/Austen, Jane - Pride and Prejudice.epub";
// const epubPath = "./epub-files/jane-austen_pride-and-prejudice - standardebooks.epub"
const epubPath = "./epub-files/steinbeck-of-mice-and-men - Epubbooks.epub";
// const epubPath = "./epub-files/lewis-prince-caspian - Epubbooks.epub";

// const extractedFolder = "extracted/okakura";
// const extractedFolder ='extracted/austen - pocketbook'
// const extractedFolder ='extracted/carroll - gutenberg'
// const extractedFolder ='extracted/lewis - epubbooks'
// const extractedFolder = "./extracted/austen - standardebooks";
const extractedFolder = "./extracted/steinbeck - epubbooks";

// const compressFolder = "austen"
// const compressFolder = "carroll"
const compressFolder = "steinbeck8-chapterinstance-legend-choice";
const folderName = "steinbeck/";

const manifestItems = [
  { id: "future-toc-css", href: "future-toc.css", "media-type": "text/css" },
  {
    id: "future-toc-svg-css",
    href: "future-svg.css",
    "media-type": "text/css",
  },
  {
    id: "future-toc-script",
    href: "future-toc.js",
    "media-type": "text/javascript",
  },
  {
    id: "future-toc",
    href: "future-toc.xhtml",
    "media-type": "application/xhtml+xml",
  },
];

const spineItem = { idref: "future-toc", linear: "yes" };
const spineItemsExtra: { idref: string; linear: string }[] = [];
let opfFile = "package.opf";
const topCharacters = getTops(chaptersOccurences);
const entities = [...topCharacters, OTHERS, DESCRIPTIONS];

// generate list of entity xhtml to be inserted in opf-file
for (let i = 0; i < entities.length; i++) {
  spineItemsExtra.push({
    idref: `${FILENAMEENTITY}-${i+1}`,
    linear: "no"
  })
  manifestItems.push({
    id: `${FILENAMEENTITY}-${i+1}`,
    href: `${FILENAMEENTITY}-${i+1}.xhtml`,
    "media-type": "application/xhtml+xml",
  })
}
// generate list of chapter xhtml to be inserted in opf-file
const chapterCount = getChapterCount(epubPath);
for (let i = 0; i < chapterCount; i++) {
  spineItemsExtra.push({
    idref: `future-toc-chapter-${i + 1}`,
    linear: "no",
  });
  manifestItems.push({
    id: `future-toc-chapter-${i + 1}`,
    href: `future-toc-chapter-${i + 1}.xhtml`,
    "media-type": "application/xhtml+xml",
  });
}




// decompressEpub(epubPath, extractedFolder);
// generateTOC(epubPath)

// chapterHandler(epubPath, extractedFolder)
// sectionHandler(folderName)

const run = async () => {
  await insertTOCFiles(extractedFolder);

  modifyOPF(
    epubPath,
    manifestItems,
    spineItem,
    spineItemsExtra,
    extractedFolder + "/OEBPS/" + opfFile
  );

  zipToEpub(extractedFolder, compressFolder);
};

run();
