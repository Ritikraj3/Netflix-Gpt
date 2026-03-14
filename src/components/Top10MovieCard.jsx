import MovieCard from "./MovieCard";

const Top10MovieCard = ({ posterPath, index, movie }) => {
  return (
    <div className="relative flex-shrink-0 flex items-end">
      {/* Outlined ranking number */}
      <span
        className="leading-none font-black select-none pointer-events-none shrink-0 text-[100px] md:text-[160px]"
        style={{
          WebkitTextStroke: "2px rgba(255,255,255,0.35)",
          color: "transparent",
          marginRight: "-14px",
          zIndex: 0,
        }}
      >
        {index + 1}
      </span>

      {/* Reuse MovieCard — identical overlay, buttons, and behaviour */}
      <div className="relative z-10">
        <MovieCard posterPath={posterPath} movie={movie} />
      </div>
    </div>
  );
};


export default Top10MovieCard;
