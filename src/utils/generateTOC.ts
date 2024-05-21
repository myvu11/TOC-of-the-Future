import { copyFilesToFolder, getFileContent } from "./zipping.js";
import { getChapterCount, getChapterFilePaths } from "./chapterHandling.js";
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import chaptersOccurences from "../../templates/chapterInstances/steinbeck.json" assert { type: "json" };
import { getTops, OTHERS, DESCRIPTIONS } from "../../templates/scripts/utils.js"


const NAMEID = "future-toc-entity-";
const LEGENDID = "future-toc-entity-legend-";

interface ChapterOccurence {
  chapterTitle: string;
  sentenceCount: number;
  characters: {
    name: string;
    occurence: number[];
  }[];
  locations: {
    name: string;
    occurence: number[];
  }[];
  description: number[];
}


// insert ebooks html head to toc template
function insertHead(epubPath: string, destination: string) {
  const xmlData = getFileContent(epubPath, "OEBPS", ".xhtml", "");
  if (!xmlData) {
    return "No xmlData";
  }
  const options = {
    ignoreAttributes: false,
    // preserveOrder: true,
    suppressEmptyNode: true,
    format: true,
  };

  const parser = new XMLParser(options);
  const obj = parser.parse(xmlData);
  // console.log("obj", obj)
  const head = obj.html.head;
  // console.log("html", head)

  const destData = fs.readFileSync(destination);
  const destObj = parser.parse(destData);
  console.log("dest", destObj);
  destObj.html["head"] = head;
  // console.log("after splice", destObj)

  const builder = new XMLBuilder(options);
  const xmlContent = builder.build(destObj);
  fs.writeFileSync(destination, xmlContent);
}

function copyTemplates() {
  copyFilesToFolder(
    "templates/html/future-toc.xhtml",
    "generated-toc",
    "future-toc.xhtml"
  );
  copyFilesToFolder(
    "templates/scripts/future-toc.ts",
    "generated-toc",
    "future-toc.ts"
  );
  copyFilesToFolder(
    "templates/style/future-toc.css",
    "generated-toc/style",
    "future-toc.css"
  );
}

function generateHTMLFilesChapters(sourceFile: string, chapterPaths: string[]) {
  const xmlData = fs.readFileSync(sourceFile, "utf-8");
  const options = {
    ignoreAttributes: false,
    preserveOrder: false,
    format: true,
    suppressEmptyNode: false,
    attrValueProcessor: true,
  };
  const parser = new XMLParser(options);
  const parsed = parser.parse(xmlData);

  for (let i = 0; i < chapterPaths.length; i++) {
    const obj = {...parsed};
    console.log("obj", obj.html.body.h2.a)
    obj.html.head.title = `Chapter ${i + 1}`;
    obj.html.body.h2.a["@_href"] = chapterPaths[i].replace("OEBPS/", "")
    obj.html.body.h2.a["#text"] = `Chapter ${i + 1}`
    const div = obj.html.body.div.div.div;
    console.log("obj after", obj.html.body.h2.a)

    for (let j = 0; j < div.length; j++) {
      const element = div[j]["@_id"];
      console.log("element", element);
      if (element.startsWith(`future-toc-legend-ch-`)) {
        obj.html.body.div.div.div[j]["@_id"] = `future-toc-legend-ch-${i + 1}`;
      }
      if (element.startsWith(`future-toc-chapter-`)) {
        obj.html.body.div.div.div[j]["@_id"] = `future-toc-chapter-${i + 1}`;
      }
    }

    const content = Object.assign({ "!DOCTYPE html": "" }, obj);
    const builder = new XMLBuilder(options);
    const xmlContent = builder
      .build(content)
      .replace("</!DOCTYPE html>", "")
      .replace("></link>", "/>")
      .replace("></link>", "/>");

    fs.writeFileSync(
      `templates/html/future-toc-chapter-${i + 1}.xhtml`,
      xmlContent
    );
  }
}

function generateHTMLFilesOverview(sourceFile: string) {
  const xmlData = fs.readFileSync(sourceFile, "utf-8");
  const options = {
    ignoreAttributes: false,
    preserveOrder: false,
    format: true,
    suppressEmptyNode: false,
    attrValueProcessor: true,
  };
  const parser = new XMLParser(options);
  const parsed = parser.parse(xmlData);
  const topCharacters = getTops(chaptersOccurences);
  const entities = [...topCharacters, OTHERS, DESCRIPTIONS];

  for(let i = 0; i < entities.length; i++) {
    const obj = {...parsed}

    const div = obj.html.body.div.div.div
    div.forEach((e:any, index:number) => {
      if(e["@_id"].startsWith(`${LEGENDID}`)) {
        obj.html.body.div.div.div[index]["@_id"] = `${LEGENDID}${i+1}`;
      }
      else if(e["@_id"].startsWith(`${NAMEID}`)) {
        obj.html.body.div.div.div[index]["@_id"] = `${NAMEID}${i+1}`;
      }
    })

    const content = Object.assign({ "!DOCTYPE html": "" }, obj);
    const builder = new XMLBuilder(options);
    const xmlContent = builder
      .build(content)
      .replace("</!DOCTYPE html>", "")
      .replace("></link>", "/>")
      .replace("></link>", "/>");

    fs.writeFileSync(
      `templates/html/future-toc-entity-${i + 1}.xhtml`,
      xmlContent
    );
  }
}

export function generateTOC(epubPath: string) {
  // const chapterCount = getChapterCount(epubPath);
  // const chapterPaths = getChapterFilePaths(epubPath);
  // console.log("paths", chapterPaths)
  // insertChapterCount(chapterCount);
  // getReadingTimeFromChapters(epubPath, extractedFolder);
  // insertHead(epubPath, "generated-toc/toc.xhtml")

  // generateHTMLFilesChapters(
  //   "templates/html/future-toc-chapter-base.xhtml",
  //   chapterPaths
  // );
  generateHTMLFilesOverview("templates/html/future-toc.xhtml")
}
