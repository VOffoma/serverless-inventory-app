import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUploadUrl, getSingleProductItem } from '../../businessLogic/products';
import { createLogger } from '../../utils/logger';
import { Key } from '../../types';
import { getUserId } from '../../utils/event';

const logger = createLogger('generate-upload-url');

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters.productId;
  logger.info(`Processing event to create upload url for product with id: ${productId}`);
  
  // TODO: Return a presigned URL to upload a file for a Product item with the provided id
  try {
  
    const userId = getUserId(event);
    const tableKey: Key = {userId, productId};
    const productItem = await getSingleProductItem(tableKey);
  
    if(!productItem) {
        throw new Error('this product does not exist');
    }
  
  
    const url = getUploadUrl(productId);
    logger.info(`upload url: ${url}`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          uploadUrl: url
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
 
};

