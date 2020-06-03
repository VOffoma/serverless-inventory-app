import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ProductItem } from '../models';

const XAWS = AWSXRay.captureAWS(AWS);

export class ProductAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly productsTable =  process.env.PRODUCTS_TABLE
    ){}

    async getAllProductItems(): Promise<ProductItem[]> {
        const result = await this.docClient.scan({
            TableName: this.productsTable
        }).promise();

        const items = result.Items;
        return items as ProductItem[];
    }
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient();
}