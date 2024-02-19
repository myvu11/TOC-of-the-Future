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

// handle opf file
export function modifyOPF(
  epubPath: string,
  manifestItem: { id: string; href: string; "media-type": string },
  spineItem: { idref: string }
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

  const manifestIdx = getItemIndex(
    obj.package.manifest.item,
    "@_href",
    "index.xhtml"
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

  const spineIdx = getItemIndex(
    obj.package.spine.itemref,
    "@_idref",
    "htmltoc"
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

    stringToFile(xmlContent, "extracted/okakura/OEBPS/package.opf");
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

// get the file as string
function getFile(
  epubPath: string,
  folder: string,
  fileType: string,
  name = ""
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
export function moveFilesToFolder(file: string, targetPath: string) {
  fs.rename(file, targetPath, function (err) {
    if (err) throw err;
    console.log("Succesfully renamed");
  });
}
