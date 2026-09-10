import React from "react";
import { Link } from "react-router-dom";
import { Image, Button, ProductsList, ReviewBlock } from "../components";
import { useGetFilteredProductsQuery } from "../services/products/productsApi";
import { useGetAllCategoriesQuery } from "../services/category/categoryApi";
import { useGetReviewsQuery } from "../services/reviews/reviewsApi";
import { categorySlug } from "../utils/slug.js";

function Home() {
  const getNewArrivals = useGetFilteredProductsQuery({
    limit: 8,
    page: 1,
    sort: "newest",
    view: "card",
  });
  const newArrivals = getNewArrivals.data?.products || [];

  const getTopSelling = useGetFilteredProductsQuery({
    limit: 8,
    sort: "rating",
    view: "card",
  });
  const topSelling = getTopSelling.data?.products || [];

  const getCategories = useGetAllCategoriesQuery();
  const categories = getCategories.data?.categories || [];

  const getReviews = useGetReviewsQuery();
  const reviews = getReviews.data?.reviews || [];

  const getCategoryLink = (name) => {
    const found = categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    return found ? `/category/${categorySlug(found)}` : `/category/${categorySlug(name)}`;
  };

  
  return (
    <main className="w-full">
      <section className="bg-[#F2F0F1] px-4 lg:px-24 pt-8 lg:pt-16 pb-0 flex flex-col lg:flex-row justify-between items-stretch relative">
        <div className="max-w-[700px] lg:py-12 z-10 flex flex-col justify-center">
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

      <section className="bg-black py-8 px-6 lg:px-24 flex flex-wrap justify-center items-center gap-6 lg:gap-10 min-h-[122px]">
        <Image src="/icons/versace.svg" alt="Versace" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[110px] sm:max-w-[140px] lg:max-w-[166px]" />
        <Image src="/icons/zara.svg" alt="Zara" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[70px] sm:max-w-[85px] lg:max-w-[91px]" />
        <Image src="/icons/gucci.svg" alt="Gucci" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[110px] sm:max-w-[140px] lg:max-w-[156px]" />
        <Image src="/icons/prada.svg" alt="Prada" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[120px] sm:max-w-[150px] lg:max-w-[194px]" />
        <Image src="/icons/calvin-klein.svg" alt="Calvin Klein" className="h-6 sm:h-8 lg:h-9 w-auto object-contain max-w-[130px] sm:max-w-[160px] lg:max-w-[206px]" />
      </section>

      <ProductsList
        title="NEW ARRIVALS"
        products={newArrivals}
        isLoading={getNewArrivals.isLoading}
        error={getNewArrivals.error}
      />

      <hr className="border-black/10 mx-4 lg:mx-24 my-4" />

      <ProductsList
        title="TOP SELLING"
        products={topSelling}
        isLoading={getTopSelling.isLoading}
        error={getTopSelling.error}
      />

      <section className="px-4 lg:px-24 py-10">
        <div className="bg-[#F0F0F0] rounded-[40px] p-6 lg:p-16">
          <h2 className="font-integral-bold text-32 lg:text-48 text-center text-black uppercase mb-8 lg:mb-14">
            BROWSE BY DRESS STYLE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            <Link
              to={getCategoryLink("Casual")}
              className="md:col-span-1 relative rounded-[20px] overflow-hidden bg-white h-[190px] sm:h-[240px] lg:h-[280px] group transition-transform duration-300 hover:shadow-lg"
            >
              <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-satoshi-bold text-20 sm:text-24 lg:text-36 text-black z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
                Casual
              </span>
              <Image
                src="/images/0.png"
                alt="Casual"
                className="w-full h-full object-cover object-center md:object-[35%_0%] group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <Link
              to={getCategoryLink("Formal")}
              className="md:col-span-2 relative rounded-[20px] overflow-hidden bg-white h-[190px] sm:h-[240px] lg:h-[280px] group transition-transform duration-300 hover:shadow-lg"
            >
              <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-satoshi-bold text-20 sm:text-24 lg:text-36 text-black z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
                Formal
              </span>
              <Image
                src="/images/1.png"
                alt="Formal"
                className="w-full h-full object-cover object-center md:object-[85%_0%] group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <Link
              to={getCategoryLink("Party")}
              className="md:col-span-2 relative rounded-[20px] overflow-hidden bg-white h-[190px] sm:h-[240px] lg:h-[280px] group transition-transform duration-300 hover:shadow-lg"
            >
              <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-satoshi-bold text-20 sm:text-24 lg:text-36 text-black z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
                Party
              </span>
              <Image
                src="/images/2.png"
                alt="Party"
                className="w-full h-full object-cover object-center md:object-[85%_0%] group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <Link
              to={getCategoryLink("Gym")}
              className="md:col-span-1 relative rounded-[20px] overflow-hidden bg-white h-[190px] sm:h-[240px] lg:h-[280px] group transition-transform duration-300 hover:shadow-lg"
            >
              <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-satoshi-bold text-20 sm:text-24 lg:text-36 text-black z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
                Gym
              </span>
              <Image
                src="/images/3.png"
                alt="Gym"
                className="w-full h-full object-cover object-center md:object-[85%_0%] group-hover:scale-105 transition-transform duration-500"
              />
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

        {getReviews.isLoading ? (
          <div className="grid grid-flow-col auto-cols-[85%] md:auto-cols-[31%] gap-5 overflow-x-auto no-scroller">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-3 bg-white h-[180px] animate-pulse"
              >
                <div className="w-24 h-4 bg-black/10 rounded"></div>
                <div className="w-32 h-5 bg-black/10 rounded"></div>
                <div className="w-full h-12 bg-black/5 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-flow-col auto-cols-[85%] md:auto-cols-[31%] gap-5 overflow-x-auto no-scroller">
            {reviews.map((review, idx) => (
              <ReviewBlock key={review.id || review._id || idx} {...review} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;