export interface ProductImage {
    id: string
    imageUrl: string
    publicId: string
    sortOrder: number
    productId: string
    createdAt: string
    updatedAt: string
}

export type ProductImageRequest = Omit<
    ProductImage,
    "id" | "productId" | "createdAt" | "updatedAt"
>
