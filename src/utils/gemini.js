import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_KEY } from "./constant";

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

export const geminiModel = genAI
  ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  : null;
