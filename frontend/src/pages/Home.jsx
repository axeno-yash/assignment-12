import React from "react";
import { Link } from "react-router-dom";
import { Image, Button, ProductsList, ReviewBlock } from "../components";

const sampleNewArrivals = [
  {
    _id: "1",
    title: "T-SHIRT WITH TAPE DETAILS",
    image: "/images/arrival1.png",
    rating: 4.5,
    price: 120,
  },
  {
    _id: "2",
    title: "SKINNY FIT JEANS",
    image: "/images/arrival2.png",
    rating: 3.5,
    price: 240,
    originalPrice: 260,
    discount: 20,
  },
  {
    _id: "3",
    title: "CHECKERED SHIRT",
    image: "/images/arrival3.png",
    rating: 4.5,
    price: 180,
  },
  {
    _id: "4",
    title: "SLEEVE STRIPED T-SHIRT",
    image: "/images/arrival4.png",
    rating: 4.5,
    price: 130,
    originalPrice: 160,
    discount: 30,
  },
];

const sampleTopSelling = [
  {
    _id: "5",
    title: "VERTICAL STRIPED SHIRT",
    image: "/images/topselling1.png",
    rating: 5.0,
    price: 212,
    originalPrice: 232,
    discount: 20,
  },
  {
    _id: "6",
    title: "COURAGE OVERSISZED T-SHIRT",
    image: "/images/topselling2.png",
    rating: 4.0,
    price: 145,
  },
  {
    _id: "7",
    title: "LOOSE FIT BERMUDA SHORTS",
    image: "/images/topselling3.png",
    rating: 3.0,
    price: 80,
  },
  {
    _id: "8",
    title: "FADED SKINNY JEANS",
    image: "/images/topselling4.png",
    rating: 4.5,
    price: 210,
  },
];

const sampleReviews = [
  {
    name: "Sarah M.",
    rating: 5,
    comment: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    name: "Alex K.",
    rating: 5,
    comment: "Finding clothes that fit my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    name: "James L.",
    rating: 5,
    comment: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-trend.",
  },
];

function Home() {
  return (
    <main className="w-full">
      <section className="bg-[#F2F0F1] px-4 lg:px-24 pt-8 lg:pt-16 pb-0 flex flex-col lg:flex-row justify-between items-stretch relative">
        <div className="max-w-[600px] lg:py-12 z-10 flex flex-col justify-center">
          <h1 className="font-integral-bold text-36 lg:text-64 leading-[1.05] text-black mb-4 uppercase">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="font-satoshi-regular text-sm lg:text-base text-black/60 mb-8 leading-relaxed">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <Link to="/category/all" className="inline-block mb-8 lg:mb-12">
            <Button className="w-full sm:w-[210px]">Shop Now</Button>
          </Link>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-black/10 pt-6 sm:hidden">
            <div className="text-center">
              <h3 className="font-satoshi-bold text-28 text-black">200+</h3>
              <p className="font-satoshi-regular text-xs text-black/60">International Brands</p>
            </div>
            <div className="text-center border-l border-black/10 pl-6">
              <h3 className="font-satoshi-bold text-28 text-black">2,000+</h3>
              <p className="font-satoshi-regular text-xs text-black/60">High-Quality Products</p>
            </div>
            <div className="col-span-2 text-center pt-2">
              <h3 className="font-satoshi-bold text-28 text-black">30,000+</h3>
              <p className="font-satoshi-regular text-xs text-black/60">Happy Customers</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-8 border-t border-black/10 pt-6 lg:border-none lg:pt-0">
            <div>
              <h3 className="font-satoshi-bold text-28 lg:text-40 text-black">200+</h3>
              <p className="font-satoshi-regular text-xs lg:text-sm text-black/60">International Brands</p>
            </div>
            <div className="border-r border-black/10 h-12"></div>
            <div>
              <h3 className="font-satoshi-bold text-28 lg:text-40 text-black">2,000+</h3>
              <p className="font-satoshi-regular text-xs lg:text-sm text-black/60">High-Quality Products</p>
            </div>
            <div className="border-r border-black/10 h-12"></div>
            <div>
              <h3 className="font-satoshi-bold text-28 lg:text-40 text-black">30,000+</h3>
              <p className="font-satoshi-regular text-xs lg:text-sm text-black/60">Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end items-end mt-6 lg:mt-0">
          <Image
            src="/images/heroImg.jpg"
            alt="Hero Banner"
            className="w-full max-w-[500px] lg:max-w-[600px] max-h-[660px] object-cover object-top"
          />
          <Image
            src="/images/sparkle.png"
            alt="sparkle"
            className="absolute top-8 right-4 lg:right-12 w-12 lg:w-16 h-12 lg:h-16"
          />
          <Image
            src="/images/sparkle.png"
            alt="sparkle"
            className="absolute top-1/3 left-4 lg:left-12 w-8 lg:w-10 h-8 lg:h-10"
          />
        </div>
      </section>

      <section className="bg-black py-8 px-6 lg:px-24 flex flex-wrap justify-between items-center gap-6 lg:gap-10 min-h-[122px]">
        <Image src="/icons/versace.svg" alt="Versace" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[110px] sm:max-w-[140px] lg:max-w-[166px]" />
        <Image src="/icons/zara.svg" alt="Zara" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[70px] sm:max-w-[85px] lg:max-w-[91px]" />
        <Image src="/icons/gucci.svg" alt="Gucci" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[110px] sm:max-w-[140px] lg:max-w-[156px]" />
        <Image src="/icons/prada.svg" alt="Prada" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[120px] sm:max-w-[150px] lg:max-w-[194px]" />
        <Image src="/icons/calvin-klein.svg" alt="Calvin Klein" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[130px] sm:max-w-[160px] lg:max-w-[206px]" />
      </section>

      <ProductsList title="NEW ARRIVALS" products={sampleNewArrivals} />

      <hr className="border-black/10 mx-4 lg:mx-24 my-4" />

      <ProductsList title="TOP SELLING" products={sampleTopSelling} />

      <section className="px-4 lg:px-24 py-10">
        <div className="bg-[#F0F0F0] rounded-[40px] p-6 lg:p-16">
          <h2 className="font-integral-bold text-32 lg:text-48 text-center text-black uppercase mb-8 lg:mb-14">
            BROWSE BY DRESS STYLE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link to="/category/casual" className="md:col-span-1 relative rounded-[20px] overflow-hidden bg-white h-[280px]">
              <span className="absolute top-6 left-6 font-satoshi-bold text-24 lg:text-36 text-black z-10">Casual</span>
              <Image src="/images/0.png" alt="Casual" className="w-full h-full object-cover object-[85%_0%]" />
            </Link>

            <Link to="/category/formal" className="md:col-span-2 relative rounded-[20px] overflow-hidden bg-white h-[280px]">
              <span className="absolute top-6 left-6 font-satoshi-bold text-24 lg:text-36 text-black z-10">Formal</span>
              <Image src="/images/1.png" alt="Formal" className="w-full h-full object-cover object-[85%_0%]" />
            </Link>

            <Link to="/category/party" className="md:col-span-2 relative rounded-[20px] overflow-hidden bg-white h-[280px]">
              <span className="absolute top-6 left-6 font-satoshi-bold text-24 lg:text-36 text-black z-10">Party</span>
              <Image src="/images/2.png" alt="Party" className="w-full h-full object-cover object-[85%_0%]" />
            </Link>

            <Link to="/category/gym" className="md:col-span-1 relative rounded-[20px] overflow-hidden bg-white h-[280px]">
              <span className="absolute top-6 left-6 font-satoshi-bold text-24 lg:text-36 text-black z-10">Gym</span>
              <Image src="/images/3.png" alt="Gym" className="w-full h-full object-cover object-[85%_0%]" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 lg:px-24 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-integral-bold text-32 lg:text-48 text-black uppercase">
            OUR HAPPY CUSTOMERS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleReviews.map((review, idx) => (
            <ReviewBlock key={idx} {...review} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;