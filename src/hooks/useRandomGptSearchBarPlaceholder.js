import { useCallback } from "react";
import lang from "../utils/languageConstants";

const useRandomGptSearchBarPlaceholder = (langCode) => {
  return useCallback(() => {
    const placeholders = lang[langCode]?.gptSearchPlaceholders || lang["en"].gptSearchPlaceholders;
    const index = Math.floor(Math.random() * placeholders.length);
    return placeholders[index];
  }, [langCode]);
};

export default useRandomGptSearchBarPlaceholder;
