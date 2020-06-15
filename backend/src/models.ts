export interface ProductItem {
    productId: string
    userId: string
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