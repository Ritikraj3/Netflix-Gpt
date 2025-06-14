// components/VideoTitle.js
import { useSelector } from "react-redux";
import useMovieLogo from "../hooks/useMovieLogo"; // adjust path if needed

const VideoTitle = ({ movieId, title, overview }) => {
  useMovieLogo({ movieId });

  const logoUrl = useSelector((store) => store.movies?.movieLogo);

  return (
    <div className="absolute top-0 left-0 w-full h-full aspect-video pt-[34%] md:pt-[38%] xl:pt-[20%] px-6 md:px-12 text-white z-20 ">
      {logoUrl ? (
        <img
          src={logoUrl} 
          alt="Movie Logo"
          className="h-10 sm:h-12 md:h-16 lg:h-18 mb-4 object-contain"
        />
      ) : (
        <h1 className="text-2xl md:text-4xl font-bold mb-4">{title}</h1>
      )}
      <p className="hidden xl:inline-block text-md max-w-2xl mb-6">
        {overview}
      </p>

      <div className=" flex gap-4">
        <button className=" bg-white text-black font-semibold px-3 py-1.5 md:px-6 md:py-2 rounded flex items-center space-x-2 justify-center hover:opacity-70 transition duration-200 text-sm md:text-base">
          <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="1 0 24 24">
            <path d="M10 5v14l11-7z" />
          </svg>
          <span>Play</span>
        </button>

        <button className="bg-gray-500 bg-opacity-50 text-white font-semibold px-3 py-1.5 md:px-6 md:py-2 rounded flex items-center space-x-2 hover:bg-gray-600 transition duration-200 text-sm md:text-base">
          <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
          </svg>
          <span>More Info</span>
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
