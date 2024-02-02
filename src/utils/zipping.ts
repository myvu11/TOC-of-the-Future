import AdmZip from "adm-zip";

export function readEpub(filePath: string) {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries(); // an array of ZipEntry records

    zipEntries.forEach((zipEntry) => {
        if (zipEntry.entryName.startsWith("OEBPS") && zipEntry.entryName.endsWith(".opf")) {
            // console.log(zipEntry.toString()); // outputs zip entries information
            // console.log("entryName", zipEntry.entryName)
            // console.log(zipEntry.getData().toString("utf8"));
            // zip.extractEntryTo(zipEntry.entryName, "extracted/test/", true, true)
            const contentAsText = zip.readAsText(zipEntry.entryName).split("\n");
            contentAsText.forEach(line => {
                // console.log(line.includes("<manifest>"))
                if(line.includes("<manifest>")) {
                    console.log("line: ", line)
                }
            })
        }
    });
}
