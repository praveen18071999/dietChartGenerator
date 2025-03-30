import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const SUPABASE_URL =
      this.configService.get<string>('SUPABASE_URL') ||
      'https://abqyqefaacrthzeksogg.supabase.co';
    const SUPABASE_API_KEY =
      this.configService.get<string>('SUPABASE_API_KEY') ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicXlxZWZhYWNydGh6ZWtzb2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMDczNjYsImV4cCI6MjA1ODg4MzM2Nn0.CoM5UmcM7o1NMiWR3FW7XLzP5QBoL1DD1t9Wmn7OHI4';
    this.supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  }

  async onModuleInit() {
    try {
      // Perform a simple query to verify the connection

      const { data: users, error } = await this.supabase
        .from('users')
        .select('*');
      if (error) throw error;

      this.logger.log('Database connection is created successfully');
    } catch (error) {
      this.logger.error('Database connection failed:', error);
      // Depending on your application requirements, you might want to:
      // 1. Retry the connection
      // 2. Exit the application
      // 3. Continue but with limited functionality
    }
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
