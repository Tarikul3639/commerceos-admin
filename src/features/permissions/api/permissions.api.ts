import { baseApi } from "@/lib/api/base-api"
import type {
    RolePermissions,
    UpdateRolePermissionsPayload,
} from "../types/permissions.types"

export const permissionsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRolesPermissions: builder.query<RolePermissions[], void>({
            query: () => ({
                url: "/permissions/roles",
            }),
            providesTags: ["Permissions"],
        }),

        getRolePermissions: builder.query<RolePermissions, string>({
            query: (role) => ({
                url: `/permissions/roles/${role}`,
            }),
            providesTags: ["Permissions"],
        }),

        updateRolePermissions: builder.mutation<
            RolePermissions,
            {
                role: string
                payload: UpdateRolePermissionsPayload
            }
        >({
            query: ({ role, payload }) => ({
                url: `/permissions/roles/${role}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Permissions"],
        }),
    }),
})

export const {
    useGetRolesPermissionsQuery,
    useGetRolePermissionsQuery,
    useUpdateRolePermissionsMutation,
} = permissionsApi
