import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseApi,
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => "/users/profile",
        }),
        updateUserProfile: builder.mutation({
            query: (body) => ({
                url: "/users/profile",
                method: "PUT",
                body,
            }),
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
} = userApi;