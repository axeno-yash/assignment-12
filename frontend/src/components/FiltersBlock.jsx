import React, { useState } from "react";
import Image from "./Image";
import Button from "./Button";
import { categorySlug } from "../utils/slug.js";

const PRICE_MIN = 0;
const PRICE_MAX = 500;

const typeOptions = [
  { label: "T-shirts", value: "T-shirt" },
  { label: "Shorts", value: "Shorts" },
  { label: "Shirts", value: "Shirt" },
  { label: "Hoodie", value: "Hoodie" },
  { label: "Jeans", value: "Jeans" },
];

const sizeOptions = ["Small", "Medium", "Large", "X-Large"];


function SectionHeader({ title, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex justify-between items-center cursor-pointer"
    >
      <span className="font-satoshi-bold text-sm text-black">{title}</span>
      <Image
        src={open ? "/icons/up-arrowkey.svg" : "/icons/down-arrowkey.svg"}
        alt="toggle section"
        className="w-3 h-3"
      />
    </button>
  );
}

function FiltersBlock({
  onClose,
  className = "",
  categories = [],
  selectedCategory = "",
  onSelectCategory = () => {},
  minPrice = "",
  maxPrice = "",
  onPriceChange = () => {},
  selectedSize = "",
  onSelectSize = () => {},
  selectedType = "",
  onSelectType = () => {},
  onReset = () => {},
  onApply = () => {},
}) {
  const [open, setOpen] = useState({
    price: true,
    size: true,
    style: true,
  });
  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const [low, setLow] = useState(minPrice ? Number(minPrice) : PRICE_MIN);
  const [high, setHigh] = useState(maxPrice ? Number(maxPrice) : PRICE_MAX);
  const [syncedPrice, setSyncedPrice] = useState(`${minPrice}|${maxPrice}`);
  if (syncedPrice !== `${minPrice}|${maxPrice}`) {
    setSyncedPrice(`${minPrice}|${maxPrice}`);
    setLow(minPrice ? Number(minPrice) : PRICE_MIN);
    setHigh(maxPrice ? Number(maxPrice) : PRICE_MAX);
  }

  const handleApply = () => {
    onPriceChange({
      min: low === PRICE_MIN ? "" : String(low),
      max: high === PRICE_MAX ? "" : String(high),
    });
    if (onApply) onApply();
    if (onClose) onClose();
  };

  const handleReset = () => {
    setLow(PRICE_MIN);
    setHigh(PRICE_MAX);
    if (onReset) onReset();
    if (onClose) onClose();
  };

  const showReset =
    selectedCategory !== "all" ||
    selectedSize ||
    selectedType ||
    minPrice ||
    maxPrice;

  const lowPct = (low / PRICE_MAX) * 100;
  const highPct = (high / PRICE_MAX) * 100;

  const rangeInputClass =
    "absolute w-full appearance-none bg-transparent pointer-events-none h-6 m-0 " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
    "[&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] " +
    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black " +
    "[&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-[18px] " +
    "[&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer";

  return (
    <aside
      className={`w-full lg:w-295 ${
        onClose ? "border-0 p-0" : "border border-blackAlpha10 p-5 lg:py-5 lg:px-6"
      } rounded-20 flex flex-col gap-5 bg-white h-fit ${className}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-satoshi-bold text-sm text-black">Filters</h3>
        <div className="flex items-center gap-2">
          {showReset && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-red hover:underline font-satoshi-medium cursor-pointer"
            >
              Reset
            </button>
          )}
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
              className="w-4 h-4 opacity-60"
            />
          )}
        </div>
      </div>

      <hr className="border-blackAlpha10" />

      <div className="flex flex-col gap-1">
        {typeOptions.map((option) => {
          const isSelected =
            selectedType.toLowerCase() === option.value.toLowerCase();
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onSelectType(isSelected ? "" : option.value)}
              className={`w-full flex justify-between items-center py-1 cursor-pointer transition-colors ${
                isSelected
                  ? "font-satoshi-bold text-black"
                  : "font-satoshi-regular text-sm text-black/50 hover:text-black"
              }`}
            >
              <span className="text-[13px]">{option.label}</span>
              <Image src="/icons/arrow.svg" alt="go" className="w-1.5 opacity-40" />
            </button>
          );
        })}
      </div>

      <hr className="border-blackAlpha10" />

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Price"
          open={open.price}
          onToggle={() => toggle("price")}
        />
        {open.price && (
          <div className="px-1">
            <div className="relative h-7 flex items-center">
              <div className="absolute w-full h-[5px] bg-black/10 rounded-full"></div>
              <div
                className="absolute h-[5px] bg-black rounded-full"
                style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
              ></div>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={low}
                onChange={(e) => setLow(Math.min(Number(e.target.value), high))}
                className={rangeInputClass}
                aria-label="Minimum price"
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={high}
                onChange={(e) => setHigh(Math.max(Number(e.target.value), low))}
                className={rangeInputClass}
                aria-label="Maximum price"
              />
            </div>
            <div className="flex justify-between text-[13px] text-black/60 font-satoshi-medium">
              <span>${low}</span>
              <span>${high}</span>
            </div>
          </div>
        )}
      </div>

      <hr className="border-blackAlpha10" />

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Size"
          open={open.size}
          onToggle={() => toggle("size")}
        />
        {open.size && (
          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map((size) => {
              const isSelected =
                selectedSize.toLowerCase() === size.toLowerCase();
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(isSelected ? "" : size)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-satoshi-medium cursor-pointer transition-all ${
                    isSelected
                      ? "bg-black text-white"
                      : "bg-[#F0F0F0] text-black/50 hover:bg-black/10"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-blackAlpha10" />

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Dress Style"
          open={open.style}
          onToggle={() => toggle("style")}
        />
        {open.style && (
          <div className="flex flex-col gap-1">
            {categories.map((cat) => {
              const catSlug = categorySlug(cat) || cat._id || cat.name;
              const isSelected =
                selectedCategory === cat._id ||
                selectedCategory === catSlug ||
                selectedCategory.toLowerCase() === cat.name?.toLowerCase();
              return (
                <button
                  key={cat._id || cat.name}
                  type="button"
                  onClick={() =>
                    onSelectCategory(isSelected ? "all" : catSlug)
                  }
                  className={`w-full flex justify-between items-center py-1 cursor-pointer transition-colors ${
                    isSelected
                      ? "font-satoshi-bold text-black"
                      : "font-satoshi-regular text-black/50 hover:text-black"
                  }`}
                >
                  <span className="text-[13px]">{cat.name}</span>
                  <Image src="/icons/arrow.svg" alt="go" className="w-1.5 opacity-40" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Button
        variant="primary"
        onClick={handleApply}
        className="w-full !py-2.5 !text-xs font-satoshi-bold"
      >
        Apply Filter
      </Button>
    </aside>
  );
}

export default FiltersBlock;
