import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PaginationInfo } from '../types';

const XAWS = AWSXRay.captureAWS(AWS);

export class ProductAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly productsTable =  process.env.PRODUCTS_TABLE
    ){}

    async getAllProductItems(paginationInfo: PaginationInfo): Promise<any> {
        const result = await this.docClient.scan({
            TableName: this.productsTable,
            Limit: paginationInfo.limit,
            ExclusiveStartKey: paginationInfo.nextKey
        }).promise();

        return result;
    }

    async bulkAddProductItems(productItems): Promise<void>{
        try {
            await this.docClient.batchWrite({
                RequestItems: {
                    [this.productsTable]: productItems
                }
            }).promise();

        } catch (error) {
            throw error;
        }
    }
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient();
}