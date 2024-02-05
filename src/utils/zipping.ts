import AdmZip from "adm-zip";
import fs from 'node:fs';


// unzip epub file
export function decompressEpub(filePath: string, distFolder: string) {
    const zip = new AdmZip(filePath);
    zip.extractAllTo(distFolder);
}

// make folder to an epub file
export function compressToEpub(fileName: string) {
    const folderName = 'compressed';
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
};

// handle epub
export function modifyEpub(filePath: string, manifestItem: string, spineItem: string) {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries(); // an array of ZipEntry records
    let newContent = "";

    let entryIdx = 0;
    let zipEntry = zipEntries[entryIdx];

    while(entryIdx < zipEntries.length && !zipEntry.entryName.startsWith("OEBPS") && !zipEntry.entryName.endsWith(".opf")) {
        entryIdx += 1;
        zipEntry = zipEntries[entryIdx];
    }

    if (zipEntry.entryName.startsWith("OEBPS") && zipEntry.entryName.endsWith(".opf")) {
        const contentAsText = zip.readAsText(zipEntry.entryName).split("\n");
        const contentLength = contentAsText.length
        let manifestIdx = 0;

        while(manifestIdx < contentLength && !contentAsText[manifestIdx].includes("<manifest>")) {
            manifestIdx += 1;
        }

        const insertIndex = manifestIdx + 3;
        const nextLine = contentAsText[insertIndex]
        const spaceCount = nextLine.match(/([\s]+)/g)!.length
        const spaces = (" ").repeat(spaceCount);

        contentAsText.splice(insertIndex, 0, spaces + manifestItem);
        newContent = contentAsText.join("\n");

        // insert item at spine tag
        let spineIdx = 0;
        while(spineIdx < contentLength && !contentAsText[manifestIdx].includes("<spine>")) {
            spineIdx += 1;
        }
        const spineInsertIdx = spineIdx + 3;
        const nextSpineItem = contentAsText[spineInsertIdx]
        const spaceCountNext = nextSpineItem.match(/([\s]+)/g)!.length
        const spacesNext = (" ").repeat(spaceCountNext);

        contentAsText.splice(spineInsertIdx, 0, spacesNext + spineItem);
        newContent = contentAsText.join("\n");

        stringToFile(newContent, "extracted/okakura/OEBPS/package.opf");
    };

    return newContent;
}

// write to opf file
function stringToFile(content: string, path: string) {
    fs.writeFileSync(path, content);
}

// insert visual TOC files into target extracted folder
function insertFilesInFolder() {

}
