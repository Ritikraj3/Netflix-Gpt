import { useRef, useState } from "react";

const useGptInputBehavior = (setValue, currentPlaceholder) => {
  const inputRef = useRef(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

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

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
    setValue("prompt", "");
    setIsAutoFilled(false);
    setShowPlaceholder(true);
  };

  return {
    inputRef,
    showPlaceholder,
    isAutoFilled,
    setShowPlaceholder,
    setIsAutoFilled,
    handleFocus,
    handleInput,
    resetInput,
  };
};

export default useGptInputBehavior;
