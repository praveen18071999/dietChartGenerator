import { Module } from '@nestjs/common';
import { DietController } from './diet.controller';
import { DietService } from './diet.service';

@Module({
  imports: [],
  controllers: [DietController],
  providers: [DietService],
  exports: [],
})
export class DietGeneratorModule {}
