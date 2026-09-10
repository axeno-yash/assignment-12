import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseApi,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => "/user/profile",
            providesTags: ["User"],
        }),
        updateUserProfile: builder.mutation({
            query: (body) => ({
                url: "/user/profile",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
} = userApi;