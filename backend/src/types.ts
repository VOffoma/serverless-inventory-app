export interface PaginationInfo {
   limit: number
   nextKey: object
}

export interface Key {
   userId: string
   productId: string
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