import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { createOrder } from '../../businessLogic/orders';
import { getUserId } from '../../utils/event';

const logger = createLogger('create-order');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const orderItems = JSON.parse(event.body)

  logger.info(`Processing event to create new order with the following items: ${orderItems}`);
 
  const userId = getUserId(event);
  const newOrder = await createOrder(orderItems, userId);

  logger.info(`details for new order: ${newOrder}`);

  return {
    statusCode: 201,
    body: JSON.stringify({
      newOrder
    })
  }
});

handler
.use(cors({
    credentials: true
}));