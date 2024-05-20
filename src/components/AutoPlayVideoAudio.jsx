import React, { useRef, useState } from "react";
import videotest from './video.mp4';
import VideoJS from './VideoJS.jsx'
import videojs from "video.js";

const AutoPlayVideoAudio = (props) => {
    const playerRef = React.useRef(null);
    const [showModal, setShowModal] = useState(false);

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: props.video,
            type: 'video/mp4'
        }]
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    const toggleFullscreen = () => {
        const videoElement = playerRef.current.el();

        if (!document.fullscreenElement) {
            if (videoElement.requestFullscreen) {
                videoElement.requestFullscreen();
            } else if (videoElement.mozRequestFullScreen) { /* Firefox */
                videoElement.mozRequestFullScreen();
            } else if (videoElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                videoElement.webkitRequestFullscreen();
            } else if (videoElement.msRequestFullscreen) { /* IE/Edge */
                videoElement.msRequestFullscreen();
            }
            setShowModal(true);
            videoElement.muted = false; // turn on audio
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
            setShowModal(false);
            videoElement.muted = true; // turn off audio
        }
    };

    return (
        <div className="w-full h-full relative justify-center items-center">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} onClick={toggleFullscreen} />

            {showModal && (
                <div className="modal">
                    {/* Modal content */}
                </div>
            )}
        </div>
    );
};

export default AutoPlayVideoAudio;