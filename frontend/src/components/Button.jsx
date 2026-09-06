import React from "react";

function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  onClick,
  ...props
}) {
  const baseStyles =
    "font-satoshi-medium rounded-full py-3.5 px-8 transition-colors cursor-pointer flex items-center justify-center text-sm md:text-base";

  const variants = {
    primary: "bg-primary text-secondary hover:bg-black/90",
    secondary: "bg-white text-black hover:bg-black/5",
    outline: "border border-blackAlpha10 text-black hover:bg-black hover:text-white transition-all",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;