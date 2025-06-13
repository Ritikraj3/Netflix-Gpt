import React, { useState } from "react";
import Header from "./Header";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase";
import { firebaseErrorMessages } from "../utils/firebaseErrorMessage";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [firebaseError, setFirebaseError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = (data) => {
    const { email } = data;

    setFirebaseError("");
    setSuccessMessage("");

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccessMessage(
          "If this email is registered, a reset link has been sent.")

      })
      .catch((error) => {
        const friendlyMessage =
          firebaseErrorMessages[error.code] ||
          "Something went wrong. Please try again.";
        setFirebaseError(friendlyMessage);
      });
  };

  return (
    <>
      <div className="h-screen w-screen relative">
        {/* Background Image */}
        <img
          className="absolute inset-0 w-full h-full object-cover object-top"
          src="https://dnm.nflximg.net/api/v6/aHn-vO8ub4KPvcVsSA3di9cME-o/AAAAAScyGMgUWk6v1RyiD6aiF3q8jELFh0hzbzYEyo0f-s-_TVtoEZRM1L-qGnR_3Oen.jpg"
          alt="background"
        />

        <div className="relative z-10">
          <Header />

          {/* Centered Reset Box */}
          <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <div className="bg-white rounded-md mx-8 p-8 w-full max-w-md text-black shadow-md">
              <h2 className="text-2xl font-bold mb-2">
                Update password with email
              </h2>

              {successMessage && (
                <div className="bg-green-600 text-white text-sm rounded-md px-4 py-2 mb-4">
                  {successMessage}
                </div>
              )}

              {firebaseError && (
                <div className="bg-[#d89d31] text-black text-sm rounded-md px-4 py-2 mb-4">
                  {firebaseError}
                </div>
              )}

              <p className="mb-4">Enter your email to reset your password</p>

              {/* Email Option Only */}
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" checked readOnly />
                  <span>Email</span>
                </label>
              </div>

              <p className="mb-3 text-sm text-gray-700">
                We will send you an email with instructions on how to reset your
                password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                  type="text"
                  placeholder="Email"
                  {...register("email", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">Email is required</p>
                )}

                <button
                  type="submit"
                  className="bg-red-600 text-white w-full py-2 rounded-md font-semibold hover:bg-red-700 transition"
                >
                  Email Me
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-white mx-8 mt-6 opacity-70">
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot.
            <span className="underline ml-1 cursor-pointer">Learn more.</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
