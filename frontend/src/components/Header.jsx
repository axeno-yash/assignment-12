import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TopStrip from "./TopStrip";
import Image from "./Image";
import { useDebounce } from "../hooks/useDebounce.js";
import { useGetCartQuery } from "../services/cart/cartApi";
import { useGetUserProfileQuery } from "../services/users/userApi";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const isFirstSearch = useRef(true);

  const { data: cartData } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: userData } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const cartCount =
    cartData?.cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileSearchOpen(false);
    } else {
      navigate("/category/all");
    }
  };

  useEffect(() => {
    if (isFirstSearch.current) {
      isFirstSearch.current = false;
      return;
    }
    const value = debouncedSearch.trim();
    if (value) {
      navigate(`/category/all?search=${encodeURIComponent(value)}`);
    }
  }, [debouncedSearch, navigate]);

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-black/10">
      <TopStrip />
      <nav className="flex justify-between items-center py-5 px-4 lg:py-6 lg:px-24 bg-white relative">
        <section className="flex items-center gap-4 lg:w-1/5 lg:justify-start">
          {!isAdminRoute && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden cursor-pointer"
              aria-label="Toggle Menu"
            >
              <Image src="/icons/menu.svg" alt="menu-icon" className="w-6 h-6" />
            </button>
          )}
          <Link to="/" className="no-underline">
            <h2 className="font-integral-bold text-24 lg:text-32 text-black tracking-tight uppercase">
              SHOP.CO
            </h2>
          </Link>
        </section>

        {!isAdminRoute && (
          <section className="hidden lg:flex flex-1 justify-between items-center gap-6 mx-6">
          <ul className="flex items-center list-none gap-6 flex-shrink-0 font-satoshi-regular text-base text-black">
            <li>
              <Link to="/category/all" className="flex items-center gap-1 hover:text-black/70 transition-colors">
                Shop
                <Image src="/icons/down-arrowkey.svg" alt="arrow-icon" className="w-3 h-3" />
              </Link>
            </li>
            <li>
              <Link to="/category/all?sort=newest" className="hover:text-black/70 transition-colors">
                On Sale
              </Link>
            </li>
            <li>
              <Link to="/category/all?sort=newest" className="hover:text-black/70 transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/category/all?sort=rating" className="hover:text-black/70 transition-colors">
                Brands
              </Link>
            </li>
          </ul>

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full max-w-[577px] h-12 bg-[#F0F0F0] rounded-full px-4 gap-3 focus-within:ring-2 focus-within:ring-black/20"
          >
            <button type="submit" aria-label="Search" className="cursor-pointer">
              <Image src="/icons/search.svg" alt="search-icon" className="w-5 h-5 flex-shrink-0 opacity-40 hover:opacity-80" />
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full border-none outline-none bg-transparent text-base text-black font-satoshi-regular placeholder:text-black/40"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-xs text-black/40 hover:text-black"
              >
                Clear
              </button>
            )}
          </form>
          </section>
        )}

        <section className="flex items-center gap-3.5">
          {!isAdminRoute && (
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden cursor-pointer"
              aria-label="Search"
            >
              <Image src="/icons/search.svg" alt="search-icon" className="w-6 h-6" />
            </button>
          )}
          <div className="relative p-1">
            <Link to="/cart">
              <Image src="/icons/cart.svg" alt="cart-icon" className="w-6 h-6" />
            </Link>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-10 font-satoshi-bold leading-5 rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <Link to={userData?.user ? "/orders" : "/login"}>
            <Image src="/icons/profile.svg" alt="profile-icon" className="w-6 h-6" />
          </Link>
        </section>
      </nav>

      {mobileSearchOpen && !isAdminRoute && (
        <div className="lg:hidden px-4 py-3 bg-white border-t border-black/10">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full h-11 bg-[#F0F0F0] rounded-full px-4 gap-3"
          >
            <Image src="/icons/search.svg" alt="search-icon" className="w-5 h-5 opacity-40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full border-none outline-none bg-transparent text-sm text-black"
              autoFocus
            />
          </form>
        </div>
      )}


      {mobileMenuOpen && !isAdminRoute && (
        <div className="lg:hidden bg-white border-t border-black/10 px-6 py-4 flex flex-col gap-4 font-satoshi-medium text-base">
          <Link to="/category/all" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          <Link to="/category/on-sale" onClick={() => setMobileMenuOpen(false)}>On Sale</Link>
          <Link to="/category/new-arrivals" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
          <Link to="/category/brands" onClick={() => setMobileMenuOpen(false)}>Brands</Link>
        </div>
      )}
    </header>
  );
}

export default Header;
