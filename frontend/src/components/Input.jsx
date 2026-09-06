import React from "react";
import Image from "./Image";

function Input({
  icon,
  iconAlt = "input-icon",
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  wrapperClassName = "",
  error,
  ...props
}) {
  if (icon) {
    return (
      <div className="w-full">
        <div
          className={`flex items-center gap-2.5 bg-gray-100 rounded-30 px-4 py-3.5 w-full ${wrapperClassName}`}
        >
          <Image
            src={icon}
            alt={iconAlt}
            className="w-4 h-4 flex-shrink-0 opacity-40"
          />
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full min-w-0 bg-transparent border-0 outline-none font-satoshi-regular text-sm text-black placeholder:text-black/40 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-red text-xs mt-1 pl-3">{error}</p>}
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-100 rounded-30 px-5 py-3.5 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border-0 ${className}`}
        {...props}
      />
      {error && <p className="text-red text-xs mt-1 pl-3">{error}</p>}
    </div>
  );
}

export default Input;
