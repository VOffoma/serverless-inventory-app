import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { deleteProductItem, getSingleProductItem } from '../../businessLogic/products';
import { getUserId } from '../../utils/event';
import { ProductKey } from '../../types';


const logger = createLogger('delete-product');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters.productId;

  logger.info('Processing event to delete product with id: ${productId}');
  // TODO: Remove a Product item by id

  try {
    // const userId = getUserId(event);
    const tableKey: ProductKey = {productId};
    const productItemToDelete = await getSingleProductItem(tableKey);

    if(!productItemToDelete) {
        throw new Error('this product does not exist');
    }
    
   await deleteProductItem(tableKey);
   

    logger.info(`product has been deleted.`);

    return {
      statusCode: 200,
      body: JSON.stringify({
          message: `Product with Id ${productId} has been deleted successfully`
      })
    }
} catch (error) {
    logger.info(error.message);
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: error.message
        })
    }
}

});

handler
.use(cors({
    credentials: true
}));
