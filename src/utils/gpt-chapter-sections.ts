import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function gptGetChapterSections(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: fs.readFileSync("./src/utils/prompts/get-chapter-sections.txt", "utf-8"),
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  // console.log("response all: ", response);
  // console.log("response print: ", response.choices[0].message.content);
  return response.choices[0].message.content
}
