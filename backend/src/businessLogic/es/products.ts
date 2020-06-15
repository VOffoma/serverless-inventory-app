import { ElasticSearchAccess } from '../../dataLayer/elasticSearch/index'
const esAccess = new ElasticSearchAccess();

export async function searchProductDocuments(body: object): Promise<any> {
    const result = await esAccess.searchDocuments('products-index', 'product', body)
    return result;
 }
 
 export async function insertProductDocument(newItem): Promise<any> {
     const productId = newItem.productId.S;
       
     const body = {
       productId: newItem.productId.S,
       productName: newItem.productName.S,
       mass_g: newItem.mass_g.N,
       quantity: newItem.quantity.N,
       addedAt: newItem.addedAt.S,
       attachmentUrl: newItem.attachmentUrl.S,
     }
     console.log('oody: ', body);
     await esAccess.addDocument('products-index', 'product', productId, body);
 }
 
 export async function updateProductDocument(updatedItem): Promise<any> {
     const productId = updatedItem.productId.S;
       
     const body = {
         doc: {
             mass_g: updatedItem.mass_g.N,
             quantity: updatedItem.quantity.N
         }
     }
     await esAccess.updateDocument('products-index', 'product', productId, body);
 }