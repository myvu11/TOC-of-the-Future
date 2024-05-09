import fs from "node:fs";
import { gptGetChapterSections } from "./gpt-chapter-sections.js";
import { indexMentions, indexNoMentions, strToSentence } from "./textUtils.js";


// save chapter's section titles to tile
function saveChapterSectionTitles(folderName:string) {
    const chapterTextList = fs.readdirSync("./src/" + folderName + "chapters");
    const chapterSections: Record<string, string | number>[] = [];
    for (let i = 0; i < chapterTextList.length; i++) {
      const text = fs.readFileSync(
        "./src/" + folderName + "chapters/" + chapterTextList[i],
        "utf-8"
      );
      const fileName = chapterTextList[i].replace(".txt", "");

      gptGetChapterSections(text)
        .then((response) => {
          if (response === null) {
            return console.log("No sections");
          }
          const sections: Record<string, string|number> = Object(response);
          chapterSections.push({[`chapter ${i+1}`]: fileName, ...sections});
          console.log("chapterSeciton", chapterSections)
        })
        .catch((err) => console.log(err.code));
    }
    return chapterSections;
  }

  // divide the chapters into sections and save to file
  function chapterIntoSections(folderName:string) {
    const sectionsJSON = fs.readFileSync(
      "./src/" + folderName + "section-titles.json",
      "utf-8"
    );
    const chapterSectionTitles = JSON.parse(sectionsJSON);
    const sectioning: Record<string, string | Record<string, number | string>[]>[] = [];

    const chapterTextList = fs.readdirSync("./src/" + folderName + "chapters");
    for (let i = 0; i < chapterTextList.length; i++) {
      const text = fs.readFileSync(
        "./src/" + folderName + "chapters/" + chapterTextList[i],
        "utf-8"
      );
      const sentences = strToSentence(text);
      const sections = chapterSectionTitles[i].sections
      const sectionsCount = sections.length;

      const chunkIntoN = (arr:string[], n:number) => {
        const size = Math.ceil(arr.length / n);
        return Array.from({ length: n }, (_, i) =>
          arr.slice(i * size, i * size + size)
        );
      }

      const textSections = chunkIntoN(sentences, sectionsCount)

      for(let j = 0; j < textSections.length; j++) {
        sections[j].text = textSections[j]
      }
      // console.log("sections", sections)
      sectioning.push({
        title: `chapter ${i+1}`,
        sections
      })
    }
    const sectioningJSON = JSON.stringify(sectioning)
    fs.writeFileSync("src/steinbeck/chapter-sections.json", sectioningJSON)
  }

  function getChapterSectionOccurence(folderName: string, target: string) {
    const file = fs.readFileSync("./src/" + folderName + "/chapter-sections.json", "utf-8");
    const chapterSectionsList = JSON.parse(file);
    const entityList = fs.readdirSync("./src/" + folderName + "/named-entities");
    const occurenceSet: Record<string, Record<string, number | string | string>[]>[] = [];

    // go through each chapter and their sections
    for(let i = 0; i < 1; i++) {
      const nameStr = fs.readFileSync(
        "./src/" + folderName + "/named-entities/" + entityList[i],
        "utf-8"
      );
      const characters = JSON.parse(nameStr).characters;
      const sections = chapterSectionsList[i].sections;
      const sectionOccurence: Record<string, number | string>[] = [];
      const sectionTitles: Record<string, string>[] = [];

      for(let j = 0; j < sections.length; j++) {
        sectionTitles.push({
          ["sectionID"]: `${sections[j].sectionID}`, sectionTitle: sections[j].sectionTitle
        })
        const noMentions = indexNoMentions(sections[j].text, characters)
        for(let k = 0; k < characters.length; k++) {
          const mentions = indexMentions(sections[j].text, characters[k].name)
          mentions.occurence.forEach( occur => {
            sectionOccurence.push({
              sectionID: sections[j].sectionID,
              name: mentions.name,
              index: occur
            })
          })
        }
        noMentions.forEach( occur => {
          sectionOccurence.push({
            sectionID: sections[j].sectionID,
            name: "no mentionings",
            index: occur
          })
        })
      }
      occurenceSet.push({
        sectionTitles,
        sectionOccurence
      })
    }
    const occurenceSetJSON = JSON.stringify(occurenceSet);
    fs.writeFileSync(target, occurenceSetJSON)
  }

  export function sectionHandler(folderName:string) {
    // saveChapterSectionTitles(folderName)
    // chapterIntoSections(folderName)
    getChapterSectionOccurence(folderName, "templates/chapterInstances/sectionInstance.json")
  }
