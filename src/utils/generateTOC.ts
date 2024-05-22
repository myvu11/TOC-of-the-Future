import { copyFilesToFolder, getFileContent } from "./zipping.js";
import { getChapterCount, getChapterFilePaths } from "./chapterHandling.js";
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import chaptersOccurences from "../../templates/chapterInstances/steinbeck.json" assert { type: "json" };
import { getTops, OTHERS, DESCRIPTIONS } from "../../templates/scripts/utils.js"


const NAMEID = "future-toc-entity-";
const LEGENDID = "future-toc-entity-legend-";
const CHAPTER = "future-toc-chapter";
const ENDID = "-1";

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

  const parsingOptions = {
    ignoreAttributes: false,
    preserveOrder: true,
    unpairedTags: ["hr", "br", "link", "meta"],
    stopNodes : [ "*.pre", "*.script"],
    processEntities: true,
    htmlEntities: true
  };
  const parser = new XMLParser(parsingOptions);
  const parsed = parser.parse(xmlData);

  for (let i = 0; i < chapterPaths.length; i++) {
    const obj = parsed;
    // console.log("obj", obj)
    // console.log("obj.0.html[1] -> ", obj['0'].html[0].head[2])
    // console.log("obj.0.html[1] -> ", obj['0'].html[1].body[0])
    // console.log("obj.0.html[1] -> ", obj['0'].html[1].body[0].h2[0][":@"])
    // console.log("obj['0'].html[1].body -> ", obj['0'].html[1].body)
    // console.log("obj['0'].html[1].body[0] -> ", obj['0'].html[1].body[0])
    console.log("obj['0'].html[1].body[1] -> ", obj['0'].html[1].body[1])
    console.log("obj['0'].html[1].body[1] -> ", obj['0'].html[1].body[1].div[1])
    // console.log("obj['0'].html[1].body[2] -> ", obj['0'].html[1].body[2])
    // console.log("obj.0.html[1] -> ", obj['0'].html[1].body[2].div[0].div[1][":@"]["@_id"])
    // console.log("obj.0.html[1] -> ", obj['0'].html[1].body[0].div[1].h2[0][":@"])

    // preserveorder
    obj['0'].html[0].head[2].title[0]["#text"] = `Chapter ${i + 1}`;
    obj['0'].html[1].body[0].h2[0][":@"]["@_href"] = chapterPaths[i].replace("OEBPS/", "")
    obj['0'].html[1].body[0].h2[0]["a"][0]["#text"] = `Chapter ${i + 1}`
    obj['0'].html[1].body[1].div[1][":@"]["@_href"] = `${CHAPTER}-${i+1}${ENDID}.xhtml`
    obj['0'].html[1].body[2].div[0].div[0][":@"]["@_id"] = `future-toc-legend-ch-${i + 1}`;
    obj['0'].html[1].body[2].div[0].div[1][":@"]["@_id"] = `${CHAPTER}-${i + 1}`;

    const content = [{ "!DOCTYPE html": "" }, obj[0]];
    // console.log("content", content)

    const builderOptions = {
      ignoreAttributes: false,
      format: true,
      preserveOrder: true,
      // suppressEmptyNode: true,
      // unpairedTags: ["hr", "br", "link", "meta"],
      stopNodes : [ "*.pre", "*.script"],
    }

    const builder = new XMLBuilder(builderOptions);
    const xmlContent = builder
      .build(content)
      .replace("</!DOCTYPE html>", "")
      .replace("></link>", "/>")
      .replace("></link>", "/>")
      .replace("></input>", "/>")
      .replace("></img>", "/>");

    // console.log("xmlContent", xmlContent)
    fs.writeFileSync(
      `templates/html/${CHAPTER}-${i + 1}.xhtml`,
      xmlContent
    );
  }
}

function generateHTMLFilesChaptersPart2(sourceFile: string, chapterPaths: string[]) {
  const xmlData = fs.readFileSync(sourceFile, "utf-8");
  console.log("xml read")
  const parsingOptions = {
    ignoreAttributes: false,
    preserveOrder: true,
    unpairedTags: ["hr", "br", "link", "meta"],
    stopNodes : [ "*.pre", "*.script"],
    processEntities: true,
    htmlEntities: true
  };
  const parser = new XMLParser(parsingOptions);
  const parsed = parser.parse(xmlData);

  for (let i = 0; i < chapterPaths.length; i++) {
    const obj = parsed;
    // console.log("obj", obj)
    // console.log("obj.0.html[1] -> ", obj['0'].html[0].head[2])
    // console.log("obj.0.html[1] -> ", obj['0'].html[1].body[2].div[0])
    // console.log("obj.0.html[1].bodu[2] -> ", obj['0'].html[1].body)
    // console.log("obj.0.html[1] -> ", obj['0'].html[1].body[0].div[1].h2[0][":@"])
    // console.log("obj.input", obj['0'].html[1].body[1])
    // console.log("obj.body", obj['0'].html[1].body)
    // console.log("obj.input", obj['0'].html[1].body[1].div[1])

    // preserveorder
    obj['0'].html[0].head[2].title[0]["#text"] = `Chapter ${i + 1}`;
    obj['0'].html[1].body[0].h2[0][":@"]["@_href"] = chapterPaths[i].replace("OEBPS/", "")
    obj['0'].html[1].body[0].h2[0]["a"][0]["#text"] = `Chapter ${i + 1}`
    obj['0'].html[1].body[1].div[1][":@"]["@_href"] = `${CHAPTER}-${i+1}.xhtml`
    obj['0'].html[1].body[1].div[1].a[1][":@"] = {...obj['0'].html[1].body[1].div[1].a[1][":@"], '@_checked': "true"}
    obj['0'].html[1].body[2].div[0].div[0][":@"]["@_id"] = `future-toc-legend-ch-${i + 1}${ENDID}`;
    obj['0'].html[1].body[2].div[0].div[1][":@"]["@_id"] = `${CHAPTER}-${i + 1}${ENDID}`;

    const content = [{ "!DOCTYPE html": "" }, obj[0]];
    console.log("content", content)

    const builderOptions = {
      ignoreAttributes: false,
      format: true,
      preserveOrder: true,
      // suppressEmptyNode: true,
      // unpairedTags: ["hr", "br", "link", "meta"],
      stopNodes : [ "*.pre", "*.script"],
    }

    const builder = new XMLBuilder(builderOptions);
    const xmlContent = builder
      .build(content)
      .replace("</!DOCTYPE html>", "")
      .replace("></link>", "/>")
      .replace("></link>", "/>")
      .replace("></input>", "/>")
      .replace("></img>", "/>");

    // console.log("xmlContent", xmlContent)
    fs.writeFileSync(
      `templates/html/${CHAPTER}-${i + 1}-1.xhtml`,
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
  const chapterPaths = getChapterFilePaths(epubPath);
  // getReadingTimeFromChapters(epubPath, extractedFolder);
  // insertHead(epubPath, "generated-toc/toc.xhtml")

  generateHTMLFilesChapters(
    "templates/html/future-toc-chapter-base.xhtml",
    chapterPaths
  );

  generateHTMLFilesChaptersPart2("templates/html/future-toc-chapter-base.xhtml",
  chapterPaths);

  // generateHTMLFilesOverview("templates/html/future-toc.xhtml")
}
