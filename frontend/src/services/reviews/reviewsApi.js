import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: baseApi,
    endpoints: (builder) => ({
        getReviews: builder.query({
            query: (productId) => `/reviews/${productId}`
        })
    })
})

export const {
    useGetReviewsQuery
} = reviewApi;