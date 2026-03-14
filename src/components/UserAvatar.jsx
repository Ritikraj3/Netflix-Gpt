import Avatar from "boring-avatars";

// photoURL is either:
//   - a JSON string starting with {"_ba": true, ...} → boring-avatar config
//   - a regular URL or base64 data URL → render as <img>
const UserAvatar = ({ src, size = 36, className }) => {
  if (src?.startsWith('{"_ba"')) {
    try {
      const { name, variant, colors } = JSON.parse(src);
      return (
        <span
          className={className}
          style={{ display: "inline-flex", width: size, height: size, borderRadius: "inherit", overflow: "hidden", flexShrink: 0 }}
        >
          <Avatar size={size} name={name} variant={variant} colors={colors} />
        </span>
      );
    } catch (_) {}
  }
  return <img src={src} alt="avatar" className={className} style={{ width: size, height: size }} />;
};

export default UserAvatar;
