import React, { useRef, useEffect } from "react";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import mute from "../../assets/mute.svg";
import unmute from "../../assets/unmute.svg";
import play from "../../assets/play.svg";
import pause from "../../assets/pause.svg";

const SingleVideo = ({ videoUrl }) => {
    console.log(videoUrl);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(true);
    const [isMuted, setIsMuted] = React.useState(false);
    const [volume, setVolume] = React.useState(1);

    useEffect(() => {
        const player = videojs(videoRef.current, {});
        playerRef.current = player;

        player.on("error", () => {
            console.log("Error during video playback");
        });

        player.volume(volume);
        player.muted(isMuted);

        return () => {
            player.dispose();
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.src(videoUrl);
            playerRef.current.play();
        }
    }, [videoUrl]);

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
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    return (
        <div
            className="video-container"
            style={{
                width: "80%", // Larghezza condizionale
                height:"100%", // Altezza condizionale
            }}
        >
            <div className={'absolute -bottom-10 left-0 w-full'}>
            <button onClick={handlePlayPause}
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
            >
                {isPlaying ? <img src={pause} alt="pause" /> : <img src={play} alt="play" />}
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
                onClick={handleMuteUnmute}>
                {isMuted ? <img src={mute} alt="Mute" /> : <img src={unmute} alt="Unmute" />}
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
                className={'bg-lRed p-2 rounded-2xl text-white'}
                style={{
                    position: "absolute",
                    left: "420px",
                    bottom: "65px",
                    zIndex: "1000",
                }}
            >{Math.round(volume * 100)}%</p>
            </div>

            <video ref={videoRef} src={videoUrl} autoPlay={true} className="w-full h-full" muted={isMuted} />
        </div>
    );
};

export default SingleVideo;
