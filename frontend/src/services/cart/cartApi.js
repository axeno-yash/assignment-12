import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: baseApi,
    endpoints: (builder) => ({
        addToCart: builder.mutation({
            query: (formData) => ({
                url: '/cart/items',
                method: 'POST',
                body: formData
            })
        }),
        getCart: builder.query({
            query: () => '/cart'
        }),
        removeFromCart: builder.mutation({
            query: (productId, size) => ({
                url: `/cart/items/${productId}/${size}`,
                method: 'DELETE'
            })
        }),
        clearCart: builder.mutation({
            query: () => ({
                url: '/cart/clear',
                method: 'DELETE'
            })
        }),
        updateCartItem: builder.mutation({
            query: (formData) => ({
                url: '/cart/items',
                method: 'PUT',
                body: formData
            })
        })
    })
})

export const {
    useAddToCartMutation,
    useGetCartQuery,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useUpdateCartItemMutation
} = cartApi;