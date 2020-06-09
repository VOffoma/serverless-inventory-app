import * as uuid from 'uuid';
import { ProductAccess } from '../dataLayer/productsAccess';
import { ProductItem } from '../models';
import { PaginationInfo, CreateProductRequest, Key, UpdateProductRequest } from '../types';

const productAccess = new ProductAccess();
const bucketName = process.env.IMAGES_S3_BUCKET;

export async function getAllProductItems(paginationInfo: PaginationInfo): Promise<any> {
    return productAccess.getAllProductItems(paginationInfo);
}

export async function getSingleProductItem(tableKey: Key): Promise<ProductItem> {
    return productAccess.getSingleProductItem(tableKey);
}

export async function createProductItem(createProductRequest: CreateProductRequest)
: Promise<ProductItem> {
    const itemId = uuid.v4();
    return await productAccess.createProductItem({
        productId: itemId,
        quantity: createProductRequest.quantity || 0,
        addedAt: new Date().toISOString(),
        productName: createProductRequest.productName,
        mass_g: createProductRequest.mass_g,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    });
}

export async function updateProductItem(updateProductRequest: UpdateProductRequest, tableKey: Key): Promise<void> {
    await productAccess.updateProductItem({...updateProductRequest}, tableKey);
}

export async function deleteProductItem(tableKey: Key): Promise<void> {
    await productAccess.deleteProductItem(tableKey);
}

export function getUploadUrl(todoId: string): string {
    return  productAccess.getUploadUrl(todoId);
}

export async function bulkAddProductItems(productItems): Promise<void> {
    const putItemRequests = createPutItemRequestsForProduct(productItems);
    
    let newItems = [];
    for (let i = 0; i < putItemRequests.length; i += 25) {
        const upperLimit = Math.min(i + 25, putItemRequests.length);
        newItems = putItemRequests.slice(i, upperLimit);
        await productAccess.bulkAddProductItems(newItems);
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