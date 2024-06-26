# Introduction
This project developed a new table of contents (TOC) version based on visualizations. The TOC applies to ebooks of the EPUB format in the fiction book genre.
This project lays the foundation to build software that on the input of an EPUB file a new one is outputtet containing a this work's TOC.

The prototype is based on the novel *Of Mice and Men* by John Steinbeck obtained from the free ebook source EpubBooks.
The finalized EPUB file can be read on the device PocketBook InkPad Color 3. Compatible ebooks must be from Project Gutenberg and EpubBooks.

Here are the instructions on how to get the TOC applied to your ebook.

# Requirements
The project makes use of OpenAI API, a user of this product is necessary. It is used to extract data from the book's text.


# Setup
Download this project.

Create a *.env* file in the main folder to store an API key to OpenAI API.
```code
OPENAI_API_KEY=" "
```

Create the following folders in the main folder: *compressed*,  *extracted*, and *epub-files*. \
Insert the input EPUB file in the just created folder *epub-files*.

Go to the file *src/generate-toc.ts* and modify the following constants filename, keeping the folder name. The *epubPath* is the path to your stored epub file. The *extractedFolder* is the folder name you want the unzipped EPUB to be stored. Foldername is of your choice.
```code
export const epubPath = "./epub-files/steinbeck-of-mice-and-men - Epubbooks.epub";
export const extractedFolder = "./extracted/steinbeck - epubbooks";
export const folderName = "steinbeck/";
```

Run in the terminal
```shell
npm start
```

The output is found in the folder *compressed*

# Remarks
Depending on your credential on OpenAi, the rate limit might exceed when running the code. In this case run the functions one at a time in the file *src/generate-toc.ts*.

The AI prompting related functions can be found in the files *src/utils/chapterHandling.ts* and
*src/utils/sectionHandling.ts*.
The functions in these files can run one by one too to avoid exceeding the rate.

The table of contents is now made for books containing up to 8 chapters. Exceeding this number will result in a TOC not fitting on one page. If you want to apply the TOC to books with more chapters, you need to modify the layout to get the page a suitable diviosn of the TOC's visualization.
The involved files to modify the TOC are found in *templates/scripts*, *templates/html*, and *templates/style*.
