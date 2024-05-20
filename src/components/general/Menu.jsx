import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "./api.jsx";
import arrowLeft from '../../assets/arrowMenu.svg';
import cercaIcon from "../../assets/cerca.png";

const Menu = ({ idTotem }) => {
    const [data, setData] = useState(null);
    const [lastData, setLastData] = useState(null);
    const [conteggioNovita, setConteggioNovita] = useState({});

    const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
    const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;

    const config = {
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json',
        },
    };

    //console.log(idTotem)

const updateNovitaCount = () => {
    axios.get(`/menu-novita/${idTotem[0].idcontenuto}`, config)
        .then((response) => {
            const novitaContent = response.data.map(item => item);
            console.log(novitaContent)

            const currentDate = new Date();
            //console.log(novitaContent)
            const novitaFiltrate = novitaContent.filter(content => (
                content && content.field_novita_fino_al_export &&
                (!content.data_fine || new Date(content.data_fine) >= currentDate) &&
                new Date(content.field_novita_fino_al_export) >= currentDate
            ));


            const conteggioSezioni = novitaFiltrate.reduce((conteggio, content) => {
                if (content && content.titolo_sezione) {
                    conteggio[content.titolo_sezione] = (conteggio[content.titolo_sezione] || 0) + 1;
                }
                return conteggio;
            }, {});

            setConteggioNovita(conteggioSezioni);
        })
        .catch((error) => console.log(error));
};
    const updateNovitaCount2 = () => {

        axios.get(`/menu/${idTotem[0].idcontenuto}`, config)
            .then((response) => {
// Assumiamo che response.data sia l'array di oggetti che vuoi filtrare
                setData(response.data.filter(item => item.field_nascondi_sezione_export === "0" || item.field_nascondi_sezione_export === null ));
                setLastData(response.data.slice(0, 4)); // Save the last menu items

            })
            .catch((error) => console.log(error));
    };
    function fetchAndUpdateMenu() {

        if (data !== null) {
            localStorage.setItem("menu", JSON.stringify(data));
            console.log(data)
        }
    }
    if (data !== null) {
        localStorage.setItem("menu", JSON.stringify(data));
        console.log(data)
    }
    useEffect(() => {
        updateNovitaCount();
        updateNovitaCount2();
        fetchAndUpdateMenu()

        const intervalId = setInterval(updateNovitaCount, 120000);
        const intervalId2 = setInterval(updateNovitaCount2, 120000);
        const intervalId3 = setInterval(fetchAndUpdateMenu, 120000);

        return () => {
            clearInterval(intervalId);
            clearInterval(intervalId2);
            clearInterval(intervalId3);
        };
    }, [idTotem]);




    localStorage.setItem("ultimi-contenuti", JSON.stringify(lastData));

    return (
        <div className={'w-full bg-white p-5 shadow-2xl'}>
            <p className={"text-black font-bold mb-3 text-xl"}>Menu</p>

            <ul className={`${JSON.parse(localStorage.getItem("totemType"))[0].layout === "Verticale" ? "flex flex-wrap" : ""} ${JSON.parse(localStorage.getItem("totemType"))[0].layout === "Orizzontale" ? "space-y-4" : ""} w-full text-center`}>
                {data &&
                    data.map((item, index) => (
                        <li
                            className={`
                            flex 
                            flex-wrap 
                            h-auto 
                            pb-1 
                            ${JSON.parse(localStorage.getItem("totemType"))[0].layout === "Verticale" ? "w-full mb-2" : ""} 
                            ${JSON.parse(localStorage.getItem("totemType"))[0].layout === "Orizzontale" ? "w-full" : ""}`}
                            key={item.id_sezione}>
                            <Link
                                to={`/snodopage/${item.id_sezione}`}
                                className={`w-full flex flex-wrap p-0 bg-rPrimary border-2 border-white hover-bg-white text-white py-4  relative  justify-between items-center transition-transform duration-300 relative`}
                            >
                                <span
                                    className="h-auto font-roboto_slab text-lg hover-text-white text-white font-semibold leading-5 px-3 uppercase relative pe-7 text-left w-2/3">
                                  {item.titolo_sezione}
                                    {conteggioNovita[item.titolo_sezione] && (
                                        <div>
                                      <span className="ml-0 text-sm font-normal text-white lowercase">
                                        {conteggioNovita[item.titolo_sezione]} novità
                                      </span>
                                        </div>
                                    )}
                                </span>
                                {conteggioNovita[item.titolo_sezione] && (
                                    <span
                                        className="ml-2 bg-lRed border-lRed font-bold text-white p-3 rounded-full w-3 h-3 text-xl absolute -top-3 -right-3  border-2 ">
                                        {/*<p className={'absolute -top-0.5 left-1.5 text-lg'}>{conteggioNovita[item.titolo_sezione]}</p>*/}

                                        {/*{conteggioNovita[item.titolo_sezione]}*/}
                  </span>
                                )}
                                <div className={'w-1/3'}>
                                    <img className={'right-0 top-1 inline-block relative right-0'} src={arrowLeft}
                                         alt="Arrow Left"/>
                                </div>
                            </Link>
                        </li>
                    ))}
                {/*{JSON.parse(localStorage.getItem("totemType"))[0].layout === "Verticale" && (*/}
                {/*    <li*/}
                {/*        className={`*/}
                {/*            flex */}
                {/*            flex-wrap */}
                {/*            h-auto */}
                {/*            pb-1 */}
                {/*            ${JSON.parse(localStorage.getItem("totemType"))[0].layout === "Verticale" ? "w-full min-h-[110px] mb-2" : ""} */}
                {/*            ${JSON.parse(localStorage.getItem("totemType"))[0].layout === "Orizzontale" ? "w-full" : ""}`}*/}
                {/*    >*/}


                {/*    </li>*/}
                {/*)}*/}

            </ul>
        </div>
    );
};

export default Menu;
