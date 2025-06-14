import { useState, useEffect } from "react";
import useRandomGptSearchBarPlaceholder from "./useRandomGptSearchBarPlaceholder";

const useGptPlaceholderText = (langCode) => {
  const getRandomPlaceholder = useRandomGptSearchBarPlaceholder(langCode);

  const [currentPlaceholder, setCurrentPlaceholder] = useState(getRandomPlaceholder());
  const [refreshing, setRefreshing] = useState(false);
  const [marqueeKey, setMarqueeKey] = useState(Date.now());

  const refreshPlaceholder = () => {
    setCurrentPlaceholder(getRandomPlaceholder());
    setMarqueeKey(Date.now());
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 300);
  };

  useEffect(() => {
    setCurrentPlaceholder(getRandomPlaceholder());
    setMarqueeKey(Date.now());
  }, [langCode, getRandomPlaceholder]);

  return {
    currentPlaceholder,
    marqueeKey,
    refreshing,
    refreshPlaceholder,
  };
};

export default useGptPlaceholderText;
