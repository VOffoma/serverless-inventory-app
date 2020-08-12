import * as uuid from 'uuid';
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




