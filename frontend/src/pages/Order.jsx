import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RedirectPath, Image, Button } from "../components";
import conf from "../conf/conf.js";
import {
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
} from "../services/orders/ordersApi";
import { useGetUserProfileQuery } from "../services/users/userApi";
import { useLogoutUserMutation } from "../services/auth/authApi";
import { formatMoney } from "../utils/money.js";

function Order() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userData, isLoading: userLoading } = useGetUserProfileQuery();
  const [logoutUser] = useLogoutUserMutation();

  const { data: myOrdersData, isLoading: ordersLoading } = useGetMyOrdersQuery(
    undefined,
    { skip: Boolean(id), refetchOnMountOrArgChange: true }
  );
  console.log("myOrdersData", myOrdersData);

  const { data: singleOrderData, isLoading: singleOrderLoading } =
    useGetOrderDetailsQuery(id, { skip: !id });
  console.log("singleOrderData", singleOrderData);

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      navigate("/login");
    } catch {
      navigate("/login");
    }
  };

  if (userLoading || (id ? singleOrderLoading : ordersLoading)) {
    return (
      <main className="w-full font-satoshi-regular px-4 lg:px-24 py-16 animate-pulse">
        <div className="h-8 bg-black/10 rounded w-48 mb-8"></div>
        <div className="space-y-4">
          <div className="h-40 bg-black/5 rounded-[20px]"></div>
          <div className="h-40 bg-black/5 rounded-[20px]"></div>
        </div>
      </main>
    );
  }

  if (!userData?.user) {
    return (
      <main className="w-full font-satoshi-regular px-4 lg:px-24 py-20 text-center">
        <h2 className="font-integral-bold text-28 text-black mb-4">
          Please Sign In
        </h2>
        <p className="text-black/60 mb-6">
          You must be logged in to view your orders and profile.
        </p>
        <Link to="/login">
          <Button variant="primary">Sign In to Your Account</Button>
        </Link>
      </main>
    );
  }

  if (id) {
    const order = singleOrderData?.order;

    if (!order) {
      return (
        <main className="w-full font-satoshi-regular px-4 lg:px-24 py-20 text-center">
          <h2 className="font-integral-bold text-24 text-black mb-4">
            Order Not Found
          </h2>
          <p className="text-black/60 mb-6">
            We could not find an order matching #{id}.
          </p>
          <Link to="/orders">
            <Button variant="outline">Back to My Orders</Button>
          </Link>
        </main>
      );
    }

    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return (
      <main className="w-full font-satoshi-regular">
        <hr className="border-black/10 mx-4 lg:mx-24" />

        <RedirectPath
          paths={[
            { label: "Home", to: "/" },
            { label: "Orders", to: "/orders" },
            { label: `Order #${order._id.slice(-6).toUpperCase()}`, to: null },
          ]}
        />

        <section className="px-4 lg:px-24 pb-20 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="font-integral-bold text-28 lg:text-36 text-black uppercase">
                ORDER #{order._id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-xs sm:text-sm text-black/60 mt-1">
                Placed on {orderDate} &bull; ID: {order._id}
              </p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-satoshi-bold uppercase border self-start sm:self-auto ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <div className="border border-black/10 rounded-[20px] p-6 bg-white space-y-6">
            <div className="space-y-4 divide-y divide-black/10">
              {order.items.map((item, idx) => {
                const prod = item.product || {};
                const image = resolveImageUrl(prod?.images?.[0]);

                return (
                  <div key={idx} className="flex items-center gap-4 pt-4 first:pt-0">
                    <div className="w-20 h-20 bg-[#F0EEED] rounded-xl overflow-hidden p-2 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={image}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={item.product?._id ? `/product/${item.product._id}` : "#"}
                        className="font-satoshi-bold text-base text-black hover:underline truncate block"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-black/60 mt-0.5">
                        Size: <span className="text-black font-satoshi-medium">{item.size}</span> | Qty: <span className="text-black font-satoshi-medium">{item.quantity}</span>
                      </p>
                    </div>
                    <span className="font-satoshi-bold text-base lg:text-lg text-black">
                      ${formatMoney(item.priceAtPurchase * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <hr className="border-black/10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2 bg-[#F0F0F0]/50 p-4 rounded-xl">
                <h4 className="font-satoshi-bold text-black">Shipping Information</h4>
                <p className="text-black/70">{order.shippingInfo}</p>
                <p className="text-black/60 text-xs mt-2">
                  Customer: {userData?.user?.name} ({userData?.user?.email})
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span className="font-satoshi-bold text-black">${formatMoney(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-black/60">
                    <span>Discount {order.couponApplied ? `(${order.couponApplied})` : ""}</span>
                    <span className="font-satoshi-bold text-red">-${formatMoney(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-black/60">
                  <span>Delivery</span>
                  <span className="font-satoshi-bold text-black">${formatMoney(order.deliveryFee ?? 0)}</span>
                </div>
                <hr className="border-black/10" />
                <div className="flex justify-between text-base font-satoshi-bold text-black pt-1">
                  <span>Total Paid</span>
                  <span>${formatMoney(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link to="/orders">
                <Button variant="outline" className="text-xs py-2 px-4">
                  &larr; Back to All Orders
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const orders = myOrdersData?.orders || [];

  return (
    <main className="w-full font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: "My Account & Orders", to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-20">
        <div className="border border-black/10 rounded-[20px] p-6 bg-white mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white font-integral-bold text-xl flex items-center justify-center">
              {userData?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-satoshi-bold text-xl text-black">
                  {userData?.user?.name}
                </h2>
                <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-black/10 font-satoshi-bold">
                  {userData?.user?.role}
                </span>
              </div>
              <p className="text-xs text-black/60 mt-0.5">
                {userData?.user?.email} &bull; {userData?.user?.address || "No address set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userData?.user?.role === "admin" && (
              <Link to="/admin">
                <Button variant="outline" className="text-xs py-2 px-4">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-xs py-2 px-4 text-red border-red/30 hover:bg-redAlpha60"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <h1 className="font-integral-bold text-28 lg:text-36 text-black uppercase mb-6">
          ORDER HISTORY ({orders.length})
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[#F0F0F0]/60 rounded-[20px] p-8 max-w-lg mx-auto">
            <h3 className="font-integral-bold text-20 text-black mb-2">
              NO ORDERS FOUND
            </h3>
            <p className="text-sm text-black/60 mb-6">
              You haven&apos;t placed any orders yet. Start exploring our collections!
            </p>
            <Link to="/category/all">
              <Button variant="primary">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={order._id}
                  className="border border-black/10 rounded-[20px] p-5 lg:p-6 bg-white flex flex-col gap-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/10">
                    <div className="flex items-center gap-3">
                      <h3 className="font-satoshi-bold text-base lg:text-lg text-black">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-satoshi-bold uppercase border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="font-satoshi-regular text-xs text-black/60">
                      Placed on {orderDate}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 divide-y divide-black/10">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 pt-3 first:pt-0"
                      >
                        <div className="w-14 h-14 rounded-lg bg-[#F0EEED] p-1.5 flex items-center justify-center flex-shrink-0">
                          <Image
                            src="/icons/cart.svg"
                            alt="product"
                            className="w-6 h-6 opacity-40"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-satoshi-bold text-sm text-black truncate">
                            {item.title}
                          </h4>
                          <p className="font-satoshi-regular text-xs text-black/60 mt-0.5">
                            Size: {item.size} &bull; Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-satoshi-bold text-sm lg:text-base text-black">
                          ${formatMoney(item.priceAtPurchase * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/10">
                    <div className="flex items-center gap-2">
                      <span className="font-satoshi-regular text-xs text-black/60">
                        Total Amount:
                      </span>
                      <span className="font-satoshi-bold text-base lg:text-lg text-black">
                        ${formatMoney(order.total)}
                      </span>
                    </div>

                    <Link to={`/order/${order._id}`}>
                      <Button
                        variant="primary"
                        className="px-5 py-2 text-xs font-satoshi-medium"
                      >
                        View Order Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Order;