export interface ProductItem {
    productId: string
    productName: string
    mass_g: number
    quantity: number
    addedAt: string
    attachmentUrl?: string
  }

  export interface ProductUpdate {
    mass_g: number
    quantity: number
  }

  export enum ShipmentStatus{
    Pending = "PENDING",
    Sent = "SENT"
  }

  export interface Order {
    orderId: string
    requestedItems: object[]
    addedAt: string
    // status: ProcessingStatus
  }

  export interface Shipment {
    shipmentId: string
    orderId: string
    shipped: object[]
    status: ShipmentStatus
  }

  export interface UnfulfilledOrder {
    orderId: string
    productId: string
    quantity: number
    addedAt: string
    // status: ProcessingStatus
  }