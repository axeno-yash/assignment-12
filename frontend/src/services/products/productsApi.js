import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: baseApi,
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => '/products'
        }),
        getProductDetails: builder.query({
            query: (id) => `/products/${id}`
        }),
        getNewProducts: builder.query({
            query: () => '/products/new'
        }),
        getFilteredProducts: builder.query({
            query: (filters) => `/products/filter?${new URLSearchParams(filters).toString()}`
        })
    })
})

export const {
    useGetAllProductsQuery,
    useGetProductDetailsQuery,
    useGetNewProductsQuery,
    useGetFilteredProductsQuery
} = productApi;