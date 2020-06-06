import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { updateProductItem, getSingleProductItem } from '../../businessLogic/products';
import { Key, UpdateProductRequest} from '../../types';


const logger = createLogger('update-product');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const productId = event.pathParameters.productId;
  const productUpdate: UpdateProductRequest = JSON.parse(event.body);

  logger.info('Processing event to update product with id: ', productId);
  logger.info('update content:  ', productUpdate);

  // TODO: Update a Product item with the provided id using values in the "productUpdate" object
    try {
    
        const tableKey: Key = {productId};
        const productItemToUpdate = await getSingleProductItem(tableKey);

        if(!productItemToUpdate) {
            throw new Error('this product does not exist');
        }

        await updateProductItem(productUpdate, tableKey);

        logger.info('todoitem has been updated');

        return {
          statusCode: 200,
          body: JSON.stringify({})
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

