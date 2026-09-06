import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseApi,
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData
            })
        }),
        getMyOrders: builder.query({
            query: () => '/orders'
        }),
        getOrderDetails: builder.query({
            query: (id) => `/orders/${id}`
        })
    })
})

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery
} = orderApi;