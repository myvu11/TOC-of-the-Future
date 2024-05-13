type SectionOccurence = {
  "sectionID": number, "name": string, "index": number
}

// identify a sentence from a string
export function strToSentence(str: string) {
    return str.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
  }

  // get the mentions of a name
export function indexMentions(text: string[], name: string) {
    const instances: number[] = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i].includes(name) || text[i].includes(name.toLowerCase())) {
        instances.push(i + 1);
      }
    }
    return { name: name, occurence: instances };
  }

export function indexingNoMentions(text: string[], sectionOccurence: SectionOccurence[]) {
  const instances: number[] = [];
  text.forEach((_, i) => {
    const instance = sectionOccurence.filter(obj => obj.index === (i+1))
    if(instance.length === 0) {
      instances.push(i+1);
    }
  })
  return instances
}
