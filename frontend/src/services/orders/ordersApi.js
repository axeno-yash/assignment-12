import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: baseApi,
    tagTypes: ['Orders', 'Cart', 'Products', 'AdminStats'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData
            }),
            invalidatesTags: ['Orders', 'Cart', 'Products', 'AdminStats']
        }),
        getMyOrders: builder.query({
            query: () => '/orders',
            providesTags: ['Orders']
        }),
        getOrderDetails: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Orders', id }]
        }),
        getAllOrdersAdmin: builder.query({
            query: () => '/orders/admin/all',
            providesTags: ['Orders']
        }),
        updateOrderStatusAdmin: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/admin/${id}/status`,
                method: 'PATCH',
                body: { status }
            }),
            invalidatesTags: ['Orders', 'AdminStats']
        })
    })
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery,
    useGetAllOrdersAdminQuery,
    useUpdateOrderStatusAdminMutation
} = ordersApi;