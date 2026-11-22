import { baseApi } from "@/lib/api/base-api"

import type {
  AnnouncementSettings,
  UpdateAnnouncementSettingsRequest,
} from "../types/announcement-settings.types"

export const announcementSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncementSettings: builder.query<AnnouncementSettings, void>({
      query: () => "/settings/announcement",
      providesTags: ["Announcement"],
    }),
    updateAnnouncementSettings: builder.mutation<
      AnnouncementSettings,
      UpdateAnnouncementSettingsRequest
    >({
      query: (body) => ({
        url: "/settings/announcement",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Announcement"],
    }),
  }),
})

export const {
  useGetAnnouncementSettingsQuery,
  useUpdateAnnouncementSettingsMutation,
} = announcementSettingsApi
