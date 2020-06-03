import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getAllProductItems  } from '../../businessLogic/products';
import { createLogger } from '../../utils/logger';

const logger = createLogger('get-all-products');

export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event for getting all products');

    try {
        const products = await getAllProductItems();
        logger.info('Available products: ', products);

        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                products
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

