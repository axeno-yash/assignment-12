import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: baseApi,
    tagTypes: ['Categories'],
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Categories']
        }),
        getCategoryProducts: builder.query({
            query: (category) => `/products?category=${category}`,
            providesTags: ['Categories']
        }),
        createCategory: builder.mutation({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Categories']
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Categories']
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories']
        })
    })
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryProductsQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;