import { baseApi } from "@/lib/api/base-api"

import type {
    ProductImage,
    ProductImageRequest,
} from "../types/product-image.types"

const productTags = (id: string) => [
    "Product" as const,
    { type: "Product" as const, id },
]

export const productImageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addProductImage: builder.mutation<
            ProductImage[],
            { productId: string; data: { images: ProductImageRequest[] } }
        >({
            query: ({ productId, data }) => ({
                url: `/admin/product-images/${productId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { productId }) =>
                productTags(productId),
        }),

        getProductImages: builder.query<ProductImage[], string>({
            query: (productId) => ({
                url: `/admin/product-images/${productId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, productId) => productTags(productId),
        }),

        updateProductImage: builder.mutation<
            ProductImage,
            {
                productId: string
                imageId: string
                data: Partial<ProductImageRequest>
            }
        >({
            query: ({ imageId, data }) => ({
                url: `/admin/product-images/${imageId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { productId }) =>
                productTags(productId),
        }),

        deleteProductImage: builder.mutation<
            ProductImage,
            { productId: string; imageId: string }
        >({
            query: ({ imageId }) => ({
                url: `/admin/product-images/${imageId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { productId }) =>
                productTags(productId),
        }),
    }),
})

export const {
    useAddProductImageMutation,
    useGetProductImagesQuery,
    useUpdateProductImageMutation,
    useDeleteProductImageMutation,
} = productImageApi
