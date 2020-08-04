export interface PaginationInfo {
   limit: number
   nextKey: object
}

export interface ProductKey {
   productId: string
  //  addedAt: string
 }

export interface CreateProductRequest {
   productName: string
   mass_g: number
   quantity: number
 }

 export interface UpdateProductRequest {
   mass_g: number
   quantity: number
 }

 export interface CreateOrderRequest {
  requestedItems: object[]
}