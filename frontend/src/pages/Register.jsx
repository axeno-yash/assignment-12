import React from "react";
import { Link } from "react-router-dom";
import { RedirectPath, Button, Newsletter } from "../components";

function Register() {
  return (
    <main className="font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: "Register", to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-20 flex justify-center items-center">
        <div className="w-full max-w-[480px] border border-blackAlpha10 rounded-[20px] p-6 lg:p-8 bg-white">
          <h1 className="font-integral-bold text-28 lg:text-32 text-black uppercase text-center mb-2">
            CREATE ACCOUNT
          </h1>
          <p className="font-satoshi-regular text-sm text-black/60 text-center mb-8">
            Sign up to start shopping your favorite collections
          </p>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-gray-100 rounded-[30px] px-5 py-3.5 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border-0"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-100 rounded-[30px] px-5 py-3.5 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border-0"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full bg-gray-100 rounded-[30px] px-5 py-3.5 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border-0"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-base font-satoshi-medium mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="font-satoshi-regular text-sm text-black/60 text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-satoshi-bold text-black underline hover:opacity-80 transition-opacity"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}

export default Register;