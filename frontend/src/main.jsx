import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import {
  Home,
  Login,
  Register,
  Product,
  Cart,
  Order,
  AdminDashboard,
  Category,
} from "./pages/index.js";
import { Provider } from "react-redux";
import store from "./app/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="product/:id" element={<Product />} />
      <Route path="cart" element={<Cart />} />
      <Route path="cart/:id" element={<Cart />} />
      <Route path="orders" element={<Order />} />
      <Route path="order/:id" element={<Order />} />
      <Route path="category/:id" element={<Category />} />
      <Route path="admin" element={<AdminDashboard />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
