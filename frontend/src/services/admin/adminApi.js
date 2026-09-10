import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseApi,
    tagTypes: ['AdminStats', 'AdminUsers'],
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/admin/dashboard',
            providesTags: ['AdminStats']
        }),
        getAllUsers: builder.query({
            query: () => '/admin/users',
            providesTags: ['AdminUsers']
        }),
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/admin/users/${id}/role`,
                method: 'PATCH',
                body: { role }
            }),
            invalidatesTags: ['AdminUsers', 'AdminStats']
        })
    })
});

export const {
    useGetDashboardStatsQuery,
    useGetAllUsersQuery,
    useUpdateUserRoleMutation
} = adminApi;