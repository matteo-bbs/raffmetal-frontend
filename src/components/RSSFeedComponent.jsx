import Marquee from "react-fast-marquee";
import React, {useEffect, useState} from "react";
import axios from "./general/api.jsx";
import {BASE_URL} from "./general/baseUrl.jsx";

const RSSFeedComponent = () => {
    const [isLoading, setIsLoading] = useState(true);

    const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
    const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;
    const config = {
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            "Content-Type": "application/json",
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
    const [rssText, setRssText] = useState()

    useEffect(() => {
        if(totemHomepageId && totemHomepageId[0]) {
            setIsLoading(true); // Set loading to true when starting the request
        axios.get(`/homepage/rss/${totemHomepageId[0].idcontenuto}`, config)
            .then((response) => {
                //console.log(response.data);
                setRssText(response.data);
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setIsLoading(false); // Set loading to false when the request is completed (whether it's successful or not)
            });
        } else {
            //console.log('Cannot make request, totemHomepageId[0] is not defined');
        }
    }, []);
    return (
        <Marquee direction={"left"} speed={200} className={'overflow-hidden'} >
            {rssText && <div className={'ps-10'} dangerouslySetInnerHTML={{__html: rssText[0].rss}}/>}
        </Marquee>
    );
};

export default RSSFeedComponent;