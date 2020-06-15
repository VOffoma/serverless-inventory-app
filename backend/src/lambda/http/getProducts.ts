import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { getAllProductItems  } from '../../businessLogic/products';
import { createLogger } from '../../utils/logger';
import { parseLimitParameter, parseNextKeyParameter, encodeNextKey } from '../../utils/pagination';
import { PaginationInfo } from '../../types';
import { getUserId } from '../../utils/event';

const logger = createLogger('get-all-products');

export const handler = middy(async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event for getting all products');

    let nextKey;
    let limit;

    try {
        const userId = getUserId(event);
        logger.info(`userId: ${userId}`);
        
        nextKey = parseNextKeyParameter(event);
        limit = parseLimitParameter(event);
       
        logger.info(`Query limit: ${limit}`);
        logger.info(`Query nextKey:  ${nextKey}`);

        const paginationInfo: PaginationInfo = {limit, nextKey};

        const queryResult = await getAllProductItems(userId, paginationInfo);
        logger.info(`Available products: ${queryResult.Items}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                products: queryResult.Items,
                nextKey: encodeNextKey(queryResult.LastEvaluatedKey)
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
});

handler
.use(cors({
    credentials: true
}));
