import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RedirectPath, Button } from "../components";
import { useLoginUserMutation } from "../services/auth/authApi";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    try {
      const res = await loginUser({ email, password }).unwrap();
      if (res.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/orders");
      }
    } catch (err) {
      setErrorMessage(
        err?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <main className="font-satoshi-regular">
      <hr className="border-black/10 mx-4 lg:mx-24" />

      <RedirectPath
        paths={[
          { label: "Home", to: "/" },
          { label: "Login", to: null },
        ]}
      />

      <section className="px-4 lg:px-24 pb-20 flex justify-center items-center">
        <div className="w-full max-w-[480px] border border-blackAlpha10 rounded-[20px] p-6 lg:p-8 bg-white">
          <h1 className="font-integral-bold text-28 lg:text-32 text-black uppercase text-center mb-2">
            WELCOME BACK
          </h1>
          <p className="font-satoshi-regular text-sm text-black/60 text-center mb-6">
            Enter your credentials to access your account
          </p>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-redAlpha60 text-red text-xs font-satoshi-medium border border-red/20 text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#F0F0F0] rounded-[30px] px-5 py-3.5 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border border-transparent focus:border-black/20"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="font-satoshi-medium text-sm text-black">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#F0F0F0] rounded-[30px] px-5 py-3.5 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border border-transparent focus:border-black/20"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-4 text-base font-satoshi-medium mt-2 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="font-satoshi-regular text-sm text-black/60 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-satoshi-bold text-black underline hover:opacity-80 transition-opacity"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;