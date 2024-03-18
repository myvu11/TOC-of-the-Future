import { getFilePaths } from "./zipping.js";
import { parse } from 'node-html-parser';
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";



// source - words per minute: wwww.thereadtime.com
const wordsPerMinute: Record <string,number> = {slow: 100, average: 183, fast: 260}

// get all chapter path anmes
function getChapterFilePaths(epubPath:string) {
    const paths = getFilePaths(epubPath, "OEBPS", "html")
    console.log("path", paths[0])
    isChapter(paths[0])
    // for(let i = 0; i < getFilePaths.length; i++) {

    // }
    return paths
}

// extract the text content from a html file
function getTextFromXHTML(html:string) {
    const parsed = parse(html);
    if(parsed === null || parsed === undefined) {
        console.log("Failed to get text")
        return
    }

    const firstChild = parsed?.firstChild?.innerText ?? ""
    const innerText = parsed?.innerText
    const content = innerText.replace(firstChild, "")
    return content
};

// check if file is a chapter
function isChapter(xmlData:string) {

    const options = {
        ignoreAttributes: false,
        // preserveOrder: true,
        suppressEmptyNode: true,
        format: true,
    };
    const parser = new XMLParser(options);

    let obj = parser.parse(xmlData);
    console.log("obj", obj)
}


// get the time of reading a given text
function getReadingDuration(text: string, pace: string = "average") {
    const wordCount = text.trim().split(/\s+/).length;
    return wordCount / wordsPerMinute[pace]
}

// convert time duration in minutes to hours
function formatTime(duration: number) {
    if(duration > 60) {
        const time = Math.round(duration / 60)
        const unit = time === 1 ? " hour" : " hours"
        return time.toString() + unit
    }
    const time = Math.round(duration)
    const minuteUnit = time === 1 ? " minute" : " minutes"
    return time.toString() + minuteUnit
}




export function getChapterCount(epubPath: string) {
    return getChapterFilePaths(epubPath).length
}

// get the reading time of each chapter in epub file
export function getReadingTimeChapters(epubPath: string, extractedPath: string) {
    const chapterPaths = getChapterFilePaths(epubPath)
    const readingTimeChapters: Record<string,string> = {}
    for(let i = 0; i < chapterPaths.length; i++) {
        const chapterText = fs.readFileSync(extractedPath +  "/" + chapterPaths[i], "utf-8")
        const text = getTextFromXHTML(chapterText)
        const readingTime = text ? getReadingDuration(text) : 0
        readingTimeChapters[chapterPaths[i]] = formatTime(readingTime)
    }
    return readingTimeChapters
}
