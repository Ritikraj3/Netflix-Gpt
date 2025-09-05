# Netflix GPT

-Create a vite project
-Configure TailwindCSS
-Header
-Routing of app
-Login/Sign up
-form validation
-useRef hooks
-firebase setup
-deploying our app to production
-create sign up user account
-Implement sig in user API 
-Created Redux store with userSlice
-implemented signout
-updated profile api call
-fetch movie from TMDB API
-implement movie suggestions
-BugFix - sign up displayname and photoURL
-BugFix - if the user is loggedin redirect to browse login vice versa
-Unsubscribe to the onAuthStateChanged callback
-difficulty in allowed access without authentication - password reset 
planned main container
-custom hook for logo, now playing movies, trailer video.
created movieSlice
updated store with movieSlice
fetch data for trailer video
update store with trailer video data 
embedded the youtube play in loop autoplay 
implememented volume toggle b/w mute and unmute
-Build secondary component
-Implementing movie suggestions
-build movie list 
-build movie card
-tmdb image CDN URL
-fetched movie logo with movie id
-made movie list scrollable
-used custom hooks for movie logo , now playing movies, popular movies top  trending movies and  trailer video
-created another slice for tv series 
-updated the store with tv series slice
-created tv series hooks for top rated tv series and trending tv series 
-GPT search feature
-GPT custom search placeholder with random suggesting prompts
-Marquee animation reset:
  -Placeholder scrolls (marquee-style) and restarts smoothly on every        refresh or language change.
-multiple language support
-Integrate GPT API


# Features
-login/Sign up
   -sign in / sign up form
   -redirect to browse page
-Browse (only comes after authentication)
   -Header
   -Main Movie
      -Trailer in background
      -Title and overview
    -Movie Suggestions
       -movies in a carousel * n  
-Netflix GPT
   -Search bar
   -Movie suggestions
   ---
   **High‑Level Summary of the Netflix‑GPT Repository**

---

### Purpose  
This project is a **React‑based web application** that mimics the look‑and‑feel of Netflix while adding a **ChatGPT‑powered movie‑recommendation feature**. Users can browse various movie categories (Now Playing, Popular, Upcoming, etc.) and, when they toggle the GPT view, type natural‑language prompts to receive AI‑generated movie suggestions.

### Main Technologies  
| Area | Stack |
|------|-------|
| **Frontend** | React 19 (with Vite), Tailwind CSS, Redux Toolkit, React‑Router‑DOM |
| **State Management** | Redux slices for user, movies, TV series, GPT, and configuration |
| **AI Integration** | OpenAI `gpt‑4o` model accessed through the `openai` npm package |
| **Data Source** | TMDB (The Movie Database) API – used for fetching movies, TV series, trailers, and logos |
| **Backend / Hosting** | Firebase (authentication & hosting) |
| **Build / Tooling** | Vite 6, ESLint (with React hooks & refresh plugins), Tailwind CSS, Lucide icons |

### Repository Layout  

```
├── .firebaserc          # Firebase project reference
├── .gitignore
├── README.md
├── eslint.config.js
├── firebase.json        # Firebase hosting config
├── index.html
├── package.json & lock
├── public/              # static assets (favicon, redirects)
└── src/
    ├── App.{css,jsx}
    ├── assets/          # images & SVGs (logo, background, etc.)
    ├── components/      # UI building blocks
    │   ├── Body.jsx               (router wrapper)
    │   ├── Browse.jsx             (main browsing page)
    │   ├── Footer.jsx
    │   ├── GptSearch.jsx          (GPT UI)
    │   ├── GptMovieSuggestions.jsx
    │   ├── Header.jsx
    │   ├── Login.jsx
    │   ├── MainContainer.jsx
    │   ├── MovieCard.jsx
    │   ├── MovieList.jsx
    │   ├── ResetPassword.jsx
    │   ├── SecondaryContainer.jsx
    │   ├── Top10MovieCard.jsx
    │   ├── Top10Movies.jsx
    │   ├── VideoBackground.jsx
    │   └── VideoTitle.jsx
    ├── hooks/           # custom React hooks for data fetching & GPT behavior
    ├── index.css
    ├── main.jsx
    └── utils/          # Redux slices, constants, OpenAI wrapper, Firebase helpers
```

### Core Features  

| Feature | Implementation Details |
|---------|------------------------|
| **Movie Browsing** | Multiple hooks (`useNowPlayingMovies`, `usePopularMovies`, `useTrendingMovies`, etc.) fetch TMDB data and store it in Redux. `MovieList`, `Top10Movies`, and `MovieCard` render the UI. |
| **GPT‑Based Search** | `GptSearchBar` (not shown but used) lets the user type a prompt. `useGptMoviePrompt` sends a crafted prompt to OpenAI’s `gpt‑4o` model, receives a comma‑separated list of 5 movie titles, then `useTmdbMovieSearch` looks up each title on TMDB. Results are displayed via `GptMovieSuggestions`. |
| **Responsive UI** | Tailwind CSS utilities, a “scrollbar‑hide” helper, and animated marquee text for placeholders. |
| **Authentication** | Firebase Auth utilities (`firebase.js`, `firebaseErrorMessage.js`) are wired into the login / reset‑password components. |
| **State Toggles** | Redux slice `gptSlice` holds `showGptSearch` (to switch between normal browse and GPT view) and the fetched GPT results. |
| **Internationalisation Ready** | `configSlice` stores the selected language (`lang`). Placeholders for the GPT search bar are language‑specific (`useRandomGptSearchBarPlaceholder`). |
| **Video Background** | `VideoBackground` uses the TMDB video endpoint to fetch a trailer for the featured movie. |
| **Deployment** | Configured for Firebase Hosting; the `public/_redirects` file ensures SPA routing works (`/* → /index.html`). |

### Notable Code Highlights  

* **API Options** – Centralized in `utils/constant.js` with the TMDB bearer token.  
* **OpenAI Wrapper** – `utils/openai.js` creates a client with the API key read from an env variable (`VITE_OPENAI_API_KEY`).  
* **Redux Slices** – Clean separation of concerns: `moviesSlice`, `TvSeriesSlice`, `gptSlice`, `userSlice`, `configSlice`.  
* **Custom Hook for GPT Input** – `useGptInputBehavior` manages placeholder auto‑fill, focus/blur behavior, and resetting.  
* **Error Handling** – Firebase auth errors are mapped to user‑friendly strings in `firebaseErrorMessage.js`.  

### Development Workflow  

1. **Install dependencies**: `npm install` (or `yarn`).  
2. **Run locally**: `npm run dev` – Vite dev server with hot‑module replacement.  
3. **Lint**: `npm run lint`.  
4. **Build for production**: `npm run build` → `dist/` folder, ready for Firebase deployment (`firebase deploy`).  

### Extensibility Opportunities  

* **Add more GPT prompt templates** (e.g., genre‑specific, mood‑based).  
* **Persist user preferences** (selected language, favorite movies) in Firebase Firestore.  
* **Improve caching** of TMDB responses to reduce API calls.  
* **Add SSR/SSG** via Vite’s preview mode or a server‑side framework for SEO.  

---  

In short, the repo provides a fully functional Netflix‑style front‑end with a clever integration of OpenAI’s GPT model to generate movie recommendations based on free‑form user prompts, all powered by TMDB data and managed through Redux.
