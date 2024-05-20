import React, { useState, useRef, useEffect } from "react";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import expand from "../../assets/expand.svg";
import reduce from "../../assets/reduce.svg";
import mute from "../../assets/mute.svg";
import unmute from "../../assets/unmute.svg";
import play from "../../assets/play.svg";
import pause from "../../assets/pause.svg";

const SliderVideo = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const videoRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0); // State for volume
    const [lastVolume, setLastVolume] = useState(1); // State to remember the last non-zero volume
    // const playerRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        const player = videojs(videoRef.current, {});
        playerRef.current = player;

        player.on("ended", () => {
            handleNext();
        });

        player.on("error", () => {
            console.log("Error during video playback");
        });

        // Set initial volume and muted state
        player.volume(volume);
        player.muted(isMuted);

        return () => {
            player.dispose();
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.src(slides[currentSlide].media_video_file.url);
            playerRef.current.play();
        }
    }, [currentSlide, slides]);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.volume(volume);
        }
    }, [volume]);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.muted(isMuted);
        }
    }, [isMuted]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const handlePlayPause = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pause();
            } else {
                playerRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleMuteUnmute = () => {
        if (isMuted || volume === 0) {
            setVolume(lastVolume); // Restore the volume to the last known non-zero level
            setIsMuted(false);
        } else {
            setLastVolume(volume); // Remember the current volume before muting
            setVolume(0);
            setIsMuted(true);
        }
    };

    const toggleExpand = () => {
        const newIsExpanded = !isExpanded;
        setIsExpanded(newIsExpanded);

        if (newIsExpanded) {
            // Entering full-screen mode
            setIsMuted(false);
            setVolume(1);
        } else {
            // Exiting full-screen mode
            setLastVolume(volume > 0 ? volume : 1); // Update lastVolume if the current volume is non-zero
            setIsMuted(true);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

  return (
    <div
      className="video-container w-full"
      style={{
        position: isExpanded ? "fixed" : "relative",
        top: isExpanded ? "0" : "auto",
        left: isExpanded ? "0" : "auto",
        zIndex: isExpanded ? 1000 : "auto",
        width: isExpanded ? "100vw" : "100%", // Larghezza condizionale
        height: isExpanded ? "100vh" : "100%", // Altezza condizionale
      }}
    >
      {isExpanded && (
        <>
          <button
            style={{
              position: "absolute",
              left: "30px",
              bottom: 16,
              zIndex: 1000,
              color: "white",
              transform: "translateY(-50%)",
              backgroundColor: "#e40428",
              borderRadius: "50%",
              padding: 20,
            }}
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <img src={pause} alt="pause" />
            ) : (
              <img src={play} alt="play" />
            )}
          </button>
            <button
                style={{
                    position: "absolute",
                    left: "130px",
                    bottom: 16,
                    zIndex: 1000,
                    color: "white",
                    transform: "translateY(-50%)",
                    backgroundColor: "#e40428",
                    borderRadius: "50%",
                    padding: 20,
                }}
                onClick={handleMuteUnmute}
            >
                {isMuted || volume === 0 ? (
                    <img src={mute} alt="Mute" />
                ) : (
                    <img src={unmute} alt="Unmute" />
                )}



            </button>

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="form-range appearance-none w-150 h-2 p-0 bg-red-500 focus:outline-none focus:ring-0 focus:shadow-none"
                style={{
                    position: "absolute",
                    left: "220px",
                    bottom: "80px",
                    zIndex: "1000",
                }}
            />
            <p
                className={'bg-rPrimary p-2 rounded-2xl text-white'}
                style={{
                    position: "absolute",
                    left: "420px",
                    bottom: "65px",
                    zIndex: "1000",
                }}
            >{Math.round(volume * 100)}%</p>

        </>
      )}
      {/*     {currentSlide > 0 && ( */}
      {!isExpanded ? (
        <button
          onClick={toggleExpand}
          className="hidden"
          style={{
            position: "absolute",
            right: "10px",
            top: 32,
            zIndex: 1000,
            color: "white",
            transform: "translateY(-50%)",
            backgroundColor: "#e40428",
            borderRadius: "50%",
            padding: 6,
          }}
        >
          <img src={expand} alt="expand" />
        </button>
      ) : (
        <button
          onClick={toggleExpand}
          style={{
            position: "absolute",
            right: "10px",
            top: "5%",
            zIndex: 1000,
            color: "white",
            transform: "translateY(-50%)",
            backgroundColor: "#e40428",
            borderRadius: "50%",
            padding: 12,
          }}
        >
          <img src={reduce} alt="reduce" />
        </button>
      )}
        {slides.length > 1 && (
      <button
        onClick={handlePrev}
        className={'hidden'}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          zIndex: 1000,
          color: "white",
          transform: "translateY(-50%)",
          backgroundColor: "#e40428",
          borderRadius: "50%",
          padding: 6,
          opacity: !!isExpanded ? 0 : 1,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
        )}



            <video
                className="w-full h-full "
                ref={videoRef}
                src={slides[currentSlide].media_video_file.url}
                autoPlay={true}
                loop={slides.length === 1} // Loop solo se c'è un solo video
                /*     controls */
                muted={!isExpanded}
            />
        {/*)}*/}
        {/*{slides.length < 1 && (*/}

        {/*    <video*/}
        {/*        className="w-full h-full "*/}
        {/*        ref={videoRef}*/}
        {/*        src={slides[currentSlide].media_video_file.url}*/}
        {/*        autoPlay={true}*/}

        {/*        muted={!isExpanded}*/}
        {/*    />*/}
        {/*)}*/}
      {/*    {currentSlide < slides.length - 1 && ( */}
      {/*  {slides.length > 1 && (*/}
      {/*<button*/}
      {/*  onClick={handleNext}*/}
      {/*  style={{*/}
      {/*    position: "absolute",*/}
      {/*    right: "10px",*/}
      {/*    top: "50%",*/}
      {/*    zIndex: 1000,*/}
      {/*    color: "white",*/}
      {/*    transform: "translateY(-50%)",*/}
      {/*    backgroundColor: "#e40428",*/}
      {/*    padding: 6,*/}
      {/*    borderRadius: "50%",*/}
      {/*    opacity: !!isExpanded ? 0 : 1,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <svg*/}
      {/*    width="24"*/}
      {/*    height="24"*/}
      {/*    viewBox="0 0 24 24"*/}
      {/*    fill="none"*/}
      {/*    stroke="white"*/}
      {/*    strokeWidth="2"*/}
      {/*  >*/}
      {/*    <path d="M9 6l6 6-6 6" />*/}
      {/*  </svg>*/}
      {/*</button>*/}
      {/*  )}*/}

      {/*     )} */}
    </div>
  );
};

export default SliderVideo;
