import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PaginationInfo, Key } from '../types';
import { ProductItem, ProductUpdate } from '../models';

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

    async getSingleProductItem(tableKey: Key): Promise<ProductItem>{
        const result = await this.docClient.get({
          TableName: this.productsTable,
          Key: {
            productId: tableKey.productId
          }
        })
        .promise();
        return result.Item as ProductItem;
    } 

    async createProductItem(productItem: ProductItem): Promise<ProductItem> {
        await this.docClient.put({
            TableName: this.productsTable,
            Item: productItem
        }).promise();

        return productItem;
    }

    async updateProductItem(productUpdate: ProductUpdate, tableKey: Key): Promise<void> {
        await this.docClient.update({
            TableName: this.productsTable,
            Key: {
                productId: tableKey.productId
            },
            UpdateExpression: "set quantity=:q, mass_g=:mg",
            ExpressionAttributeValues: {
                ":q": productUpdate.quantity,
                ":mg": productUpdate.mass_g
            }
        }).promise();

    }

    async deleteProductItem(tableKey: Key): Promise<void> {
        await this.docClient.delete({
            TableName: this.productsTable,
            Key: {
                productId: tableKey.productId
            },
        }).promise();

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