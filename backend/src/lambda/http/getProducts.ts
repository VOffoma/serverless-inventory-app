import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getAllProductItems  } from '../../businessLogic/products';
import { createLogger } from '../../utils/logger';
import { parseLimitParameter, parseNextKeyParameter, encodeNextKey } from '../../utils/pagination';
import { PaginationInfo } from '../../types';

const logger = createLogger('get-all-products');

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event for getting all products: ', event);

    let nextKey;
    let limit;

    try {
        nextKey = parseNextKeyParameter(event);
        limit = parseLimitParameter(event);
       
        logger.info('Query limit: ', limit);
        logger.info('Query nextKey:  ', nextKey);

        const paginationInfo: PaginationInfo = {limit, nextKey};

        const queryResult = await getAllProductItems(paginationInfo);
        logger.info('Available products: ', queryResult.Items);

        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
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
}

