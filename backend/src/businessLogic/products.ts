import * as uuid from 'uuid';
import { ProductAccess } from '../dataLayer/productsAccess';
import { ProductItem } from '../models';
import { PaginationInfo } from '../types';

const productAccess = new ProductAccess();

export async function getAllProductItems(paginationInfo: PaginationInfo): Promise<any> {
    return productAccess.getAllProductItems(paginationInfo);
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
    item.productId = uuid.v4();
    item.quantity = item.quantity || 0;
    item.addedAt = new Date().toISOString();
    return item;
}