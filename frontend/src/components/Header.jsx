import React from "react";
import TopStrip from "./TopStrip";

function Header() {
  return (
    <header className="sticky top-0 z-[100]">
      <TopStrip />
      <nav className="flex justify-between items-center py-5 px-4 bg-white lg:justify-start lg:py-6 lg:px-24">
        <section className="flex items-center gap-4 lg:w-1/5 lg:justify-start">
          <img className="cursor-pointer lg:hidden" src="/icons/menu.svg" alt="menu-icon" />
          <a href="/" className="">
            <h2 className="font-integral-bold text-2xl lg:text-32 text-black tracking-tight">SHOP.CO</h2>
          </a>
        </section>
        <section className="hidden lg:flex flex-1 justify-between items-center gap-5">
          <ul className="flex list-none gap-5 flex-shrink-0">
            <li>
              <a href="#" className=" text-black flex items-center gap-1">
                Shop
                <img src="/icons/down-arrowkey.svg" alt="arrow-icon" />
              </a>
            </li>
            <li><a href="#" className="text-black">On Sale</a></li>
            <li><a href="#" className="text-black">New Arrivals</a></li>
            <li><a href="#" className="text-black">Brands</a></li>
          </ul>
          <div className="flex items-center w-full max-w-[577px] h-12 bg-gray-300 rounded-full px-4 gap-2.5">
            <img className="w-4 h-4 flex-shrink-0" src="/icons/search.svg" alt="search-icon" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border-none outline-none bg-transparent text-base text-black font-satoshi-regular placeholder:text-black/40"
            />
          </div>
        </section>
        <section className="flex items-center gap-3 lg:gap-3.5 cursor-pointer">
          <img className="lg:hidden" src="/icons/search.svg" alt="search-icon" />
          <div className="relative p-3">
            <a href="/cart">
              <img src="/icons/cart.svg" alt="cart-icon" />
            </a>
            <span className="absolute top-0 right-0 bg-black text-white text-10 leading-5 rounded-full w-5 h-5 text-center">0</span>
          </div>
          <img id="logoutBtn" src="/icons/profile.svg" alt="profile-icon" />
        </section>
      </nav>
    </header>
  );
}

export default Header;
