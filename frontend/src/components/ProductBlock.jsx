import React from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import conf from "../conf/conf.js";

function ProductBlock({ product, className = "" }) {
  if (!product) return null;
  const id = product._id || product.id;
  const name = product.title || product.name || "Product";
  const backendBase = (conf.backendUrl || "http://localhost:3000/api").replace(/\/api\/?$/, "");
  const imagePath = product?.images?.[0] || "";
  let image = "/images/arrival1.png";
  if (imagePath) {
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      image = imagePath;
    } else if (imagePath.startsWith("/images/")) {
      image = imagePath;
    } else {
      image = `${backendBase}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
    }
  }

  const rating = product.rating || 0;
  const price = product.discountRate ? Math.round(product.price * (1 - product.discountRate / 100)) : product.price;
  const originalPrice = product.discountRate ? product.price : null;
  const discountRate = product.discountRate || "";

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <Link
      to={`/product/${id || ""}`}
      className={`product-card w-full flex flex-col group no-underline min-w-0 ${className}`}
    >
      <div className="bg-[#F0EEED] rounded-[13px] md:rounded-[20px] overflow-hidden aspect-square flex items-center justify-center p-4 mb-3">
        <Image
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h4 className="font-satoshi-bold text-black text-base md:text-xl truncate mb-1">
        {name}
      </h4>

      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Image
              key={`star-${i}`}
              src="/icons/star.svg"
              alt="star"
              className="w-4 h-4 md:w-5 md:h-5"
            />
          ))}
          {hasHalfStar && (
            <Image
              src="/icons/star-half.svg"
              alt="half-star"
              className="w-4 h-4 md:w-5 md:h-5"
            />
          )}
        </div>
        <span className="font-satoshi-regular text-xs md:text-sm text-black">
          {rating}/<span className="opacity-60">5</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-satoshi-bold text-black text-lg md:text-24">
          ${price}
        </span>
        {originalPrice && (
          <span className="font-satoshi-bold text-black/40 line-through text-lg md:text-24">
            ${originalPrice}
          </span>
        )}
        {discountRate && (
          <span className="font-satoshi-medium text-10 text-red bg-redAlpha60 py-1.5 px-3.5 rounded-full">
            -{discountRate}%
          </span>
        )}
      </div>
    </Link>
  );
}

export default ProductBlock;
