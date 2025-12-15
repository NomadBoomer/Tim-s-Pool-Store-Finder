import { GoogleGenAI } from "@google/genai";
import { StoreResult, LocationState, OpenTimeFilter } from '../types';

const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const searchPoolStores = async (
  location: LocationState,
  range: string,
  services: string[],
  openTimeFilter: OpenTimeFilter
): Promise<StoreResult[]> => {
  const ai = getGeminiClient();

  let locationString = "";
  if (location.mode === 'device' && location.latitude && location.longitude) {
    locationString = `${location.latitude}, ${location.longitude}`;
  } else if (location.mode === 'zip') {
    locationString = `Zip Code ${location.zipCode}`;
  } else if (location.mode === 'town') {
    locationString = `${location.city}, ${location.state}`;
  } else {
    throw new Error("Invalid location data");
  }

  const serviceString = services.length > 0 
    ? services.join(", ") 
    : "General Pool Services";

  let timeInstruction = "";
  if (openTimeFilter === 'now') {
    const currentDateTime = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    timeInstruction = `Strictly filter for stores that are OPEN RIGHT NOW. The current date and time is ${currentDateTime}. Check their operating hours.`;
  } else if (openTimeFilter === 'weekend') {
    timeInstruction = "Strictly filter for stores that are open on weekends (Saturday or Sunday).";
  }

  const prompt = `
    Find top 6 pool stores or service providers near ${locationString} within ${range} miles.
    Focus on finding businesses that offer these services: ${serviceString}.
    ${timeInstruction}
    
    You MUST use the Google Maps tool to retrieve accurate details.

    You MUST return the response in valid JSON format.
    The JSON should be an array of objects. 
    Each object must have these keys: "name", "address", "phone", "rating", "reviewSummary".
    
    CRITICAL INSTRUCTIONS FOR FIELDS:
    1. "rating": Provide a number between 0-5. If not found, use "Not Available".
    2. "reviewSummary": Write a short, inviting 1-sentence blurb (15-20 words) about the business. 
       - If you find reviews, summarize them. 
       - If you CANNOT find specific reviews, generate a professional description based on their name and likely services (e.g. "Reliable local provider specializing in pool maintenance and equipment.").
       - DO NOT return "Not Available" for the summary. It must be a full sentence.

    If no stores are found within the range, return an empty array.
    Do not include markdown formatting like \`\`\`json.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    let responseText = response.text || "[]";
    
    // Attempt to extract JSON array if the model included extra text
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        responseText = jsonMatch[0];
    } else {
        // Fallback cleanup if regex didn't match a block but text is messy
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    let stores: StoreResult[] = [];

    try {
      const parsedData = JSON.parse(responseText);
      if (Array.isArray(parsedData)) {
        stores = parsedData.map((item: any, index: number) => ({
          id: `store-${index}`,
          name: item.name || "Unknown Store",
          address: item.address || "Not Available",
          phone: item.phone || "Not Available",
          reviewSummary: item.reviewSummary || "Trusted local pool service provider.",
          rating: item.rating !== undefined && item.rating !== null ? item.rating : "Not Available",
        }));
      }
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini", e);
      console.log("Raw response text:", response.text);
    }

    // Enhance with Grounding Metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks && stores.length > 0) {
      stores = stores.map((store, index) => {
        // Attempt to find a relevant chunk
        const chunk = groundingChunks.find(c => 
          c.web?.title?.toLowerCase().includes(store.name.toLowerCase()) ||
          store.name.toLowerCase().includes(c.web?.title?.toLowerCase() || '')
        );

        let mapUri = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + " " + store.address)}`;
        
        // @ts-ignore 
        if (chunk?.web?.uri) mapUri = chunk.web.uri;
        
        return {
          ...store,
          mapUri
        };
      });
    }

    return stores;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch pool stores. Please try again.");
  }
};