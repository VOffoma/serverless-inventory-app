import Axios from 'axios';
import 'source-map-support/register';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { APIGatewayProxyResult} from 'aws-lambda';
import { createLogger } from '../../utils/logger';



const logger = createLogger('get-token');

export const handler = middy(async(): Promise<APIGatewayProxyResult> => {
    logger.info('Trying to get token');

    try {

        const response = await Axios({
            method: 'POST',
            url: 'https://dev-qb2jhova.eu.auth0.com/oauth/token',
            headers: { 'content-type': 'application/json' },
            data: {
                "client_id":"5JzwmGkYQd0v0JDvX73nf8ok5qN9pkP0",
                "client_secret":"D_kfRm_SI5LoJyExPyTu4bWGoqODD4JpkB2sBVe8uBIEQNyIO9lTxGuQ47w7DhSM",
                "audience":"https://aws-inventory-app",
                "grant_type":"client_credentials"}
        });
      

        logger.info('Available products: ', response.data);

        return {
            statusCode: 200,
            body: JSON.stringify({
                token: response.data
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

