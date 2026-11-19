import { baseApi } from "@/lib/api/base-api"
import type {
  ShippingSettings,
  ShippingZone,
  ShippingZonePayload,
  UpdateShippingSettingsRequest,
} from "../types/shipping-settings.types"

export const shippingSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingSettings: builder.query<ShippingSettings, void>({
      query: () => "/shipping-settings",
      providesTags: ["Shipping"],
    }),
    updateShippingSettings: builder.mutation<
      { freeShippingThreshold: string | null },
      UpdateShippingSettingsRequest
    >({
      query: (body) => ({ url: "/shipping-settings", method: "PATCH", body }),
      invalidatesTags: ["Shipping"],
    }),
    createShippingZone: builder.mutation<ShippingZone, ShippingZonePayload>({
      query: (body) => ({
        url: "/shipping-settings/zones",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shipping"],
    }),
    updateShippingZone: builder.mutation<
      ShippingZone,
      { id: string; data: Partial<ShippingZonePayload> }
    >({
      query: ({ id, data }) => ({
        url: `/shipping-settings/zones/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Shipping"],
    }),
    deleteShippingZone: builder.mutation<void, string>({
      query: (id) => ({
        url: `/shipping-settings/zones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shipping"],
    }),
  }),
})

export const {
  useGetShippingSettingsQuery,
  useUpdateShippingSettingsMutation,
  useCreateShippingZoneMutation,
  useUpdateShippingZoneMutation,
  useDeleteShippingZoneMutation,
} = shippingSettingsApi
