import axios from "../../components/general/api.jsx";
import React, { useEffect, useState } from "react";
import Slider from "./Slider.jsx";
import SliderVideo from "./SliderVideo.jsx";
import videotest from "../../components/video.mp4";
import VideoSlider from "./VideoSlider.jsx";
export const VideoEvidenza = () => {
    const [contenuti, setContenuti] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
    const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;
    const config = {
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json',
        },
    };

    let totemHomepageId = localStorage.getItem("totemType");
    if(totemHomepageId) {
        totemHomepageId = JSON.parse(totemHomepageId);
        if(totemHomepageId[0]) {
            //console.log(totemHomepageId[0].idcontenuto);
        } else {
            //console.log('totemHomepageId[0] is not defined');
        }
    } else {
        //console.log('totemHomepageId is not defined');
    }


    const fetchData = () => {
        if(totemHomepageId && totemHomepageId[0]) {
            setIsLoading(true); // Set loading to true when starting the request
            // Effettua la prima fetch per ottenere gli ID dei contenuti
            axios.get(`/homepage/video/${totemHomepageId[0].idcontenuto}`, config)
                .then((response) => {
                    //console.log(response.data);
                    setContenuti(response.data);
                })
                .catch((error) => console.log(error))
                .finally(() => {
                    setIsLoading(false); // Set loading to false when the request is completed (whether it's successful or not)
                });
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data immediately when component mounts

        // Set up interval to fetch data every 10 minutes
        const intervalId = setInterval(() => {
            fetchData();
        }, 10 * 60 * 1000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <p className={"text-black font-bold mb-3 mt-3 text-xl"}>Video in Evidenza</p>

            {/*<h1>In Evidenza</h1>*/}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                contenuti && contenuti[0].field_video_export ? (
                    <SliderVideo slides={contenuti[0].field_video_export}/>
                    // <VideoSlider videos={contenuti[0].field_video_export} />
                ) : (
                    <p>No data available</p>
                )
            )}
        </div>
    );
};
