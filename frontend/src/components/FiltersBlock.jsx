import React from "react";
import Image from "./Image";
import Button from "./Button";

const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];

const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

const dressStyles = ["Casual", "Formal", "Party", "Gym"];

function FiltersBlock({ onClose, className = "" }) {
  return (
    <aside
      className={`w-full lg:w-295 ${
        onClose ? "border-0 p-0" : "border border-blackAlpha10 p-5 lg:py-5 lg:px-6"
      } rounded-20 flex flex-col gap-6 bg-white h-fit ${className}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-satoshi-bold text-xl text-black">Filters</h3>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1.5 hover:opacity-70 transition-opacity"
            aria-label="Close filters"
          >
            <Image src="/icons/cross-black.svg" alt="close" className="w-4 h-4" />
          </button>
        ) : (
          <Image
            src="/icons/filter.svg"
            alt="filters"
            className="w-5 h-5 opacity-40 cursor-pointer hover:opacity-100 transition-opacity"
          />
        )}
      </div>

      <hr className="border-blackAlpha10" />

      <ul className="flex flex-col gap-4 list-none">
        {categories.map((cat, idx) => (
          <li key={idx}>
            <a
              href="#"
              className="font-satoshi-regular text-base text-black/60 hover:text-black flex justify-between items-center transition-colors"
            >
              <span>{cat}</span>
              <Image src="/icons/arrow.svg" alt="arrow" className="w-1.5" />
            </a>
          </li>
        ))}
      </ul>

      <hr className="border-blackAlpha10" />

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center cursor-pointer">
          <h4 className="font-satoshi-bold text-xl text-black">Price</h4>
          <Image src="/icons/up-arrowkey.svg" alt="collapse" className="w-3" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative flex items-center w-full my-2">
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="w-3/5 h-full bg-black rounded-full mx-auto" />
            </div>
            <div className="absolute left-[20%] w-5 h-5 bg-black rounded-full cursor-pointer shadow" />
            <div className="absolute right-[20%] w-5 h-5 bg-black rounded-full cursor-pointer shadow" />
          </div>
          <div className="flex justify-between text-sm font-satoshi-medium text-black px-4">
            <span>$50</span>
            <span>$200</span>
          </div>
        </div>
      </div>

      <hr className="border-blackAlpha10" />

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center cursor-pointer">
          <h4 className="font-satoshi-bold text-xl text-black">Size</h4>
          <Image src="/icons/up-arrowkey.svg" alt="collapse" className="w-3" />
        </div>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`px-5 py-2.5 rounded-full text-sm font-satoshi-regular cursor-pointer transition-colors ${
                size === "Large"
                  ? "bg-black text-white font-satoshi-medium"
                  : "bg-gray-100 text-black/60 hover:bg-black/10"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-blackAlpha10" />

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center cursor-pointer">
          <h4 className="font-satoshi-bold text-xl text-black">Dress Style</h4>
          <Image src="/icons/up-arrowkey.svg" alt="collapse" className="w-3" />
        </div>

        <ul className="flex flex-col gap-4 list-none">
          {dressStyles.map((style, idx) => (
            <li key={idx}>
              <a
                href="#"
                className="font-satoshi-regular text-base text-black/60 hover:text-black flex justify-between items-center transition-colors"
              >
                <span>{style}</span>
                <Image src="/icons/arrow.svg" alt="arrow" className="w-1.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="primary"
        onClick={onClose}
        className="w-full py-4 text-sm font-satoshi-medium mt-1"
      >
        Apply Filter
      </Button>
    </aside>
  );
}

export default FiltersBlock;