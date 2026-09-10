import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RedirectPath, Button, Image, AdminTable, AdminTableHead, ProductModal, CategoryModal } from "../components";
import conf from "../conf/conf.js";
import {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "../services/admin/adminApi";
import {
  useGetAllOrdersAdminQuery,
  useUpdateOrderStatusAdminMutation,
} from "../services/orders/ordersApi";
import { useGetFilteredProductsQuery, useUpdateProductStockMutation, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from "../services/products/productsApi";
import { useGetAllCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from "../services/category/categoryApi";
import { useGetUserProfileQuery } from "../services/users/userApi";
import { categorySlug } from "../utils/slug.js";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [roleMessage, setRoleMessage] = useState(null);
  const [orderMessage, setOrderMessage] = useState(null);
  const [orderFilter, setOrderFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productError, setProductError] = useState(null);
  const [productMessage, setProductMessage] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [categoryMessage, setCategoryMessage] = useState(null);

  const { data: userProfile, isLoading: profileLoading } = useGetUserProfileQuery();
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: productsData, isLoading: productsLoading } = useGetFilteredProductsQuery({ limit: 100 });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersAdminQuery();

  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [updateOrderStatus] = useUpdateOrderStatusAdminMutation();
  const [updateProductStock] = useUpdateProductStockMutation();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const stats = statsData?.stats;
  const users = usersData?.users || [];
  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];
  const orders = ordersData?.orders || [];

  const currentUser = userProfile?.user;
  const isAdmin = currentUser?.role === "admin";

  const [stockFilter, setStockFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  const productStock = (p) =>
    (p.variants || []).reduce((acc, v) => acc + (v.quantity || 0), 0);

  const lowStockProducts = products.filter((p) => {
    const total = productStock(p);
    return total > 0 && total <= 5;
  });

  const outOfStockProducts = products.filter((p) => productStock(p) <= 0);

  const lowStockCount = lowStockProducts.length;

  const visibleProducts =
    stockFilter === "low"
      ? lowStockProducts
      : stockFilter === "out"
        ? outOfStockProducts
        : products;

  const searchedProducts = visibleProducts.filter((p) =>
    p.title?.toLowerCase().includes(productSearch.trim().toLowerCase())
  );

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const shippedOrders = orders.filter((o) => o.status === "shipped");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      orderFilter === "all" ? true : order.status?.toLowerCase() === orderFilter.toLowerCase();

    const searchLower = orderSearch.trim().toLowerCase();
    if (!searchLower) return matchesFilter;

    const matchesSearch =
      order._id?.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower) ||
      order.shippingInfo?.toLowerCase().includes(searchLower) ||
      order.items?.some((item) => item.title?.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  const backendBase = (conf.backendUrl || "http://localhost:3000/api").replace(
    /\/api\/?$/,
    ""
  );

  const resolveImageUrl = (imgSrc) => {
    if (!imgSrc) return "/images/arrival1.png";
    if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) return imgSrc;
    if (imgSrc.startsWith("/images/")) return imgSrc;
    return `${backendBase}${imgSrc.startsWith("/") ? "" : "/"}${imgSrc}`;
  };

  const handleSetStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setOrderMessage(null);
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      setOrderMessage({
        type: "success",
        text: `Order #${orderId.slice(-6).toUpperCase()} status successfully updated to "${newStatus.toUpperCase()}"!`,
      });
      setTimeout(() => setOrderMessage(null), 4000);
    } catch (err) {
      setOrderMessage({
        type: "error",
        text: err?.data?.message || "Failed to update order status.",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };


  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === "admin" ? "customer" : "admin";
    setRoleMessage(null);
    try {
      await updateUserRole({ id: userId, role: nextRole }).unwrap();
      setRoleMessage({
        type: "success",
        text: `User role successfully updated to ${nextRole}!`,
      });
      setTimeout(() => setRoleMessage(null), 4000);
    } catch (err) {
      setRoleMessage({
        type: "error",
        text: err?.data?.message || "Failed to update user role.",
      });
    }
  };

  const openProductModal = (prod) => {
    setEditingProduct(prod || null);
    setProductError(null);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (payload) => {
    setProductSaving(true);
    setProductError(null);
    try {
      if (editingProduct) {
        const origCategoryId = String(
          editingProduct.category?._id || editingProduct.category || ""
        );
        const origImages = editingProduct.images || [];
        const origVariants = (editingProduct.variants || []).map((v) => ({
          size: String(v.size),
          quantity: Number(v.quantity),
        }));
        const detailsChanged =
          payload.title !== (editingProduct.title || "") ||
          payload.description !== (editingProduct.description || "") ||
          Number(payload.price) !== Number(editingProduct.price || 0) ||
          Number(payload.discountRate) !== Number(editingProduct.discountRate || 0) ||
          String(payload.category || "") !== origCategoryId ||
          payload.images.length !== origImages.length ||
          payload.images.some((img, i) => img !== origImages[i]);
        const variantsChanged =
          payload.variants.length !== origVariants.length ||
          payload.variants.some(
            (v, i) =>
              v.size !== origVariants[i]?.size ||
              Number(v.quantity) !== Number(origVariants[i]?.quantity)
          );
        if (!detailsChanged && !variantsChanged) {
          setProductModalOpen(false);
          setEditingProduct(null);
          return;
        }
        if (!detailsChanged && variantsChanged) {
          await updateProductStock({
            id: editingProduct._id,
            variants: payload.variants,
          }).unwrap();
          setProductMessage({ type: "success", text: "Stock updated successfully!" });
        } else {
          await updateProduct({ id: editingProduct._id, ...payload }).unwrap();
          setProductMessage({ type: "success", text: "Product updated successfully!" });
        }
      } else {
        await createProduct(payload).unwrap();
        setProductMessage({ type: "success", text: "Product added successfully!" });
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      setTimeout(() => setProductMessage(null), 4000);
    } catch (err) {
      setProductError(err?.data?.message || "Failed to save product.");
    } finally {
      setProductSaving(false);
    }
  };

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Delete "${prod.title}" permanently?`)) return;
    try {
      await deleteProduct(prod._id).unwrap();
      setProductMessage({ type: "success", text: "Product deleted successfully!" });
      setTimeout(() => setProductMessage(null), 4000);
    } catch (err) {
      setProductMessage({
        type: "error",
        text: err?.data?.message || "Failed to delete product.",
      });
    }
  };

  const openCategoryModal = (cat) => {
    setEditingCategory(cat || null);
    setCategoryError(null);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async ({ name }) => {
    setCategorySaving(true);
    setCategoryError(null);
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, name }).unwrap();
        setCategoryMessage({ type: "success", text: "Category updated successfully!" });
      } else {
        await createCategory({ name }).unwrap();
        setCategoryMessage({ type: "success", text: "Category added successfully!" });
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
      setTimeout(() => setCategoryMessage(null), 4000);
    } catch (err) {
      setCategoryError(err?.data?.message || "Failed to save category.");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}" permanently?`)) return;
    try {
      await deleteCategory(cat._id).unwrap();
      setCategoryMessage({ type: "success", text: "Category deleted successfully!" });
      setTimeout(() => setCategoryMessage(null), 4000);
    } catch (err) {
      setCategoryMessage({
        type: "error",
        text: err?.data?.message || "Failed to delete category.",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return {
          badgeClass: "bg-green-100 text-green-800 border-green-200",
          dotClass: "bg-green-500",
          label: "Delivered",
        };
      case "shipped":
        return {
          badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
          dotClass: "bg-blue-500",
          label: "Shipped",
        };
      case "pending":
      default:
        return {
          badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
          dotClass: "bg-amber-500",
          label: "Pending",
        };
    }
  };

  if (profileLoading || ordersLoading) {
    return (
      <main className="w-full font-satoshi-regular px-4 lg:px-24 py-16 animate-pulse">
        <div className="h-8 bg-black/10 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-black/5 rounded-[20px]"></div>
          ))}
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="w-full font-satoshi-regular px-4 lg:px-24 py-20 text-center">
        <h2 className="font-integral-bold text-28 text-black mb-4">
          Access Denied
        </h2>
        <p className="text-black/60 mb-6 max-w-md mx-auto">
          You must be signed in with an Administrator account to view the admin control panel.
        </p>
        <Link to="/login">
          <Button variant="primary">Sign In as Admin</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: "Admin Dashboard", to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-integral-bold text-28 lg:text-36 text-black uppercase">
              ADMIN DASHBOARD
            </h1>
            <p className="font-satoshi-regular text-sm text-black/60 mt-1">
              Manage live customer orders, order fulfillment status, inventory &amp; roles
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-full text-xs font-satoshi-bold transition-all cursor-pointer ${activeTab === "orders"
                  ? "bg-black text-white"
                  : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                }`}
            >
              Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-full text-xs font-satoshi-bold transition-all cursor-pointer ${activeTab === "products"
                  ? "bg-black text-white"
                  : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                }`}
            >
              Products ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-full text-xs font-satoshi-bold transition-all cursor-pointer ${activeTab === "users"
                  ? "bg-black text-white"
                  : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                }`}
            >
              Users &amp; Roles ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-full text-xs font-satoshi-bold transition-all cursor-pointer ${activeTab === "categories"
                  ? "bg-black text-white"
                  : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                }`}
            >
              Categories ({categories.length})
            </button>
          </div>
        </div>

        {orderMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-satoshi-medium transition-all flex items-center justify-between ${orderMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-redAlpha60 text-red border border-red/20"
              }`}
          >
            <span>{orderMessage.text}</span>
            <button
              onClick={() => setOrderMessage(null)}
              className="text-xs font-satoshi-bold ml-4 opacity-60 hover:opacity-100"
            >
              &times;
            </button>
          </div>
        )}

        {roleMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-satoshi-medium transition-all flex items-center justify-between ${roleMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-redAlpha60 text-red border border-red/20"
              }`}
          >
            <span>{roleMessage.text}</span>
            <button
              onClick={() => setRoleMessage(null)}
              className="text-xs font-satoshi-bold ml-4 opacity-60 hover:opacity-100"
            >
              &times;
            </button>
          </div>
        )}

        {productMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-satoshi-medium transition-all flex items-center justify-between ${productMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-redAlpha60 text-red border border-red/20"
              }`}
          >
            <span>{productMessage.text}</span>
            <button
              onClick={() => setProductMessage(null)}
              className="text-xs font-satoshi-bold ml-4 opacity-60 hover:opacity-100"
            >
              &times;
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
          <div className="border border-blackAlpha10 rounded-[20px] p-5 bg-white flex flex-col justify-between">
            <span className="font-satoshi-regular text-xs sm:text-sm text-black/60">
              Total Revenue
            </span>
            <div className="my-2">
              <span className="font-satoshi-bold text-24 lg:text-32 text-black">
                ${stats?.totalRevenue ?? 0}
              </span>
            </div>
            <span className="font-satoshi-medium text-xs text-green-600">
              Live DB Sales
            </span>
          </div>

          <div className="border border-blackAlpha10 rounded-[20px] p-5 bg-white flex flex-col justify-between">
            <span className="font-satoshi-regular text-xs sm:text-sm text-black/60">
              Total Orders
            </span>
            <div className="my-2">
              <span className="font-satoshi-bold text-24 lg:text-32 text-black">
                {orders.length || stats?.totalOrders || 0}
              </span>
            </div>
            <span className="font-satoshi-medium text-xs text-black/60">
              <span className="text-amber-600 font-satoshi-bold">{pendingOrders.length} Pending</span>
            </span>
          </div>

          <div className="border border-blackAlpha10 rounded-[20px] p-5 bg-white flex flex-col justify-between">
            <span className="font-satoshi-regular text-xs sm:text-sm text-black/60">
              Total Products
            </span>
            <div className="my-2">
              <span className="font-satoshi-bold text-24 lg:text-32 text-black">
                {stats?.totalProducts ?? products.length}
              </span>
            </div>
            <span className="font-satoshi-medium text-xs text-black/60">
              Active Catalog
            </span>
          </div>

          <div className="border border-blackAlpha10 rounded-[20px] p-5 bg-white flex flex-col justify-between">
            <span className="font-satoshi-regular text-xs sm:text-sm text-black/60">
              Low Stock Alert
            </span>
            <div className="my-2">
              <span className="font-satoshi-bold text-24 lg:text-32 text-red">
                {lowStockCount}
              </span>
            </div>
            <span className="font-satoshi-medium text-xs text-red">
              Threshold &le; 5 units
            </span>
          </div>
        </div>

        {activeTab === "orders" && (
          <div className="border border-blackAlpha10 rounded-[20px] p-5 lg:p-6 bg-white overflow-hidden space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-black/10">
              <div>
                <h3 className="font-satoshi-bold text-lg lg:text-xl text-black">
                  Customer Orders &amp; Fulfillment
                </h3>
                <p className="text-xs text-black/60 mt-0.5">
                  Update order status directly or cycle with quick toggle buttons
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by ID, customer, item..."
                    className="w-full text-xs font-satoshi-regular px-3 py-2 bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:outline-none placeholder:text-black/40"
                  />
                  {orderSearch && (
                    <button
                      type="button"
                      onClick={() => setOrderSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/40 hover:text-black"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-[#F0F0F0] p-1 rounded-full text-xs font-satoshi-medium">
                  <button
                    type="button"
                    onClick={() => setOrderFilter("all")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${orderFilter === "all"
                        ? "bg-black text-white"
                        : "text-black/60 hover:text-black"
                      }`}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter("pending")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${orderFilter === "pending"
                        ? "bg-amber-500 text-white"
                        : "text-black/60 hover:text-black"
                      }`}
                  >
                    Pending ({pendingOrders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter("shipped")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${orderFilter === "shipped"
                        ? "bg-blue-600 text-white"
                        : "text-black/60 hover:text-black"
                      }`}
                  >
                    Shipped ({shippedOrders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter("delivered")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${orderFilter === "delivered"
                        ? "bg-green-600 text-white"
                        : "text-black/60 hover:text-black"
                      }`}
                  >
                    Delivered ({deliveredOrders.length})
                  </button>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-[#F0F0F0]/50 rounded-2xl p-6">
                <p className="font-satoshi-bold text-base text-black mb-1">
                  No orders found
                </p>
                <p className="text-xs text-black/60">
                  {orderSearch || orderFilter !== "all"
                    ? "Try adjusting your search query or status filter."
                    : "When customers place orders, they will appear here."}
                </p>
              </div>
            ) : (
              <AdminTable minWidth="760px">
                  <AdminTableHead>
                      <th className="pb-3 pr-4 whitespace-nowrap">Order ID &amp; Date</th>
                      <th className="pb-3 px-4 whitespace-nowrap">Customer</th>
                      <th className="pb-3 px-4 whitespace-nowrap">Items Summary</th>
                      <th className="pb-3 px-4 whitespace-nowrap text-right">Total</th>
                      <th className="pb-3 pl-4 whitespace-nowrap">Fulfillment Status</th>
                  </AdminTableHead>
                  <tbody className="divide-y divide-black/10 text-sm">
                    {filteredOrders.map((order) => {
                      const badge = getStatusBadge(order.status);
                      const isUpdating = updatingOrderId === order._id;
                      const isExpanded = expandedOrderId === order._id;
                      const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      const orderTime = new Date(order.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <React.Fragment key={order._id}>
                          <tr className="hover:bg-black/[0.015] transition-colors">
                            <td className="py-4 pr-4">
                              <span className="font-satoshi-bold text-black block">
                                #{order._id.slice(-6).toUpperCase()}
                              </span>
                              <span className="text-xs text-black/50 block mt-0.5">
                                {orderDate} &bull; {orderTime}
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              <span className="font-satoshi-medium text-black block">
                                {order.user?.name || "Customer"}
                              </span>
                              <span className="text-xs text-black/50 block truncate max-w-[160px]">
                                {order.user?.email || "—"}
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedOrderId(isExpanded ? null : order._id)
                                }
                                className="text-left group cursor-pointer"
                              >
                                {(order.items || []).map((it, idx) => (
                                  <span
                                    key={idx}
                                    className="block text-xs font-satoshi-medium text-black whitespace-nowrap"
                                  >
                                    {it.title} ({it.size})×{it.quantity}
                                  </span>
                                ))}
                                <span className="text-[10px] text-black/40 group-hover:underline">
                                  {isExpanded ? "▲ Hide" : "▼ Show"}
                                </span>
                              </button>
                            </td>

                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <span className="font-satoshi-bold text-black">
                                ${order.total}
                              </span>
                              {order.couponApplied && (
                                <span className="block text-[10px] text-green-700 font-satoshi-medium">
                                  Coupon: {order.couponApplied} (-${order.discount})
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-satoshi-bold uppercase border ${badge.badgeClass}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`}
                                  ></span>
                                  {order.status}
                                </span>

                                <select
                                  value={order.status}
                                  disabled={isUpdating}
                                  onChange={(e) => handleSetStatus(order._id, e.target.value)}
                                  className="text-xs font-satoshi-medium border border-black/20 rounded-lg px-2 py-1 bg-white text-black cursor-pointer hover:border-black focus:outline-none disabled:opacity-40"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                </select>
                              </div>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-[#F0F0F0]/40">
                              <td colSpan={5} className="p-4 lg:p-6 rounded-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                  <div>
                                    <h5 className="font-satoshi-bold text-sm text-black mb-3">
                                      Order Items ({order.items?.length || 0})
                                    </h5>
                                    <div className="space-y-3">
                                      {(order.items || []).map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-black/5"
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-10 h-10 bg-[#F0EEED] rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                                              <Image
                                                src={resolveImageUrl(item.product?.images?.[0])}
                                                alt={item.title}
                                                className="max-h-full max-w-full object-contain"
                                              />
                                            </div>
                                            <div className="min-w-0">
                                              <p className="font-satoshi-bold text-black truncate">
                                                {item.title}
                                              </p>
                                              <p className="text-black/50 text-[11px]">
                                                Size: {item.size} &bull; Qty: {item.quantity}
                                              </p>
                                            </div>
                                          </div>
                                          <span className="font-satoshi-bold text-black flex-shrink-0">
                                            ${item.priceAtPurchase * item.quantity}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="bg-white p-3.5 rounded-xl border border-black/5">
                                      <h5 className="font-satoshi-bold text-sm text-black mb-1.5">
                                        Shipping Destination
                                      </h5>
                                      <p className="text-black/70">{order.shippingInfo}</p>
                                      <p className="text-black/50 text-[11px] mt-2">
                                        Recipient: {order.user?.name} ({order.user?.email})
                                      </p>
                                    </div>

                                    <div className="bg-white p-3.5 rounded-xl border border-black/5 space-y-1.5">
                                      <div className="flex justify-between text-black/60">
                                        <span>Subtotal</span>
                                        <span className="font-satoshi-bold text-black">
                                          ${order.subtotal}
                                        </span>
                                      </div>
                                      {order.discount > 0 && (
                                        <div className="flex justify-between text-black/60">
                                          <span>
                                            Discount{" "}
                                            {order.couponApplied
                                              ? `(${order.couponApplied})`
                                              : ""}
                                          </span>
                                          <span className="font-satoshi-bold text-red">
                                            -${order.discount}
                                          </span>
                                        </div>
                                      )}
                                      <hr className="border-black/10 my-1" />
                                      <div className="flex justify-between text-sm font-satoshi-bold text-black">
                                        <span>Total Amount</span>
                                        <span>${order.total}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
              </AdminTable>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="border border-blackAlpha10 rounded-[20px] p-5 lg:p-6 bg-white overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
              <h3 className="font-satoshi-bold text-lg lg:text-xl text-black">
                Products Inventory &amp; Stock Levels
              </h3>
              <button
                type="button"
                onClick={() => openProductModal(null)}
                className="text-xs px-4 py-2 rounded-full bg-black text-white font-satoshi-bold hover:bg-black/80 transition-colors whitespace-nowrap"
              >
                + Add Product
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              {[
                { key: "all", label: `All (${products.length})` },
                { key: "low", label: `Low Stock (${lowStockProducts.length})` },
                { key: "out", label: `Out of Stock (${outOfStockProducts.length})` },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setStockFilter(option.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-satoshi-bold transition-all cursor-pointer ${
                    stockFilter === option.key
                      ? "bg-black text-white"
                      : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {visibleProducts.length === 0 ? (
              <div className="text-center py-12 bg-[#F0F0F0]/50 rounded-2xl p-6">
                <p className="font-satoshi-bold text-base text-black mb-1">
                  No products found
                </p>
                <p className="text-xs text-black/60">
                  No products match the selected stock filter.
                </p>
              </div>
            ) : (
              <AdminTable minWidth="720px">
                  <AdminTableHead>
                    <th className="pb-3 pr-4 whitespace-nowrap">Product Title</th>
                    <th className="pb-3 px-4 whitespace-nowrap">Category</th>
                    <th className="pb-3 px-4 whitespace-nowrap text-right">Price</th>
                    <th className="pb-3 px-4 whitespace-nowrap text-right">Total Stock</th>
                    <th className="pb-3 px-4 whitespace-nowrap">Stock Status</th>
                    <th className="pb-3 pl-4 whitespace-nowrap text-right">Action</th>
                  </AdminTableHead>
                <tbody className="divide-y divide-black/10 text-sm">
                  {visibleProducts.map((prod) => {
                    const totalQty = (prod.variants || []).reduce(
                      (acc, v) => acc + (v.quantity || 0),
                      0
                    );
                    const isOut = totalQty <= 0;
                    const isLow = !isOut && totalQty <= 5;

                    return (
                      <tr key={prod._id || prod.id} className="hover:bg-black/[0.02]">
                        <td className="py-4 pr-4 font-satoshi-bold text-black">
                          <Link
                            to={`/product/${prod._id || prod.id}`}
                            className="hover:underline"
                          >
                            {prod.title}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-black/70">
                          {prod.category?.name || "Apparel"}
                        </td>
                        <td className="py-4 px-4 font-satoshi-bold text-black">
                          ${prod.price}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-satoshi-bold">{totalQty}</span>
                          <span className="text-xs text-black/40 block">
                            {(prod.variants || [])
                              .map((v) => `${v.size}: ${v.quantity}`)
                              .join(", ")}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-satoshi-bold ${isOut
                                ? "bg-redAlpha60 text-red"
                                : isLow
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                          >
                            {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openProductModal(prod)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-black/10 hover:border-black text-black/60 hover:text-black font-satoshi-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-redAlpha60 text-red font-satoshi-medium hover:bg-red/20 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </AdminTable>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="border border-blackAlpha10 rounded-[20px] p-5 lg:p-6 bg-white overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-satoshi-bold text-lg lg:text-xl text-black">
                Registered Users &amp; Role Management
              </h3>
            </div>

            <AdminTable minWidth="640px">
                  <AdminTableHead>
                    <th className="pb-3 pr-4 whitespace-nowrap">User Name</th>
                    <th className="pb-3 px-4 whitespace-nowrap">Email</th>
                    <th className="pb-3 px-4 whitespace-nowrap">Current Role</th>
                    <th className="pb-3 px-4 whitespace-nowrap">Address</th>
                    <th className="pb-3 pl-4 whitespace-nowrap text-right">Role Toggle</th>
                  </AdminTableHead>
                <tbody className="divide-y divide-black/10 text-sm">
                  {users.map((u) => {
                    const isTargetAdmin = u.role === "admin";
                    const isSelf = u._id === currentUser?._id;

                    return (
                      <tr key={u._id} className="hover:bg-black/[0.02]">
                        <td className="py-4 pr-4 font-satoshi-bold text-black">
                          {u.name} {isSelf && <span className="text-xs text-black/40">(You)</span>}
                        </td>
                        <td className="py-4 px-4 text-black/70">{u.email}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-satoshi-bold uppercase ${isTargetAdmin
                                ? "bg-black text-white"
                                : "bg-[#F0F0F0] text-black/70"
                              }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-black/60 text-xs truncate max-w-xs">
                          {u.address || "—"}
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <button
                            type="button"
                            disabled={isUpdatingRole || isSelf}
                            onClick={() => handleToggleRole(u._id, u.role)}
                            className={`text-xs px-3 py-1.5 rounded-full font-satoshi-medium cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isTargetAdmin
                                ? "bg-redAlpha60 text-red hover:bg-red/20"
                                : "bg-black text-white hover:bg-black/80"
                              }`}
                          >
                            {isTargetAdmin ? "Demote to Customer" : "Promote to Admin"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </AdminTable>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="border border-blackAlpha10 rounded-[20px] p-5 lg:p-6 bg-white overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
              <h3 className="font-satoshi-bold text-lg lg:text-xl text-black">
                Product Categories
              </h3>
              <button
                type="button"
                onClick={() => openCategoryModal(null)}
                className="text-xs px-4 py-2 rounded-full bg-black text-white font-satoshi-bold hover:bg-black/80 transition-colors whitespace-nowrap"
              >
                + Add Category
              </button>
            </div>

            {categoryMessage && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-satoshi-medium flex items-center justify-between ${categoryMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-redAlpha60 text-red border border-red/20"
                  }`}
              >
                <span>{categoryMessage.text}</span>
                <button
                  onClick={() => setCategoryMessage(null)}
                  className="text-xs font-satoshi-bold ml-4 opacity-60 hover:opacity-100"
                >
                  &times;
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const count = products.filter(
                  (p) =>
                    p.category?._id === cat._id ||
                    p.category === cat._id ||
                    p.category?.name?.toLowerCase() === cat.name?.toLowerCase()
                ).length;

                return (
                  <div
                    key={cat._id}
                    className="border border-black/10 rounded-2xl p-5 flex flex-col justify-between bg-[#F0F0F0]/30"
                  >
                    <div>
                      <h4 className="font-satoshi-bold text-lg text-black mb-1">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-black/60">/{categorySlug(cat)}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs font-satoshi-bold text-black/70">
                        {count} Products
                      </span>
                      <Link
                        to={`/category/${categorySlug(cat)}`}
                        className="text-xs font-satoshi-bold underline text-black hover:opacity-70"
                      >
                        View &rarr;
                      </Link>
                    </div>
                    <div className="mt-3 pt-3 border-t border-black/10 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openCategoryModal(cat)}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-black/10 hover:border-black text-black/60 hover:text-black font-satoshi-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        disabled={count > 0}
                        title={
                          count > 0
                            ? `Cannot delete: ${count} product${count === 1 ? "" : "s"} still in this category`
                            : "Delete category"
                        }
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-redAlpha60 text-red font-satoshi-medium hover:bg-red/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-redAlpha60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {categoryModalOpen && (
        <CategoryModal
          key={editingCategory?._id || "new"}
          category={editingCategory}
          saving={categorySaving}
          error={categoryError}
          onClose={() => {
            setCategoryModalOpen(false);
            setEditingCategory(null);
            setCategoryError(null);
          }}
          onSubmit={handleSaveCategory}
        />
      )}

      {productModalOpen && (
        <ProductModal
          key={editingProduct?._id || "new"}
          product={editingProduct}
          categories={categories}
          saving={productSaving}
          error={productError}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
            setProductError(null);
          }}
          onSubmit={handleSaveProduct}
        />
      )}

    </main>
  );
}

export default AdminDashboard;