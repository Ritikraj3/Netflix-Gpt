import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaSyncAlt } from "react-icons/fa";

// Hooks
import useGptInputBehavior from "../hooks/useGptInputBehavior";
import useGptPlaceholderText from "../hooks/useGptPlaceholderText";
import useGptMoviePrompt from "../hooks/useGptMoviePrompt";
import useTmdbMovieSearch from "../hooks/useTmdbMovieSearch";

// Utilities
import lang from "../utils/languageConstants";
import { addGptMovieResults } from "../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langCode = useSelector((store) => store.config.lang);
  const { register, handleSubmit, reset, setValue, getValues } = useForm();

  const {
    currentPlaceholder,
    marqueeKey,
    refreshing,
    refreshPlaceholder,
  } = useGptPlaceholderText(langCode);

  const {
    inputRef,
    showPlaceholder,
    handleFocus,
    handleInput,
    resetInput,
  } = useGptInputBehavior(setValue, currentPlaceholder);

  const { getMovieNamesFromGpt } = useGptMoviePrompt();
  const { getTmdbResults } = useTmdbMovieSearch();

  const handleGptSearch = async () => {
    const gptPrompt = getValues("prompt");
    const movieNames = await getMovieNamesFromGpt(gptPrompt);
    const tmdbResults = await getTmdbResults(movieNames);
    console.log(tmdbResults);
    dispatch(addGptMovieResults(tmdbResults));
  };

  const onSubmit = (data) => {
    const { prompt } = data;
    console.log(prompt);
    reset();
    resetInput();
    refreshPlaceholder();
  };

  return (
    <div className="pt-[110px] bg-[#141414] min-h-screen px-2 sm:px-4">
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
            type="button"
            onClick={(e) => {
              e.preventDefault();
              refreshPlaceholder();
            }}
            title="Refresh placeholder"
            className="ml-2 text-white/80 hover:text-white transition-all"
          >
            <FaSyncAlt
              className={`text-base sm:text-lg cursor-pointer ${refreshing ? "animate-spin" : ""}`}
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
