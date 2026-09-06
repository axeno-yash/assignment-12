import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  RedirectPath,
  FiltersBlock,
  ProductBlock,
  Button,
  Image,
} from "../components";

const categoryProducts = [
  {
    _id: "1",
    title: "Gradient Graphic T-shirt",
    image: "/images/arrival1.png",
    rating: 3.5,
    price: 145,
    originalPrice: 242,
    discount: 20,
  },
  {
    _id: "2",
    title: "Polo with Tipping Details",
    image: "/images/arrival2.png",
    rating: 4.5,
    price: 180,
    originalPrice: 242,
    discount: 20,
  },
  {
    _id: "3",
    title: "Black Striped T-shirt",
    image: "/images/arrival4.png",
    rating: 4.0,
    price: 120,
    originalPrice: 150,
    discount: 30,
  },
  {
    _id: "4",
    title: "Skinny Fit Jeans",
    image: "/images/arrival2.png",
    rating: 3.5,
    price: 240,
    originalPrice: 260,
    discount: 20,
  },
  {
    _id: "5",
    title: "Checkered Shirt",
    image: "/images/arrival3.png",
    rating: 4.5,
    price: 180,
  },
  {
    _id: "6",
    title: "Sleeve Striped T-shirt",
    image: "/images/arrival4.png",
    rating: 4.5,
    price: 130,
    originalPrice: 160,
    discount: 30,
  },
  {
    _id: "7",
    title: "Vertical Striped Shirt",
    image: "/images/topselling1.png",
    rating: 5.0,
    price: 212,
    originalPrice: 232,
    discount: 20,
  },
  {
    _id: "8",
    title: "Courage Oversized T-shirt",
    image: "/images/topselling2.png",
    rating: 4.0,
    price: 145,
  },
  {
    _id: "9",
    title: "Loose Fit Bermuda Shorts",
    image: "/images/topselling3.png",
    rating: 3.0,
    price: 80,
  },
];

function Category() {
  const { id = "casual" } = useParams();
  const categoryName = (id || "Casual").charAt(0).toUpperCase() + (id || "Casual").slice(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <main className="w-full font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: categoryName, to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-satoshi-bold text-28 lg:text-32 text-black">
              {categoryName}
            </h1>
            <span className="text-xs lg:text-sm text-black/60 pt-1">
              Showing 1-9 of 100 Products
            </span>
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden w-8 h-8 bg-[#F0F0F0] rounded-full flex items-center justify-center cursor-pointer"
            aria-label="Open Filters"
          >
            <Image src="/icons/filter.svg" alt="filters" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-5">
          <div className="hidden lg:block w-[295px] flex-shrink-0">
            <FiltersBlock />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mb-9">
              {categoryProducts.map((prod) => (
                <ProductBlock key={prod._id} product={prod} />
              ))}
            </div>

            <hr className="border-black/10 mb-8" />

            <div className="flex justify-between items-center">
              <Button variant="outline" className="py-2.5 px-4 text-xs md:text-sm">
                &larr; Previous
              </Button>
              <div className="flex items-center gap-1.5 text-xs md:text-sm font-satoshi-medium">
                <span className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center font-satoshi-bold text-black">
                  1
                </span>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-black/60">
                  2
                </span>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-black/60">
                  ...
                </span>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-black/60">
                  9
                </span>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-black/60">
                  10
                </span>
              </div>
              <Button variant="outline" className="py-2.5 px-4 text-xs md:text-sm">
                Next &rarr;
              </Button>
            </div>
          </div>
        </div>
      </section>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[150] bg-black/50 flex flex-col justify-end lg:hidden">
          <div
            className="fixed inset-0"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative z-10 bg-white rounded-t-[20px] max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <FiltersBlock onClose={() => setMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </main>
  );
}

export default Category;