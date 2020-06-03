import { ProductAccess } from '../dataLayer/productsAccess';
import { PaginationInfo } from '../types';

const productAccess = new ProductAccess();

export async function getAllProductItems(paginationInfo: PaginationInfo): Promise<any> {
    return productAccess.getAllProductItems(paginationInfo);
}