import { config } from "dotenv";
config();

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ...

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ...
export async function consultGemini(stringDate) {
  const prompt = `Dame una unica efemeride, de forma breve(10 reglones maximo), del dia ${stringDate}`;
  const safetySettings = {
    HarmCategory: HarmCategory.NONE,
    HarmBlockThreshold: HarmBlockThreshold.NONE,
  };
  const result = await model.generateContent(prompt, safetySettings);
  const response = result.response;

  const text = response.text();
  console.log(text);
  const text_ = checkText(text);
  return text_;
}
const checkText = (text_) => {
  let text = text_;
  //chequear mientras el texto empieza con #,* o -
  while (text.startsWith("#") || text.startsWith("*") || text.startsWith("-")) {
    text = text.substring(1);
  }
  //chequear que si el texto tiene **, se eliminen
  while (text.includes("**")) {
    text = text.replace("**", "");
  }
  return text;
};
