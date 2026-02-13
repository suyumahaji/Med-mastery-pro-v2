import { GoogleGenAI, Type } from "@google/genai";
import { MEDICAL_SYSTEM_PROMPT } from "./constants.tsx";

// Helper to get API Key safely from environment
const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API_KEY is missing. Ensure it is set in GitHub Secrets or .env.local file.");
  }
  return key || "";
};

export const generateMedicalCase = async () => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: "Generate a realistic, high-complexity medical clinical case focusing on the 'Next Best Step in Management' logic.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          patientDemographics: { type: Type.STRING },
          chiefComplaint: { type: Type.STRING },
          history: { type: Type.STRING },
          vitals: {
            type: Type.OBJECT,
            properties: {
              bp: { type: Type.STRING },
              hr: { type: Type.STRING },
              rr: { type: Type.STRING },
              temp: { type: Type.STRING }
            },
            required: ["bp", "hr", "rr", "temp"]
          },
          physicalExam: { type: Type.STRING },
          initialLabs: { type: Type.STRING }
        },
        required: ["id", "title", "patientDemographics", "chiefComplaint", "history", "vitals", "physicalExam"]
      },
      systemInstruction: "You are a Chief Clinical Educator. Generate a structured clinical case study for USMLE Step 3 level students."
    }
  });

  return JSON.parse(response.text || "{}");
};

export const createMedicalChat = () => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  return ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: MEDICAL_SYSTEM_PROMPT,
      temperature: 0.7
    }
  });
};