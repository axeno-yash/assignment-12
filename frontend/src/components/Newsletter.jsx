import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Image from "./Image";
import conf from "../conf/conf.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setErrorMsg("");
    setStatus("sending");

    const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } = conf;
    try {
      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          {
            email: value,
            name: "there",
            title: "Newsletter Subscription",
          },
          { publicKey: emailjsPublicKey }
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
        console.warn(
          "EmailJS keys missing (VITE_EMAILJS_SERVICE_ID/TEMPLATE_ID/PUBLIC_KEY). Using local fallback."
        );
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Subscription failed. Please try again.");
    }
  };

  return (
    <div className="bg-black text-white rounded-[20px] py-8 sm:py-9 px-6 lg:px-16 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8 shadow-xl">
      <h2 className="font-integral-bold text-24 sm:text-32 lg:text-40 text-white leading-tight uppercase lg:max-w-[551px] text-center lg:text-left">
        STAY UPTO DATE ABOUT OUR LATEST OFFERS
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-3.5 w-full max-w-[400px] mx-auto lg:mx-0 lg:w-[349px] flex-shrink-0"
      >
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
            disabled={status === "sending"}
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-white text-black font-satoshi-medium rounded-full h-12 w-full text-sm lg:text-base hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending"
            ? "Subscribing..."
            : status === "success"
              ? "Subscribed! Thank you"
              : "Subscribe to Newsletter"}
        </button>

        <p aria-live="polite" className="min-h-[1.25rem] text-xs font-satoshi-regular text-center">
          {errorMsg ? (
            <span className="text-red-300">{errorMsg}</span>
          ) : status === "success" ? (
            <span className="text-green-300">You are on the list. Check your inbox.</span>
          ) : null}
        </p>
      </form>
    </div>
  );
}

export default Newsletter;
