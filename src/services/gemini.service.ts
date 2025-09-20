// Fix: Created the GeminiService to encapsulate Gemini API calls.
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type, Part } from '@google/genai';

const API_KEY = process.env.API_KEY;

export interface ProductDetails {
  name?: string;
  features?: string;
  tone?: string;
  targetAudience?: string;
  imageData?: {
    mimeType: string;
    data: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    if (!API_KEY) {
      throw new Error('API_KEY environment variable not set.');
    }
    this.genAI = new GoogleGenAI({ apiKey: API_KEY });
  }

  async generateDescriptions(details: ProductDetails): Promise<string[]> {
    const { name, features, tone, targetAudience, imageData } = details;

    let prompt = '';
    const parts: Part[] = [];

    if (imageData && targetAudience) {
      prompt = `You are an expert social media marketer specializing in Facebook sales posts.
      Analyze the following product image carefully. Identify the product, its key features, and its overall aesthetic.
      Your task is to generate 3 distinct, highly engaging Facebook sales captions for this product, tailored specifically for the following target audience: "${targetAudience}".

      Each caption MUST:
      1. Be attractive and persuasive, written in a friendly and appealing tone.
      2. Start with a strong hook to grab attention immediately.
      3. Clearly highlight the product's main benefits (inferred from the image).
      4. Include relevant, popular emojis to increase engagement and visual appeal.
      5. End with a strong call-to-action (e.g., "Shop Now!", "DM to order", "Order yours today!").
      6. Include 3-5 relevant hashtags (e.g., #productname #sale #style #musthave).

      Return the captions as a JSON array of strings. For example: ["caption 1", "caption 2", "caption 3"]`;

      parts.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.data,
        },
      });

    } else {
       prompt = `Based on the provided details, generate 3 creative and compelling product descriptions.
      Each description should be unique, attractive, and include relevant emojis to be more engaging.

      Product Name: ${name}
      Key Features & Benefits: ${features}
      Desired Tone of Voice: ${tone}

      Return the descriptions as a JSON array of strings. For example: ["description 1", "description 2", "description 3"]
      `;
    }

    parts.push({ text: prompt });

    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
              description: 'A product description or social media caption.',
            },
          },
        },
      });

      const jsonString = response.text.trim();
      const descriptions = JSON.parse(jsonString);

      if (Array.isArray(descriptions) && descriptions.every(item => typeof item === 'string')) {
        return descriptions;
      } else {
        console.error('Gemini API returned an unexpected JSON structure:', descriptions);
        return [];
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}
