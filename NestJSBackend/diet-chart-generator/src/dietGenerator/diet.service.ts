/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class DietService {
  private readonly logger = new Logger(DietService.name);

  constructor() {
    // Constructor logic if needed
  }

  async generateDietChart(dietRequest: any): Promise<any> {
    try {
      // Configure Google Generative AI with API key
      const apiKey = 'AIzaSyDWATeTSUWb2T80bH40cANs5qk3DMLRqx0';
      const googleGenerativeAI = new GoogleGenerativeAI(apiKey);

      // Prepare input text from request data
      let inputText = `Age: ${dietRequest.age}, Goal: ${dietRequest.goal}`;

      if (dietRequest.restrictions) {
        inputText += `, Restrictions: ${dietRequest.restrictions}`;
      }

      if (dietRequest.diseases) {
        inputText += `, Diseases: ${
          Array.isArray(dietRequest.diseases)
            ? dietRequest.diseases.join(', ')
            : dietRequest.diseases
        }`;
      }

      if (dietRequest.activity_level) {
        inputText += `, Activity level: ${dietRequest.activity_level}`;
      }

      if (dietRequest.gender) {
        inputText += `, Gender: ${dietRequest.gender}`;
      }

      if (dietRequest.height) {
        inputText += `, Height: ${dietRequest.height}cm`;
      }

      if (dietRequest.weight) {
        inputText += `, Weight: ${dietRequest.weight}kg`;
      }

      if (dietRequest.otherDisease) {
        inputText += `, Other diseases: ${dietRequest.otherDisease}`;
      }

      // Create prompt for Gemini API
      const prompt = `
You are a nutrition expert AI.

Based on the following user input, generate a comprehensive personalized diet plan, including full nutritional information.

User details:
${inputText}

Output ONLY a valid JSON object with the structure below. Do not include any text, explanation, markdown, or formatting outside the JSON.

JSON structure:
{
  "diet_plan": "The complete diet plan text with all recommendations and guidance.",
  "daily_targets": {
    "calories": <number>,
    "protein": <number>,
    "carbs": <number>,
    "fats": <number>,
    "fiber": <number>,
    "water": "<recommendation>"
  },
  "meal_plan": [
    {
      "day": 1,
      "meals": [
        {
          "meal_type": "Breakfast",
          "foods": [
            {
              "name": "<food item>",
              "portion": "<portion size>",
              "calories": <number>,
              "protein": <number>,
              "carbs": <number>,
              "fats": <number>
            }
          ]
        }
      ]
    }
  ]
}

Ensure:
- Each food item has full nutritional breakdown.
- Daily totals align with daily_targets.
- Your response must be valid JSON.
`;

      // Make API call to Gemini
      const model = googleGenerativeAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 4096,
        },
      });

      const responseText = result.response.text();
      this.logger.log(
        `Raw Gemini API response: ${responseText.substring(0, 200)}...`,
      );

      try {
        // Clean the response text to remove markdown code blocks
        let cleanedResponse = responseText;

        // Check if response contains markdown code blocks
        if (cleanedResponse.includes('```')) {
          this.logger.log(
            'Detected markdown code blocks in response, cleaning...',
          );

          // Remove markdown code block delimiters
          cleanedResponse = cleanedResponse.replace(/```json/g, '');
          cleanedResponse = cleanedResponse.replace(/```/g, '');
          cleanedResponse = cleanedResponse.trim();

          // Log the cleaned response for debugging
          this.logger.log(
            `Cleaned response: ${cleanedResponse.substring(0, 200)}...`,
          );
        }

        // Try to parse the cleaned JSON response
        const responseData = JSON.parse(cleanedResponse);
        const dietPlan = responseData.diet_plan || '';

        // Extract nutritional info from JSON
        const dailyTargets = responseData.daily_targets || {};
        const calories = dailyTargets.calories;
        const protein = dailyTargets.protein;
        const carbs = dailyTargets.carbs;
        const fats = dailyTargets.fats;

        return {
          status: HttpStatus.OK,
          message: 'Diet chart generated successfully',
          data: {
            diet_plan: JSON.stringify(responseData), // Return stringified JSON
            calories,
            protein,
            carbs,
            fats,
          },
        };
      } catch (jsonError) {
        // If JSON parsing fails, use regex to extract nutritional info
        this.logger.warn(`Failed to parse JSON response: ${jsonError.message}`);
        this.logger.warn(
          `Problematic response: ${responseText.substring(0, 300)}`,
        );

        let calories: number | null = null;
        let protein: number | null = null;
        let carbs: number | null = null;
        let fats: number | null = null;

        try {
          // Extract nutritional info using regex
          const calorieMatch = responseText.match(/calories:\s*(\d+)/i);
          if (calorieMatch) calories = parseInt(calorieMatch[1], 10);

          const proteinMatch = responseText.match(/protein:\s*(\d+)\s*g/i);
          if (proteinMatch) protein = parseInt(proteinMatch[1], 10);

          const carbsMatch = responseText.match(/carbs?:\s*(\d+)\s*g/i);
          if (carbsMatch) carbs = parseInt(carbsMatch[1], 10);

          const fatsMatch = responseText.match(/fats?:\s*(\d+)\s*g/i);
          if (fatsMatch) fats = parseInt(fatsMatch[1], 10);
        } catch (extractError) {
          this.logger.warn(
            `Error extracting nutritional info: ${extractError.message}`,
          );
        }

        return {
          status: HttpStatus.OK,
          message: 'Diet chart generated with limited parsing',
          data: {
            diet_plan: responseText,
            calories,
            protein,
            carbs,
            fats,
          },
        };
      }
    } catch (error) {
      this.logger.error(`Error generating diet chart: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error generating diet plan: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
