import React from "react";
import { useParams } from "react-router-dom";
import { RedirectPath, Image, Button, Newsletter } from "../components";

const ordersData = [
  {
    id: "ORD-73921",
    date: "Sep 05, 2026",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-700",
    total: 467,
    items: [
      {
        id: 1,
        name: "Gradient Graphic T-shirt",
        size: "Large",
        color: "White",
        price: 145,
        quantity: 1,
        image: "/images/cart1.png",
      },
      {
        id: 2,
        name: "Checkered Shirt",
        size: "Medium",
        color: "Red",
        price: 180,
        quantity: 1,
        image: "/images/arrival3.png",
      },
      {
        id: 3,
        name: "Skinny Fit Jeans",
        size: "Large",
        color: "Blue",
        price: 240,
        quantity: 1,
        image: "/images/arrival2.png",
      },
    ],
  },
  {
    id: "ORD-62810",
    date: "Aug 28, 2026",
    status: "Shipped",
    statusColor: "bg-blue-100 text-blue-700",
    total: 212,
    items: [
      {
        id: 4,
        name: "Vertical Striped Shirt",
        size: "Medium",
        color: "Green",
        price: 212,
        quantity: 1,
        image: "/images/topselling1.png",
      },
    ],
  },
];

function Order() {
  const { id } = useParams();

  return (
    <main className="font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: "Orders", to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-20">
        <h1 className="font-integral-bold text-32 lg:text-40 text-black uppercase mb-6">
          YOUR ORDERS
        </h1>

        <div className="flex flex-col gap-6">
          {ordersData.map((order) => (
            <div
              key={order.id}
              className="border border-blackAlpha10 rounded-[20px] p-5 lg:p-6 bg-white flex flex-col gap-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <h3 className="font-satoshi-bold text-base lg:text-xl text-black">
                    Order {order.id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-satoshi-medium ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
                <span className="font-satoshi-regular text-sm text-black/60">
                  Placed on {order.date}
                </span>
              </div>

              <div className="flex flex-col gap-4 divide-y divide-black/10">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pt-4 first:pt-0"
                  >
                    <div className="w-[72px] h-[72px] lg:w-[90px] lg:h-[90px] rounded-xl bg-[#F0EEED] p-2 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-satoshi-bold text-sm lg:text-base text-black truncate">
                        {item.name}
                      </h4>
                      <p className="font-satoshi-regular text-xs text-black/60 mt-0.5">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="font-satoshi-medium text-xs text-black mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-satoshi-bold text-base lg:text-xl text-black flex-shrink-0">
                      ${item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/10">
                <div className="flex items-center gap-2">
                  <span className="font-satoshi-regular text-sm text-black/60">
                    Total Amount:
                  </span>
                  <span className="font-satoshi-bold text-lg lg:text-xl text-black">
                    ${order.total}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="px-5 py-2.5 text-xs lg:text-sm"
                  >
                    Track Order
                  </Button>
                  <Button
                    variant="primary"
                    className="px-5 py-2.5 text-xs lg:text-sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Order;