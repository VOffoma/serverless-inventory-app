import 'source-map-support/register';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { searchProductDocuments  } from '../../businessLogic/es/products';
import { createLogger } from '../../utils/logger';

const logger = createLogger('search-for-products');

export const handler = middy(async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event for searching through products');
    const  queryString = event['queryStringParameters'];
    logger.info(`ueryStringParameters: ${queryString}`);

    // const q = event.queryStringParameters.q;
    // logger.info('Query: ', );
   console.log('Query ', queryString.q);
    try {
        const body = {
          "query": {
            "match_all": {}
          }
        };

        const searchResult = await searchProductDocuments(body);
        logger.info(`Number of hits: ${searchResult}`);
        // logger.info('Number of hits: ', searchResult.total);
        // logger.info('hits: ', searchResult.hits);

        return {
            statusCode: 200,
            body: JSON.stringify({
                searchResult
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

