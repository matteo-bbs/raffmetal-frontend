import React, { useRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ src, ref, autoPlay }) => {
    const playerRef = useRef(null);

    return (
        <ReactPlayer
            ref={playerRef}
            url={src}
            autoPlay={autoPlay}
            controls={true}
        />
    );
};

export default VideoPlayer;