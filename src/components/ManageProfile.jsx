import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { BOT_ICON_MAP, DEFAULT_BOT_ICON } from "../utils/chatConfig";

// ─── Avatar presets (DiceBear modern styles) ──────────────────────────────────
const BASE = "https://api.dicebear.com/9.x";
const AVATAR_PRESETS = [
  // notionists — elegant illustrated characters
  { key: "n1",  url: `${BASE}/notionists/svg?seed=Alice&backgroundColor=b6e3f4` },
  { key: "n2",  url: `${BASE}/notionists/svg?seed=Felix&backgroundColor=ffd5dc` },
  { key: "n3",  url: `${BASE}/notionists/svg?seed=Maya&backgroundColor=c0aede` },
  { key: "n4",  url: `${BASE}/notionists/svg?seed=Zara&backgroundColor=d1f4cc` },
  // adventurer — cartoon adventure characters
  { key: "a1",  url: `${BASE}/adventurer/svg?seed=Lily&backgroundColor=b6e3f4` },
  { key: "a2",  url: `${BASE}/adventurer/svg?seed=Jake&backgroundColor=ffd5dc` },
  { key: "a3",  url: `${BASE}/adventurer/svg?seed=Leo&backgroundColor=ffeaad` },
  { key: "a4",  url: `${BASE}/adventurer/svg?seed=Sam&backgroundColor=c0aede` },
  // lorelei — soft illustrated portraits
  { key: "l1",  url: `${BASE}/lorelei/svg?seed=Anna&backgroundColor=ffd5dc` },
  { key: "l2",  url: `${BASE}/lorelei/svg?seed=Chris&backgroundColor=b6e3f4` },
  { key: "l3",  url: `${BASE}/lorelei/svg?seed=Ryan&backgroundColor=d1f4cc` },
  { key: "l4",  url: `${BASE}/lorelei/svg?seed=Mia&backgroundColor=ffeaad` },
  // big-smile — expressive fun characters
  { key: "b1",  url: `${BASE}/big-smile/svg?seed=Ethan&backgroundColor=b6e3f4` },
  { key: "b2",  url: `${BASE}/big-smile/svg?seed=Nora&backgroundColor=ffcfad` },
  { key: "b3",  url: `${BASE}/big-smile/svg?seed=Owen&backgroundColor=c0aede` },
  { key: "b4",  url: `${BASE}/big-smile/svg?seed=Ella&backgroundColor=d1f4cc` },
  // croodles — cute playful doodles
  { key: "c1",  url: `${BASE}/croodles/svg?seed=Pixel&backgroundColor=ffd5dc` },
  { key: "c2",  url: `${BASE}/croodles/svg?seed=Nova&backgroundColor=b6e3f4` },
];

// Resize an uploaded image to 150×150 JPEG data URL
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
        ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, SIZE, SIZE);
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
  const [botIconKey, setBotIconKey] = useState(user?.botIcon || DEFAULT_BOT_ICON);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedAvatar(await resizeImage(file));
  };

  const handleSave = async () => {
    if (!displayName.trim()) { setError("Name cannot be empty."); return; }
    setSaving(true);
    setError("");
    try {
      const photoURL = selectedAvatar || user?.photoURL;
      const isRemoteUrl = photoURL?.startsWith("http");

      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        ...(isRemoteUrl ? { photoURL } : {}),
      });

      await setDoc(
        doc(db, "users", user.uid, "profile", "info"),
        { displayName: displayName.trim(), photoURL, botIcon: botIconKey, updatedAt: Date.now() },
        { merge: true }
      );

      dispatch(addUser({ ...user, displayName: displayName.trim(), photoURL, botIcon: botIconKey }));
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
              <UserAvatar
                src={selectedAvatar || user?.photoURL}
                size={80}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">✎</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white text-xs transition-all hover:bg-white/6"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload from device
            </button>
          </div>

          {/* Boring-avatars preset grid */}
          <div>
            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-3">Or pick a preset</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedAvatar === preset.url;
                return (
                  <button
                    key={preset.key}
                    onClick={() => setSelectedAvatar(preset.url)}
                    className={`rounded-xl overflow-hidden aspect-square transition-all duration-150 ${
                      isSelected ? "ring-2 ring-red-500 scale-110" : "opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <img src={preset.url} alt="avatar" className="w-full h-full object-cover" />
                  </button>
                );
              })}
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

          {/* NetBot icon picker */}
          <div>
            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-3">NetBot Icon</p>
            <div className="grid grid-cols-6 gap-2">
              {Object.entries(BOT_ICON_MAP).map(([key, IconComponent]) => {
                const isSelected = botIconKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setBotIconKey(key)}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-150 ${
                      isSelected ? "ring-2 ring-red-500 scale-110" : "opacity-50 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ background: isSelected ? "rgba(220,38,38,0.15)" : "#2a2a2a" }}
                    title={key}
                  >
                    <IconComponent
                      size={22}
                      color={isSelected ? "#ef4444" : "rgba(255,255,255,0.7)"}
                    />
                  </button>
                );
              })}
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
