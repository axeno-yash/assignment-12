import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RedirectPath, Image, Button } from "../components";
import conf from "../conf/conf.js";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useApplyCouponMutation,
} from "../services/cart/cartApi";
import { useCreateOrderMutation } from "../services/orders/ordersApi";
import { useGetUserProfileQuery } from "../services/users/userApi";

function Cart() {
  const navigate = useNavigate();

  const { data: userData, isLoading: userLoading } = useGetUserProfileQuery();
  const { data: cartData, isLoading: cartLoading, error: cartError } = useGetCartQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [createOrder, { isLoading: isCheckingOut }] = useCreateOrderMutation();

  const [couponCode, setCouponCode] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  const cart = cartData?.cart;
  const items = cart?.items || [];
  console.log("cartData", items);

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

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      const p = item.product;
      if (!p) return acc;
      const discounted = p.discountRate
        ? p.price * (1 - p.discountRate / 100)
        : p.price;
      return acc + discounted * item.quantity;
    }, 0);
  };

  const rawSubtotal = calculateSubtotal();
  const subtotal = Math.round(rawSubtotal);
  const couponApplied = cart?.couponApplied;

  let discountAmount = 0;
  if (couponApplied === "SAVE10") {
    discountAmount = Math.round(rawSubtotal * 0.1);
  } else if (couponApplied === "SAVE20") {
    discountAmount = Math.round(rawSubtotal * 0.2);
  }

  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleUpdateQuantity = async (productId, size, currentQty, delta) => {
    const newQty = currentQty + delta;
    setStatusMessage(null);
    try {
      if (newQty <= 0) {
        await removeFromCart({ productId, size }).unwrap();
      } else {
        await updateCartItem({ productId, size, quantity: newQty }).unwrap();
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Could not update item quantity.",
      });
    }
  };

  const handleRemoveItem = async (productId, size) => {
    setStatusMessage(null);
    try {
      await removeFromCart({ productId, size }).unwrap();
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Could not remove item.",
      });
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setStatusMessage(null);
    const code = couponCode.trim().toUpperCase();
    if (code !== "SAVE10" && code !== "SAVE20") {
      setStatusMessage({
        type: "error",
        text: "Invalid promo code. Please use SAVE10 or SAVE20.",
      });
      return;
    }

    try {
      await applyCoupon({ coupon: code }).unwrap();
      setStatusMessage({
        type: "success",
        text: `Coupon ${code} applied successfully!`,
      });
      setCouponCode("");
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to apply coupon.",
      });
    }
  };

  const handleCheckout = async () => {
    setStatusMessage(null);
    const address = shippingAddress.trim() || userData?.user?.address;
    if (!address || address.length < 5) {
      setStatusMessage({
        type: "error",
        text: "Please provide a valid shipping address (at least 5 characters).",
      });
      return;
    }

    try {
      const res = await createOrder({
        shippingInfo: address,
        couponApplied: couponApplied || undefined,
      }).unwrap();

      setStatusMessage({
        type: "success",
        text: "Order placed successfully! Redirecting to orders...",
      });
      setTimeout(() => {
        navigate(`/order/${res.order?._id || ""}`);
      }, 1500);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Checkout failed. Please check stock and details.",
      });
    }
  };

  if (cartLoading || userLoading) {
    return (
      <main className="w-full font-satoshi-regular px-4 lg:px-24 py-16 animate-pulse">
        <div className="h-8 bg-black/10 rounded w-48 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 h-64 bg-black/5 rounded-[20px]"></div>
          <div className="w-full lg:w-96 h-64 bg-black/5 rounded-[20px]"></div>
        </div>
      </main>
    );
  }

  if (cartError && !userData?.user) {
    return (
      <main className="w-full font-satoshi-regular px-4 lg:px-24 py-20 text-center">
        <h2 className="font-integral-bold text-28 text-black mb-4">
          Please Sign In
        </h2>
        <p className="text-black/60 mb-6">
          You must be logged in to view your shopping cart and complete purchases.
        </p>
        <Link to="/login">
          <Button variant="primary">Sign In to Your Account</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: "Cart", to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-20">
        <h1 className="font-integral-bold text-32 lg:text-40 text-black uppercase mb-6">
          YOUR CART
        </h1>

        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-satoshi-medium transition-all ${statusMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-redAlpha60 text-red border border-red/20"
              }`}
          >
            {statusMessage.text}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#F0F0F0]/60 rounded-[20px] p-8 max-w-xl mx-auto">
            <h3 className="font-integral-bold text-24 text-black mb-3">
              YOUR CART IS EMPTY
            </h3>
            <p className="text-sm text-black/60 mb-8 max-w-sm mx-auto">
              Looks like you haven&apos;t added anything to your cart yet. Explore our top products!
            </p>
            <Link to="/category/all">
              <Button variant="primary" className="px-8">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:flex-1 border border-black/10 rounded-[20px] p-4 lg:p-6 space-y-4 bg-white">
              {items.map((item, idx) => {
                const product = item.product || {};
                const prodId = product._id || item.product;
                const title = product.title || "Product";
                const size = item.size;
                const quantity = item.quantity;
                const image = resolveImageUrl(product?.images?.[0]);

                const unitPrice = product.discountRate
                  ? Math.round(product.price * (1 - product.discountRate / 100))
                  : product.price || 0;

                return (
                  <React.Fragment key={`${prodId}-${size}-${idx}`}>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 bg-[#F0EEED] rounded-[13px] overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                        <Image
                          src={image}
                          alt={title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              to={`/product/${prodId}`}
                              className="font-satoshi-bold text-base lg:text-lg text-black hover:underline line-clamp-1"
                            >
                              {title}
                            </Link>
                            <p className="text-xs text-black/60 mt-0.5">
                              Size: <span className="text-black font-satoshi-medium">{size}</span>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(prodId, size)}
                            className="cursor-pointer p-1 text-red hover:opacity-70"
                            aria-label="Remove item"
                          >
                            <Image
                              src="/icons/delete.svg"
                              alt="delete"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="font-satoshi-bold text-lg lg:text-xl text-black">
                            ${unitPrice}
                          </span>

                          <div className="flex items-center justify-between w-24 h-8 bg-[#F0F0F0] rounded-full px-2.5">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleUpdateQuantity(prodId, size, quantity, -1)}
                              className="text-base font-satoshi-bold text-black cursor-pointer hover:opacity-70 disabled:opacity-40"
                            >
                              -
                            </button>
                            <span className="font-satoshi-bold text-xs text-black">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleUpdateQuantity(prodId, size, quantity, 1)}
                              className="text-base font-satoshi-bold text-black cursor-pointer hover:opacity-70 disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {idx < items.length - 1 && (
                      <hr className="border-black/10 my-4" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="w-full lg:w-[420px] border border-black/10 rounded-[20px] p-5 lg:p-6 bg-white space-y-5">
              <h2 className="font-satoshi-bold text-xl lg:text-24 text-black">
                Order Summary
              </h2>

              <div className="space-y-3 font-satoshi-regular text-sm lg:text-base">
                <div className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span className="font-satoshi-bold text-black">${subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-black/60">
                    <span>Discount ({couponApplied})</span>
                    <span className="font-satoshi-bold text-red">-${discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-black/60">
                  <span>Delivery Fee</span>
                  <span className="font-satoshi-bold text-black">${deliveryFee}</span>
                </div>

                <hr className="border-black/10 my-3" />

                <div className="flex justify-between text-base lg:text-xl font-satoshi-bold text-black">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="flex-1 bg-[#F0F0F0] rounded-full px-4 flex items-center gap-2">
                  <Image src="/icons/coupon.svg" alt="promo" className="w-4 h-4 opacity-40" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Add promo code (SAVE10, SAVE20)"
                    className="w-full bg-transparent border-none outline-none text-xs font-satoshi-medium text-black py-3 uppercase"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  variant="primary"
                  className="px-5 py-3 text-xs font-satoshi-medium rounded-full disabled:opacity-50"
                >
                  {isApplyingCoupon ? "..." : "Apply"}
                </Button>
              </form>

              <div className="space-y-2">
                <label className="block text-xs font-satoshi-medium text-black/70">
                  Shipping Address
                </label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder={userData?.user?.address || "Enter street address, city, state"}
                  className="w-full bg-[#F0F0F0] rounded-xl px-4 py-3 text-xs font-satoshi-regular text-black outline-none border border-transparent focus:border-black/20"
                />
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="w-full py-4 text-sm font-satoshi-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  "Processing Order..."
                ) : (
                  <>
                    <span>Go to Checkout</span>
                    <span className="text-base">&rarr;</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;