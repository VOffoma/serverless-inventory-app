import { createAWSConnection, awsCredsifyAll, awsGetCredentials } from '@acuris/aws-es-connection';
import { Client } from '@elastic/elasticsearch';

let awsCredentials;

(async () => { // IIFE to give access to async/await
    awsCredentials = await awsGetCredentials();
})();
  
  
const AWSConnection = createAWSConnection(awsCredentials);

const esHost = process.env.ES_ENDPOINT;
console.log(esHost);

const es = awsCredsifyAll(
    new Client({
        node: esHost,
        Connection: AWSConnection
    })
);


export default es;