import { Module } from '@nestjs/common';
import { AuthModule } from './Authentication/auth.module';
import { DatabaseModule } from './Database/database.module';
import { DietModule } from './Diet/diet.module';
import { UserSpecificationModule } from './UserSpecifications/userspec.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './orders/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    DietModule,
    UserSpecificationModule,
    CartModule,
    OrderModule,
    TransactionModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
