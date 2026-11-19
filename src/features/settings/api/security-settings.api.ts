import { baseApi } from "@/lib/api/base-api"
import type {
  SecuritySettings,
  UpdateSecuritySettingsRequest,
} from "../types/security-settings.types"

export const securitySettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecuritySettings: builder.query<SecuritySettings, void>({
      query: () => "/settings/security",
      providesTags: ["SecuritySettings"],
    }),
    updateSecuritySettings: builder.mutation<
      SecuritySettings,
      UpdateSecuritySettingsRequest
    >({
      query: (body) => ({
        url: "/settings/security",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SecuritySettings"],
    }),
  }),
})

export const {
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
} = securitySettingsApi
