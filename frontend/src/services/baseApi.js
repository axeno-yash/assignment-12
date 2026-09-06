import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import conf from '../conf/conf.js'

export const baseApi = fetchBaseQuery({
    baseUrl: conf.backendUrl,
    credentials: 'include',
})