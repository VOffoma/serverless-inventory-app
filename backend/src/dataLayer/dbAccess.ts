import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PaginationInfo } from '../types';

const XAWS = AWSXRay.captureAWS(AWS);

export class DBAccess {
    private readonly docClient: DocumentClient = createDynamoDBClient();
    private readonly dbTable: string; 

    constructor(dbtable: string){
        this.dbTable = dbtable;
    }

    async getAllRecords(paginationInfo: PaginationInfo): Promise<any> {

        const queryResult = await this.docClient.scan({
            TableName: this.dbTable,
            // IndexName: productNameIndex,
            Limit: paginationInfo.limit,
            ExclusiveStartKey: paginationInfo.nextKey
        }).promise();

    
        return queryResult
    }


    async getSingleRecord(tableKey): Promise<Object>{
        const result = await this.docClient.get({
          TableName: this.dbTable,
          Key: tableKey
        })
        .promise();
        return result;
    } 

    async createRecord(record): Promise<any> {
        await this.docClient.put({
            TableName: this.dbTable,
            Item: record
        }).promise();

        return record;
    }

    async updateRecord(updateExpression, attributeValues, tableKey): Promise<void> {
        await this.docClient.update({
            TableName: this.dbTable,
            Key: tableKey,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: attributeValues
        }).promise();

    }

    async deleteRecord(tableKey): Promise<void> {
        await this.docClient.delete({
            TableName: this.dbTable,
            Key: tableKey
        }).promise();

    }

    async bulkAddRecords(bulkRecords): Promise<void>{
        try {
            await this.docClient.batchWrite({
                RequestItems: {
                    [this.dbTable]: bulkRecords
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

