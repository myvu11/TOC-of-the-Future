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

// handle epub
export function modifyEpub(
  filePath: string,
  manifestItem: {id:string, href:string, 'media-type':string},
  spineItem: {idref: string}
) {
  const xmlData = getOPFFile(filePath);
  if (!xmlData) {
    return "No opf file";
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


  const manifestIdx = getItemIndex(
    obj.package.manifest.item,
    "@_href",
    "index.xhtml"
  );
  console.log("idx", manifestIdx);

  if (manifestIdx) {
    obj.package.manifest.item.splice(manifestIdx, 0, {
            '@_id': manifestItem.id,
            '@_href': manifestItem.href,
            '@_media-type': manifestItem["media-type"]
    });
  } else {
    return "No manifest tag";
  }

  const spineIdx = getItemIndex(
    obj.package.spine.itemref,
    "@_idref",
    "htmltoc"
  );
  console.log("idx", spineIdx);

  if(spineIdx) {
    obj.package.spine.itemref.splice(spineIdx, 0, {
        '@_idref': spineItem.idref,
    });
  }

  // parse object into XML
  const builder = new XMLBuilder(options);
  const xmlContent = builder.build(obj);

  stringToFile(xmlContent, "extracted/okakura/OEBPS/package.opf");
}

// get the opf file as string
function getOPFFile(filePath: string) {
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries(); // an array of ZipEntry records

  for (let i = 0; i < zipEntries.length; i++) {
    const zipEntry = zipEntries[i];

    if (
      zipEntry.entryName.startsWith("OEBPS") &&
      zipEntry.entryName.endsWith(".opf")
    ) {
      return zip.readAsText(zipEntry.entryName);
    }
  }
  return null;
}

// get index of item from an object
function getItemIndex(obj: any, ref: string, target: string) {
  for (let i = 0; i < obj.length; i++) {
    if (obj[i][ref] === target) {
      return i + 1;
    }
  }
  return null;
}


// write to opf file
function stringToFile(content: string, path: string) {
  fs.writeFileSync(path, content);
}

// insert visual TOC files into target extracted folder
function insertFilesInFolder() {
    
}
