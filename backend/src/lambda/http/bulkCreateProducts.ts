import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { bulkAddProductItems  } from '../../businessLogic/products';
import { getUserId } from '../../utils/event';


const logger = createLogger('bulk-create-products');

export const handler = middy(async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event for the bulk creation of products');

    const productItems = JSON.parse(event.body);
    const productCount = productItems.length;
    const userId = getUserId(event);

    try {
        await bulkAddProductItems(userId, productItems);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `${productCount} has been created`
            })
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

