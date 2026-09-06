import React, { useState } from "react";
import { RedirectPath, Image, Button, Newsletter } from "../components";

const stats = [
  { label: "Total Products", value: "100", change: "+12%" },
  { label: "Total Orders", value: "248", change: "+8%" },
  { label: "Total Revenue", value: "$45,280", change: "+18%" },
  { label: "Low Stock Items", value: "7", change: "Threshold ≤ 5", alert: true },
];

const adminProducts = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    category: "T-shirts",
    price: 145,
    stock: 12,
    status: "In Stock",
    statusClass: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    name: "Polo with Tipping Details",
    category: "Shirts",
    price: 180,
    stock: 4,
    status: "Low Stock",
    statusClass: "bg-yellow-100 text-yellow-700",
  },
  {
    id: 3,
    name: "Black Striped T-shirt",
    category: "T-shirts",
    price: 120,
    stock: 0,
    status: "Out of Stock",
    statusClass: "bg-red-100 text-red",
  },
  {
    id: 4,
    name: "Skinny Fit Jeans",
    category: "Jeans",
    price: 240,
    stock: 28,
    status: "In Stock",
    statusClass: "bg-green-100 text-green-700",
  },
];

const adminCategories = [
  { id: 1, name: "T-shirts", count: 32 },
  { id: 2, name: "Shorts", count: 18 },
  { id: 3, name: "Shirts", count: 24 },
  { id: 4, name: "Hoodie", count: 12 },
  { id: 5, name: "Jeans", count: 14 },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

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
              Manage inventory, categories, products, and store performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveTab("categories")}
              className={`px-5 py-2.5 text-xs lg:text-sm ${
                activeTab === "categories" ? "bg-black text-white" : ""
              }`}
            >
              Categories
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("products")}
              className={`px-5 py-2.5 text-xs lg:text-sm ${
                activeTab === "products" ? "bg-black text-white" : ""
              }`}
            >
              Products
            </Button>
            <Button
              variant="primary"
              className="px-5 py-2.5 text-xs lg:text-sm"
            >
              + Add Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="border border-blackAlpha10 rounded-[20px] p-5 bg-white flex flex-col justify-between"
            >
              <span className="font-satoshi-regular text-xs sm:text-sm text-black/60">
                {stat.label}
              </span>
              <div className="my-2">
                <span className="font-satoshi-bold text-24 lg:text-32 text-black">
                  {stat.value}
                </span>
              </div>
              <span
                className={`font-satoshi-medium text-xs ${
                  stat.alert ? "text-red" : "text-green-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          ))}
        </div>

        {activeTab === "products" ? (
          <div className="border border-blackAlpha10 rounded-[20px] p-5 lg:p-6 bg-white overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-satoshi-bold text-xl text-black">
                Products Inventory
              </h3>
              <span className="font-satoshi-regular text-sm text-black/60">
                Showing {adminProducts.length} items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-xs font-satoshi-medium text-black/60 uppercase">
                    <th className="pb-3 pr-4">Product</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4">Price</th>
                    <th className="pb-3 px-4">Stock</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 font-satoshi-regular text-sm">
                  {adminProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-black/[0.02]">
                      <td className="py-4 pr-4 font-satoshi-medium text-black">
                        {product.name}
                      </td>
                      <td className="py-4 px-4 text-black/60">
                        {product.category}
                      </td>
                      <td className="py-4 px-4 font-satoshi-bold text-black">
                        ${product.price}
                      </td>
                      <td className="py-4 px-4 font-satoshi-medium text-black">
                        {product.stock} pcs
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-satoshi-medium ${product.statusClass}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="text-xs font-satoshi-medium text-black hover:underline cursor-pointer px-2 py-1"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs font-satoshi-medium text-red hover:underline cursor-pointer px-2 py-1"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border border-blackAlpha10 rounded-[20px] p-5 lg:p-6 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-satoshi-bold text-xl text-black">
                Category Management
              </h3>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="New category name"
                  className="bg-gray-100 rounded-full px-4 py-2 text-sm font-satoshi-regular outline-none border-0 w-full sm:w-60"
                />
                <Button
                  variant="primary"
                  className="px-5 py-2 text-xs font-satoshi-medium whitespace-nowrap"
                >
                  Add Category
                </Button>
              </div>
            </div>

            <div className="divide-y divide-black/10">
              {adminCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <h4 className="font-satoshi-bold text-base text-black">
                      {category.name}
                    </h4>
                    <span className="font-satoshi-regular text-xs text-black/60">
                      {category.count} products assigned
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-xs font-satoshi-medium text-black hover:underline cursor-pointer"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="text-xs font-satoshi-medium text-red hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;