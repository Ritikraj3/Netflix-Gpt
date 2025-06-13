import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import useRandomGptSearchBarPlaceholder from "../hooks/useRandomGptSearchBarPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constant";
import { addGptMovieResults } from "../utils/gptSlice";

const GptSearchBar = () => {

  const dispatch = useDispatch()
  const langCode = useSelector((store) => store.config.lang);
  const { register, handleSubmit, reset, setValue, getValues } = useForm();
  const inputRef = useRef(null);

  const getRandomPlaceholder = useRandomGptSearchBarPlaceholder(langCode);

  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    getRandomPlaceholder()
  );
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [marqueeKey, setMarqueeKey] = useState(Date.now()); // 💡 for animation refresh

  const onSubmit = (data) => {
    const { prompt } = data;
    console.log(prompt);
    reset();
    if (inputRef.current) inputRef.current.value = "";
    setValue("prompt", "");
    setIsAutoFilled(false);
    setShowPlaceholder(true);
    setCurrentPlaceholder(getRandomPlaceholder());
    setMarqueeKey(Date.now()); // 🔁 Also update marquee on submit
  };

  //search movie in TMDB
  const searchMovieTMDB = async (movie) => {
    const Data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&page=1`,
      API_OPTIONS
    );
    const Json = await Data.json();

    return Json.results;
  };

  const handleGptSearch = async () => {
    const gptPrompt = getValues("prompt");
    // console.log(gptPrompt);

    const gptQuery =
      "Act as a Movie Recommendation System and suggest some movies based on the following prompt: " +
      gptPrompt +
      "only give me name of 5 movies do not include any other text or anything. only give me movie names separated by comma like the example result given ahead. when you do not find any prompt or prompt is not related to movies then ask with some creative remark to make user enter the prompt to get movie or series result. Keep it a bit short.  Example Result : The Shawshank Redemption, The Godfather, Dilwale Dulhania Le Jayenge, The Godfather Part II, Pulp Fiction";

    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuery }],
      model: "gpt-4o",
    });

    if (!gptResults.choices[0].message.content) {
      //  TODO : Error handling
    }
    console.log(gptResults.choices[0].message.content);

    const gptMovies = gptResults.choices[0].message.content.split(","); //array of movies

    // for each movie search in TMDB

    const data = gptMovies.map((movie) => searchMovieTMDB(movie));    // result array of promises

    const tmdbResults = await Promise.all(data);

    console.log(tmdbResults);

    dispatch(addGptMovieResults(tmdbResults));
  };
  

  const handleFocus = () => {
    const input = inputRef.current;
    if (!input) return;

    if (input.value.trim() === "" && !isAutoFilled) {
      input.value = currentPlaceholder;
      setValue("prompt", currentPlaceholder);
      input.select();
      setIsAutoFilled(true);
      setShowPlaceholder(false);
    }

    if (isAutoFilled) {
      input.value = "";
      setValue("prompt", "");
      setIsAutoFilled(false);
      setShowPlaceholder(false);
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setValue("prompt", value);
    if (value.trim() === "") {
      setShowPlaceholder(false);
      setIsAutoFilled(false);
    } else {
      setIsAutoFilled(false);
    }
  };

  useEffect(() => {
    setCurrentPlaceholder(getRandomPlaceholder());
    setMarqueeKey(Date.now()); // 🔁 Restart animation on lang change too
  }, [langCode]);

  const refreshPlaceholder = (e) => {
    e.preventDefault();
    setCurrentPlaceholder(getRandomPlaceholder());
    setMarqueeKey(Date.now()); // 🔁 Restart marquee
    if (!inputRef.current.value) setShowPlaceholder(true);

    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 300);
  };

  return (
    <div className="pt-[110px] bg-[#141414] min-h-screen  px-2 sm:px-4">
      <div className="w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl flex items-center bg-white/10 border border-white/20 rounded-full px-3 sm:px-5 py-2 sm:py-3 backdrop-blur-md shadow-lg"
        >
          <FaSearch className="text-white/70 text-base sm:text-lg mr-2 sm:mr-3" />

          <div className="relative flex-1 min-w-0 overflow-hidden">
            {showPlaceholder && !inputRef.current?.value && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center pl-1 pr-2 text-white/60 text-sm sm:text-base pointer-events-none whitespace-nowrap overflow-x-hidden text-ellipsis">
                <div key={marqueeKey} className="animate-marquee">
                  {currentPlaceholder}
                </div>
              </div>
            )}
            <input
              type="text"
              {...register("prompt", { required: true })}
              ref={inputRef}
              onFocus={handleFocus}
              onInput={handleInput}
              className="bg-transparent w-full text-white placeholder-white/60 focus:outline-none text-sm sm:text-base min-w-0"
            />
          </div>

          <button
            onClick={refreshPlaceholder}
            type="button"
            title="Refresh placeholder"
            className="ml-2 text-white/80 hover:text-white transition-all"
          >
            <FaSyncAlt
              className={`text-base sm:text-lg cursor-pointer ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>

          <button
            type="submit"
            onClick={handleGptSearch}
            className="ml-2 sm:ml-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full transition-all cursor-pointer"
          >
            {lang[langCode].search}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GptSearchBar;
