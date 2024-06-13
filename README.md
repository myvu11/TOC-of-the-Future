# Introduction
This project work developed a new table of contents (TOC) version based on visualizations. The TOC is applied to ebooks of the EPUB format.
It lays the foundation to build software that on the input of an ebook a new EPUB file is outputtet containing the new TOC.

The prototype is based on the novel *Of Mice and Men* by John Steinbeck obtained from the free ebook source EpubBooks.
The finalized EPUB file can be read on the device PocketBook InkPad Color 3. Compatible ebooks must be from Project Gutenberg and EpubBooks and in the fiction book genre.

Here are the instructions on how to get the TOC applied to your ebook.

# Requirements
The project makes use of OpenAI API, a user of this product is necessary. it is used to extract data from the book text.


# Setup
Download this project.
Create a *.env* file in the main folder to store an API key to OpenAI API.
```code
OPENAI_API_KEY=" "
```

Create the following folders in the main folder: *compressed*,  *extracted*, and *epub-files*. \
Insert the input EPUB file in the just created folder *epub-files*.

Go to the file *src/generate-toc.ts* and modify the following constants keeping the folder name:
```code
const epubPath = ".epub-files/ "
const extractedFolder = ".extracted/"
const folderName = " "
```

Run in the terminal
```shell
npm start
```

The output is found in the folder *compressed*

# Remarks
Depending on your credentials on OpenAi, your credentials might exceed. In this case run the functions one at a time. The AI prompting related functions can be found in the files *src/utils/chapterHandling.ts* and
*src/utils/sectionHandling.ts*.

The table of contents is of now made for books containing up to 8 chapters. Exceeding the this number will result in a TOC not fitting to one page. Wanting to apply the TOC to books with more chapters, you need to modify the layout to have the page to get a suitable diviosn of the visualization of the TOC.
