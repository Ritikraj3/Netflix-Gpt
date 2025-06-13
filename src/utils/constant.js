export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTU1ZTU5NGE1MWQwODFiN2Y4MjU3YWQ5M2EwZTQzYSIsIm5iZiI6MTc0OTM5MDU2NS45MDksInN1YiI6IjY4NDU5NGU1ZTljYThhN2IzYzNmYzQyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e87pUslKIRo_DLMtTQZEuUbYFZfbbV_HjJv1cONojzQ'
  }
};

export const IMG_CDN_URL = 'https://image.tmdb.org/t/p/w500/';

export const SUPPORTED_LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'Hindi', code: 'hi' },
  {name:"spanish",code:"es"},
  {name:"japanese",code:"ja"},
  {name:"korean",code:"ko"},]

  export const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;