import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenAI from "openai";
import useChatHistory from "../hooks/useChatHistory";
import { appendMessage } from "../utils/chatSlice";
import {
  BOT_NAME,
  CHATBOT_MODEL,
  OPENROUTER_BASE_URL,
  CHATBOT_SYSTEM_PROMPT,
  CHAT_SUGGESTIONS,
  SESSION_TITLE_MAX_LEN,
  LAST_MSG_PREVIEW_LEN,
  CHAT_THEME,
  BOT_ICON_MAP,
  DEFAULT_BOT_ICON,
} from "../utils/chatConfig";

const chatClient = import.meta.env.VITE_CHATBOT_API_KEY
  ? new OpenAI({
      apiKey: import.meta.env.VITE_CHATBOT_API_KEY,
      baseURL: OPENROUTER_BASE_URL,
      dangerouslyAllowBrowser: true,
    })
  : null;

const SYSTEM_MESSAGE = { role: "system", content: CHATBOT_SYSTEM_PROMPT };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const timeAgo = (ts) => {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
};

const parseInline = (str) => {
  const parts = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0, match;
  while ((match = regex.exec(str)) !== null) {
    if (match.index > last) parts.push(str.slice(last, match.index));
    if (match[1]) parts.push(<strong key={match.index} className="font-semibold text-white">{match[1]}</strong>);
    else if (match[2]) parts.push(<em key={match.index} className="italic text-white/55">{match[2]}</em>);
    last = regex.lastIndex;
  }
  if (last < str.length) parts.push(str.slice(last));
  return parts;
};

const renderText = (text) => {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  const hasBullets = lines.some(
    (l) => /^\s*[\*\-]\s+/.test(l) && !/^\s*\*[^*\n]+\*\s*$/.test(l)
  );
  if (!hasBullets) {
    return lines.map((line, i) => (
      <p key={i} className={i > 0 ? "mt-1.5" : ""}>{parseInline(line)}</p>
    ));
  }
  return (
    <ul className="space-y-2 list-none">
      {lines.map((line, i) => {
        const isBullet =
          /^\s*[\*\-]\s+/.test(line) && !/^\s*\*[^*\n]+\*\s*$/.test(line);
        const content = isBullet ? line.replace(/^\s*[\*\-]\s+/, "") : line;
        return isBullet ? (
          <li key={i} className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
            <span>{parseInline(content)}</span>
          </li>
        ) : (
          <p key={i} className="text-white/45 text-xs mt-1 italic">{parseInline(content)}</p>
        );
      })}
    </ul>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────
const MovieChatBot = () => {
  const dispatch = useDispatch();
  const { sessions, activeSessionId, activeMessages, sessionsLoaded } =
    useSelector((store) => store.chat);
  const botIconKey = useSelector((store) => store.user?.botIcon || DEFAULT_BOT_ICON);
  const BotIcon = BOT_ICON_MAP[botIconKey] || BOT_ICON_MAP[DEFAULT_BOT_ICON];
  const { fetchSessions, createSession, saveSession, deleteSession } = useChatHistory();

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const historyRef = useRef([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const openChat = () => {
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
  };

  const closeChat = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 220);
  };

  useEffect(() => {
    if (isOpen && !sessionsLoaded) fetchSessions();
  }, [isOpen]);

  useEffect(() => {
    historyRef.current = activeMessages
      .slice(1)
      .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
  }, [activeSessionId]);

  // Instant jump to bottom when chat panel opens or when switching back from sessions panel
  useEffect(() => {
    if (isOpen && !showSessions) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      });
    }
  }, [isOpen, showSessions]);

  // Smooth scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, loading]);

  useEffect(() => {
    if (isOpen && !showSessions) inputRef.current?.focus();
  }, [isOpen, showSessions]);

  const handleNewChat = () => {
    createSession();
    setShowSessions(false);
    historyRef.current = [];
  };

  const handleLoadSession = (session) => {
    dispatch({ type: "chat/setActiveSession", payload: session });
    setShowSessions(false);
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    await deleteSession(sessionId);
  };

  const handleSend = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading || !chatClient) return;
    setInput("");

    const sessionId = activeSessionId;
    const currentMessages = activeMessages;
    const userMsg = { role: "user", text: userText };
    dispatch(appendMessage(userMsg));
    historyRef.current = [...historyRef.current, { role: "user", content: userText }];
    setLoading(true);

    try {
      const response = await chatClient.chat.completions.create({
        model: CHATBOT_MODEL,
        messages: [SYSTEM_MESSAGE, ...historyRef.current],
      });
      const reply =
        response.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
      const aiMsg = { role: "model", text: reply };
      historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
      dispatch(appendMessage(aiMsg));

      const existingSession = sessions.find((s) => s.id === sessionId);
      const title = existingSession?.title || userText.slice(0, SESSION_TITLE_MAX_LEN);
      saveSession(
        sessionId,
        [...currentMessages, userMsg, aiMsg],
        title,
        reply.slice(0, LAST_MSG_PREVIEW_LEN)
      );
    } catch (err) {
      const isRateLimit = (err?.message || "").includes("429");
      dispatch(
        appendMessage({
          role: "model",
          text: isRateLimit
            ? "Too many requests — please wait a moment and try again."
            : "Something went wrong. Please try again.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const isOnlyWelcome = activeMessages.length === 1;

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className={`w-[330px] sm:w-[390px] h-[600px] sm:h-[660px] flex flex-col rounded-2xl overflow-hidden shadow-2xl ${isVisible ? "chat-enter" : "chat-exit"}`}
          style={{
            background: CHAT_THEME.panelBg,
            border: `1px solid ${CHAT_THEME.borderColor}`,
          }}
        >
          {/* Header */}
          <div
            className="relative px-4 py-3 shrink-0"
            style={{
              background: CHAT_THEME.headerGrad,
              borderBottom: `1px solid ${CHAT_THEME.borderColor}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: CHAT_THEME.accentGrad }}
                  >
                    <BotIcon size={20} color="white" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">{BOT_NAME}</p>
                  <p className="text-green-400 text-[10px] font-medium tracking-wider uppercase">
                    {showSessions ? "Chat History" : "● Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setShowSessions((p) => !p)}
                  title="Chat history"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    showSessions
                      ? "text-red-400 bg-red-400/15"
                      : "text-white/40 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={closeChat}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {showSessions ? (
            /* ── Sessions Panel ── */
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col p-3 gap-2">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10"
              >
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Chat
              </button>

              {sessions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/6 flex items-center justify-center"><BotIcon size={24} color="rgba(255,255,255,0.4)" /></div>
                  <p className="text-white/30 text-sm text-center leading-relaxed">
                    No previous chats yet.<br />Start a conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-white/25 text-[10px] uppercase tracking-widest px-1 mb-2">Recent</p>
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleLoadSession(session)}
                      className={`group flex items-start justify-between gap-2 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                        session.id === activeSessionId
                          ? "border-red-500/40 bg-red-500/10"
                          : "border-transparent hover:bg-white/5 hover:border-white/8"
                      }`}
                    >
                      <div className="flex gap-2.5 items-start flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5 text-sm">🎞️</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/90 text-xs font-medium truncate">{session.title || "New chat"}</p>
                          <p className="text-white/40 text-[10px] truncate mt-0.5">{session.lastMessage || "…"}</p>
                          <p className="text-white/22 text-[9px] mt-1">{timeAgo(session.updatedAt)}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 transition-all p-1 shrink-0 mt-0.5 rounded"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Conversation Panel ── */
            <>
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scrollbar-hide">
                {activeMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "model" && (
                      <div
                        className="w-6 h-6 rounded-lg shrink-0 mb-0.5 flex items-center justify-center text-xs"
                        style={{ background: CHAT_THEME.accentGrad }}
                      >
                        <BotIcon size={12} color="white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm text-white"
                          : "rounded-bl-sm text-white/88 border"
                      }`}
                      style={
                        msg.role === "user"
                          ? { background: CHAT_THEME.accentGrad }
                          : { background: CHAT_THEME.botMsgBg, borderColor: CHAT_THEME.borderColor }
                      }
                    >
                      {msg.role === "user" ? msg.text : renderText(msg.text)}
                    </div>
                  </div>
                ))}

                {/* Suggestion chips — shown only on fresh chat */}
                {isOnlyWelcome && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {CHAT_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="text-[11px] text-white/65 hover:text-white border border-white/12 hover:border-red-500/50 hover:bg-red-500/10 px-3 py-1.5 rounded-full transition-all duration-200"
                        style={{ background: CHAT_THEME.botMsgBg }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {loading && (
                  <div className="flex items-end gap-2">
                    <div
                      className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs"
                      style={{ background: CHAT_THEME.accentGrad }}
                    >
                      {botIcon}
                    </div>
                    <div
                      className="rounded-2xl rounded-bl-sm px-4 py-3 border flex gap-1.5 items-center"
                      style={{ background: CHAT_THEME.botMsgBg, borderColor: CHAT_THEME.borderColor }}
                    >
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div
                className="px-3 pb-4 pt-2 shrink-0"
                style={{ borderTop: `1px solid ${CHAT_THEME.borderColor}` }}
              >
                <div
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 focus-within:ring-1 focus-within:ring-red-500/50 transition-all duration-200 border"
                  style={{ background: CHAT_THEME.inputBg, borderColor: CHAT_THEME.borderColor }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
                    }
                    placeholder="Ask about any movie or show…"
                    className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none min-w-0"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30"
                    style={{
                      background: input.trim()
                        ? CHAT_THEME.accentGrad
                        : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── FAB Button ── */}
      <button
        onClick={() => (isOpen ? closeChat() : openChat())}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 hover:scale-105"
        style={{ background: CHAT_THEME.accentGrad }}
      >
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-2xl animate-ping opacity-20"
            style={{ background: CHAT_THEME.accentGrad }}
          />
        )}
        {isOpen ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MovieChatBot;
