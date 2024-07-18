import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import axios from "../components/general/api.jsx";
import { Video } from "../components/Video.jsx";
import { Documenti } from "../components/Documenti.jsx";
import { Notizia } from "../components/Notizia.jsx";
import { InEvidenza } from "../layouts/homepage/InEvidenza.jsx";
import AutoPlayVideoAudio from "../components/AutoPlayVideoAudio.jsx";
import { VideoEvidenza } from "../layouts/homepage/VideoEvidenza.jsx";
import { TimeClock } from "../components/TimeClock.jsx";
import homeButton from "../assets/home.svg";
import arrowright from "../assets/next.png";
import PDFViewer from "../components/PDFViewer.jsx";
import PDFViewerHome from "../components/PDFViewerHome.jsx";
import ModalComponent from "../components/general/ModalComponent.jsx";

import leonardoWhite from "../assets/leonardoWhite.png";
import {BASE_URL} from "../components/general/baseUrl.jsx";
import RSSFeedComponent from "../components/RSSFeedComponent.jsx";

export const FrontPage = ({layout}) => {
  const { id_sezione } = useParams();

  const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
  const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;
  const config = {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      "Content-Type": "application/json",
    },
  };

  const [contenuti, setContenuti] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contentPerPage = 6; // Numero di contenuti da visualizzare per pagina

  const [ultimiContenuti, setUltimiContenuti] = useState(
    JSON.parse(localStorage.getItem("ultimi-contenuti"))
  );

  const [allResults, setAllResults] = useState([]);
  const [novitaContentsArray, setNovitaContentsArray] = useState([]);

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true); // Set isLoading to true at the start of data loading

      // Check if ultimiContenuti is null or empty
      if (!ultimiContenuti || ultimiContenuti.length === 0) {
        setIsLoading(false);
        return;
      }

      // axios get each object in the array
      const fetchPromises = ultimiContenuti.map((item) => {
        return axios.get(`/contenuti/sezione/${item.id_sezione}`, config);
      });

      Promise.all(fetchPromises)
          .then((responses) => {
            const newResults = [];

            responses.forEach((response, index) => {
              if (index < 4) {
                const fetchResult = {
                  novitaContents: null,
                  sezione: ultimiContenuti[index].titolo_sezione,
                  immagine: ultimiContenuti[index].field_sfondo_export.media_image,
                };

                newResults[index] = fetchResult;

                const contenutiSezioneIDs = response.data
                    .map((item) =>
                        item.field_contenuti_sezione_export.map((subitem) => subitem.id)
                    )
                    .flat();

                const secondFetchPromises = contenutiSezioneIDs.map((id) => {
                  return axios.get(`/contenuti/sezione-interna/${id}`, config);
                });

                Promise.all(secondFetchPromises)
                    .then((secondResponses) => {
                      fetchResult.secondFetchResult = secondResponses
                          .map((response) => response.data[0])
                          .flat();

                      const currentDate = new Date();

                      // console.log(fetchResult)
                      fetchResult.novitaContents =
                          fetchResult.secondFetchResult.filter((content) => {
                            const dataInizio = new Date(content.data_inizio);
                            const dataFine = content.data_fine ? new Date(content.data_fine) : null;
                            const dataScadenzaValida = !dataFine || currentDate <= dataFine;

                            return (
                                dataInizio <= currentDate &&
                                dataScadenzaValida &&
                                content.field_rimuovi_da_ultime_news_export !== true
                            );
                          });


                      setAllResults([...newResults.filter(item => item.novitaContents && item.novitaContents.length > 0)]);
                    })
                    .catch((error) => console.log(error));
              }
            });
          })
          .catch((error) => console.log(error));

      setIsLoading(false); // Set isLoading to false at the end of data loading
    };

    loadData(); // Esegui immediatamente una volta per caricare i dati all'inizio

    const intervalId = setInterval(() => {
      loadData(); // Questa funzione verrà eseguita ogni 5 minuti
    }, 120000); // Imposta l'intervallo a 2 minuti

    return () => clearInterval(intervalId); // Pulizia dell'intervallo quando il componente viene smontato
  }, [id_sezione, ultimiContenuti]); // Dipendenze useEffect

  const [count, setCount] = useState(0);
  useEffect(() => {
    let tempCount = 0;

    allResults.forEach(item => {
      if (item.novitaContents && item.novitaContents.length > 0) {
        tempCount++;
      }
    });

    setCount(tempCount);
  }, []); // L'array vuoto come seconda dipendenza indica che useEffect verrà eseguito solo una volta, quando il componente viene montato


  const handleOpenModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalContent(null);
    setModalIsOpen(false);
  };

  function extractTextFromHtml(htmlString) {
    try {
      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(htmlString, "text/html");
      return parsedHtml.querySelector(".field__item").textContent;
    } catch (error) {
      console.error("Errore nell'estrazione del testo HTML:", error);
      return "Errore nell'estrazione del testo HTML";
    }
  }
  function extractPdfImageFromHtml(htmlString) {
    try {
      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(htmlString, "text/html");
      return parsedHtml.querySelector(".pdfpreview-file").attributes[1].value;
    } catch (error) {
      console.error("Errore nell'estrazione del testo HTML:", error);
      return "Errore nell'estrazione del testo HTML";
    }
  }



  const renderComponentBasedOnBundle = (bundle, content) => {
    switch (bundle) {
      case "video":
        return <Video content={content} />;
      case "documenti":
        return <Documenti content={content} />;
      case "in_evidenza_documenti":
        return <Documenti content={content} />;
      case "notizia":
        return <Notizia content={content} />;
      case "in_evidenza_notizie":
        return <Notizia content={content} />;
      default:
        return null;
    }
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1); // Aggiungi 1 per iniziare dalla pagina 1
  };

  const pageCount = Math.ceil(contenuti.length / contentPerPage);

  const indexOfLastContent = currentPage * contentPerPage;
  const indexOfFirstContent = indexOfLastContent - contentPerPage;
  const currentContents = contenuti.slice(
    indexOfFirstContent,
    indexOfLastContent
  );

  function riduciTesto(testo) {
    // Dividi il testo in parole
    const parole = testo.split(" ");

    // Verifica se il testo ha meno parole del numero desiderato
    if (parole.length <= 100) {
      return testo;
    }

    // Prendi solo le prime 'numeroParole' parole e uniscile in un nuovo testo
    const testoRidotto = parole.slice(0, 100).join(" ");

    return testoRidotto + "..."; // Aggiungi i puntini di sospensione alla fine
  }

  // Esempio di utilizzo:
  //     const testoCompleto = "Questo è un esempio di testo che verrà ridotto a un certo numero di parole.";
  //     const testoRidotto = riduciTesto(testoCompleto, 8);
  //     console.log(testoRidotto); // Output: "Questo è un esempio di testo che verrà ridotto..."

  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  useEffect(() => {
    if (
      allResults.length > 0 &&
      allResults[0].novitaContents &&
      allResults[0].novitaContents.length > 0
    ) {
      setSelectedContent(
        allResults[0].novitaContents[allResults[0].novitaContents.length - 1]
      );
      setSelectedIndex(0);
    }
  }, [allResults]);
  function extractImageUrl(htmlString) {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(htmlString, "text/html");
    return parsedHtml.querySelector(".field__item").textContent;
  }

  function extractTextFromHtml(htmlString) {
    try {
      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(htmlString, "text/html");
      return parsedHtml.querySelector(".field__item").textContent;
    } catch (error) {
      console.error("Errore nell'estrazione del testo HTML:", error);
      return "Errore nell'estrazione del testo HTML";
    }
  }

  useEffect(() => {

    const timer = setInterval(() => {
      // Calcola il prossimo indice
      const nextIndex = (selectedIndex + 1) % allResults.length;

      // Trova il prossimo contenuto
      const nextContent =
        allResults[nextIndex].novitaContents[
          allResults[nextIndex].novitaContents.length - 1
        ];

      // Imposta il contenuto selezionato e l'indice
      setSelectedContent({
        ...nextContent,
        immagine: allResults[nextIndex].immagine,
        sezione: allResults[nextIndex].sezione,
      });

      setSelectedIndex(nextIndex);
    }, 30000); // Cambia il contenuto ogni 30 secondi

    // Pulisci il timer quando il componente si smonta o quando le dipendenze cambiano
    return () => clearInterval(timer);
  }, [allResults, selectedIndex]);

  //check and set localstorage for force reload of the page if is not the first time
  const [firstTime, setFirstTime] = useState(
    localStorage.getItem("firstTime") || "false"
  );

  useEffect(() => {
    const reloadTimeout = setTimeout(() => {
      if (firstTime === "false") {
        localStorage.setItem("firstTime", "true");
        setFirstTime("true");
        window.location.reload();
      } else {
        clearTimeout(reloadTimeout);
      }
    }, 5000);
  }, [firstTime]);


  //get the localstorage totemtType and export in two useState nascondi_in_evidenza and nascondi_ultime_news e nascondi video

  const [nascondiInEvidenza, setNascondiInEvidenza] = useState(null);
  const [nascondiUltimeNews, setNascondiUltimeNews] = useState(null);
  const [nascondiVideo, setNascondiVideo] = useState(null);
  const [nascondiLinkUtili, setNascondiLinkUtili] = useState(null);
  useEffect(() => {
    const totemTypeDetail = localStorage.getItem("totemType");
    setNascondiInEvidenza(JSON.parse(totemTypeDetail)[0].nascondi_in_evidenza);
    setNascondiUltimeNews(JSON.parse(totemTypeDetail)[0].nascondi_ultime_news);
    setNascondiVideo(JSON.parse(totemTypeDetail)[0].nascondi_video);
    setNascondiLinkUtili(JSON.parse(totemTypeDetail)[0].nascondi_link_utili);
    localStorage.setItem('nascondi_link', JSON.parse(totemTypeDetail)[0].nascondi_link_utili)
    // console.log('aggiorno prima volta');

    const intervalId = setInterval(() => {
      const totemTypeDetail = localStorage.getItem("totemType");

      if (totemTypeDetail) {
        setNascondiInEvidenza(JSON.parse(totemTypeDetail)[0].nascondi_in_evidenza);
        setNascondiUltimeNews(JSON.parse(totemTypeDetail)[0].nascondi_ultime_news);
        setNascondiVideo(JSON.parse(totemTypeDetail)[0].nascondi_video);
        setNascondiLinkUtili(JSON.parse(totemTypeDetail)[0].nascondi_link_utili);
        localStorage.setItem('nascondi_link', JSON.parse(totemTypeDetail)[0].nascondi_link_utili)

        // console.log('aggiorno');
      }
    }, 120000); // Updating every 60 seconds (1 minute)

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);



  return (
      <div className={"h-full relative"}>
        <div className={`${layout === "Verticale" ? "flex-wrap" : ""}  h-full`}>

          {/*layout 2 colonne contenuto sinistra menu destra*/}
          <div className={`${layout === "Verticale" ? "w-full" : "w-4/12"} bg-white shadow-2xl px-10 flex h-[1220px]`}>
            {nascondiInEvidenza === '0' && !modalIsOpen && (
                <div
                    className={`${layout === "Verticale" ? "w-6/12 mb-1" : "w-full mb-4"} bg-white flex-grow overflow-hidden`}>
                  <InEvidenza/>
                </div>
            )}
          </div>

          <div className={`${layout === "Verticale" ? "" : "w-[3%]"} `}></div>
          <div
              className={`${layout === "Verticale" ? "w-full mt-5 bg-white h-[440px]" : "w-5/12 flex-col space-y-4"} flex shadow-2xl`}>

            {nascondiVideo === '0' && !modalIsOpen && (
                <div
                    className={`${layout === "Verticale" ? "w-full px-5 py-2 pb-10" : "w-full mt-4"} aspect-[16/9]  overflow-hidden  `}>
                  <VideoEvidenza/>
                </div>
            )}
          </div>
          <div
              className={'w-full text-black top-0 text-3xl text-left flex justify-start mt-5 me-4 overflow-hidden'}>
            <RSSFeedComponent/>
          </div>

        </div>


        <ModalComponent
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Contenuto Modale"
            style={{
              overlay: {
                position: "fixed",
                zIndex: 1020,
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(255, 255, 255, 0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              content: {
                inset: "50px",
              },
            }}
        >
          {/*<h2>{modalContent.titolo_sezione}</h2>*/}
          {/*{modalContent && modalContent.title}*/}
          {modalContent && modalContent.bundle === "video" ? (
              <Video content={modalContent}/>
          ) : modalContent && modalContent.bundle === "documenti" ? (
              <Documenti content={modalContent}/>
          ) : modalContent && modalContent.bundle === "notizia" ? (
              <Notizia content={modalContent}/>
          ) : modalContent && modalContent.bundle === "in_evidenza_documenti" ? (
              <Documenti content={modalContent}/>
          ) : modalContent && modalContent.bundle === "in_evidenza_notizie" ? (
              <Notizia content={modalContent}/>
          ) : (
              <p>Contenuto non valido</p>
          )}
          <button onClick={handleCloseModal} className="close-button">
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
        </ModalComponent>


      </div>
  );
};
