import OpenAI from "openai";
import { config } from "dotenv";
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function consultOpenai(stringDate) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Cuenta el dato historico importante del ${stringDate}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content;
}
