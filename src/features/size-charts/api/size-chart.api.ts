import { baseApi } from "@/lib/api/base-api"

import type {
    CreateSizeChartItemRequest,
    CreateSizeChartRequest,
    SizeChart,
    SizeChartQueryParams,
    SizeChartsResponse,
    UpdateSizeChartItemRequest,
    UpdateSizeChartRequest,
} from "../types/size-chart.types"

export const sizeChartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSizeCharts: builder.query<
            SizeChartsResponse,
            SizeChartQueryParams | void
        >({
            query: (params) => ({
                url: "/size-charts",
                method: "GET",
                ...(params && { params }),
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({
                            type: "SizeChart" as const,
                            id,
                        })),
                        {
                            type: "SizeChart" as const,
                            id: "LIST",
                        },
                    ]
                    : [
                        {
                            type: "SizeChart" as const,
                            id: "LIST",
                        },
                    ],
        }),

        getSizeChart: builder.query<SizeChart, string>({
            query: (id) => `/size-charts/${id}`,
            providesTags: (_result, _error, id) => [
                {
                    type: "SizeChart",
                    id,
                },
            ],
        }),

        createSizeChart: builder.mutation<SizeChart, CreateSizeChartRequest>({
            query: (body) => ({
                url: "/size-charts",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                {
                    type: "SizeChart",
                    id: "LIST",
                },
            ],
        }),

        updateSizeChart: builder.mutation<
            SizeChart,
            {
                id: string
                data: UpdateSizeChartRequest
            }
        >({
            query: ({ id, data }) => ({
                url: `/size-charts/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                {
                    type: "SizeChart",
                    id,
                },
                {
                    type: "SizeChart",
                    id: "LIST",
                },
            ],
        }),

        deleteSizeChart: builder.mutation<void, string>({
            query: (id) => ({
                url: `/size-charts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                {
                    type: "SizeChart",
                    id: "LIST",
                },
            ],
        }),

        createSizeChartItem: builder.mutation<
            SizeChart,
            {
                sizeChartId: string
                data: CreateSizeChartItemRequest
            }
        >({
            query: ({ sizeChartId, data }) => ({
                url: `/size-charts/${sizeChartId}/items`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { sizeChartId }) => [
                {
                    type: "SizeChart",
                    id: sizeChartId,
                },
            ],
        }),

        updateSizeChartItem: builder.mutation<
            SizeChart,
            {
                sizeChartId: string
                itemId: string
                data: UpdateSizeChartItemRequest
            }
        >({
            query: ({ sizeChartId, itemId, data }) => ({
                url: `/size-charts/${sizeChartId}/items/${itemId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { sizeChartId }) => [
                {
                    type: "SizeChart",
                    id: sizeChartId,
                },
            ],
        }),

        deleteSizeChartItem: builder.mutation<
            void,
            {
                sizeChartId: string
                itemId: string
            }
        >({
            query: ({ sizeChartId, itemId }) => ({
                url: `/size-charts/${sizeChartId}/items/${itemId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { sizeChartId }) => [
                {
                    type: "SizeChart",
                    id: sizeChartId,
                },
            ],
        }),
    }),
})

export const {
    useGetSizeChartsQuery,
    useGetSizeChartQuery,
    useCreateSizeChartMutation,
    useUpdateSizeChartMutation,
    useDeleteSizeChartMutation,
    useCreateSizeChartItemMutation,
    useUpdateSizeChartItemMutation,
    useDeleteSizeChartItemMutation,
} = sizeChartApi
