import { createSlice } from "@reduxjs/toolkit";
import { BOT_WELCOME } from "./chatConfig";

export const WELCOME_MESSAGE = { role: "model", text: BOT_WELCOME };

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    sessions: [],          // [{ id, title, lastMessage, updatedAt, messages[] }]
    activeSessionId: null,
    activeMessages: [],
    sessionsLoaded: false,
  },
  reducers: {
    setSessions: (state, action) => {
      state.sessions = action.payload;
      state.sessionsLoaded = true;
    },
    setActiveSession: (state, action) => {
      state.activeSessionId = action.payload.id;
      state.activeMessages = action.payload.messages?.length
        ? action.payload.messages
        : [WELCOME_MESSAGE];
    },
    appendMessage: (state, action) => {
      state.activeMessages.push(action.payload);
    },
    upsertSession: (state, action) => {
      const { id, title, lastMessage, updatedAt, messages } = action.payload;
      const idx = state.sessions.findIndex((s) => s.id === id);
      if (idx >= 0) {
        state.sessions[idx] = { id, title, lastMessage, updatedAt, messages };
      } else {
        state.sessions.unshift({ id, title, lastMessage, updatedAt, messages });
      }
      state.sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    },
    removeSession: (state, action) => {
      const remaining = state.sessions.filter((s) => s.id !== action.payload);
      state.sessions = remaining;
      if (state.activeSessionId === action.payload) {
        state.activeSessionId = remaining[0]?.id || null;
        state.activeMessages = remaining[0]?.messages?.length
          ? remaining[0].messages
          : [WELCOME_MESSAGE];
      }
    },
  },
});

export const { setSessions, setActiveSession, appendMessage, upsertSession, removeSession } =
  chatSlice.actions;
export default chatSlice.reducer;
