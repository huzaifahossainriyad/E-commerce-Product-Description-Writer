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
      prompt = `You are an expert social media marketer creating a Facebook sales post.
      Your primary task is to analyze the provided product image. From the image alone, you must infer the product's name, key features, and the appropriate tone of voice (e.g., luxury, casual, playful).

      Based on your image analysis, generate 3 distinct and highly engaging Facebook sales captions. These captions must be specifically tailored for the following target audience: "${targetAudience}".

      Each of the 3 captions MUST include:
      1. A compelling opening hook to grab attention.
      2. Persuasive language that highlights the product's benefits, as inferred from the image.
      3. Relevant and popular emojis to increase visual appeal and engagement.
      4. 3-5 relevant and specific hashtags to improve reach.
      5. A clear and strong call-to-action (e.g., "Shop the link in bio!", "DM us to order!", "Get yours today!").

      Return ONLY a valid JSON array of 3 strings, with no other text or explanation. For example: ["caption 1", "caption 2", "caption 3"]`;

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