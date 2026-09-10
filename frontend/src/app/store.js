import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "../services/admin/adminApi.js";
import { authApi } from "../services/auth/authApi.js";
import { cartApi } from "../services/cart/cartApi.js";
import { categoryApi } from "../services/category/categoryApi.js";
import { ordersApi } from "../services/orders/ordersApi.js";
import { productsApi } from "../services/products/productsApi.js";
import { reviewsApi } from "../services/reviews/reviewsApi.js";
import { userApi } from "../services/users/userApi.js";

const store = configureStore({
    reducer: {
        [adminApi.reducerPath]: adminApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            authApi.middleware,
            cartApi.middleware,
            categoryApi.middleware,
            ordersApi.middleware,
            productsApi.middleware,
            reviewsApi.middleware,
            adminApi.middleware
        ),
});

export default store;