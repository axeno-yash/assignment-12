import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseApi,
    tagTypes: ['User', 'Cart', 'Orders'],
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (formData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['User']
        }),
        loginUser: builder.mutation({
            query: (body) => ({
                url: '/auth/signin',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User', 'Cart', 'Orders']
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'GET'
            }),
            invalidatesTags: ['User', 'Cart', 'Orders']
        })
    })
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation
} = authApi;