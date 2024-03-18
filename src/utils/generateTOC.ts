import { copyFilesToFolder, getFilePaths, findFile } from "./zipping.js";
import { getReadingTimeChapters, getChapterCount } from "./chapterHandling.js";
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";



// insert ebooks html head to toc template
function insertHead(epubPath: string, destination: string) {
    const xmlData = findFile(epubPath, "OEBPS", ".xhtml", "")
    if(!xmlData) {
        return "No xmlData"
    }
    const options = {
        ignoreAttributes: false,
        // preserveOrder: true,
        suppressEmptyNode: true,
        format: true,
      };

    const parser = new XMLParser(options);
    const obj = parser.parse(xmlData)
    // console.log("obj", obj)
    const head = obj.html.head
    // console.log("html", head)

    const destData = fs.readFileSync(destination)
    const destObj = parser.parse(destData)
    console.log("dest", destObj)
    destObj.html["head"] = head
    // console.log("after splice", destObj)

    const builder = new XMLBuilder(options);
    const xmlContent = builder.build(destObj);
    fs.writeFileSync(destination, xmlContent);

}

function insertChapterCount(chapterCount: number) {
    const targetFile = "generated-toc/toc.ts"
    const seperator = "\r\n"
    const file = fs.readFileSync(targetFile, 'utf-8')
    const lines = file.split(seperator)
    const target = "const chapterCount = ";
    const targetIdx = lines.reduce((acc, line, i, _) => {
        return line.startsWith(target) ? i : acc
    }, -1)

    lines.splice(targetIdx, 1, target + chapterCount.toString() + ";");

    const modifiedFile = lines.join(seperator)

    fs.writeFile(targetFile, modifiedFile, error => {console.log(error)})
}

function copyTemplates() {
    copyFilesToFolder("templates/html/toc.xhtml", "generated-toc", "toc.xhtml")
    copyFilesToFolder("templates/scripts/toc.ts", "generated-toc", "toc.ts")
    copyFilesToFolder("templates/style/toc.css", "generated-toc/style", "toc.css")
}



export function generateTOC(epubPath: string) {
    // copyTemplates();
    // const chapterCount = getChapterCount(epubPath);
    // insertChapterCount(chapterCount);
    // reading time
    // getReadingTimeFromChapters(epubPath, extractedFolder);

    // insertHead(epubPath, "generated-toc/toc.xhtml")
}
