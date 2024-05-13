import fs from "node:fs";
import { gptGetChapterSections } from "./gpt-chapter-sections.js";
import { indexMentions, indexingNoMentions, strToSentence } from "./textUtils.js";


type SectionTitle = {"sectionID": string, "sectionTitle": string}
type SectionOccurence = {
  "sectionID": number, "name": string, "index": number
}

type ChapterSections = {
  sectionTitles: { sectionID: string; sectionTitle: string }[];
  sectionOccurence: {
    sectionID: number;
    name: string;
    index: number;
  }[];
};

type ChapterOccurence = {
  chapter: string,
  occurenceSet: ChapterSections[]
}


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
  function chapterToSections(folderName:string) {
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

  function getChapterSectionOccurence(folderName: string, targetFolder: string) {
    const file = fs.readFileSync("./src/" + folderName + "/chapter-sections.json", "utf-8");
    const chapterSectionsList = JSON.parse(file);
    const entityList = fs.readdirSync("./src/" + folderName + "/named-entities");
    const allChapters: ChapterOccurence[] = [];


    // get occurence for each sections in each chapter
    for(let i = 0; i <chapterSectionsList.length; i++) {
      const occurenceSet: ChapterSections[] = [];
      const nameStr = fs.readFileSync(
        "./src/" + folderName + "/named-entities/" + entityList[i],
        "utf-8"
      );
      const characters = JSON.parse(nameStr).characters;
      const sections = chapterSectionsList[i].sections;
      const sectionOccurence: SectionOccurence[] = [];
      const sectionTitles: SectionTitle[] = [];

      for(let j = 0; j < sections.length; j++) {
        sectionTitles.push({
          "sectionID": `${sections[j].sectionID}`, sectionTitle: sections[j].sectionTitle
        })

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

        const currentSection = sectionOccurence.filter(obj => obj.sectionID === j+1)
        const noMentions = indexingNoMentions(sections[j].text, currentSection)
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
      allChapters.push({"chapter": `${i+1}`, "occurenceSet": occurenceSet})

    }
    const occurenceSetJSON = JSON.stringify(allChapters);
    fs.writeFileSync(targetFolder + "BookOccurence" + ".json", occurenceSetJSON)
  }

  export function sectionHandler(folderName:string) {
    // saveChapterSectionTitles(folderName)
    // chapterToSections(folderName)
    getChapterSectionOccurence(folderName, "templates/chapterInstances/")
  }
