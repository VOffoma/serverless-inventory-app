import {DynamoDBStreamEvent, DynamoDBStreamHandler} from 'aws-lambda';
import 'source-map-support/register';


export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    console.log('Processing events batch from DynamoDB', JSON.stringify(event));

    for(const record of event.Records){
        console.log('Processing record', JSON.stringify(record));

        if (record.eventName === 'INSERT') {
          const newOrder = record.dynamodb.NewImage;
          for(let orderItem in newOrder){
            console.log(orderItem);
          }
        }
        else{
          continue;
        }   
    }
}

