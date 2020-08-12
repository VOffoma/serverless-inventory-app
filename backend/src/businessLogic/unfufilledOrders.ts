import { DBAccess } from '../dataLayer/dbAccess';
import { UnfulfilledOrder } from '../models';
import { PaginationInfo } from '../types';

const dbAccess = new DBAccess(process.env.UNFULFILLED_ORDERS_TABLE);

export async function getAllUnfulfilledOrders(paginationInfo: PaginationInfo): Promise<any> {
    return dbAccess.getAllRecords(paginationInfo);
}

export async function createUnfulfilledOrder(unfulfilledOrder: UnfulfilledOrder): Promise<UnfulfilledOrder> {

    return await dbAccess.createRecord(unfulfilledOrder)
}




