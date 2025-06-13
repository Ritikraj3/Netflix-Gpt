import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";
import { useEffect, useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const VideoBackground = ({ movieId }) => {
  useMovieTrailer({ movieId });

  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  const iframeRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const message = {
      event: "command",
      func: isMuted ? "mute" : "unMute",
    };

    // Post message to iframe to mute/unmute
    iframe.contentWindow?.postMessage(JSON.stringify(message), "*");
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="relative w-screen ">
      {trailerVideo && (
        <>
          <iframe
            ref={iframeRef}
            className="w-full h-full md:h-screen aspect-video scale-[1.4] md:scale-[1.95] xl:scale-[1.4]"
            src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerVideo.key}&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
            title="Netflix Background Trailer"
            allow="autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />

          {/* Speaker toggle button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-3 md:bottom-30 right-5 md:right-8 xl:right-12 bg-black/60 p-1 md:p-2 rounded-full text-white text-xl z-40 hover:bg-black/80 transition pointer-events-auto"
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </>
      )}
    </div>
  );
};

export default VideoBackground;
