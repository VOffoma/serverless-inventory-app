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

  export enum ProcessingStatus{
    Pending = "PENDING",
    Incomplete = "INCOMPLETE",
    Complete = "COMPLETE"
  }

  export interface Order {
    orderId: string
    requestedItems: object[]
    addedAt: string
    status: ProcessingStatus
    userId: string
  }