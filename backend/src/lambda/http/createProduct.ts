import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { createProductItem } from '../../businessLogic/products';
import { CreateProductRequest } from '../../types'

const logger = createLogger('create-todo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newProduct: CreateProductRequest = JSON.parse(event.body)

  logger.info('Processing event for create productitem with the following detail: ', newProduct);
 
  const item = await createProductItem(newProduct);

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