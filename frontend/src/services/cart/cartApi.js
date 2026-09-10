import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: baseApi,
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        addToCart: builder.mutation({
            query: (formData) => ({
                url: '/cart/items',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Cart']
        }),
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart']
        }),
        removeFromCart: builder.mutation({
            query: ({ productId, size }) => ({
                url: `/cart/items/${productId}/${size}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Cart']
        }),
        clearCart: builder.mutation({
            query: () => ({
                url: '/cart/clear',
                method: 'DELETE'
            }),
            invalidatesTags: ['Cart']
        }),
        updateCartItem: builder.mutation({
            query: (formData) => ({
                url: '/cart/items',
                method: 'PUT',
                body: formData
            }),
            invalidatesTags: ['Cart']
        }),
        applyCoupon: builder.mutation({
            query: (body) => ({
                url: '/cart/coupon',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Cart']
        })
    })
});

export const {
    useAddToCartMutation,
    useGetCartQuery,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useUpdateCartItemMutation,
    useApplyCouponMutation
} = cartApi;