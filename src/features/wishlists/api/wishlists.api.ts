import { baseApi } from "@/lib/api/base-api"
import type {
  WishlistQueryParams,
  WishlistsResponse,
} from "../types/wishlist.types"

export const wishlistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlists: builder.query<WishlistsResponse, WishlistQueryParams | void>({
      query: (params) => ({
        url: "/admin/wishlists",
        method: "GET",
        ...(params && { params }),
      }),
    }),
  }),
})

export const { useGetWishlistsQuery } = wishlistsApi
