import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Header from "./Header";
import LoginBackground from "../assets/Netflix-LoginPage-img.jpg";
import userAvatar  from "../assets/Netflix-avatar.png"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { firebaseErrorMessages } from "../utils/firebaseErrorMessage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [firebaseError, setFirebaseError] = useState("");
  const [isSignin, setIsSignin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const toggleSignInForm = () => {
    setIsSignin(!isSignin);
  };

   const onSubmit = (data) => {
    const { name, email, password } = data;
    if (!data) return;

    setFirebaseError("");

    if (!isSignin) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name,
            photoURL: userAvatar,
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
              navigate("/browse");
            })
            .catch((error) => {
              const friendlyMessage =
                firebaseErrorMessages[error.code] ||
                "Something went wrong. Please try again.";
              setFirebaseError(friendlyMessage);
            });
        })       
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          const friendlyMessage =
            firebaseErrorMessages[error.code] ||
            "Something went wrong. Please try again.";
          setFirebaseError(friendlyMessage);
        });
    }
  };

  const resetPassword = () => {
    navigate("/reset-password");
  };

  return (
    <div className="relative w-full h-screen">
      <Header />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={LoginBackground}
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Login Box */}
      <div className="relative flex items-center justify-center h-full px-4 sm:px-6 md:px-8">
        <div className="bg-black/80 rounded-md px-5 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 w-full max-w-[320px] sm:max-w-[350px]">
          <h1 className="text-white text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
            {isSignin ? "Sign In" : "Sign Up"}
          </h1>

          {firebaseError && (
            <div className="bg-[#d89d31] text-black  text-sm rounded-md px-4 py-2 mb-4">
              {firebaseError}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Name input (only for Sign Up) */}
            {!isSignin && (
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-gray-700/40 border border-gray-600 text-white px-3 py-2 rounded-md focus:outline-none placeholder-gray-400 text-sm"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
            )}

            {/* Email input */}
            <div>
              <input
                name="email"
                type="text"
                placeholder="Email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /.*?@?[^@]*\.+.*/,
                    message: "please enter a valid email",
                  },
                })}
                className="w-full bg-gray-700/40 border border-gray-600 text-white px-3 py-2 rounded-md focus:outline-none placeholder-gray-400 text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password input */}
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message: "please enter a valid password",
                  },
                })}
                className="w-full bg-gray-700/40 border border-gray-600 text-white px-3 py-2 rounded-md focus:outline-none placeholder-gray-400 text-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-md transition-colors text-sm"
            >
              {isSignin ? "Sign In" : "Sign Up"}
            </button>

            {/* OR divider */}
            <div className="text-center text-gray-400 text-sm">OR</div>

            {/* Use sign-in code button */}
            <button
              type="button"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-md transition-colors text-sm"
            >
              Use a sign-in code
            </button>
          </form>

          {/* Forgot password */}
          <div className="text-center mt-3">
            <a
              onClick={resetPassword}
              className="text-white select-none hover:underline text-sm cursor-pointer"
            >
              Forgot password?
            </a>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              defaultChecked
              className="w-4 h-4 text-white bg-gray-800 border-gray-600 rounded focus:ring-red-600 focus:ring-2"
            />
            <label htmlFor="remember" className="ml-2 text-gray-400 text-sm">
              Remember me
            </label>
          </div>

          {/* Sign up link */}
          <div className="text-gray-400 text-sm mt-5 select-none">
            {isSignin ? "New to Netflix? " : "Already registered "}
            <span
              className="text-white hover:underline font-medium cursor-pointer"
              onClick={toggleSignInForm}
            >
              {isSignin ? "Sign up now" : "Sign in now"}
            </span>
          </div>

          {/* reCAPTCHA notice */}
          <div className="mt-3 text-xs text-gray-500">
            <p className="mb-1">
              This page is protected by Google reCAPTCHA to ensure you're not a
              bot.
            </p>
            <span className="text-blue-500 hover:underline cursor-pointer">
              Learn more.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
