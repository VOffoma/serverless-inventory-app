import * as uuid from 'uuid';
import { DBAccess } from '../dataLayer/dbAccess';
import { Shipment, ShipmentStatus } from '../models';
import { PaginationInfo } from '../types';

const dbAccess = new DBAccess(process.env.SHIPMENTS_TABLE);

export async function getAllShipments(paginationInfo: PaginationInfo): Promise<any> {
    return dbAccess.getAllRecords(paginationInfo);
}

export async function createShipment(shipment): Promise<Shipment> {

    return await dbAccess.createRecord({
        shipmentId: uuid.v4(),
        orderId: shipment.orderId,
        shipped: shipment.item,
        status: ShipmentStatus.Pending
    });
}




