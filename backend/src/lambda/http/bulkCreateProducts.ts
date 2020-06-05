import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { bulkAddProductItems  } from '../../businessLogic/products';


const logger = createLogger('bulk-create-products');

export const handler = middy(async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event for the bulk creation of products: ', event);

    const productItems = JSON.parse(event.body);

    try {
        await bulkAddProductItems(productItems);
        return {
            statusCode: 200,
            body: JSON.stringify({})
          };

    } catch (error) {
        logger.info(error.message);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error.message
            })
        }
    }
})

handler
.use(cors({
    credentials: true
}))

