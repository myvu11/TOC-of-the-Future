import { buildInstanceChart } from "./instancechart";
import { buildLayoutRectangle } from "./layout-rectangle";

const inputCharacterOccurence = [
  {
    name: "Watson",
    occurence: [
      144, 250, 259, 323, 331, 381, 410, 422, 425, 452, 487, 551, 554, 573, 582,
      643, 683, 700,
    ],
  },
  {
    name: "Holmes",
    occurence: [
      427, 431, 440, 447, 454, 520, 547, 564, 587, 635, 703, 728, 777, 839, 856,
      861, 909, 916, 950, 973, 978, 992, 1025, 1103, 1120, 1125, 1146, 1163,
      1168, 1196, 1201, 1220, 1275, 1293, 1306, 1328, 1376, 1412, 1416, 1429,
    ],
  },
  {
    name: "Stamford",
    occurence: [
      222, 260, 280, 338, 341, 885, 1033, 1121, 1143, 1210, 1257, 1354, 1377,
    ],
  },
  { name: "Murray", occurence: [26] },
  { name: "Candahar", occurence: [66] },
];

const inputChapterLength = 2106;

const ch1 = {
  characters: [
    {
      name: "Lennie",
      occurence: [
        6, 14, 18, 22, 24, 26, 30, 34, 38, 42, 46, 50, 54, 58, 66, 70, 74, 78,
        82, 86, 90, 94, 98, 102, 106, 110, 114, 118, 122, 126, 130, 134, 138,
        142, 146, 150, 154, 158, 162, 166, 170, 174, 178, 182, 186, 190, 194,
        198, 202, 206, 210,
      ],
    },
    {
      name: "George",
      occurence: [
        6, 14, 18, 22, 24, 26, 30, 34, 38, 42, 46, 50, 54, 58, 66, 70, 74, 78,
        82, 86, 90, 94, 98, 102, 106, 110, 114, 118, 122, 126, 130, 134, 138,
        142, 146, 150, 154, 158, 162, 166, 170, 174, 178, 182, 186, 190, 194,
        198, 202, 206, 210,
      ],
    },
  ],
  locations: [
    {
      location: "Salinas River",
      occurence: [1, 2, 3, 6, 8, 10, 14, 28, 30, 32, 210],
    },
    {
      location: "Gabilan mountains",
      occurence: [2, 4, 6],
    },
    {
      location: "Soledad",
      occurence: [2, 78, 78],
    },
  ],
  chapterLength: 210,
};

const ch2 = {
  characters: [
    {
      name: "Old man",
      occurence: [
        9, 13, 15, 17, 35, 37, 39, 41, 43, 111, 117, 121, 131, 133, 143, 151,
        161, 179, 193, 223, 237, 239, 251,
      ],
    },
    {
      name: "George",
      occurence: [
        15, 17, 25, 31, 33, 41, 79, 81, 91, 95, 97, 99, 101, 103, 105, 137, 139,
        145, 151, 161, 181, 211, 227, 233, 235, 263,
      ],
    },
    {
      name: "Lennie",
      occurence: [
        17, 25, 31, 33, 41, 79, 81, 91, 95, 97, 99, 101, 103, 105, 137, 139,
        145, 151, 161, 181, 211, 227, 233, 235, 263, 265, 267, 269, 271, 273,
        275,
      ],
    },
    {
      name: "Curley",
      occurence: [
        249, 271, 307, 309, 311, 337, 339, 357, 359, 375, 377, 379, 381,
      ],
    },
  ],
  locations: [
    {
      location: "Bunk house",
      occurence: [
        1, 13, 15, 37, 45, 47, 49, 51, 53, 79, 89, 101, 111, 131, 143, 151, 161,
        173, 181, 191, 211, 225, 237, 239, 249, 261, 269, 271, 293, 307, 309,
        311, 337, 357, 359, 373, 375, 377, 379, 381,
      ],
    },
    { location: "Washroom", occurence: [343, 347] },
  ],
  sentenceCount: 387,
};

buildInstanceChart("1", inputCharacterOccurence, inputChapterLength);
// buildLayoutRectangle();
