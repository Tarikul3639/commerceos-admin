import { baseApi } from "@/lib/api/base-api"

import type {
    Brand,
    BrandsResponse,
    CreateBrand,
    UpdateBrand,
    BrandQueryParams,
} from "../types/brands.types"

export const brandsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBrand: builder.mutation<Brand, CreateBrand>({
            query: (body) => ({
                url: "/brands",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                {
                    type: "Brand",
                    id: "LIST",
                },
            ],
        }),

        getBrands: builder.query<
            BrandsResponse,
            BrandQueryParams | void
        >({
            query: (params) => ({
                url: "/brands",
                method: "GET",
                ...(params && { params }),
            }),

            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({
                            type: "Brand" as const,
                            id,
                        })),
                        {
                            type: "Brand" as const,
                            id: "LIST",
                        },
                    ]
                    : [
                        {
                            type: "Brand" as const,
                            id: "LIST",
                        },
                    ],
        }),

        getBrand: builder.query<Brand, string>({
            query: (id) => ({
                url: `/brands/${id}`,
                method: "GET",
            }),

            providesTags: (_result, _error, id) => [
                {
                    type: "Brand",
                    id,
                },
            ],
        }),

        updateBrand: builder.mutation<
            Brand,
            {
                id: string
                data: UpdateBrand
            }
        >({
            query: ({ id, data }) => ({
                url: `/brands/${id}`,
                method: "PATCH",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                {
                    type: "Brand",
                    id,
                },
                {
                    type: "Brand",
                    id: "LIST",
                },
            ],
        }),

        deleteBrand: builder.mutation<void, string>({
            query: (id) => ({
                url: `/brands/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: (_result, _error, id) => [
                {
                    type: "Brand",
                    id,
                },
                {
                    type: "Brand",
                    id: "LIST",
                },
            ],
        }),
    }),
})

export const {
    useCreateBrandMutation,
    useGetBrandsQuery,
    useGetBrandQuery,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
} = brandsApi