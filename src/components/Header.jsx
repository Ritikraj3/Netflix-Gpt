import React, { useEffect, useState, useRef } from "react";
import netflixLogo from "../assets/netflix.webp";
import avatarLogo from "../assets/Netflix-avatar.png";
import chatGptLogo from "../assets/chatgpt-4.svg";
import miniLogo from "../assets/miniLogo.webp";
import homeLogo from "../assets/home.svg";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { toggleGptSearchView } from "../utils/gptSlice";
import { SUPPORTED_LANGUAGES } from "../utils/constant";
import { changeLanguage } from "../utils/configSlice";
import ManageProfile from "./ManageProfile";
import UserAvatar from "./UserAvatar";

const WatchlistItem = () => {
  const count = useSelector((store) => store.watchlist?.items?.length ?? 0);
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 text-sm">
      <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 text-base">
        🔖
      </span>
      <span className="flex-1">My Watchlist</span>
      {count > 0 && (
        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {count}
        </span>
      )}
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  const isBrowsePage = location.pathname === "/browse";
  const isResetpassword = location.pathname === "/reset-password";

  const [showDropdown, setShowDropdown] = useState(false);
  const [showManageProfile, setShowManageProfile] = useState(false);
  const dropdownRef = useRef();

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;

        // Load saved profile (custom avatar, botIcon) from Firestore
        let profile = {};
        try {
          const snap = await getDoc(doc(db, "users", uid, "profile", "info"));
          if (snap.exists()) profile = snap.data();
        } catch (_) {}

        dispatch(
          addUser({
            uid,
            email,
            displayName: profile.displayName || displayName,
            photoURL: profile.photoURL || photoURL || avatarLogo,
            botIcon: profile.botIcon || "🎬",
          }),
        );
        if (
          location.pathname !== "/browse" &&
          location.pathname !== "/reset-password"
        )
          navigate("/browse");
      } else {
        dispatch(removeUser());
        if (location.pathname !== "/reset-password") navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.log(error);
      navigate("/error");
    });
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <>
      <header className="absolute top-0 w-full z-50">
        <div
          className={`flex items-center justify-between h-[90px] ${
            !isBrowsePage ? "2xl:px-[354px]" : ""
          } md:px-14 px-2 mb-[-120px] absolute top-0 w-full z-10 bg-black md:bg-gradient-to-b md:from-black/70 md:to-transparent select-none`}
        >
          <img
            src={netflixLogo}
            alt="Netflix"
            className="hidden sm:inline-block sm:w-38 h-auto"
          />
          <img
            src={miniLogo}
            alt="Netflix"
            className="inline-block sm:hidden w-8 h-auto"
          />

          {!isBrowsePage && !isResetpassword && (
            <img
              src={chatGptLogo}
              className="w-12 sm:w-15 h-auto"
              alt="ChatGPT"
            />
          )}

          {isResetpassword && (
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-1.5 rounded cursor-pointer"
            >
              Sign In
            </button>
          )}

          {isBrowsePage && (
            <div className="flex items-center gap-3 relative">
              <button
                onClick={handleGptSearchClick}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white text-black hover:bg-gray-300 cursor-pointer rounded-lg text-xs sm:text-sm transition-all duration-200"
              >
                <img
                  src={showGptSearch ? homeLogo : chatGptLogo}
                  alt="toggle"
                  className="w-5 h-5 sm:w-5 sm:h-5"
                />
                <span className="hidden sm:inline">
                  {showGptSearch ? "Home" : "GPT Search"}
                </span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-1.5"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <UserAvatar
                    src={user?.photoURL || avatarLogo}
                    size={36}
                    className="w-9 h-9 rounded-lg cursor-pointer transition object-cover"
                  />
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 top-12 mt-1 w-64 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* User card */}
                    <div
                      className="flex items-center gap-3 px-4 py-4"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <UserAvatar
                        src={user?.photoURL || avatarLogo}
                        size={44}
                        className="w-11 h-11 rounded-xl shrink-0 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {user?.displayName || "Netflix User"}
                        </p>
                        <p className="text-white/45 text-[11px] truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="px-2 py-2 space-y-0.5">
                      {/* Watchlist */}
                      <WatchlistItem />

                      {/* Manage Profile */}
                      <button
                        onClick={() => {
                          setShowManageProfile(true);
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/6 transition-all duration-150 text-sm"
                      >
                        <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </span>
                        <span>Manage Profile</span>
                      </button>

                      {/* GPT Search toggle */}
                      <button
                        onClick={() => {
                          dispatch(toggleGptSearchView());
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/6 transition-all duration-150 text-sm"
                      >
                        <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                          <img
                            src={chatGptLogo}
                            alt="gpt"
                            className="w-4 h-4"
                          />
                        </span>
                        <span>
                          {showGptSearch ? "Back to Home" : "GPT Search"}
                        </span>
                      </button>

                      {/* Language — only visible on GPT Search page */}
                      {showGptSearch && (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/6 transition-all duration-150">
                          <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 text-base">
                            🌐
                          </span>
                          <select
                            onChange={handleLanguageChange}
                            className="flex-1 bg-transparent text-white/80 text-sm outline-none cursor-pointer"
                          >
                            {SUPPORTED_LANGUAGES.map((lang) => (
                              <option
                                className="text-black bg-white"
                                key={lang.code}
                                value={lang.code}
                              >
                                {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Sign Out */}
                    <div
                      className="px-2 pb-2"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 mt-1.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 text-sm font-medium"
                      >
                        <span className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {showManageProfile && (
        <ManageProfile onClose={() => setShowManageProfile(false)} />
      )}
    </>
  );
};

export default Header;
