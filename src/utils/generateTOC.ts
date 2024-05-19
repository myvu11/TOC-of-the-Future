import { copyFilesToFolder, getFilePaths, getFileContent } from "./zipping.js";
import { getReadingTimeChapters, getChapterCount } from "./chapterHandling.js";
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";



// insert ebooks html head to toc template
function insertHead(epubPath: string, destination: string) {
    const xmlData = getFileContent(epubPath, "OEBPS", ".xhtml", "")
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
    copyFilesToFolder("templates/html/future-toc.xhtml", "generated-toc", "future-toc.xhtml")
    copyFilesToFolder("templates/scripts/future-toc.ts", "generated-toc", "future-toc.ts")
    copyFilesToFolder("templates/style/future-toc.css", "generated-toc/style", "future-toc.css")
}

function generateHTMLFilesChapters(sourceFile: string, chapterCount:number) {
    const xmlData = fs.readFileSync(sourceFile, "utf-8");
    const options = {
        ignoreAttributes: false,
        preserveOrder: false,
        format: true,
        suppressEmptyNode: false,
        attrValueProcessor: true
      };
    const parser = new XMLParser(options);
    const parsed = parser.parse(xmlData);

    for(let i = 0; i < chapterCount; i++) {
        const obj = parsed;
        obj.html.head.title = `Chapter ${i+1}`;
        obj.html.body.h2 = `Chapter ${i+1}`;
        const div = obj.html.body.div.div.div;

        for(let j = 0; j < div.length; j++) {
            const element = div[j]['@_id']
            console.log("element", element)
            if(element.startsWith(`future-toc-legend-ch-`)) {
                obj.html.body.div.div.div[j]['@_id'] = `future-toc-legend-ch-${i+1}`
            }
            if(element.startsWith(`future-toc-chapter-`)) {
                obj.html.body.div.div.div[j]['@_id'] = `future-toc-chapter-${i+1}`
            }
        }

        const content = Object.assign({"!DOCTYPE html": ""}, obj);
        const builder = new XMLBuilder(options);
        const xmlContent = builder.build(content).replace("</!DOCTYPE html>", "").replace("></link>", "/>").replace("></link>", "/>");


        fs.writeFileSync(`templates/html/future-toc-chapter-${i+1}.xhtml`, xmlContent)
    }

}


export function generateTOC(epubPath: string) {
    copyTemplates();
    const chapterCount = getChapterCount(epubPath);
    // insertChapterCount(chapterCount);
    // reading time
    // getReadingTimeFromChapters(epubPath, extractedFolder);
    // insertHead(epubPath, "generated-toc/toc.xhtml")

    generateHTMLFilesChapters("templates/html/future-toc-chapter-base.xhtml", chapterCount);

}
