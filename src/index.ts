import AdmZip from "adm-zip";
import fs from 'node:fs';
import { readEpub } from "./utils/zipping.js";


// unzip epub file
function decompressEpub(filePath: string, distFolder: string) {
    const zip = new AdmZip(filePath);
    zip.extractAllTo(distFolder);
}

// make folder to epub file
function compressToEpub(fileName: string) {
    const folderName = 'compressed';
    try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
    } catch (err) {
        console.error(err);
    }

    const zip = new AdmZip();
    zip.addLocalFolder("../extracted/" + fileName);
    zip.writeZip("compressed/" + fileName + ".epub");
    console.log("Compress successful");
};


const filePath = "../epub-files/okakura-book-of-tea.epub";
const extractFolder = "extracted/okakura";
const convertName = "epubWithVisTOC";

readEpub(filePath)
// compressToEpub("lewis");
