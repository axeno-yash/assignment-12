import React, { useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";

function TopStrip() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="h-9 bg-black text-white flex items-center justify-between px-4 lg:px-24 text-xs md:text-sm">
      <div className="hidden md:block w-4"></div>
      <p className="font-satoshi-regular text-center flex-1">
        Sign up and get 20% off to your first order.&nbsp;
        <Link to="/register" className="font-satoshi-medium underline hover:text-white/80">
          Sign Up Now
        </Link>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="cursor-pointer hidden md:flex items-center justify-center"
        aria-label="Close announcement"
      >
        <Image
          className="w-3.5 h-3.5"
          src="/icons/cross.svg"
          alt="cross-icon"
        />
      </button>
    </div>
  );
}

export default TopStrip;
