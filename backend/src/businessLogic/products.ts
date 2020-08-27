import * as uuid from 'uuid';
import { ProductAccess } from '../dataLayer/productsAccess';
import { ProductItem } from '../models';
import { PaginationInfo, CreateProductRequest, ProductKey, UpdateProductRequest } from '../types';
import { DBAccess } from '../dataLayer/dbAccess';
import { MediaBucketAccess } from '../dataLayer/mediaBucketAccess';

const mediaBucketAccess = new MediaBucketAccess();
const dbAccess = new DBAccess(process.env.PRODUCTS_TABLE);
const bucketName = process.env.IMAGES_S3_BUCKET;
// const productAccess = new ProductAccess();

export async function getAllProductItems(paginationInfo: PaginationInfo): Promise<any> {
    return await dbAccess.getAllRecords(paginationInfo);
}

export async function getSingleProductItem(tableKey: ProductKey): Promise<any> {
    return await dbAccess.getSingleRecord(tableKey);
}

export async function createProductItem(createProductRequest: CreateProductRequest)
: Promise<ProductItem> {
    const itemId = uuid.v4();
    return await dbAccess.createRecord({
        productId: itemId,
        quantity: createProductRequest.quantity || 0,
        addedAt: new Date().toISOString(),
        productName: createProductRequest.productName,
        mass_g: createProductRequest.mass_g,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    });
}

export async function updateProductItem(updateProductRequest: UpdateProductRequest, tableKey: ProductKey): Promise<void> {
    const updateExpression = "set quantity=:q, mass_g=:mg";
    const attributeValues =  {
        ":q": updateProductRequest.quantity,
        ":mg": updateProductRequest.mass_g
    }
    await dbAccess.updateRecord(updateExpression, attributeValues, tableKey);
}

export async function deleteProductItem(tableKey: ProductKey): Promise<void> {
    await dbAccess.deleteRecord(tableKey);
}

export function getUploadUrl(productId: string): string {
    return mediaBucketAccess.getUploadUrl(productId);
}

export async function bulkAddProductItems(productItems): Promise<void> {
    const putItemRequests = createPutItemRequestsForProduct(productItems);
    
    let newItems = [];
    for (let i = 0; i < putItemRequests.length; i += 25) {
        const upperLimit = Math.min(i + 25, putItemRequests.length);
        newItems = putItemRequests.slice(i, upperLimit);
        await dbAccess.bulkAddRecords(newItems);
    };
}

function createPutItemRequestsForProduct(productItems): [] {
    const requestItems = productItems.map((item: ProductItem) => {
        const populatedItem = populateProductItemFields(item);
        return {
            'PutRequest': {
                Item: populatedItem
            }
        }
    });
    return requestItems;
}

function populateProductItemFields (item: ProductItem) {
    const itemId = uuid.v4();
    item.productId = itemId;
    item.quantity = item.quantity || 0;
    item.addedAt = new Date().toISOString();
    item.attachmentUrl =  `https://${bucketName}.s3.amazonaws.com/${itemId}`;
    return item;
}


