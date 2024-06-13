import { modifyOPF, insertTOCFiles, zipToEpub } from "./utils/zipping.js";
import { getChapterCount } from "./utils/chapterHandling.js";
import { getTops, OTHERS, DESCRIPTIONS } from "../templates/scripts/utils.js";
import chaptersOccurences from "../templates/chapterInstances/stackedData.json" assert { type: "json" };
import { epubPath, extractedFolder } from "./prepare-epub.js";

const FILENAMEENTITY = "future-toc-entity";
const ENDID = "-1";

const compressFolder = "TOC added to EPUB";

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
    idref: `${FILENAMEENTITY}-${i + 1}`,
    linear: "no",
  });
  manifestItems.push({
    id: `${FILENAMEENTITY}-${i + 1}`,
    href: `${FILENAMEENTITY}-${i + 1}.xhtml`,
    "media-type": "application/xhtml+xml",
  });
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

for (let i = 0; i < chapterCount; i++) {
  spineItemsExtra.push({
    idref: `future-toc-chapter-${i + 1}${ENDID}`,
    linear: "no",
  });
  manifestItems.push({
    id: `future-toc-chapter-${i + 1}${ENDID}`,
    href: `future-toc-chapter-${i + 1}${ENDID}.xhtml`,
    "media-type": "application/xhtml+xml",
  });
}

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
