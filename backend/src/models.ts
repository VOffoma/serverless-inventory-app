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