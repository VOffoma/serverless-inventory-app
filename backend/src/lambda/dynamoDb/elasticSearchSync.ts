import {DynamoDBStreamEvent, DynamoDBStreamHandler} from 'aws-lambda';
import 'source-map-support/register';
import { insertProductDocument, updateProductDocument  } from '../../businessLogic/es/products';

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    console.log('Processing events batch from DynamoDB', JSON.stringify(event));

    for(const record of event.Records){
        console.log('Processing record', JSON.stringify(record));

        if (record.eventName === 'INSERT') {
          const newItem = record.dynamodb.NewImage;
          await insertProductDocument(newItem);
        }
        else if(record.eventName === 'MODIFY'){
          console.log(record.dynamodb)
          const updatedItem = record.dynamodb.NewImage;
          await updateProductDocument(updatedItem);
        }
        else{
          continue;
        }
      
          
      
        
    }
}