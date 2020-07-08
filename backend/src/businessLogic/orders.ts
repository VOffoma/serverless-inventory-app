import * as uuid from 'uuid';
import { OrderAccess } from '../dataLayer/ordersAccess';
import { Order, ProcessingStatus } from '../models';

const orderAccess = new OrderAccess();


export async function createOrder(orderItems: object[], userId: string)
: Promise<Order> {

    return await orderAccess.createOrder({
        orderId: uuid.v4(),
        requestedItems: orderItems,
        addedAt: new Date().toISOString(),
        userId: userId,
        status: ProcessingStatus.Pending
    });
}




