import {DynamoDBStreamEvent, DynamoDBStreamHandler} from 'aws-lambda';
import 'source-map-support/register';
import { processOrderItem } from '../../businessLogic/orders';



export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    console.log('Processing events batch from DynamoDB', JSON.stringify(event));

    for(const record of event.Records){
        console.log('Processing record', JSON.stringify(record));

        if (record.eventName === 'INSERT') {
          const newOrder = record.dynamodb.NewImage;
          const orderItems = newOrder.requestedItems.L;
          const orderId = newOrder.orderId.S;

          for(let orderItem of orderItems){
            const productId = orderItem.M.productId.S;
            const orderItemQuantity = parseInt(orderItem.M.quantity.N, 10);
            await processOrderItem({orderId, productId, orderItemQuantity})
          }
        }
        else{
          continue;
        }   
    }
}




