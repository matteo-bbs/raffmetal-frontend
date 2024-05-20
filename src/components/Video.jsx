import React, {useEffect} from "react";
import videotest from "./video.mp4";
import SliderVideo from "../layouts/homepage/SliderVideo.jsx";
import SingleVideo from "../layouts/homepage/SingleVideo.jsx";

export const Video = (props) => {
    useEffect(() => {
        const videoElement = document.getElementById("autoplay-video");
        if (videoElement) {
            videoElement.play().catch(error => {
                // Autoplay may be blocked by the browser, handle the error here
                console.error("Autoplay blocked:", error);
            });

            videoElement.addEventListener("ended", () => {
                videoElement.play();
            });
        }
    }, []);

    console.log(props.content.video)
    return(
        <div>
            <p className={'text-black font-semibold relative z-10 w-2/3 uppercase font-lTekneLDO mb-2'} dangerouslySetInnerHTML={{ __html: `${props.content.bundle} `}} />
            <h1 className={'text-2xl font-bold font-lTekneLDO'} dangerouslySetInnerHTML={{ __html: props.content.title }}></h1>
            <div className="w-auto h-full flex justify-center">
                {/*<video*/}
                {/*    id="autoplay-video"*/}
                {/*    src={props.content.video[0].media_video_file.url }*/}
                {/*    autoPlay*/}
                {/*    loop*/}
                {/*    controls={'true'}*/}
                {/*    // muted*/}
                {/*    width="80%"*/}
                {/*    height="100%"*/}
                {/*/>*/}

                <SingleVideo videoUrl={props.content.video[0].media_video_file.url} />

            </div>
        </div>
    )
}
