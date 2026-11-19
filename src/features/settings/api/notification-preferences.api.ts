import { baseApi } from "@/lib/api/base-api"
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from "../types/notification-preferences.types"

export const notificationPreferencesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => "/settings/notification-preferences",
      providesTags: ["NotificationPreferences"],
    }),
    updateNotificationPreferences: builder.mutation<
      NotificationPreferences,
      UpdateNotificationPreferencesRequest
    >({
      query: (body) => ({
        url: "/settings/notification-preferences",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NotificationPreferences"],
    }),
  }),
})

export const {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = notificationPreferencesApi
