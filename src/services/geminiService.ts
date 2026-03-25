import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getPirateResponse(message: string, history: { role: string; parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a salty, weathered pirate captain. You speak in pirate slang (e.g., 'Ahoy', 'Matey', 'Arrgh', 'Avast'). You are helpful but always maintain your pirate persona. You love the sea, treasure, and your ship.",
    },
    history: history,
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
