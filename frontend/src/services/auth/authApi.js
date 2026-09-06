import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../baseApi";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseApi,
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (formData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: formData
            })
        }),
        loginUser: builder.mutation({
            query: (body) => ({
                url: '/auth/signin',
                method: 'POST',
                body
            })
        }),
        logoutUser: builder.query({
            query: () => '/auth/logout'
        })
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserQuery
} = authApi;