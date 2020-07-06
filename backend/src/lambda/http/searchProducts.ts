import 'source-map-support/register';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { searchProductDocuments  } from '../../businessLogic/es/products';
import { createLogger } from '../../utils/logger';

const logger = createLogger('search-for-products');

export const handler = middy(async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Processing event for searching through products');
    const queryString = event['queryStringParameters'];
    logger.info(`queryStringParameters: ${queryString}`);

    try {
        const body = {
          "query": {
            "match": {
                "productName": queryString.q
            }
          }
        };

        const searchResult = await searchProductDocuments(body);
        

        return {
            statusCode: 200,
            body: JSON.stringify({
                totalhits: searchResult.total,
                data: searchResult.hits
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

