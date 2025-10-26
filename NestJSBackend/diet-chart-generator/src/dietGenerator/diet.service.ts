/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DietService {
  private readonly logger = new Logger(DietService.name);
  private genAI: GoogleGenerativeAI;

  constructor() {
    // FIX 1: REMOVE HARDCODED KEY. Use environment variables.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.error('FATAL: GEMINI_API_KEY is not set in environment variables. Check your .env file location.');
      throw new Error('GEMINI_API_KEY is not set.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.logger.log('DietService initialized successfully with API Key.');
  }

  async generateDietChart(dietRequest: any): Promise<any> {
    try {
      let inputText = `Age: ${dietRequest.age}, Goal: ${dietRequest.goal}`;
      if (dietRequest.restrictions) inputText += `, Restrictions: ${dietRequest.restrictions}`;
      if (dietRequest.diseases) inputText += `, Diseases: ${Array.isArray(dietRequest.diseases) ? dietRequest.diseases.join(', ') : dietRequest.diseases}`;
      if (dietRequest.activity_level) inputText += `, Activity level: ${dietRequest.activity_level}`;
      if (dietRequest.gender) inputText += `, Gender: ${dietRequest.gender}`;
      if (dietRequest.height) inputText += `, Height: ${dietRequest.height}cm`;
      if (dietRequest.weight) inputText += `, Weight: ${dietRequest.weight}kg`;
      if (dietRequest.otherDisease) inputText += `, Other diseases: ${dietRequest.otherDisease}`;

      const prompt = `
You are a nutrition expert AI. Based on the user details below, generate a comprehensive diet plan.
User details: ${inputText}
Output ONLY a valid JSON object with the exact structure specified. Do not include any text, explanation, or markdown formatting outside the JSON object.
JSON structure:
{
  "diet_plan": "The complete diet plan text...",
  "daily_targets": { "calories": 0, "protein": 0, "carbs": 0, "fats": 0 },
  "meal_plan": [ { "day": 1, "meals": [ { "meal_type": "Breakfast", "foods": [ { "name": "", "portion": "", "calories": 0 } ] } ] } ]
}`;

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-pro-latest',
      });

      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ];

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
        safetySettings,
      });

      const response = result.response;

      if (!response || !response.text()) {
        const finishReason = response?.candidates?.[0]?.finishReason;
        this.logger.error(`Gemini returned an empty response. Finish Reason: ${finishReason}`);
        throw new HttpException(`Failed to generate diet plan. The model returned an empty response. Reason: ${finishReason}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // FIX 2: CLEAN THE JSON before parsing to remove trailing commas.
      const rawText = response.text();
      const cleanedText = rawText.replace(/,\s*([}\]])/g, '$1'); // Removes trailing commas

      try {
        const responseData = JSON.parse(cleanedText);
        const dailyTargets = responseData.daily_targets || {};

        return {
          status: HttpStatus.OK,
          message: 'Diet chart generated successfully',
          data: {
            diet_plan: JSON.stringify(responseData),
            calories: dailyTargets.calories,
            protein: dailyTargets.protein,
            carbs: dailyTargets.carbs,
            fats: dailyTargets.fats,
          },
        };
      } catch (e) {
        this.logger.error('Failed to parse cleaned JSON response from Gemini.', e.stack);
        this.logger.log('Problematic cleaned text:', cleanedText); // Log the text that failed
        throw new HttpException('Received an invalid format from the AI model after cleaning.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      this.logger.error(`Error generating diet chart: ${error.message}`, error.stack);
      throw new HttpException(`Error generating diet plan: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}