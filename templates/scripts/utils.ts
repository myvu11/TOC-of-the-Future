import * as d3 from "d3";

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

export const OTHERS = "secondary";
export const DESCRIPTIONS = "no entity";
const numberOfMains = 4;


const qualColorsPaired = ['#a6cee3','#1f78b4','#b2df8a','#33a02c'];
const seqColorsYlOrRd = [
"#ffffb2",
"#fecc5c",
"#fd8d3c",
"#f03b20",
"#bd0026",
];
const seqColorsOrRd = ["#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"];

const colorSecondary = "#fb9a99";
const colorNomentions = "#bdbdbd" //"#d9d9d9"; //"#045a8d";


// make color scale
export function getLegendColors(keys:string[]) {
    const entityCount = Math.min(numberOfMains, keys.length - 2)
    const colorScheme = [...qualColorsPaired].reverse().splice(0, entityCount);
    const color = d3
        .scaleOrdinal<string>([...colorScheme, colorSecondary, colorNomentions])
        .domain(keys)
        .unknown(colorSecondary)
    return color;
}

// get top n characters of the book
export function getTops(data: ChapterOccurence[], n=numberOfMains) {
    let countOccurence: Record<string, string | number>[] = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].characters.length; j++) {
        const character: string = data[i].characters[j].name;
        const index = countOccurence.findIndex((e) => e.name === character);
        const occurenceLength = data[i].characters[j].occurence.length;
        if (index !== -1) {
          const prevCount = Number(countOccurence[index].count);
          const newCount = prevCount + occurenceLength;
          countOccurence[index] = { name: character, count: newCount };
        } else {
          countOccurence.push({ name: character, count: occurenceLength });
        }
      }
    }
    const res = Object(countOccurence).sort(
      (a: Record<string, string | number>, b: Record<string, string | number>) =>
        Number(b.count) - Number(a.count)
    );

    const keys: string[] = res.map((e: Record<string, string | number>) =>
      String(e.name)
    );
    if (keys.length > n) {
      return keys.slice(0, n);
    }
    return keys;
  }

export const groupBy = <T, R extends string | number>(
  arr: T[],
  callback: (item: T) => R
) => {
  return arr.reduce<Record<R, T[]>>((acc, args) => {
    const key = callback(args);
    acc[key] ??= [];
    acc[key].push(args);
    return acc;
  }, {} as any);
};
