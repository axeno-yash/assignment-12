import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  RedirectPath,
  Image,
  Button,
  ProductBlock,
  ReviewBlock,
} from "../components";

const sampleProduct = {
  _id: "1",
  title: "ONE LIFE CLOTHING CO. T-SHIRT",
  rating: 4.5,
  price: 260,
  originalPrice: 300,
  discount: 40,
  description:
    "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
  images: [
    "/images/product1.png",
    "/images/product2.png",
    "/images/product3.png",
  ],
  colors: [
    { name: "Olive", hex: "#4F4631" },
    { name: "Green", hex: "#314F4A" },
    { name: "Navy", hex: "#31344F" },
  ],
  sizes: ["Small", "Medium", "Large", "X-Large"],
};

const relatedProducts = [
  {
    _id: "101",
    title: "Polo with Tipping Details",
    image: "/images/arrival2.png",
    rating: 4.5,
    price: 180,
    originalPrice: 242,
    discount: 20,
  },
  {
    _id: "102",
    title: "Black Striped T-Shirt",
    image: "/images/arrival4.png",
    rating: 4.0,
    price: 120,
    originalPrice: 150,
    discount: 30,
  },
  {
    _id: "103",
    title: "Category Graphic T-Shirt",
    image: "/images/arrival1.png",
    rating: 4.5,
    price: 145,
  },
  {
    _id: "104",
    title: "Loose Fit Bermuda Shorts",
    image: "/images/topselling3.png",
    rating: 3.0,
    price: 80,
  },
];

const productReviews = [
  {
    name: "Samantha D.",
    rating: 5,
    comment:
      "I absolutely love this t-shirt! The fabric feels so soft and the fit is perfect. Just bought a second one in a different color.",
  },
  {
    name: "Alex M.",
    rating: 5,
    comment:
      "The design is sleek and modern. Fits true to size and high quality stitching throughout. Highly recommended!",
  },
  {
    name: "Ethan R.",
    rating: 4,
    comment:
      "Great shirt for casual wear. Wears well after multiple washes. Shipping was fast as well.",
  },
];

function Product() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");

  const images = sampleProduct.images;

  return (
    <main className="w-full font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/category/all" },
          { label: "Men", to: "/category/all" },
          { label: "T-shirts", to: null },
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
              alt={sampleProduct.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col">
          <h1 className="font-integral-bold text-28 lg:text-40 text-black uppercase leading-tight mb-3">
            {sampleProduct.title}
          </h1>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Image
                  key={i}
                  src="/icons/star.svg"
                  alt="star"
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              ))}
            </div>
            <span className="text-sm text-black">
              4.5/<span className="opacity-60">5</span>
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="font-satoshi-bold text-24 lg:text-32 text-black">
              ${sampleProduct.price}
            </span>
            <span className="font-satoshi-bold text-24 lg:text-32 text-black/40 line-through">
              ${sampleProduct.originalPrice}
            </span>
            <span className="font-satoshi-medium text-xs lg:text-sm text-red bg-redAlpha60 py-1.5 px-3.5 rounded-full">
              -{sampleProduct.discount}%
            </span>
          </div>

          <p className="text-sm lg:text-base text-black/60 leading-relaxed mb-6">
            {sampleProduct.description}
          </p>

          <hr className="border-black/10 my-4" />

          <div className="mb-6">
            <h3 className="text-sm text-black/60 mb-3">Select Colors</h3>
            <div className="flex items-center gap-4">
              {sampleProduct.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  style={{ backgroundColor: color.hex }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform ${
                    selectedColor === index ? "ring-2 ring-offset-2 ring-black" : ""
                  }`}
                  aria-label={color.name}
                >
                  {selectedColor === index && (
                    <Image src="/icons/check.svg" alt="selected" className="w-4 h-4 invert" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-black/10 my-4" />

          <div className="mb-6">
            <h3 className="text-sm text-black/60 mb-3">Choose Size</h3>
            <div className="flex flex-wrap gap-3">
              {sampleProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-6 rounded-full text-sm md:text-base font-satoshi-medium transition-colors cursor-pointer ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-black/10 my-4" />

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-between w-32 md:w-40 h-13 bg-[#F0F0F0] rounded-full px-5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-24 font-satoshi-bold text-black cursor-pointer hover:opacity-70"
              >
                -
              </button>
              <span className="font-satoshi-bold text-base text-black">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-24 font-satoshi-bold text-black cursor-pointer hover:opacity-70"
              >
                +
              </button>
            </div>

            <Button className="flex-1 h-13">Add to Cart</Button>
          </div>
        </div>
      </section>

      <section className="px-4 lg:px-24 py-8">
        <div className="flex border-b border-black/10 mb-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-4 text-center font-satoshi-medium text-base md:text-xl border-b-2 cursor-pointer transition-colors ${
              activeTab === "details"
                ? "border-black text-black"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-4 text-center font-satoshi-medium text-base md:text-xl border-b-2 cursor-pointer transition-colors ${
              activeTab === "reviews"
                ? "border-black text-black"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            Rating & Reviews
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`flex-1 py-4 text-center font-satoshi-medium text-base md:text-xl border-b-2 cursor-pointer transition-colors ${
              activeTab === "faqs"
                ? "border-black text-black"
                : "border-transparent text-black/60 hover:text-black"
            }`}
          >
            FAQs
          </button>
        </div>

        {activeTab === "reviews" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-satoshi-bold text-20 md:text-24 text-black">
                All Reviews <span className="text-black/60 text-sm font-satoshi-regular">(451)</span>
              </h3>
              <div className="flex gap-3">
                <Button variant="outline" className="hidden sm:flex py-2.5 px-5">
                  Latest
                </Button>
                <Button className="py-2.5 px-5 text-sm">Write a Review</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productReviews.map((rev, idx) => (
                <ReviewBlock key={idx} {...rev} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="py-4 text-black/70 leading-relaxed space-y-3">
            <p>100% Cotton material, machine wash warm with like colors.</p>
            <p>Imported garment crafted with premium stitching for maximum durability.</p>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="py-4 text-black/70 leading-relaxed space-y-3">
            <p><strong>Q: What is the delivery time?</strong><br />Standard delivery takes 3-5 business days.</p>
            <p><strong>Q: Can I return this product?</strong><br />Yes, 30-day hassle free returns available.</p>
          </div>
        )}
      </section>

      <section className="px-4 lg:px-24 py-12">
        <h2 className="font-integral-bold text-32 lg:text-48 text-center text-black uppercase mb-8 lg:mb-14">
          YOU MIGHT ALSO LIKE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {relatedProducts.map((prod) => (
            <ProductBlock key={prod._id} product={prod} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Product;