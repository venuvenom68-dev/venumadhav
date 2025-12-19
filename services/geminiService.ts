
import { GoogleGenAI, Type } from "@google/genai";
import { Movie, RecommendationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMovieRecommendations = async (query: string): Promise<RecommendationResponse> => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: `Recommend movies based on this request: "${query}". 
               Use Google Search to find official high-quality poster image URLs (preferably from TMDB, IMDb, or Wikipedia).
               Provide a concise introduction explaining the mood of these choices.
               For each movie, provide: 
               - title
               - year
               - a list of genres
               - rating (out of 10)
               - a compelling description
               - posterUrl (A direct, high-quality URL to the movie's official poster)
               - reasoning on why this fits the user's search query.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          intro: { type: Type.STRING },
          movies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                year: { type: Type.STRING },
                genre: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                rating: { type: Type.NUMBER },
                description: { type: Type.STRING },
                posterUrl: { type: Type.STRING },
                reasoning: { type: Type.STRING },
              },
              required: ["title", "year", "genre", "rating", "description", "posterUrl", "reasoning"]
            }
          }
        },
        required: ["intro", "movies"]
      }
    }
  });

  try {
    const text = response.text;
    const parsed = JSON.parse(text) as RecommendationResponse;
    
    // Extract grounding chunks if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      parsed.groundingChunks = chunks as any;
    }
    
    return parsed;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not connect to the cinematic database. Please try again.");
  }
};
