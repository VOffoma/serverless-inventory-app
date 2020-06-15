import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PaginationInfo, Key } from '../types';
import { ProductItem, ProductUpdate } from '../models';

const XAWS = AWSXRay.captureAWS(AWS);
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const productNameIndex = process.env.PRODUCT_NAME_INDEX;

export class ProductAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly s3Client = createS3Client(),
        private readonly productsTable =  process.env.PRODUCTS_TABLE
    ){}

    async getAllProductItems(userId: string, paginationInfo: PaginationInfo): Promise<any> {

        const result = await this.docClient.query({
            TableName: this.productsTable,
            IndexName: productNameIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId':userId
            },
            Limit: paginationInfo.limit,
            ExclusiveStartKey: paginationInfo.nextKey
        }).promise();

    
        return result;
    }

    async getSingleProductItem(tableKey: Key): Promise<ProductItem>{
        const result = await this.docClient.get({
          TableName: this.productsTable,
          Key: {
            userId: tableKey.userId,
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
                userId: tableKey.userId,
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
                userId: tableKey.userId,
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

    getUploadUrl(productId: string): string {
        return this.s3Client.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: productId,
            Expires: urlExpiration
        });
    }
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient();
}

function createS3Client() {
    return new XAWS.S3({
        signatureVersion: 'v4'
      })
}