import { ProductAccess } from '../dataLayer/productsAccess';
import { ProductItem } from '../models';

const productAccess = new ProductAccess();

export async function getAllProductItems(): Promise<ProductItem[]> {
    return productAccess.getAllProductItems();
}