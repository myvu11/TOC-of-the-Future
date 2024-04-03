import AdmZip from "adm-zip";
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

// unzip epub file
export function decompressEpub(filePath: string, distFolder: string) {
  const zip = new AdmZip(filePath);
  zip.extractAllTo(distFolder);
}

// make folder to an epub file
export function compressToEpub(extractFileName:string, fileName: string) {
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
  zip.writeZip("compressed/" + fileName + ".epub");
  console.log("Compress successful");
}


// modify opf file
export function modifyOPF(
  epubPath: string,
  manifestItem: { id: string; href: string; "media-type": string },
  manifestItemJS: { id: string; href: string; "media-type": string },
  spineItem: { idref: string },
  targetModifiedFIle: string
) {
  const xmlData = getFileContent(epubPath, "OEBPS", ".opf");
  if (!xmlData) {
    console.log("No opf file")
    return ;
  }

  const options = {
    ignoreAttributes: false,
    // preserveOrder: true,
    suppressEmptyNode: true,
    format: true,
  };
  const parser = new XMLParser(options);

  let obj = parser.parse(xmlData);
  //   console.dir(obj, { depth: 15 });

  let manifestIdx = getItemIndex(
    obj.package.manifest.item,
    "@_href",
    ["index.xhtml"]
  );

  if(!manifestIdx) {
    manifestIdx = getItemIndex(
      obj.package.manifest.item,
      "@_id",
      ["pg-header", "Cover.html"]
    );
  }


  if (manifestIdx) {
    obj.package.manifest.item.splice(manifestIdx, 0, {
      "@_id": manifestItem.id,
      "@_href": manifestItem.href,
      "@_media-type": manifestItem["media-type"],
    });
  } else {
    console.log("No manifest tag");
    return ;
  }

  obj.package.manifest.item.splice(0, 0, {
    "@_id": manifestItemJS.id,
    "@_href": manifestItemJS.href,
    "@_media-type": manifestItemJS["media-type"],
  });


  const spineIdx = getItemIndex(
    obj.package.spine.itemref,
    "@_idref",
    ["pg-header", "htmltoc", "Cover.html"]
  );

  if (spineIdx) {
    obj.package.spine.itemref.splice(spineIdx, 0, {
      "@_idref": spineItem.idref,
    });
  } else {
    console.log("No spine tag")
    return
  }

  if (manifestIdx && spineIdx) {
    // parse object into XML
    const builder = new XMLBuilder(options);
    const xmlContent = builder.build(obj);

    stringToFile(xmlContent, targetModifiedFIle);
    console.log("File .opf modified")
    return ;
  }
  console.log("File .opf not modified")
  return ;
}


// get the file based on type and return content as string
export function getFileContent(
  epubPath: string,
  folder: string,
  fileType: string,
  name: string = "",

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
      console.log("got file: ", zipEntry.entryName)
      return zip.readAsText(zipEntry.entryName);
    }
  }
  return null;
}


// get array of file path names
export function getFilePaths(
  epubPath: string,
  folder: string,
  fileType: string,

) {
  const zip = new AdmZip(epubPath);
  const zipEntries = zip.getEntries();
  const paths:string[] = []

  for (let i = 0; i < zipEntries.length; i++) {
    const entryName = zipEntries[i].entryName;

    if (
      folder && entryName.startsWith(folder) &&
      entryName.endsWith(fileType) &&
      !entryName.includes("index") && !entryName.includes("cover") &&
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
    for(let j = 0; j < target.length; j++) {
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
export function copyFilesToFolder(source: string, targetFolder: string, targetName: string) {
  if(!fs.existsSync(targetFolder + "/" + targetName)) {
    fs.mkdirSync(targetFolder, {recursive: true});
  }
  fs.copyFileSync(source, targetFolder + "/" + targetName);
  if(fs.existsSync(targetFolder + "/" + targetName)) {
    console.log("File copied")
  }
}

export function insertTOCFiles(extractedFolder: string) {
  copyFilesToFolder("dist/future-toc.xhtml", extractedFolder + "/OEBPS", "future-toc.xhtml");
  copyFilesToFolder("dist/future-toc.css", extractedFolder + "/OEBPS", "future-toc.css");
  copyFilesToFolder("dist/future-svg.css", extractedFolder + "/OEBPS", "future-svg.css");
  copyFilesToFolder("dist/future-toc.js", extractedFolder + "/OEBPS", "future-toc.js");

}
