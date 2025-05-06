

import {GoogleGenAI} from '@google/genai';
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = ''
const ai = new GoogleGenAI({apiKey: GEMINI_API_URL});

async function runChat(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  });
  console.log(response.text);
  return response.text;
}

export default runChat;