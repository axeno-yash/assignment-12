import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseApi,
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/admin/dashboard'
        }),
        getAllUsers: builder.query({
            query: () => '/admin/users'
        }),
        getAllProducts: builder.query({
            query: () => '/admin/products'
        }),
        getAllOrders: builder.query({
            query: () => '/admin/orders'
        }),
        updateUserRole: builder.mutation({
            query: (userData) => ({
                url: '/admin/user/role',
                method: 'PATCH',
                body: userData
            })
        })
    })
})

export const {
    useGetDashboardStatsQuery,
    useGetAllUsersQuery,
    useGetAllProductsQuery,
    useGetAllOrdersQuery,
    useUpdateUserRoleMutation
} = adminApi;