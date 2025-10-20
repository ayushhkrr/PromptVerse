import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generatePreview = async (promptBody, sampleInput, promptType) => {
  try {
    const fullPrompt = promptBody.replace("{INPUT}", sampleInput);

    if (promptType === "image") {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
      });
      return response.data[0].url;
    } else if (promptType === "text") {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: fullPrompt }],
      });
      return response.choices[0].message.content;
    } else {
      throw new Error("Invalid prompt type specified");
    }
  } catch (e) {
    console.error('Error communicating with OpenAI API', e)
    throw new Error('Failed to generate AI preview')
  }
};
