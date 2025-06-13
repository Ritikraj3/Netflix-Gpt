import React, { useEffect } from "react";
import netflixLogo from "../assets/netflix.png";
import avatarLogo from "../assets/Netflix-avatar.png";
import chatGptLogo from "../assets/chatgpt-4.svg";
import miniLogo from "../assets/miniLogo.png";
import homeLogo from "../assets/home.svg";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { toggleGptSearchView } from "../utils/gptSlice";
import { SUPPORTED_LANGUAGES } from "../utils/constant";
import { changeLanguage } from "../utils/configSlice";

const Header = () => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  const isBrowsePage = location.pathname === "/browse";
  const isResetpassword = location.pathname === "/reset-password";


  const handleGptSearchClick = () => {
            dispatch(toggleGptSearchView())
      }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL || avatarLogo,
          })
        );
        if (location.pathname !== "/browse") {
          navigate("/browse");
        }
      } else {
        dispatch(removeUser());
        if (location.pathname !== "/reset-password") {
          navigate("/");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.log(error);
        navigate("/error");
      });

  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value))
  }

  return (
    <header className="absolute top-0 w-full z-50 ">
      <div
        className={`flex items-center justify-between h-[90px] ${
          !isBrowsePage ? "2xl:px-[354px]" : ""
        } md:px-14 px-6 mb-[-120px] absolute top-0 w-full z-10 bg-gradient-to-b from-black/70 to-transparent select-none `}
      >
        <img
          src={netflixLogo}
          alt="Netflix"
          className="hidden sm:inline-block sm:w-38 h-auto"
        />
        <img
          src={miniLogo}
          alt="Netflix"
          className="inline-block sm:hidden w-11  h-auto"
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
          <div className="flex items-center gap-3">

            {showGptSearch && <select className="text-white border-2 cursor-pointer rounded px-2 py-1" onChange={handleLanguageChange} >
              {SUPPORTED_LANGUAGES.map(lang => <option className="text-black" key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>}

            <button
              onClick={ handleGptSearchClick }
              className="flex items-center gap-2 px-3 py-2 bg-white text-black hover:bg-gray-300 cursor-pointer rounded-lg text-xs sm:text-sm transition-all duration-200"
            >
              {showGptSearch ? <img
                src={homeLogo}
                alt="GPT Search"
                className="w-4 h-4 sm:w-5 sm:h-5"
              /> : <img
                src= {chatGptLogo}
                alt="Home"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />}
              <span className="hidden sm:inline">{showGptSearch ? "Home" : "GPT Search"}</span>
            </button>

            <img
              className="w-10 h-10 rounded cursor-pointer"
              src={user?.photoURL || avatarLogo}
              alt="user-avatar"
            />
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Sign Out
            </button>

          </div> 
        )}
      </div>
    </header>
  );
};

export default Header;
