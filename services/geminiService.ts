
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AISummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fast summary generation using Gemini Flash Lite
 * Rule: gemini lite or flash lite: 'gemini-flash-lite-latest'
 */
export const generateVideoSummary = async (title: string, description: string, explainSimply: boolean = false): Promise<AISummary> => {
  const model = 'gemini-flash-lite-latest';
  
  const prompt = `
    Analyze this educational video for Class 10 Board preparation.
    Title: ${title}
    Description: ${description}
    ${explainSimply ? "Explain everything in very simple, easy-to-understand language for a beginner." : "Provide a detailed, exam-focused summary for high-performing students."}
    
    Return a JSON object containing:
    1. A 2-3 minute readable summary.
    2. Key points (list).
    3. Important formulas mentioned or relevant to the topic.
    4. 3-5 Practice MCQs with options and correct answers.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
            practiceQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answer: { type: Type.STRING }
                },
                required: ["question", "options", "answer"]
              }
            }
          },
          required: ["summary", "keyPoints", "formulas", "practiceQuestions"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      summary: "Could not generate AI summary at this moment. Please refer to NCERT textbooks.",
      keyPoints: ["Topic: " + title],
      formulas: [],
      practiceQuestions: []
    };
  }
};

/**
 * Deep video understanding using Gemini 3 Pro
 * Rule: gemini pro: 'gemini-3-pro-preview'
 */
export const analyzeVideoDeeply = async (title: string, description: string) => {
  const model = 'gemini-3-pro-preview';
  const prompt = `As a Class 10 Board Exam Specialist, provide a deep analysis of this lecture: "${title}". 
  Context: ${description}. 
  Focus on:
  1. High-probability exam questions (Short & Long Answer).
  2. Critical conceptual nuances that students often miss.
  3. Strategic approach for answering questions on this topic to score 100%.
  Format the output in professional Markdown with bullet points and bold headings.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 } // Adding some thinking budget for higher quality analysis
      }
    });
    return response.text;
  } catch (error) {
    console.error("Deep Analysis Error:", error);
    return "Deep intelligence is currently unavailable for this video.";
  }
};

/**
 * Text-to-Speech for video summaries
 * Rule: gemini tts or gemini text-to-speech: 'gemini-2.5-flash-preview-tts'
 */
export const generateTTS = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this educational summary clearly for a student: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return undefined;
  }
};

/**
 * AI Chatbot using Gemini 3 Pro for academic queries
 * Rule: gemini pro: 'gemini-3-pro-preview'
 */
export const getChatResponse = async (message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]) => {
  const model = 'gemini-3-pro-preview';
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: "You are 'BoardBot Pro', a highly intelligent academic counselor for Class 10 Board Exams. You provide elite-level, precise, and exam-focused guidance for Math, Science, Social Science, and English. You use a professional, encouraging, and authoritative tone. Do not answer non-academic questions. If asked about syllabus, assume latest 2024-25 CBSE/ICSE patterns.",
    },
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "BoardBot is resting for a moment. Please retry your question!";
  }
};

/**
 * Fast content polishing using Flash Lite
 * Rule: gemini lite or flash lite: 'gemini-flash-lite-latest'
 */
export const polishContent = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: `Refine this revision note for better clarity and board-exam vocabulary: "${text}". Keep the meaning identical but improve the professional quality.`,
  });
  return response.text;
};

/**
 * Generate full revision card from a topic using Gemini 3 Pro
 */
export const generateRevisionCard = async (topic: string) => {
  const model = 'gemini-3-pro-preview';
  const prompt = `Create a high-quality revision flashcard for the Class 10 Board Exam on the topic: "${topic}".
  Return a JSON object with:
  1. title: A concise, catchy title.
  2. content: A structured, easy-to-memorize explanation including 3-4 bullet points.
  3. category: One of "Math", "Science", "Social", "English", or "General".
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["Math", "Science", "Social", "English", "General"] }
          },
          required: ["title", "content", "category"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Revision Card Generation Error:", error);
    return null;
  }
};
