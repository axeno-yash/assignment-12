import React from "react";
import Image from "./Image";

function ReviewBlock({ name, rating = 5, comment, verified = true }) {
  return (
    <div className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-3 bg-white h-full">
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, index) => (
          <Image key={index} src="/icons/star.svg" alt="star" className="w-4 h-4" />
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <h4 className="font-satoshi-bold text-base text-black">{name}</h4>
        {verified && (
          <Image src="/images/tick.png" alt="verified" className="w-4 h-4" />
        )}
      </div>
      <p className="text-sm text-black/60 font-satoshi-regular leading-relaxed">
        "{comment}"
      </p>
    </div>
  );
}

export default ReviewBlock;