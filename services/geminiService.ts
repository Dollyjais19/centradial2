
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function processFileAndExtractText(fileData: string, mimeType: string): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: fileData,
            mimeType: mimeType
          }
        },
        {
          text: `Extract the conversation text from this file. Focus specifically on identifying messages spoken by the "other person" (the suspected scammer or manipulator). Return the extracted conversation as a JSON array of strings, where each string is a single sentence or logical message chunk from that person. Do not include your own commentary in the JSON. Output ONLY valid JSON.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse sentences:", e);
    return [];
  }
}

export async function analyzeSentence(sentence: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this sentence for emotional manipulation and scam risk. Be calm, therapist-like, and gentle.
    
    Sentence: "${sentence}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentence: { type: Type.STRING },
          pressureLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          urgencyScore: { type: Type.NUMBER },
          manipulationPattern: { type: Type.STRING },
          riskExplanation: { type: Type.STRING },
          protectiveAction: { type: Type.STRING },
          scamType: { type: Type.STRING }
        },
        required: ['sentence', 'pressureLevel', 'urgencyScore', 'manipulationPattern', 'riskExplanation', 'protectiveAction', 'scamType']
      }
    }
  });

  return JSON.parse(response.text);
}
