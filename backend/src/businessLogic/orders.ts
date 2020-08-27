import * as uuid from 'uuid';
import { getSingleProductItem, updateProductItem } from '../businessLogic/products';
import { createShipment } from '../businessLogic/shipment';
import { createUnfulfilledOrder } from '../businessLogic/unfufilledOrders';
import { UpdateProductRequest} from '../types';
import { DBAccess } from '../dataLayer/dbAccess';
import { Order } from '../models';


const dbAccess = new DBAccess(process.env.ORDERS_TABLE);


export async function createOrder(orderItems: object[]): Promise<Order> {

    return await dbAccess.createRecord({
        orderId: uuid.v4(),
        requestedItems: orderItems,
        addedAt: new Date().toISOString()
        //status: ProcessingStatus.Pending
    });
}

export async function processOrderItem(orderItem){
    const {orderId, productId, orderItemQuantity} = orderItem;
    const productInOrderItem = await getSingleProductItem({productId});

    if(orderItemQuantity <= productInOrderItem.quantity){
        const remainingProductQuantity = productInOrderItem.quantity - orderItemQuantity;
        return await Promise.all([
            updateProductQuantity(productInOrderItem, remainingProductQuantity),
            createShipment({orderId, item: {productId, quantity: orderItemQuantity}})
        ]);
    }
    else{
        if(productInOrderItem.quantity == 0){
            return await createUnfulfilledOrder({ orderId, productId, quantity: orderItemQuantity, addedAt: new Date().toISOString() });
        }
        else{
            const remainingQuantityNeeded = orderItemQuantity - productInOrderItem.quantity;
            return await Promise.all([
                updateProductQuantity(productInOrderItem, 0),
                createShipment({orderId, item: {productId, quantity: productInOrderItem.quantity}}),
                createUnfulfilledOrder({orderId, productId, quantity: remainingQuantityNeeded, addedAt: new Date().toISOString() })
            ]);  
        }
    }
}

async function updateProductQuantity (product, newQuantity) {
    const productUpdate: UpdateProductRequest = {
      mass_g: product.mass_g,
      quantity: newQuantity
    }
    await updateProductItem( productUpdate, {productId: product.productId});
}




