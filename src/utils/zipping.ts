import AdmZip from "adm-zip";
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { zip } from "zip-a-folder";

// unzip epub file
export function decompressEpub(filePath: string, distFolder: string) {
  const zip = new AdmZip(filePath);
  zip.extractAllTo(distFolder);
}

// make folder to an epub file
export async function compressToEpub(
  extractFileName: string,
  fileName: string
) {
  const folderName = "compressed";
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }

  const zip = new AdmZip();
  zip.addLocalFolder("./" + extractFileName);
  console.log("WHAT ERROR!!!");
  await zip.writeZipPromise("compressed/" + fileName + ".epub");
  console.log("Compress successful");
}

export async function zipToEpub(extractFileName: string, fileName: string) {
  await zip(extractFileName, "compressed/" + fileName + ".epub");
}

// modify opf file
export function modifyOPF(
  epubPath: string,
  manifestItems: { id: string; href: string; "media-type": string }[],
  spineItem: { idref: string },
  spineItemsExtra: { idref: string }[],
  opfFile: string,
) {

  const xmlData = getFileContent(epubPath, "OEBPS", ".opf");
  if (!xmlData) {
    console.log("No opf file");
    return;
  }

  const options = {
    ignoreAttributes: false,
    // preserveOrder: true,
    suppressEmptyNode: true,
    format: true,
  };
  const parser = new XMLParser(options);

  let obj = parser.parse(xmlData);

  for(let i = 0; i < manifestItems.length; i++) {
    obj.package.manifest.item.splice(0, 0, {
    "@_id": manifestItems[i].id,
    "@_href": manifestItems[i].href,
    "@_media-type": manifestItems[i]["media-type"],
    });
  }

    const spineIdx = getItemIndex(obj.package.spine.itemref, "@_idref", [
    "pg-header",
    "htmltoc",          //
    "Cover.html",       // PocketBook InkPad Color 3
    "imprint.xhtml"     // www.starndardebooks.org
  ]);

  if (spineIdx) {
    obj.package.spine.itemref.splice(spineIdx, 0, {
      "@_idref": spineItem.idref,
    });
  } else {
    console.log("No spine tag");
    return;
  }

  // get index of last spine item
  const itemrefLength = obj.package.spine.itemref.length
  const endidref = obj.package.spine.itemref[itemrefLength - 1]
  console.log("end", endidref)
  const endSpineIdx = getItemIndex(obj.package.spine.itemref, "@_idref", [`${endidref['@_idref']}`])
  console.log("idx", endSpineIdx)
  
  if (endSpineIdx) {
    for(let i = 0; i < spineItemsExtra.length; i ++) {
      obj.package.spine.itemref.splice(endSpineIdx, 0, {
        "@_idref": spineItemsExtra[i].idref,
      });
    }
  } else {
    console.log("No spine tag");
    return;
  }

  // if (manifestIdx && spineIdx) {
  if (spineIdx) {
    // parse object into XML
    const builder = new XMLBuilder(options);
    const xmlContent = builder.build(obj);

    stringToFile(xmlContent, opfFile);
    console.log("File .opf modified");
    return;
  }
  console.log("File .opf not modified");
  return;
}

// get the file based on type and return content as string
export function getFileContent(
  epubPath: string,
  folder: string,
  fileType: string,
  name: string = ""
) {
  const zip = new AdmZip(epubPath);
  const zipEntries = zip.getEntries();

  for (let i = 0; i < zipEntries.length; i++) {
    const zipEntry = zipEntries[i];
    if (
      zipEntry.entryName.startsWith(folder) &&
      zipEntry.entryName.endsWith(fileType) &&
      zipEntry.entryName.includes(name)
    ) {
      console.log("got file: ", zipEntry.entryName);
      return zip.readAsText(zipEntry.entryName);
    }
  }
  return null;
}

// get array of file path names
export function getFilePaths(
  epubPath: string,
  folder: string,
  fileType: string
) {
  const zip = new AdmZip(epubPath);
  const zipEntries = zip.getEntries();
  const paths: string[] = [];

  for (let i = 0; i < zipEntries.length; i++) {
    const entryName = zipEntries[i].entryName;

    if (
      folder &&
      entryName.startsWith(folder) &&
      entryName.endsWith(fileType) &&
      !entryName.includes("index") &&
      !entryName.includes("cover") &&
      !entryName.includes("toc")
    ) {
      // console.log("entry", entryName)
      paths.push(entryName);
    }
  }
  return paths;
}

// get index of item from an object
function getItemIndex(obj: any, ref: string, target: string[]) {
  for (let i = 0; i < obj.length; i++) {
    for (let j = 0; j < target.length; j++) {
      if (obj[i][ref] === target[j]) {
        return i + 1;
      }
    }
  }
  return null;
}

// write content to opf file
function stringToFile(content: string, path: string) {
  fs.writeFileSync(path, content);
}

// insert visual TOC files into target extracted folder
export function copyFilesToFolder(
  source: string,
  targetFolder: string,
  targetName: string
) {
  if (!fs.existsSync(targetFolder + "/" + targetName)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }
  fs.copyFileSync(source, targetFolder + "/" + targetName);
  if (fs.existsSync(targetFolder + "/" + targetName)) {
    console.log("File copied");
  }
}

export function insertTOCFiles(extractedFolder: string) {
  // copyFilesToFolder(
  //   "dist/future-toc.xhtml",
  //   extractedFolder + "/OEBPS",
  //   "future-toc.xhtml"
  // );
  // copyFilesToFolder(
  //   "dist/future-toc.css",
  //   extractedFolder + "/OEBPS",
  //   "future-toc.css"
  // );
  // copyFilesToFolder(
  //   "dist/future-svg.css",
  //   extractedFolder + "/OEBPS",
  //   "future-svg.css"
  // );
  // copyFilesToFolder(
  //   "dist/future-toc.js",
  //   extractedFolder + "/OEBPS",
  //   "future-toc.js"
  // );
  fs.cp('./dist', extractedFolder +'/OEBPS', { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Files copied")
    }
  });
}


