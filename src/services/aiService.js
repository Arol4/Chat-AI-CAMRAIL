import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const client = new GoogleGenerativeAI(apiKey);
const model = client.getGenerativeModel({model: "gemini-2.5-flash"});

export const generateResponseStream = async (prompt) => {
  try {
    const result = await model.generateContentStream(prompt);
    return result.stream;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API de Gemini:", error);
    throw error;
  }
};