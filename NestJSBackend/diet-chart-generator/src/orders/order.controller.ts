/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  // Define the constructor and any necessary dependencies here
  constructor(private readonly orderService: OrderService) {}

  @Get('order-confirmation/:id')
  async getOrderConfirmation(@Req() req: any, @Param('id') id: string) {
    return this.orderService.getOrderConfirmation(id);
  }
  // Define your controller methods here
  // For example, you might have a method to create an order
}
