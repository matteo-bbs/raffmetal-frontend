import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "./VideoPlayer"; // Assuming you have a VideoPlayer component

const VideoSlider = () => {
  const [videos, setVideos] = useState([]); // Initialize the videos array

  useEffect(() => {
    const fetchVideos = async () => {
      const videoFiles = ["video1.mp4", "video2.mp4", "video3.mp4"];

      const videosWithDurations = await Promise.all(
        videoFiles.map(async (src) => {
          const duration = await getVideoDuration(src);
          return { src, duration };
        })
      );

      setVideos(videosWithDurations);
    };

    fetchVideos();
  }, []);

  const getVideoDuration = async (src) => {
    // Implement video duration detection using FFprobe
  };

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Initialize currentVideoIndex to a valid index
  const videoRef = useRef(null);

  useEffect(() => {
    const handleVideoEnded = () => {
      // Update currentVideoIndex inside the handleVideoEnded function
      setCurrentVideoIndex((currentVideoIndex) => {
        let nextVideoIndex = (currentVideoIndex + 1) % videos.length;

        // Check if the next index is within the valid range
        if (nextVideoIndex >= videos.length) {
          nextVideoIndex = 0; // Reset to the first video
        }

        return nextVideoIndex;
      });
    };

    videoRef.current.addEventListener("ended", handleVideoEnded);

    return () => {
      videoRef.current.removeEventListener("ended", handleVideoEnded);
    };
  }, [currentVideoIndex]);

  return (
    <div className="video-slider">
      <VideoPlayer
        src={videos[currentVideoIndex].src}
        ref={videoRef}
        autoPlay
      />
    </div>
  );
};

export default VideoSlider;
