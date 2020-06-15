import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { createProductItem } from '../../businessLogic/products';
import { CreateProductRequest } from '../../types'
import { getUserId } from '../../utils/event';

const logger = createLogger('create-todo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newProduct: CreateProductRequest = JSON.parse(event.body)

  logger.info('Processing event for create productitem with the following detail: ', newProduct);
 
  const userId = getUserId(event);
  const item = await createProductItem(newProduct, userId);

  logger.info('detail for new productitem: ', item);

  return {
    statusCode: 201,
    body: JSON.stringify({
      item
    })
  }
});

handler
.use(cors({
    credentials: true
}));