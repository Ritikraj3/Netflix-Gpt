import { useDispatch, useSelector } from "react-redux";
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import {
  setSessions,
  setActiveSession,
  upsertSession,
  removeSession,
  WELCOME_MESSAGE,
} from "../utils/chatSlice";
import { FIREBASE_CHAT_COLLECTION } from "../utils/chatConfig";

const useChatHistory = () => {
  const dispatch = useDispatch();
  const uid = useSelector((store) => store.user?.uid);

  const fetchSessions = async () => {
    if (!uid) return;
    try {
      const snap = await getDocs(collection(db, "users", uid, FIREBASE_CHAT_COLLECTION));
      const sessions = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      dispatch(setSessions(sessions));

      // Auto-load the most recent session
      if (sessions.length > 0) {
        dispatch(setActiveSession(sessions[0]));
      } else {
        // No sessions yet — start a fresh one
        dispatch(setActiveSession({ id: `session_${Date.now()}`, messages: [WELCOME_MESSAGE] }));
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      dispatch(setSessions([]));
      dispatch(setActiveSession({ id: `session_${Date.now()}`, messages: [WELCOME_MESSAGE] }));
    }
  };

  const createSession = () => {
    const id = `session_${Date.now()}`;
    dispatch(setActiveSession({ id, messages: [WELCOME_MESSAGE] }));
    return id;
  };

  const saveSession = async (sessionId, messages, title, lastMessage) => {
    if (!uid) return;
    try {
      const updatedAt = Date.now();
      const ref = doc(db, "users", uid, FIREBASE_CHAT_COLLECTION, sessionId);
      await setDoc(ref, { title, messages, lastMessage, updatedAt });
      dispatch(upsertSession({ id: sessionId, title, messages, lastMessage, updatedAt }));
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!uid) return;
    try {
      await deleteDoc(doc(db, "users", uid, FIREBASE_CHAT_COLLECTION, sessionId));
      dispatch(removeSession(sessionId));
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  return { fetchSessions, createSession, saveSession, deleteSession };
};

export default useChatHistory;
