import AdmZip from "adm-zip";
import fs from "node:fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

// unzip epub file
export function decompressEpub(filePath: string, distFolder: string) {
  const zip = new AdmZip(filePath);
  zip.extractAllTo(distFolder);
}

// make folder to an epub file
export function compressToEpub(fileName: string) {
  const folderName = "compressed";
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }

  const zip = new AdmZip();
  zip.addLocalFolder("./extracted/" + fileName);
  zip.writeZip("compressed/" + fileName + ".epub");
  console.log("Compress successful");
}

function insertItemToManifest(items:any[]) {
  for(let i = 0; i < items.length; i++) {

  }
}

// modify opf file
export function modifyOPF(
  epubPath: string,
  manifestItem: { id: string; href: string; "media-type": string },
  manifestItemJS: { id: string; href: string; "media-type": string },
  spineItem: { idref: string },
  targetModifiedFIle: string
) {
  const xmlData = getFile(epubPath, "OEBPS", ".opf");
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

  // const manifestIdx = getItemIndex(
  //   obj.package.manifest.item,
  //   "@_href",
  //   "index.xhtml"
  // );

  const manifestIdx = getItemIndex(
    obj.package.manifest.item,
    "@_id",
    ["pg-header", "index.xhtml"]
  );


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

  // const spineIdx = getItemIndex(
  //   obj.package.spine.itemref,
  //   "@_idref",
  //   "htmltoc"
  // );

  const spineIdx = getItemIndex(
    obj.package.spine.itemref,
    "@_idref",
    ["pg-header", "htmltoc"]
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
    console.log("opf file modified")
    return ;
  }
  console.log("opf file not modified")
  return ;
}

export function modifyTOC(epubPath: string) {
  const xmlData = getFile(epubPath, "OEBPS", ".xhtml", "toc");
  if(!xmlData) {
    console.log("No TOC file")
    return
  }
  const options = {
    ignoreAttributes: false,
    // preserveOrder: true,
    suppressEmptyNode: true,
    format: true,
  };
  const parser = new XMLParser(options);

  let obj = parser.parse(xmlData);
  console.log("obj", obj.html.body.div.nav.ol.li)

}

// get the file based on type and return content as string
export function getFile(
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
      console.log("entry", entryName)
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
  console.log("start")
  if(!fs.existsSync(targetFolder + "/" + targetName)) {
    console.log("in if")
    fs.mkdirSync(targetFolder, {recursive: true})
    if(fs.existsSync(targetFolder + "/" + targetName)) {
      console.log("exists")
    }
  }
  if(targetName === "") {
    fs.cpSync(source, targetFolder)
  }
  fs.copyFile(source, targetFolder + "/" + targetName, function (err) {
    if (err) throw err;
    console.log("Succesfully copied");
  });
}
