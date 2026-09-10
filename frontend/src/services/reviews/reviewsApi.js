import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const reviewsApi = createApi({
    reducerPath: 'reviewsApi',
    baseQuery: baseApi,
    endpoints: (builder) => ({
        getReviews: builder.query({
            query: () => `/reviews/`
        })
    })
})

export const {
    useGetReviewsQuery
} = reviewsApi;