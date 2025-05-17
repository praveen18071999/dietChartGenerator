/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post } from '@nestjs/common';
import { DietService } from './diet.service';

@Controller('dietGenerator')
export class DietController {
  // This controller will handle diet-related requests
  // Add your methods here to handle different routes
  // For example, you might have methods for generating diet charts, etc.
  constructor(private readonly dietService: DietService) {}
  @Post('/generateDiet')
  async generateDiet(@Body() dietRequest: any): Promise<any> {
    // Logic to generate diet chart based on the request
    // This is just a placeholder implementation
    const response = await this.dietService.generateDietChart(dietRequest);

    return {
      message: 'Diet chart generated successfully',
      data: response,
      status: 'success',
    };
  }
}
