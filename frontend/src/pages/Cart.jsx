import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RedirectPath, Image, Button } from "../components";

const initialCartItems = [
  {
    id: "1",
    title: "Gradient Graphic T-shirt",
    size: "Large",
    color: "White",
    price: 145,
    quantity: 1,
    image: "/images/cart1.png",
  },
  {
    id: "2",
    title: "Checkered Shirt",
    size: "Medium",
    color: "Red",
    price: 180,
    quantity: 1,
    image: "/images/cart2.png",
  },
  {
    id: "3",
    title: "Skinny Fit Jeans",
    size: "Large",
    color: "Blue",
    price: 240,
    quantity: 1,
    image: "/images/cart3.png",
  },
];

function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = discountApplied ? Math.round(subtotal * 0.2) : 0;
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === "discount20") {
      setDiscountApplied(true);
    }
  };

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

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-[#F0F0F0] rounded-[20px]">
            <p className="text-lg text-black/60 mb-4">Your cart is empty.</p>
            <Link to="/category/all">
              <Button>Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="w-full lg:flex-1 border border-black/10 rounded-[20px] p-4 lg:p-6 space-y-4 bg-white">
              {cartItems.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-24 bg-[#F0EEED] rounded-[13px] overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-24">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-satoshi-bold text-base lg:text-xl text-black truncate max-w-[200px] md:max-w-none">
                            {item.title}
                          </h3>
                          <p className="text-xs lg:text-sm text-black/60">
                            Size: <span className="text-black">{item.size}</span>
                          </p>
                          <p className="text-xs lg:text-sm text-black/60">
                            Color: <span className="text-black">{item.color}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="cursor-pointer text-red-500 hover:opacity-70"
                          aria-label="Remove item"
                        >
                          <Image src="/icons/delete.svg" alt="delete" className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-satoshi-bold text-xl lg:text-24 text-black">
                          ${item.price}
                        </span>

                        <div className="flex items-center justify-between w-28 h-9 bg-[#F0F0F0] rounded-full px-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="font-satoshi-bold text-lg text-black cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-satoshi-bold text-sm text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="font-satoshi-bold text-lg text-black cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {idx < cartItems.length - 1 && (
                    <hr className="border-black/10" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="w-full lg:w-[505px] border border-black/10 rounded-[20px] p-5 lg:p-6 bg-white space-y-4">
              <h2 className="font-satoshi-bold text-20 lg:text-24 text-black">
                Order Summary
              </h2>

              <div className="space-y-3 text-base text-black/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-satoshi-bold text-black">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount (-20%)</span>
                  <span className="font-satoshi-bold text-red">-${discountAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-satoshi-bold text-black">${deliveryFee}</span>
                </div>
                <hr className="border-black/10" />
                <div className="flex justify-between text-black text-lg lg:text-xl font-satoshi-bold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              <form onSubmit={handleApplyPromo} className="flex gap-3 pt-2">
                <div className="flex items-center flex-1 h-12 bg-[#F0F0F0] rounded-full px-4 gap-2.5">
                  <Image src="/icons/mail.svg" alt="promo" className="w-4 h-4 opacity-40" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Add promo code"
                    className="w-full border-none outline-none bg-transparent text-sm text-black placeholder:text-black/40"
                  />
                </div>
                <Button type="submit" className="px-6 h-12 text-sm">
                  Apply
                </Button>
              </form>

              <Link to="/order/1">
                <Button className="w-full h-13 mt-4 text-base">
                  Go to Checkout &rarr;
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;