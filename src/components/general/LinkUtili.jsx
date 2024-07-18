import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import axios from "./api.jsx";
import arrowLeft from "../../assets/arrowMenu.svg";
import ModalComponentIframe from "./ModalComponentIframe.jsx";
import cercaIcon from "../../assets/cerca.png";
import {TimeClock} from "../TimeClock.jsx";
const LinkUtili = ({ idTotem }) => {
  const [data, setData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState(null);

  const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
  const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;

  const config = {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    axios
      .get(`/link-utili/${idTotem[0].idcontenuto}`, config)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log(error));
  }, [idTotem]);

  //console.log(data)
  const openModal = (url) => {
    setModalUrl(url);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [isVisible, setIsVisible] = useState(null)

  useEffect(() => {
    setIsVisible(localStorage.getItem("nascondi_link"));

    const intervalId = setInterval(() => {

    setIsVisible(localStorage.getItem("nascondi_link"));
    }, 120000); // Updating every 60 seconds (1 minute)

  }, []);


  return (
    <div className={"w-full bg-white px-5 py-5 mt-5 h-full relative"}>
      {isVisible === '0' && (
          <div className={"w-full"}>
        <p className={"text-black font-bold mb-3 text-xl"}>
          Numeri di emergenza
        </p>

      <ul className="space-y-4 w-full text-center bg-rPrimary p-5 min-h-[380px]">
        {data &&
          data.length > 0 &&
          data[0].field_numeri_di_emergenza_export.map((item, index) => {
            return (
              <li
                key={index}
                className={
                  "h-auto pb-2 hover-bg-white text-white w-full h-full relative flex flex-wrap justify-center items-center transition-transform duration-300 relative text-[22px]"
                }
              >
                <span className="h-auto font-roboto_slab text-xl hover-text-black text-white font-medium leading-5 px-3 uppercase relative pe-7 text-[22px]">
                  {item}
                </span>
              </li>
            );
          })}
      </ul>
            {/*<Link*/}
            {/*    className={`h-[70px] mt-5 w-full flex flex-wrap p-5 border-2 border-rPrimary hover-bg-white text-black bg-rSecondary h-full  justify-between text-[18px] items-center transition-transform duration-300`}*/}
            {/*    to={'/ricerca'}>RICERCA <img className={'flex ms-2 w-[18px] h-[18px] mt-1.5'}*/}
            {/*                                 src={cercaIcon}/>*/}
            {/*</Link>*/}
            <div className={'text-center pt-5'}>
              <TimeClock/>

            </div>

          </div>

)}

      <ModalComponentIframe
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        modalUrl={modalUrl}
      >
        <button onClick={closeModal} className="close-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="close-icon"
          >
            {/*<circle cx="10" cy="10" r="9" stroke="red" strokeWidth="2" />*/}
            <line
              x1="5"
              y1="5"
              x2="15"
              y2="15"
              stroke="white"
              strokeWidth="2"
            />
            <line
              x1="5"
              y1="5"
              x2="15"
              y2="15"
              stroke="white"
              strokeWidth="2"
            />
            <line
              x1="15"
              y1="5"
              x2="5"
              y2="15"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </button>
      </ModalComponentIframe>
    </div>
  );
};

export default LinkUtili;
