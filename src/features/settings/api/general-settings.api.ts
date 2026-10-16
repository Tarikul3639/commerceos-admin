import { baseApi } from "@/lib/api/base-api"

import type {
    GeneralSettings,
    UpdateGeneralSettingsRequest,
} from "../types/general-settings.types"

export const generalSettingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGeneralSettings: builder.query<GeneralSettings, void>({
            query: () => "/settings",
            providesTags: ["General"],
        }),

        updateGeneralSettings: builder.mutation<
            GeneralSettings,
            UpdateGeneralSettingsRequest
        >({
            query: (body) => ({
                url: "/settings",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["General"],
        }),
    }),
})

export const {
    useGetGeneralSettingsQuery,
    useUpdateGeneralSettingsMutation,
} = generalSettingsApi