const UserAvatar = ({ src, size = 36, className }) => {
  return <img src={src} alt="avatar" className={className} style={{ width: size, height: size }} />;
};

export default UserAvatar;
