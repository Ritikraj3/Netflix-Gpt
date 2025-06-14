import openai from "../utils/openai";

const useGptMoviePrompt = () => {
  const getMovieNamesFromGpt = async (gptPrompt) => {
    const query = `Act as a Movie Recommendation System and suggest some movies based on the following prompt: ${gptPrompt} only give me name of 5 movies do not include any other text or anything. only give me movie names separated by comma like the example result given ahead. when you do not find any prompt or prompt is not related to movies then ask with some creative remark to make user enter the prompt to get movie or series result. Keep it a bit short.  Example Result : The Shawshank Redemption, The Godfather, Dilwale Dulhania Le Jayenge, The Godfather Part II, Pulp Fiction`;

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: query }],
      model: "gpt-4o",
    });

    const result = response.choices?.[0]?.message?.content || "";
    console.log(result);
    return result.split(",").map((m) => m.trim());
  };

  return { getMovieNamesFromGpt };
};

export default useGptMoviePrompt;
