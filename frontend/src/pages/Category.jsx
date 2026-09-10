import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  RedirectPath,
  FiltersBlock,
  ProductBlock,
  Button,
  Image,
} from "../components";
import { useGetFilteredProductsQuery } from "../services/products/productsApi";
import { useGetAllCategoriesQuery } from "../services/category/categoryApi";
import { categorySlug, matchCategorySlug } from "../utils/slug.js";

function Category() {
  const { id = "all" } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const sort = searchParams.get("sort") || "most_popular";
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const size = searchParams.get("size") || "";

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const matchedCategory = categories.find((c) => matchCategorySlug(c, id));
  const categoryTitle =
    id === "all"
      ? "All Products"
      : matchedCategory?.name || (id.charAt(0).toUpperCase() + id.slice(1));

  const { data, isLoading, isFetching, error } = useGetFilteredProductsQuery({
    category: id !== "all" ? id : undefined,
    search: search || undefined,
    type: type || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    size: size || undefined,
    sort: sort || undefined,
    page,
    limit: 9,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const totalProducts = data?.totalProducts || 0;

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== "") {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    if (key !== "page") {
      nextParams.delete("page");
    }
    setSearchParams(nextParams);
  };

  const handleSelectCategory = (catId) => {
    const found = categories.find(
      (c) => c._id === catId || c.name === catId || categorySlug(c) === catId
    );
    const slug = catId === "all" ? "all" : found ? categorySlug(found) : categorySlug(catId);
    const keptParams = new URLSearchParams(searchParams);
    keptParams.delete("page");
    const queryString = keptParams.toString();
    navigate(`/category/${slug}${queryString ? `?${queryString}` : ""}`);
    setMobileFilterOpen(false);
  };

  const handlePriceChange = ({ min, max }) => {
    const nextParams = new URLSearchParams(searchParams);
    if (min) nextParams.set("minPrice", min);
    else nextParams.delete("minPrice");
    if (max) nextParams.set("maxPrice", max);
    else nextParams.delete("maxPrice");
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handleSelectSize = (selectedSize) => {
    updateParam("size", selectedSize);
  };

  const handleSelectType = (selectedType) => {
    updateParam("type", selectedType);
  };

  const handleResetFilters = () => {
    navigate("/category/all");
    setSearchParams(new URLSearchParams());
    setMobileFilterOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateParam("page", newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startProductNum = totalProducts === 0 ? 0 : (page - 1) * 9 + 1;
  const endProductNum = Math.min(page * 9, totalProducts);

  return (
    <main className="w-full font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/category/all" },
          { label: categoryTitle, to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-16">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-satoshi-bold text-28 lg:text-32 text-black">
              {categoryTitle}
            </h1>
            <span className="text-xs lg:text-sm text-black/60 pt-1">
              Showing {startProductNum}-{endProductNum} of {totalProducts} Products
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-2 text-xs lg:text-sm text-black/60">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="bg-[#F0F0F0] text-black font-satoshi-medium rounded-full px-3 py-1.5 border-none outline-none cursor-pointer"
              >
                <option value="most_popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden w-9 h-9 bg-[#F0F0F0] rounded-full flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors"
              aria-label="Open Filters"
            >
              <Image src="/icons/filters.svg" alt="filters" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {search && (
          <div className="mb-4 inline-flex items-center gap-2 bg-[#F0F0F0] px-4 py-1.5 rounded-full text-xs font-satoshi-medium text-black">
            <span>Search: "{search}"</span>
            <button
              onClick={() => updateParam("search", "")}
              className="font-bold hover:opacity-70"
            >
              &times;
            </button>
          </div>
        )}

        {type && (
          <div className="mb-4 ml-2 inline-flex items-center gap-2 bg-black px-4 py-1.5 rounded-full text-xs font-satoshi-medium text-white">
            <span>Type: "{type}"</span>
            <button
              onClick={() => updateParam("type", "")}
              className="font-bold hover:opacity-70"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex gap-6 items-start">
          <div className="hidden lg:block w-[295px] flex-shrink-0">
            <FiltersBlock
              categories={categories}
              selectedCategory={id}
              onSelectCategory={handleSelectCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              selectedSize={size}
              onSelectSize={handleSelectSize}
              selectedType={type}
              onSelectType={handleSelectType}
              onReset={handleResetFilters}
            />
          </div>

          <div className="flex-1">
            {isLoading || isFetching ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mb-9">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-3 animate-pulse">
                    <div className="bg-black/5 rounded-[20px] aspect-square w-full"></div>
                    <div className="h-5 bg-black/5 rounded-md w-3/4"></div>
                    <div className="h-4 bg-black/5 rounded-md w-1/2"></div>
                    <div className="h-6 bg-black/5 rounded-md w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-black/60 font-satoshi-medium text-lg mb-4">
                  Failed to load products. Please check connection.
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Retry
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-[#F0F0F0]/50 rounded-[20px] p-8">
                <h3 className="font-satoshi-bold text-xl text-black mb-2">
                  No Products Found
                </h3>
                <p className="text-sm text-black/60 mb-6 max-w-sm mx-auto">
                  We couldn&apos;t find any products matching your current filters.
                </p>
                <Button onClick={handleResetFilters} variant="primary">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mb-9">
                {products.map((prod) => (
                  <ProductBlock key={prod._id || prod.id} product={prod} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <>
                <hr className="border-black/10 mb-8" />
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="py-2.5 px-4 text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    &larr; Previous
                  </Button>

                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs md:text-sm font-satoshi-medium">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const isActive = p === page;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${isActive
                              ? "bg-black text-white font-satoshi-bold"
                              : "text-black/60 hover:bg-black/5"
                            }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="py-2.5 px-4 text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next &rarr;
                  </Button>
                </div>
              </>
            )}
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
            <FiltersBlock
              categories={categories}
              selectedCategory={id}
              onSelectCategory={handleSelectCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              selectedSize={size}
              onSelectSize={handleSelectSize}
              selectedType={type}
              onSelectType={handleSelectType}
              onReset={handleResetFilters}
              onClose={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Category;