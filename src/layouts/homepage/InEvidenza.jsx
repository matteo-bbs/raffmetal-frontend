import axios from "../../components/general/api.jsx";
import React, { useEffect, useState } from "react";
import SliderComponent from "./Slider.jsx";

export const InEvidenza = () => {
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
    if (totemHomepageId) {
        totemHomepageId = JSON.parse(totemHomepageId);
    }

    const fetchData = () => {
        if (totemHomepageId && totemHomepageId[0]) {
            setIsLoading(true);
            axios.get(`/homepage/in-evidenza/${totemHomepageId[0].idcontenuto}`, config)
                .then((response) => {
                    setContenuti(response.data);
                    console.log(response.data)
                })
                .catch((error) => console.log(error))
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data immediately when component mounts

        // Set up interval to fetch data every 5 minutes
        const intervalId = setInterval(() => {
            fetchData();
        }, 2 * 60 * 1000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={'h-full pb-20'}>
            <p className={"text-black font-bold mb-3 mt-3 text-xl"}>Le Ultime News</p>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                contenuti && contenuti[0]?.field_in_evidenza_export ? (
                    <SliderComponent slides={contenuti[0].field_in_evidenza_export} />
                ) : (
                    <p>No data available</p>
                )
            )}
        </div>
    );
};
