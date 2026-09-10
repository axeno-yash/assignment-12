import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  RedirectPath,
  Image,
  Button,
  ProductBlock,
  ReviewBlock,
} from "../components";
import conf from "../conf/conf.js";
import { useGetReviewsQuery } from "../services/reviews/reviewsApi";
import {
  useGetProductDetailsQuery,
  useGetFilteredProductsQuery,
} from "../services/products/productsApi";
import { useAddToCartMutation } from "../services/cart/cartApi";
import { useGetUserProfileQuery } from "../services/users/userApi";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [actionMessage, setActionMessage] = useState(null);

  const { data: userData } = useGetUserProfileQuery();
  const { data: productData, isLoading, error } = useGetProductDetailsQuery(id);
  const product = productData?.product;

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const { data: reviewsData } = useGetReviewsQuery();
  const reviews = reviewsData?.reviews || [];

  const categoryId =
    typeof product?.category === "object"
      ? product?.category?._id
      : product?.category;
  const categoryName = product?.category?.name || "Shop";

  const { data: relatedData } = useGetFilteredProductsQuery(
    categoryId ? { category: categoryId, limit: 5 } : { limit: 5 },
    { skip: !categoryId }
  );
  const relatedProducts = (relatedData?.products || []).filter(
    (p) => (p._id || p.id) !== id
  ).slice(0, 4);

  const variants = product?.variants || [];
  const selectedVariant = variants.find((v) => v.size === selectedSize) || variants[0];
  const maxStock = selectedVariant?.quantity || 0;
  const isOutOfStock = maxStock <= 0;

  useEffect(() => {
    if (variants.length > 0) {
      const firstInStock = variants.find((v) => v.quantity > 0) || variants[0];
      setSelectedSize(firstInStock.size);
      setSelectedImage(0);
      setQuantity(1);
      setActionMessage(null);
    }
  }, [id, product]);

  const backendBase = (conf.backendUrl || "http://localhost:3000/api").replace(
    /\/api\/?$/,
    ""
  );

  const resolveImageUrl = (imgSrc) => {
    if (!imgSrc) return "/images/product1.png";
    if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) return imgSrc;
    if (imgSrc.startsWith("/images/")) return imgSrc;
    return `${backendBase}${imgSrc.startsWith("/") ? "" : "/"}${imgSrc}`;
  };

  const images =
    product?.images && product.images.length > 0
      ? product.images.map(resolveImageUrl)
      : ["/images/product1.png"];

  const rating = product?.rating || 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const originalPrice = product?.price || 0;
  const discountRate = product?.discountRate || 0;
  const finalPrice = discountRate
    ? Math.round(originalPrice * (1 - discountRate / 100))
    : originalPrice;

  const handleAddToCart = async () => {
    if (!userData?.user) {
      navigate("/login");
      return;
    }

    if (isOutOfStock) {
      setActionMessage({ type: "error", text: "Selected size is currently out of stock." });
      return;
    }

    try {
      await addToCart({
        productId: id,
        size: selectedSize,
        quantity,
      }).unwrap();
      setActionMessage({
        type: "success",
        text: `Added ${quantity} item(s) to your cart!`,
      });
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err?.data?.message || "Could not add item to cart. Please check your login.",
      });
    }
  };

  if (isLoading) {
    return (
      <main className="w-full font-satoshi-regular px-4 lg:px-24 py-12">
        <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
          <div className="w-full lg:w-1/2 aspect-square bg-black/5 rounded-[20px]"></div>
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="h-10 bg-black/5 rounded w-3/4"></div>
            <div className="h-6 bg-black/5 rounded w-1/4"></div>
            <div className="h-8 bg-black/5 rounded w-1/3"></div>
            <div className="h-24 bg-black/5 rounded w-full"></div>
            <div className="h-12 bg-black/5 rounded w-full"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="w-full font-satoshi-regular px-4 lg:px-24 py-20 text-center">
        <h2 className="font-integral-bold text-28 text-black mb-4">
          Product Not Found
        </h2>
        <p className="text-black/60 mb-6">
          The requested product does not exist or has been removed.
        </p>
        <Link to="/category/all">
          <Button variant="primary">Browse All Products</Button>
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
          { label: "Shop", to: "/category/all" },
          { label: categoryName, to: categoryId ? `/category/${categoryId}` : "/category/all" },
          { label: product.title, to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-12 flex flex-col lg:flex-row gap-8 lg:gap-10">
        <div className="flex flex-col-reverse md:flex-row gap-3.5 lg:w-1/2">
          <div className="flex md:flex-col gap-3 justify-between md:justify-start">
            {images.map((imgSrc, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-[111px] h-[106px] rounded-[20px] overflow-hidden bg-[#F0EEED] border-2 cursor-pointer transition-all flex items-center justify-center p-2 ${
                  selectedImage === index
                    ? "border-black"
                    : "border-transparent hover:border-black/30"
                }`}
              >
                <Image
                  src={imgSrc}
                  alt={`Thumbnail ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-[#F0EEED] rounded-[20px] overflow-hidden aspect-square flex items-center justify-center p-6">
            <Image
              src={images[selectedImage] || images[0]}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col">
          <h1 className="font-integral-bold text-28 lg:text-40 text-black uppercase leading-tight mb-3">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-3">
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
            <span className="text-sm text-black">
              {rating}/<span className="opacity-60">5</span>
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="font-satoshi-bold text-24 lg:text-32 text-black">
              ${finalPrice}
            </span>
            {discountRate > 0 && (
              <>
                <span className="font-satoshi-bold text-24 lg:text-32 text-black/40 line-through">
                  ${originalPrice}
                </span>
                <span className="font-satoshi-medium text-xs lg:text-sm text-red bg-redAlpha60 py-1.5 px-3.5 rounded-full">
                  -{discountRate}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm lg:text-base text-black/60 leading-relaxed mb-6">
            {product.description}
          </p>

          <hr className="border-black/10 my-4" />

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm text-black/60 font-satoshi-medium">Choose Size</h3>
              <span className={`text-xs font-satoshi-medium ${isOutOfStock ? "text-red" : "text-black/60"}`}>
                {isOutOfStock
                  ? "Out of stock"
                  : `${maxStock} left in stock`}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {variants.map((variant) => {
                const isSelected = selectedSize === variant.size;
                const isVariantOut = variant.quantity <= 0;

                return (
                  <button
                    key={variant.size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(variant.size);
                      setQuantity(1);
                      setActionMessage(null);
                    }}
                    className={`py-3 px-6 rounded-full text-sm md:text-base font-satoshi-medium transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-black text-white shadow-sm"
                        : isVariantOut
                        ? "bg-[#F0F0F0] text-black/30 line-through"
                        : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-black/10 my-4" />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center justify-between w-full sm:w-40 h-13 bg-[#F0F0F0] rounded-full px-5">
              <button
                type="button"
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-24 font-satoshi-bold text-black cursor-pointer hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="font-satoshi-bold text-base text-black">
                {isOutOfStock ? 0 : quantity}
              </span>
              <button
                type="button"
                disabled={quantity >= maxStock || isOutOfStock}
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                className="text-24 font-satoshi-bold text-black cursor-pointer hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            <Button
              type="button"
              variant="primary"
              disabled={isOutOfStock || isAddingToCart}
              onClick={handleAddToCart}
              className="flex-1 h-13 disabled:opacity-50 disabled:cursor-not-allowed font-satoshi-medium text-base"
            >
              {isAddingToCart
                ? "Adding to Cart..."
                : isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
            </Button>
          </div>

          {actionMessage && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs sm:text-sm font-satoshi-medium transition-all ${
                actionMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-redAlpha60 text-red border border-red/20"
              }`}
            >
              {actionMessage.text}
              {actionMessage.type === "success" && (
                <Link to="/cart" className="ml-2 font-satoshi-bold underline">
                  View Cart
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 lg:px-24 py-8">
        <div className="flex border-b border-black/10 mb-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-4 text-center font-satoshi-medium text-base md:text-xl border-b-2 cursor-pointer transition-colors ${
              activeTab === "details"
                ? "border-black text-black font-satoshi-bold"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-4 text-center font-satoshi-medium text-base md:text-xl border-b-2 cursor-pointer transition-colors ${
              activeTab === "reviews"
                ? "border-black text-black font-satoshi-bold"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            Rating &amp; Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`flex-1 py-4 text-center font-satoshi-medium text-base md:text-xl border-b-2 cursor-pointer transition-colors ${
              activeTab === "faqs"
                ? "border-black text-black font-satoshi-bold"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            FAQs
          </button>
        </div>

        {activeTab === "details" && (
          <div className="py-4 text-black/70 leading-relaxed space-y-4 max-w-2xl">
            <p className="text-base">{product.description}</p>
            <div className="grid grid-cols-2 gap-4 border-t border-black/10 pt-4 text-sm">
              <div>
                <span className="font-satoshi-bold text-black block mb-1">Category</span>
                <span>{categoryName}</span>
              </div>
              <div>
                <span className="font-satoshi-bold text-black block mb-1">Total Stock</span>
                <span>
                  {variants.reduce((acc, v) => acc + (v.quantity || 0), 0)} units available
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-satoshi-bold text-20 md:text-24 text-black">
                Customer Reviews{" "}
                <span className="text-black/60 text-sm font-satoshi-regular">
                  ({reviews.length})
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev, idx) => (
                <ReviewBlock key={rev.id || idx} {...rev} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="py-4 text-black/70 leading-relaxed space-y-4 max-w-2xl">
            <div className="bg-[#F0F0F0]/50 p-4 rounded-xl">
              <strong className="block text-black mb-1">How fast is shipping?</strong>
              Standard delivery takes 3-5 business days across all states.
            </div>
            <div className="bg-[#F0F0F0]/50 p-4 rounded-xl">
              <strong className="block text-black mb-1">What is the return policy?</strong>
              We offer 30-day easy returns on all unworn items with tags attached.
            </div>
          </div>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="px-4 lg:px-24 py-12">
          <h2 className="font-integral-bold text-32 lg:text-48 text-center text-black uppercase mb-8 lg:mb-14">
            YOU MIGHT ALSO LIKE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
            {relatedProducts.map((prod) => (
              <ProductBlock key={prod._id || prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Product;
