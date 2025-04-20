/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';

@Injectable()
export class OrderService {
  constructor(private readonly databaservice: SupabaseService) {}

  async getOrderConfirmation(orderId: string): Promise<any> {
    try {
      // Fetch order details from the database using the order ID
      const { data: cartData, error } = await this.databaservice
        .getClient()
        .from('cart')
        .select('*')
        .eq('id', orderId)
        .single();
      const { data: deliveryData, error: deliveryError } =
        await this.databaservice
          .getClient()
          .from('deliveryDetails')
          .select('*')
          .eq('id', cartData.deliveryId)
          .single();
      const { data: transactionData, error: transactionError } =
        await this.databaservice
          .getClient()
          .from('transactions')
          .select('*')
          .eq('id', cartData.transactionId)
          .single();
      if (error) {
        throw new Error(`Error fetching order: ${error.message}`);
      }
      if (deliveryError) {
        throw new Error(
          `Error fetching delivery details: ${deliveryError.message}`,
        );
      }
      if (transactionError) {
        throw new Error(
          `Error fetching transaction details: ${transactionError.message}`,
        );
      }
      const responseData = {
        cartData: cartData,
        deliveryData: deliveryData,
        transactionData: transactionData,
      };
      return {
        success: true,
        message: 'Order fetched successfully',
        data: responseData,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        message: 'Failed to fetch order',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  async getOrderHistory(userId: string): Promise<any> {
    try {
      const { data, error } = await this.databaservice
        .getClient()
        .rpc('diethistorytabledata', {
          userid: userId,
        });
        console.log('Data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      return {
        success: false,
        message: 'Failed to fetch order history',
        error: error.message || 'Unknown error occurred',
      };
    }
  }
}
