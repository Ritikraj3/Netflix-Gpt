import { useSelector } from "react-redux";
import useMovieLogo from "../hooks/useMovieLogo";

const VideoTitle = ({ movieId, title, overview }) => {
  useMovieLogo({ movieId });

  const logoUrl = useSelector((store) => store.movies?.movieLogo);

  return (
    <div className="absolute bottom-[18%] md:bottom-[22%] left-0 w-full md:w-[55%] px-6 md:px-14 text-white z-20">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Movie Logo"
          className="h-12 sm:h-16 md:h-20 lg:h-24 mb-4 object-contain object-left"
        />
      ) : (
        <h1 className="text-lg md:text-xl font-bold mb-4 drop-shadow-lg">{title}</h1>
      )}

      <p className="hidden md:block text-sm md:text-base text-white/90 max-w-lg mb-6 leading-relaxed line-clamp-3 drop-shadow-md">
        {overview}
      </p>

      <div className="flex gap-3">
        <button className="bg-white text-black font-semibold px-5 py-2 md:px-8 md:py-2.5 rounded flex items-center gap-2 hover:bg-white/80 transition duration-200 text-sm md:text-base">
          <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="1 0 24 24">
            <path d="M10 5v14l11-7z" />
          </svg>
          Play
        </button>

        <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-5 py-2 md:px-8 md:py-2.5 rounded flex items-center gap-2 hover:bg-white/30 transition duration-200 text-sm md:text-base">
          <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
          </svg>
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
