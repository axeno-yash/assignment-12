import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: baseApi,
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => '/categories'
        }),
        getCategoryProducts: builder.query({
            query: (category) => `/categories/${category}/products`
        })
    })
})

export const {
    useGetAllCategoriesQuery,
    useGetCategoryProductsQuery
} = categoryApi;