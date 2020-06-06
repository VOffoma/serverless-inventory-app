export interface PaginationInfo {
   limit: number,
   nextKey: object
}

export interface CreateProductRequest {
   productName: string
   mass_g: number
   quantity: number
 }