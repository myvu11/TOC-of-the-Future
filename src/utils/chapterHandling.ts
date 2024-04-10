import { getFileContent, getFilePaths } from "./zipping.js";
import { parse } from "node-html-parser";
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { writeFileSync } from "fs";
import { gptGetCharacters } from "./gpt-characters.js";

// source - words per minute: wwww.thereadtime.com
const Words_Per_Minute: Record<string, number> = {
  slow: 100,
  average: 183,
  fast: 260,
};

// get all chapter path anmes
function getChapterFilePaths(epubPath: string) {
  const paths = getFilePaths(epubPath, "OEBPS", "html");
  const chapterPaths = paths.filter(
    (path) =>
      !path.toLowerCase().includes("cover") ||
      !path.toLowerCase().includes("index") ||
      !path.toLowerCase().includes("toc") ||
      !path.toLowerCase().includes("wrap")
  );
  return chapterPaths;
}

// extract the text content from a html file
function getTextFromXHTML(html: string) {
  const parsed = parse(html);
  if (parsed === null || parsed === undefined) {
    console.log("Failed to get text");
    return "";
  }

  const firstChild = parsed?.firstChild?.innerText ?? "";
  console.log("FIRST:", firstChild);
  const content = parsed?.structuredText;
  const text = content.replace(firstChild, " ");
  // const innerText = parsed?.innerText;
  // console.log("innerText", innerText)
  // console.log("content", content)
  return text;
}

// get the time of reading a given text
function getReadingDuration(text: string, pace: string = "average") {
  const wordCount = text.trim().split(/\s+/).length;
  return wordCount / Words_Per_Minute[pace];
}

// convert time duration in minutes to hours
function formatTime(duration: number) {
  if (duration > 60) {
    const time = Math.round(duration / 60);
    const unit = time === 1 ? " hour" : " hours";
    return time.toString() + unit;
  }
  const time = Math.round(duration);
  const minuteUnit = time === 1 ? " minute" : " minutes";
  return time.toString() + minuteUnit;
}

function extractChapterText(epubPath: string, extractedPath: string) {
  const chapterPaths = getChapterFilePaths(epubPath);
  const chapterTexts: Record<string, string>[] = [];
  for (let i = 0; i < chapterPaths.length; i++) {
    const chapterText = fs.readFileSync(
      extractedPath + "/" + chapterPaths[i],
      "utf-8"
    );
    const text = getTextFromXHTML(chapterText);

    chapterTexts.push({ title: chapterPaths[i], text: text });
  }
  return chapterTexts;
}

// get number of chapters
export function getChapterCount(epubPath: string) {
  return getChapterFilePaths(epubPath).length;
}

// get the reading time of each chapter in epub file
export function getReadingTimeChapters(
  epubPath: string,
  extractedPath: string
) {
  const chapterPaths = getChapterFilePaths(epubPath);
  const readingTimeChapters: Record<string, string> = {};
  for (let i = 0; i < chapterPaths.length; i++) {
    const chapterText = fs.readFileSync(
      extractedPath + "/" + chapterPaths[i],
      "utf-8"
    );
    const text = getTextFromXHTML(chapterText);
    const readingTime = text ? getReadingDuration(text) : 0;
    readingTimeChapters[chapterPaths[i]] = formatTime(readingTime);
  }
  return readingTimeChapters;
}


function saveChaptersToFile(epubPath: string, extractedFolder: string) {
  const chapters = extractChapterText(epubPath, extractedFolder);
  console.log("chapters", chapters.length);
  for (let i = 0; i < chapters.length; i++) {
    const fileName = chapters[i]["title"]
      .replace("OEBPS/", "")
      .replace(".html", "")
      .replace(".xhtml", "");
    const dest = "src/chapters/" + fileName + ".txt";
    writeFileSync(dest, chapters[i].text);
  }
}


function saveCharactersToFile() {
  const chapterTextList = fs.readdirSync("./src/chapters")
  for(let i = 0; i < chapterTextList.length; i++) {
    const text = fs.readFileSync("./src/chapters/" + chapterTextList[i], 'utf-8')
    const fileName = chapterTextList[i].replace('.txt', '.ts')
    gptGetCharacters(text)
      .then(characters => {
        if(characters === null) {
          return console.log("No characters")
        }
        fs.writeFileSync('src/named-entities/' + fileName, characters)
      })
      .catch(err => console.log(err.code))
  }

}

export function chapterHandler() {
  saveCharactersToFile()
}
