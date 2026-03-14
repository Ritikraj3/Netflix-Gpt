// ─── Bot Identity ────────────────────────────────────────────────────────────
export const BOT_NAME = "NetBot";
export const BOT_TAGLINE = "Your Movie & TV Expert";
export const BOT_WELCOME =
  "Hi! I'm NetBot — your personal movie expert. Ask me anything about films, shows, actors, or directors!";

// ─── AI Models ───────────────────────────────────────────────────────────────
export const CHATBOT_MODEL = "stepfun/step-3.5-flash:free";
export const GPT_SEARCH_MODEL = "stepfun/step-3.5-flash:free";
export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// ─── Prompts ─────────────────────────────────────────────────────────────────
export const CHATBOT_SYSTEM_PROMPT = `You are a movie and TV show expert assistant embedded in a Netflix-like streaming app called NetBot.
You ONLY answer questions about movies, TV shows, web series, anime, actors, directors, genres, ratings,
plot summaries, cast, crew, release dates, box office, awards, and recommendations.
If the user asks about anything unrelated to movies or entertainment, respond with:
"I can only help with movie and TV show questions! Try asking me about a film, show, actor, or director."
Keep answers concise, engaging, and friendly. Do not use markdown headers. You may use short bullet points where helpful.`;

export const GPT_SEARCH_PROMPT = (query) =>
  `Act as a Movie Recommendation System and suggest some movies based on the following prompt: ${query} ` +
  `only give me name of 20 movies do not include any other text or anything. ` +
  `only give me movie names separated by comma like the example result given ahead. ` +
  `when you do not find any prompt or prompt is not related to movies then ask with some creative remark ` +
  `to make user enter the prompt to get movie or series result. Keep it a bit short. ` +
  `Example Result : The Shawshank Redemption, The Godfather, Dilwale Dulhania Le Jayenge, ` +
  `The Godfather Part II, Pulp Fiction, Forrest Gump, Schindler's List, The Dark Knight, Interstellar, Inception`;

// ─── Suggestion Chips (shown on fresh chat) ──────────────────────────────────
export const CHAT_SUGGESTIONS = [
  "Best movies of 2024 🎬",
  "Top Bollywood films 🇮🇳",
  "Recommend a thriller 🔪",
  "Best sci-fi series 🚀",
];

// ─── Firebase Collection Paths ───────────────────────────────────────────────
export const FIREBASE_CHAT_COLLECTION = "chatSessions";
export const FIREBASE_WATCHLIST_COLLECTION = "watchlist";

// ─── Session Config ───────────────────────────────────────────────────────────
export const SESSION_TITLE_MAX_LEN = 45;
export const LAST_MSG_PREVIEW_LEN = 80;

// ─── NetBot Icon Map (react-icons/fa + react-icons/md only) ──────────────────
import {
  FaFilm, FaRobot, FaStar, FaPlay, FaFire,
  FaCamera, FaVideo, FaGamepad, FaMagic, FaSpaceShuttle,
} from "react-icons/fa";
import {
  MdMovie, MdLocalMovies, MdLiveTv, MdStars,
  MdTheaterComedy, MdAutoAwesome, MdWhatshot,
  MdSlowMotionVideo,
} from "react-icons/md";

export const BOT_ICON_MAP = {
  FaFilm, FaCamera, FaVideo, FaRobot,
  FaFire, FaStar, FaPlay, FaGamepad, FaMagic, FaSpaceShuttle,
  MdMovie, MdLocalMovies, MdLiveTv, MdStars,
  MdTheaterComedy, MdAutoAwesome, MdWhatshot, MdSlowMotionVideo,
};

export const DEFAULT_BOT_ICON = "FaFilm";

// ─── Theme ────────────────────────────────────────────────────────────────────
export const CHAT_THEME = {
  panelBg:       "#212121",
  headerBg:      "#2a2a2a",
  botMsgBg:      "#2e2e2e",
  inputBg:       "#2e2e2e",
  borderColor:   "rgba(255,255,255,0.09)",
  accentGrad:    "linear-gradient(135deg, #dc2626, #b91c1c)",
  headerGrad:    "linear-gradient(135deg, #2a2a2a, #232323)",
};
