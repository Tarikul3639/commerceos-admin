import { baseApi } from "@/lib/api/base-api"
import type {
  AdjustStockRequest,
  Stock,
  StockQueryParams,
  StockResponse,
} from "../types/stock.types"

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.query<StockResponse, StockQueryParams | void>({
      query: (params) => ({
        url: "/stocks",
        method: "GET",
        ...(params && { params }),
      }),
      providesTags: ["Stock"],
    }),
    adjustStock: builder.mutation<Stock, AdjustStockRequest>({
      query: (body) => ({
        url: "/stocks/adjust",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Stock", "Product", "Dashboard"],
    }),
  }),
})

export const { useGetStocksQuery, useAdjustStockMutation } = stockApi
