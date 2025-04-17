import { Module } from '@nestjs/common';
import { AuthModule } from './Authentication/auth.module';
import { DatabaseModule } from './Database/database.module';
import { DietModule } from './Diet/diet.module';
import { UserSpecificationModule } from './UserSpecifications/userspec.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    DietModule,
    UserSpecificationModule,
    CartModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
