import React from "react";
import ProductBlock from "./ProductBlock";
import Button from "./Button";
import { Link } from "react-router-dom";

function ProductsList({ title, products = [], viewAllLink = "/category/all" }) {
  return (
    <section className="px-4 lg:px-24 py-10">
      <h2 className="font-integral-bold text-32 lg:text-48 text-center text-black uppercase mb-8 lg:mb-14">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
        {products.map((product, index) => (
          <ProductBlock key={product._id || index} product={product} />
        ))}
      </div>
      <div className="flex justify-center mt-9">
        <Link to={viewAllLink}>
          <Button variant="outline" className="w-full sm:w-[218px]">
            View All
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default ProductsList;