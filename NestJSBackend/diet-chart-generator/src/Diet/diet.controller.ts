/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DietService } from './diet.service';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';

@Controller('diet')
@UseGuards(JwtAuthGuard)
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @Post('createDietChart')
  async createDietChart(@Req() req: any, @Body() dietData: any): Promise<any> {
    console.log(req.user);
    const userId = req.user.userid; // Assuming user ID is available in the request

    return this.dietService.createDietChart(userId, dietData);
  }

  @Get('getDietChart')
  async getDietChart(@Req() req: any): Promise<any> {
    const userId = req.user.userid; // Assuming user ID is available in the request
    return this.dietService.getDietChart(userId);
  }

  @Patch('updateDietChart')
  async updateDietChart(@Req() req: any, @Body() dietData: any): Promise<any> {
    const userId = req.user.userid; // Assuming user ID is available in the request
    return this.dietService.updateDietChart(userId, dietData);
  }

  @Delete('deleteDietChart')
  async deleteDietChart(@Req() req: any): Promise<any> {
    const userId = req.user.userid; // Assuming user ID is available in the request
    return this.dietService.deleteDietChart(userId);
  }

  @Patch('updateDietChartById/:id')
  async updateDietChartById(
    @Req() req: any,
    @Body() dietData: any,
    @Param('id') id: string,
  ): Promise<any> {
    return this.dietService.updateDietChartById(id, dietData);
  }
  @Delete('deleteDietChartById/:id')
  async deleteDietChartById(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<any> {
    return this.dietService.deleteDietChartById(id);
  }
  @Get('getDietChartById/:id')
  async getDietChartById(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<any> {
    return this.dietService.getDietChartById(id);
  }
}
