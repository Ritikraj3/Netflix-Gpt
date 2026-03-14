import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const PRESET_AVATARS = [
  // Human / cartoon
  { url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4", label: "Felix" },
  { url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mia&backgroundColor=ffd5dc", label: "Mia" },
  { url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Leo&backgroundColor=c0aede", label: "Leo" },
  { url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sara&backgroundColor=d1f4cc", label: "Sara" },
  { url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jake&backgroundColor=ffeaad", label: "Jake" },
  { url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe&backgroundColor=ffcfad", label: "Zoe" },
  // Bot / robot
  { url: "https://api.dicebear.com/9.x/bottts/svg?seed=Rusty&backgroundColor=b6e3f4", label: "Rusty" },
  { url: "https://api.dicebear.com/9.x/bottts/svg?seed=Neon&backgroundColor=d1f4cc", label: "Neon" },
  { url: "https://api.dicebear.com/9.x/bottts/svg?seed=Volt&backgroundColor=c0aede", label: "Volt" },
  { url: "https://api.dicebear.com/9.x/bottts/svg?seed=Spark&backgroundColor=ffd5dc", label: "Spark" },
  // Pixel art
  { url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Alpha&backgroundColor=b6e3f4", label: "Alpha" },
  { url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Beta&backgroundColor=ffd5dc", label: "Beta" },
  { url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Pixel&backgroundColor=ffeaad", label: "Pixel" },
  { url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Retro&backgroundColor=d1f4cc", label: "Retro" },
  // Fun emoji
  { url: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Chill&backgroundColor=b6e3f4", label: "Chill" },
  { url: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Fire&backgroundColor=ffcfad", label: "Fire" },
];

const BOT_ICONS = ["🎬", "🎥", "🍿", "🎞️", "🎭", "🦸", "🤖", "🦊", "🐱", "🦅", "💫", "🌟", "🔥", "⚡", "🎮", "🎯", "🧠", "🦄"];

// Resize an image File to a 150×150 JPEG data URL
const resizeImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const SIZE = 150;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const ManageProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const fileInputRef = useRef(null);

  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [botIcon, setBotIcon] = useState(user?.botIcon || "🎬");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await resizeImage(file);
    setSelectedAvatar(dataUrl);
  };

  const handleSave = async () => {
    if (!displayName.trim()) { setError("Name cannot be empty."); return; }
    setSaving(true);
    setError("");
    try {
      const photoURL = selectedAvatar || user?.photoURL;
      const isRemoteUrl = photoURL?.startsWith("http");

      // Only update Auth photoURL for proper URLs (not base64 — Auth has length limits)
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        ...(isRemoteUrl ? { photoURL } : {}),
      });

      // Persist everything (including base64 avatar + botIcon) to Firestore
      await setDoc(
        doc(db, "users", user.uid, "profile", "info"),
        { displayName: displayName.trim(), photoURL, botIcon, updatedAt: Date.now() },
        { merge: true }
      );

      dispatch(addUser({ ...user, displayName: displayName.trim(), photoURL, botIcon }));
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
        style={{ background: "#181818", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <h2 className="text-white font-bold text-base">Manage Profile</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Current avatar preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={selectedAvatar || user?.photoURL}
                alt="current avatar"
                className="w-20 h-20 rounded-2xl object-cover"
                style={{ background: "#2a2a2a" }}
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">✎</span>
            </div>

            {/* Upload from device */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white text-xs transition-all duration-150 hover:bg-white/6"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload from device
            </button>
          </div>

          {/* Preset avatar grid */}
          <div>
            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-3">Or pick a preset</p>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AVATARS.map((avatar) => (
                <button
                  key={avatar.url}
                  onClick={() => setSelectedAvatar(avatar.url)}
                  className={`relative rounded-xl overflow-hidden aspect-square transition-all duration-150 ${
                    selectedAvatar === avatar.url
                      ? "ring-2 ring-red-500 scale-105"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                  style={{ background: "#2a2a2a" }}
                  title={avatar.label}
                >
                  <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                  {selectedAvatar === avatar.url && (
                    <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[9px] text-white">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Display name */}
          <div>
            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-2">Display Name</p>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={40}
              placeholder="Your name"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:ring-1 focus:ring-red-500/60 transition"
              style={{ background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          {/* Bot icon picker */}
          <div>
            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-3">Chatbot Icon</p>
            <div className="grid grid-cols-9 gap-1.5">
              {BOT_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setBotIcon(icon)}
                  className={`aspect-square rounded-xl text-lg flex items-center justify-center transition-all duration-150 ${
                    botIcon === icon
                      ? "ring-2 ring-red-500 scale-110"
                      : "hover:scale-110 opacity-60 hover:opacity-100"
                  }`}
                  style={{ background: botIcon === icon ? "rgba(220,38,38,0.15)" : "#2a2a2a" }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Account info */}
          <div
            className="rounded-xl px-4 py-3 space-y-2 text-sm"
            style={{ background: "#212121", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Account Info</p>
            <div className="flex items-center justify-between">
              <span className="text-white/50">Email</span>
              <span className="text-white/80 text-xs truncate max-w-[180px]">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50">User ID</span>
              <span className="text-white/40 text-[10px] font-mono truncate max-w-[120px]">{user?.uid?.slice(0, 12)}…</span>
            </div>
          </div>

          {/* Reset password */}
          <button
            onClick={() => { onClose(); navigate("/reset-password"); }}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition w-full px-4 py-3 rounded-xl hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change / Reset Password
          </button>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
