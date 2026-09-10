import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: baseApi,
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => '/products',
            providesTags: ['Products']
        }),
        getProductDetails: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }]
        }),
        getNewProducts: builder.query({
            query: () => '/products?sort=newest&limit=4',
            providesTags: ['Products']
        }),
        getFilteredProducts: builder.query({
            query: (filters = {}) => {
                const cleanParams = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        cleanParams.append(key, value);
                    }
                });
                const queryString = cleanParams.toString();
                return `/products${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['Products']
        }),
        updateProductStock: builder.mutation({
            query: ({ id, variants }) => ({
                url: `/products/${id}/stock`,
                method: 'PATCH',
                body: { variants },
            }),
            invalidatesTags: ['Products'],
        }),
        createProduct: builder.mutation({
            query: (body) => ({
                url: '/products',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Products'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
    })
});

export const {
    useGetAllProductsQuery,
    useGetProductDetailsQuery,
    useGetNewProductsQuery,
    useGetFilteredProductsQuery,
    useUpdateProductStockMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi;