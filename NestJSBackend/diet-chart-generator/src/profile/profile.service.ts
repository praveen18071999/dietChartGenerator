/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: SupabaseService) {}

  async updateProfile(profileData: any, userId: string) {
    console.log('Profile Data:', profileData);
    console.log('User ID:', userId);
    try {
      // Extract medical conditions from conditions array
      const medicalConditions = profileData.conditions;

      // Extract medication names from medications array
      const medications = profileData.medications;

      // Convert dietary restrictions object to string array
      const dietaryRestrictions = profileData.dietaryRestrictions
        ? Object.entries(profileData.dietaryRestrictions)
            .filter(([key, value]) => value === true && key !== 'other')
            .map(([key]) => {
              switch (key) {
                case 'noSugar':
                  return 'No Sugar';
                case 'lowSodium':
                  return 'Low Sodium';
                case 'glutenFree':
                  return 'Gluten Free';
                case 'dairyFree':
                  return 'Dairy Free';
                case 'vegetarian':
                  return 'Vegetarian';
                case 'vegan':
                  return 'Vegan';
                default:
                  return key;
              }
            })
        : null;

      // Add "other" value if provided
      if (profileData.dietaryRestrictions?.other) {
        if (dietaryRestrictions) {
          dietaryRestrictions.push(profileData.dietaryRestrictions.other);
        }
      }

      // Format date properly if it's a string
      let dateOfBirth = profileData.dateOfBirth;
      if (dateOfBirth && typeof dateOfBirth === 'string') {
        dateOfBirth = dateOfBirth.split('T')[0]; // Extract YYYY-MM-DD part
      }

      const { data, error } = await this.databaseService
        .getClient()
        .rpc('updateprofile', {
          userid: userId,
          name: profileData.fullName,
          email: profileData.email,
          phoneNumber: profileData.phone,
          age: profileData.age,
          goal: profileData.goal,
          gender: profileData.gender,
          height: profileData.height,
          weight: profileData.weight,
          bloodpressure: profileData.bloodPressure,
          heartrate: profileData.heartRate,
          bloodsugar: profileData.bloodSugar,
          medicalconditions: medicalConditions,
          medications: medications,
          dietaryrestrictions: dietaryRestrictions,
          allergies: profileData.allergies ? [profileData.allergies] : null,
          dietarypreferences: profileData.dietaryPreferences
            ? [profileData.dietaryPreferences]
            : null,
          dateofbirth: dateOfBirth,
        });

      if (error) {
        console.error('Profile update error:', error);
        throw new Error(`Error updating profile: ${error.message}`);
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        data: data,
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async getProfile(userId: string) {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw new Error(`Error fetching profile: ${error.message}`);
      }

      if (!data) {
        throw new Error(`No user found with ID: ${userId}`);
      }
      //return data;
      // Parse medical conditions from stringified JSON
      const parsedConditions = data.medicalconditions
        ? data.medicalconditions.map((condition) => {
            if (typeof condition === 'string') {
              try {
                return JSON.parse(condition);
              } catch (e) {
                console.error('Error parsing condition:', e);
                return {
                  name: condition,
                  diagnosed: null,
                  severity: null,
                  controlled: null,
                };
              }
            }
            return condition;
          })
        : [];

      // Parse medications from stringified JSON
      const parsedMedications = data.medications
        ? data.medications.map((medication) => {
            if (typeof medication === 'string') {
              try {
                return JSON.parse(medication);
              } catch (e) {
                console.error('Error parsing medication:', e);
                return {
                  name: medication,
                  dosage: null,
                  frequency: null,
                  startDate: null,
                };
              }
            }
            return medication;
          })
        : [];

      // Format the data according to the required structure
      const formattedData = {
        user: {
          name: data.name,
          age: data.age,
          gender: data.gender,
          email: data.email,
        },
        vitals: {
          height: data.height,
          weight: data.weight,
          bmi:
            data.height && data.weight
              ? Number((data.weight / (data.height / 100) ** 2).toFixed(1))
              : null,
          bloodPressure: data.bloodpressure,
          heartRate: data.heartrate,
          bloodSugar: data.bloodsugar,
        },
        conditions: parsedConditions,
        weightHistory: data.weightHistory || [],
        medications: parsedMedications,
        dietaryRestrictions: data.dietaryrestrictions || [],
        allergies: data.allergies || [],
        dietaryPreferences: data.dietarypreferences || [],
        dateOfBirth: data.dateofbirth || null,
      };

      return {
        success: true,
        message: 'Profile fetched successfully',
        data: formattedData,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        message: 'Failed to fetch profile',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async getWeightHistory(userId: string) {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .rpc('weighthistory', {
          userid: userId,
        });

      if (error) {
        console.error('Error fetching weight history:', error);
        throw new Error(`Error fetching weight history: ${error.message}`);
      }

      return {
        success: true,
        message: 'Weight history fetched successfully',
        data: data,
      };
    } catch (error) {
      console.error('Error fetching weight history:', error);
      return {
        success: false,
        message: 'Failed to fetch weight history',
        error: error.message || 'Unknown error occurred',
      };
    }
  }
}
