import openai from "../utils/openai";

const useGptMoviePrompt = () => {
  const getMovieNamesFromGpt = async (gptPrompt) => {
    if (!openai) {
      throw new Error(
        "OpenAI API key is missing. Add VITE_OPENAI_API_KEY to a .env file in the project root and restart the dev server."
      );
    }

    const query = `Act as a Movie Recommendation System and suggest some movies based on the following prompt: ${gptPrompt} only give me name of 20 movies do not include any other text or anything. only give me movie names separated by comma like the example result given ahead. when you do not find any prompt or prompt is not related to movies then ask with some creative remark to make user enter the prompt to get movie or series result. Keep it a bit short.  Example Result : The Shawshank Redemption, The Godfather, Dilwale Dulhania Le Jayenge, The Godfather Part II, Pulp Fiction, Forrest Gump, Schindler's List, The Dark Knight, Interstellar, Inception`;

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: query }],
      model: "google/gemma-3n-e4b-it:free",
    });

    const result = response.choices?.[0]?.message?.content || "";
    return result.split(",").map((m) => m.trim());
  };

  return { getMovieNamesFromGpt };
};

export default useGptMoviePrompt;
