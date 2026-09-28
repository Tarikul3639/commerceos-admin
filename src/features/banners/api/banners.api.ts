import { baseApi } from "@/lib/api/base-api"

import type {
    Banner,
    BannersResponse,
    CreateBanner,
    UpdateBanner,
    BannerQueryParams,
} from "../types/banners.types"

export const bannersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBanner: builder.mutation<Banner, CreateBanner>({
            query: (body) => ({
                url: "/banners",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Banner", id: "LIST" }],
        }),

        getBanners: builder.query<BannersResponse, BannerQueryParams | void>({
            query: (params) => ({
                url: "/banners",
                method: "GET",
                ...(params && { params }),
            }),

            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({
                            type: "Banner" as const,
                            id,
                        })),
                        {
                            type: "Banner" as const,
                            id: "LIST",
                        },
                    ]
                    : [
                        {
                            type: "Banner" as const,
                            id: "LIST",
                        },
                    ],
        }),

        getBanner: builder.query<Banner, string>({
            query: (id) => ({
                url: `/banners/${id}`,
                method: "GET",
            }),

            providesTags: (_result, _error, id) => [
                {
                    type: "Banner",
                    id,
                },
            ],
        }),

        updateBanner: builder.mutation<
            Banner,
            {
                id: string
                data: UpdateBanner
            }
        >({
            query: ({ id, data }) => ({
                url: `/banners/${id}`,
                method: "PATCH",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                {
                    type: "Banner",
                    id,
                },
                {
                    type: "Banner",
                    id: "LIST",
                },
            ],
        }),

        deleteBanner: builder.mutation<void, string>({
            query: (id) => ({
                url: `/banners/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: (_result, _error, id) => [
                {
                    type: "Banner",
                    id,
                },
                {
                    type: "Banner",
                    id: "LIST",
                },
            ],
        }),
    }),
})

export const {
    useCreateBannerMutation,
    useGetBannersQuery,
    useGetBannerQuery,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = bannersApi
