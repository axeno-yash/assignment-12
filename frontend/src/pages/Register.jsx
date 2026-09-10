import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RedirectPath, Button } from "../components";
import { useRegisterUserMutation } from "../services/auth/authApi";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };
      if (formData.phone) payload.phone = Number(formData.phone);
      if (formData.address) payload.address = formData.address.trim();

      await registerUser(payload).unwrap();
      navigate("/orders");
    } catch (err) {
      setErrorMessage(
        err?.data?.message || "Registration failed. Please check your details."
      );
    }
  };

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
          <p className="font-satoshi-regular text-sm text-black/60 text-center mb-6">
            Sign up to start shopping your favorite collections
          </p>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-redAlpha60 text-red text-xs font-satoshi-medium border border-red/20 text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-[#F0F0F0] rounded-[30px] px-5 py-3 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border border-transparent focus:border-black/20"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-[#F0F0F0] rounded-[30px] px-5 py-3 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border border-transparent focus:border-black/20"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Password (min 6 chars) *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full bg-[#F0F0F0] rounded-[30px] px-5 py-3 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border border-transparent focus:border-black/20"
                required
                minLength={6}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Phone Number (optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className="w-full bg-[#F0F0F0] rounded-[30px] px-5 py-3 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border border-transparent focus:border-black/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi-medium text-sm text-black">
                Shipping Address (optional)
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, city, state"
                className="w-full bg-[#F0F0F0] rounded-[30px] px-5 py-3 text-sm font-satoshi-regular outline-none text-black placeholder:text-black/40 border border-transparent focus:border-black/20"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-4 text-base font-satoshi-medium mt-2 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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
    </main>
  );
}

export default Register;