/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';
import { UserSpecificationService } from 'src/UserSpecifications/userspec.service';

@Injectable()
export class DietService {
  private readonly logger = new Logger(DietService.name);

  constructor(
    private readonly databaseService: SupabaseService,
    private readonly userSpecificationService: UserSpecificationService,
  ) {}

  async createDietChart(userid: string, dietData: any): Promise<any> {
    try {
      const supabase = this.databaseService.getClient();
      const { data, error } = await supabase
        .from('Diet')
        .insert([
          { generatedBy: userid, diet: dietData.diet, days: dietData.days },
        ])
        .select();

      if (error) {
        this.logger.error(
          `Database error creating diet chart: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to create diet chart: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Diet chart created successfully',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Unexpected error creating diet chart: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDietChart(userid: string): Promise<any> {
    try {
      const supabase = this.databaseService.getClient();
      console.log('User ID:', userid);
      const { data, error } = await supabase
        .from('Diet')
        .select('*')
        .eq('generatedBy', userid);

      if (error) {
        this.logger.error(
          `Database error fetching diet chart: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to fetch diet chart: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data || data.length === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No diet chart found for this user',
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Diet chart retrieved successfully',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Unexpected error fetching diet chart: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDietChart(userid: string): Promise<any> {
    try {
      const supabase = this.databaseService.getClient();
      const { data, error } = await supabase
        .from('Diet')
        .delete()
        .eq('generatedBy', userid);

      if (error) {
        this.logger.error(
          `Database error deleting diet chart: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to delete diet chart: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Diet chart deleted successfully',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Unexpected error deleting diet chart: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDietChart(userid: string, dietData: any): Promise<any> {
    try {
      const supabase = this.databaseService.getClient();

      // Create update object dynamically based on provided data
      const updateObj: any = {};

      // Always include diet if provided
      if (dietData.diet !== undefined) {
        updateObj.diet = dietData.diet;
      }

      // Only include days if it's provided
      if (dietData.days !== undefined) {
        updateObj.days = dietData.days;
      }

      // Log the update operation for debugging
      this.logger.log(
        `Updating diet chart for user ${userid} with data: ${JSON.stringify(updateObj)}`,
      );

      const { data, error } = await supabase
        .from('Diet')
        .update(updateObj)
        .eq('generatedBy', userid)
        .select();

      if (error) {
        this.logger.error(
          `Database error updating diet chart: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to update diet chart: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data || data.length === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No diet chart found to update',
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Diet chart updated successfully',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Unexpected error updating diet chart: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDietChartById(id: string, dietData: any): Promise<any> {
    try {
      const supabase = this.databaseService.getClient();
      const { data, error } = await supabase
        .from('Diet')
        .update({ diet: dietData.diet, days: dietData.days })
        .eq('id', id)
        .select();

      if (error) {
        this.logger.error(
          `Database error updating diet chart by ID: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to update diet chart: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data || data.length === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: `No diet chart found with ID: ${id}`,
          data: [],
        };
      }
      console.log('Diet Data:', dietData);
      await this.userSpecificationService.updateUserSpecification(
        id,
        dietData.profile,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Diet chart updated successfully',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Unexpected error updating diet chart by ID: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDietChartById(id: string): Promise<any> {
    try {
      const supabase = this.databaseService.getClient();
      const { data, error } = await supabase
        .from('Diet')
        .select(
          `
        *,
        "User Specifications"(*)
      `,
        )
        .eq('id', id);

      if (error) {
        this.logger.error(
          `Database error fetching diet chart by ID: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to fetch diet chart: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data || data.length === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: `No diet chart found with ID: ${id}`,
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Diet chart retrieved successfully',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Unexpected error fetching diet chart by ID: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDietChartById(id: string): Promise<any> {
    try {
      const supabase = this.databaseService.getClient();
      const { data, error } = await supabase.from('Diet').delete().eq('id', id);

      if (error) {
        this.logger.error(
          `Database error deleting diet chart by ID: ${error.message}`,
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Failed to delete diet chart: ${error.message}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!data) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: `No diet chart found with ID: ${id}`,
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Diet chart deleted successfully',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Unexpected error deleting diet chart by ID: ${error.message}`,
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
