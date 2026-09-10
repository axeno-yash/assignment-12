import React, { useState } from "react";
import ProductBlock from "./ProductBlock";
import Button from "./Button";

function ProductsList({ title, products = [], initialCount = 4, isLoading = false, error = null }) {
  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? products : products.slice(0, initialCount);

  return (
    <section className="px-4 lg:px-24 py-10">
      <h2 className="font-integral-bold text-32 lg:text-48 text-center text-black uppercase mb-8 lg:mb-14">
        {title}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="bg-black/5 rounded-[20px] aspect-square w-full"></div>
              <div className="h-5 bg-black/5 rounded-md w-3/4"></div>
              <div className="h-4 bg-black/5 rounded-md w-1/2"></div>
              <div className="h-6 bg-black/5 rounded-md w-1/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-black/50 font-satoshi-medium">
          Unable to load products. Please check your connection.
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-black/50 font-satoshi-medium">
          No products available.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {visibleProducts.map((product, index) => (
            <div key={product._id || index}>
              <ProductBlock product={product} />
            </div>
          ))}
        </div>
      )}

      {products.length > initialCount && !isLoading && !error && (
        <div className="flex justify-center mt-9">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="w-full sm:w-[218px]"
          >
            {showAll ? "Show Less" : "View All"}
          </Button>
        </div>
      )}
    </section>
  );
}

export default ProductsList;
