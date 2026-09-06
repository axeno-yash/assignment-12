import React from "react";

function TopStrip() {
  return (
    <div className="h-8 md:h-9 bg-black text-white flex items-center justify-around text-xs md:text-sm">
      <div className="hidden md:block"></div>
      <h3 className="satoshi-regular">
        Sign up and get 20% off to your first order.&nbsp;
        <span className="underline satoshi-medium cursor-pointer">
          Sign Up Now
        </span>
      </h3>
      <img
        className="cursor-pointer hidden md:block"
        src={"/icons/cross.svg"}
        alt="cross-icon"
      />
    </div>
  );
}

export default TopStrip;
