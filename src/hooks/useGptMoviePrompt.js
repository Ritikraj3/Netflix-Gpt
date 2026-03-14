import openai from "../utils/openai";
import { GPT_SEARCH_MODEL, GPT_SEARCH_PROMPT } from "../utils/chatConfig";

const useGptMoviePrompt = () => {
  const getMovieNamesFromGpt = async (gptPrompt) => {
    if (!openai) {
      throw new Error(
        "OpenAI API key is missing. Add VITE_OPENAI_API_KEY to a .env file in the project root and restart the dev server."
      );
    }

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: GPT_SEARCH_PROMPT(gptPrompt) }],
      model: GPT_SEARCH_MODEL,
    });

    const result = response.choices?.[0]?.message?.content || "";
    return result.split(",").map((m) => m.trim());
  };

  return { getMovieNamesFromGpt };
};

export default useGptMoviePrompt;
