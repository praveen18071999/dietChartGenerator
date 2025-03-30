import { Module } from '@nestjs/common';
import { AuthModule } from './Authentication/auth.module';
import { DatabaseModule } from './Database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
