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

// get the mentions of no names
export function indexNoMentions(text: string[], characters: Record<string, string>[]) {
    const instances: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const mentions = characters.map(character =>
        // console.log("name", character.name)
        !(text[i].includes(character.name)) && !(text[i].includes(character.name.toLowerCase()))
      )

      if(mentions.every(v => v === true)) {
        instances.push(i + 1);
      }

    }
    return instances;
  }
