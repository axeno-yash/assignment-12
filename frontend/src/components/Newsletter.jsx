import React, { useState } from "react";
import Image from "./Image";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="bg-black text-white rounded-[20px] py-9 px-6 lg:px-16 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-xl">
      <h2 className="font-integral-bold text-32 lg:text-40 text-white leading-tight uppercase lg:max-w-[551px]">
        STAY UPTO DATE ABOUT OUR LATEST OFFERS
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 w-full lg:w-[349px]">
        <div className="flex items-center w-full h-12 rounded-full px-4 gap-3 bg-white">
          <Image
            className="w-5 h-5 flex-shrink-0 opacity-40"
            src="/icons/mail.svg"
            alt="mail-icon"
          />
          <input
            className="font-satoshi-regular min-w-0 w-full text-sm lg:text-base text-black bg-transparent border-0 outline-none placeholder:text-black/40"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-white text-black font-satoshi-medium rounded-full h-12 w-full text-sm lg:text-base hover:bg-white/90 transition-colors cursor-pointer"
        >
          {subscribed ? "Subscribed! Thank you" : "Subscribe to Newsletter"}
        </button>
      </form>
    </div>
  );
}

export default Newsletter;