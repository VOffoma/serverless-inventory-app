import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Order } from '../models';


const XAWS = AWSXRay.captureAWS(AWS);


export class OrderAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly ordersTable =  process.env.ORDERS_TABLE
    ){}

    async createOrder(newOrder: Order): Promise<Order> {
        await this.docClient.put({
            TableName: this.ordersTable,
            Item: newOrder
        }).promise();

        return newOrder;
    }

}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient();
}

