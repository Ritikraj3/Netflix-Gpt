import OpenAI from "openai";
import { OPENAI_KEY } from "./constant";

const openai = OPENAI_KEY
  ? new OpenAI({
      apiKey: OPENAI_KEY,
      dangerouslyAllowBrowser: true,
    })
  : null;

export default openai;