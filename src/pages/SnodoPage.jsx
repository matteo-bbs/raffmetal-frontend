import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "../components/general/api.jsx";
import { Video } from "../components/Video.jsx";
import { Documenti } from "../components/Documenti.jsx";
import { SyncLoader } from "react-spinners";
import ReactPaginate from 'react-paginate';
import arrowMenu from "../assets/arrowMenu.svg";
import {Notizia} from "../components/Notizia.jsx";
import React, {useEffect, useState, useRef} from "react";
import * as PropTypes from "prop-types";
import {TimeClock} from "../components/TimeClock.jsx";
import Modal from 'react-modal';
import ModalComponent from "../components/general/ModalComponent.jsx";
import arrowLeft from "../assets/arrowMenu.svg";

Modal.setAppElement('#root'); // replace '#root' with the id of your app's root element

import homeButton from "../assets/home.svg";
import {Mercatino} from "../components/Mercatino.jsx";
import arrowRed from "../assets/arrowMenu.svg";

export const SnodoPage = () => {
    const { id_sezione } = useParams();

    const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
    const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;
    const config = {
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json',
        },
    };

    const [contenuti, setContenuti] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const contentPerPage = 6; // Numero di contenuti da visualizzare per pagina

    const menuItem = JSON.parse(localStorage.getItem('menu'));

    const matchedMenuItem = menuItem.find(item => item.id_sezione === id_sezione);
    if (menuItem) {

        if (matchedMenuItem) {
            localStorage.setItem('field_sfondo_export', JSON.stringify(matchedMenuItem.field_sfondo_export));
        }
    }

    useEffect(() => {
        const fetchAndUpdateContents = () => {
            axios.get(`/contenuti/sezione/${id_sezione}`, config)
                .then((response) => {
                    const contenutiSezioneIDs = response.data.map(item => item.field_contenuti_sezione_export.map(subitem => subitem.id)).flat();

                    const fetchPromises = contenutiSezioneIDs.map(id => {
                        return axios.get(`/contenuti/sezione-interna/${id}`, config);
                    });

                    Promise.all(fetchPromises)
                        .then(responses => {
                            const combinedContents = responses.map(response => response.data[0]).flat();
                            const currentDate = new Date();

                            const novitaContents = combinedContents.filter(content => {
                                const dataInizio = new Date(content.data_inizio);
                                const dataFine = content.data_fine ? new Date(content.data_fine) : null;

                                // Se dataFine è null o non è definita, considera il contenuto come non scaduto
                                if (!dataFine || isNaN(dataFine)) {
                                    return dataInizio <= currentDate;
                                } else {
                                    return dataInizio <= currentDate && currentDate <= dataFine;
                                }
                            });
                            novitaContents.reverse();

                            setContenuti(novitaContents);
                            setIsLoading(false);
                        });

                });
        };

        fetchAndUpdateContents();
        const intervalId = setInterval(fetchAndUpdateContents, 120000);

        return () => clearInterval(intervalId);
    }, [id_sezione]);
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
            return "Errore nell'estrazione del testo HTML";
        }
    }

    const renderComponentBasedOnBundle = (bundle, content) => {
        switch (bundle) {
            case 'video':
                return <Video content={content} />;
            case 'documenti':
                return <Documenti content={content} />;
            case 'notizia':
                return <Notizia content={content} />;
            case 'mercatino':
                return <Mercatino content={content} />;
            default:
                return null;
        }
    };

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1);
    };

    const pageCount = Math.ceil(contenuti.length / contentPerPage);

    const indexOfLastContent = currentPage * contentPerPage;
    const indexOfFirstContent = indexOfLastContent - contentPerPage;
    const currentContents = contenuti.slice(indexOfFirstContent, indexOfLastContent);

    function riduciTesto(testo) {
        const parole = testo.split(' ');

        if (parole.length <= 100) {
            return testo;
        }

        const testoRidotto = parole.slice(0, 100).join(' ');

        return testoRidotto + '...';
    }
// Function to check if the content is a novelty

    const navigate = useNavigate();
    const timerRef = useRef(null);

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            navigate('/');
        }, 2 * 60 * 1000); // 2 minuti
    };

    useEffect(() => {
        window.addEventListener('click', resetTimer);
        resetTimer(); // avvia il timer al caricamento della pagina

        return () => {
            window.removeEventListener('click', resetTimer);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);
    return (
        <div>
            <div className="flex h-[90vh]">
                <div className=" w-full  ">

                    <div className="h-[1620px] flex flex-wrap gap-4 p-5 pt-20 relative pb-32 ">
                        {/*<Link className={'z-10 absolute bottom-5 left-5 py-5 px-10 uppercase bg-rPrimary text-white text-xl font-bold'} to={`/archivio/${id_sezione}`}>Archivio {matchedMenuItem.titolo_sezione} <img className={'right-0 top-1 inline-block'} src={arrowLeft} alt="Arrow Left" /></Link>*/}
                        <Link className={'z-10 absolute bottom-5 left-5 py-5 px-10 uppercase bg-rPrimary text-white text-xl font-normal w-[200px] flex justify-between'} to={`/archivio/${id_sezione}`}>Archivio <img className={'right-0 top-1 inline-block'} src={arrowLeft} alt="Arrow Left" /></Link>

                        <img className={'absolute left-0 top-0 w-full h-full object-cover backdrop:bg-black bg-black bg-opacity-50 '} src={matchedMenuItem.field_sfondo_export.media_image}/>
                        <h1 className={'w-full absolute top-3 left-0 p-5 text-lGrayDark font-bold text-3xl text-white font-lTekneLDO'}>{matchedMenuItem.titolo_sezione}</h1>
                        {isLoading ? (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <SyncLoader color="#fff" loading={true} size={20} />
                            </div>
                        ) : currentContents.length > 0 ? (
                            currentContents.map((contenuto, index) => {
                                const content = contenuto;
                                if (content) {
                                    // console.log(content.data_novita)
                                    // Check if the content is a novelty

                                    console.log(content.data_novita)
                                    const contentDate = new Date(content.data_novita);
                                    const currentDate = new Date();
                                    currentDate.setHours(0,0,0,0); // set the current date to the start of the day
                                    contentDate.setHours(0,0,0,0); // set the content date to the start of the day

                                    const isNovelty = contentDate.getTime() >= currentDate.getTime();
                                    console.log(isNovelty)


                                    return (
                                        <a
                                            onClick={() => handleOpenModal(contenuto.field_aggiungi_i_contenuti_export)}
                                            key={index}
                                            className="relative p-8 shadow-lg w-[48%] h-1/4 cursor-pointer bg-rPrimary opacity-80 mt-5"
                                            style={{ position: 'relative' }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.querySelector('img.arrownext').style.left = '10px';
                                                e.currentTarget.querySelector('img.arrownext').style.opacity = '0.8';
                                                e.currentTarget.querySelector('div.backcard').style.opacity = '0.2';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.querySelector('img.arrownext').style.left = '0';
                                                e.currentTarget.querySelector('img.arrownext').style.opacity = '1';
                                                e.currentTarget.querySelector('div.backcard').style.opacity = '0.5';
                                            }}
                                        >
                                            <div className="absolute left-0 top-0 w-full  bg-rPrimary opacity-80 z-10 backcard"
                                                 style={{ transition: 'opacity 0.3s' }}
                                            ></div>
                                            {isNovelty &&    <span className="z-10 ml-2 bg-rYellow border-rYellow font-bold text-white p-2 rounded-full w-4 h-4 text-xl absolute -top-2 -right-2  border-2">
                    {/*{conteggioNovita[item.titolo_sezione]}*/}
                  </span>}
                                            <p className={'text-white mt-2 mb-2 text-sm font-semibold relative z-10 w-2/3 uppercase font-lTekneLDO'} >{matchedMenuItem.titolo_sezione}</p>
                                            {/*<p className={'text-white mt-2 mb-2 text-sm font-semibold relative z-10 w-2/3 uppercase font-lPublicSans'} dangerouslySetInnerHTML={{ __html: `${contenuto.field_aggiungi_i_contenuti_export.tipo_della_notizia} | ${new Date(contenuto.data_inizio).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}`}} ></p>*/}
                                            <p className={'text-white mt-2 mb-2 text-sm font-semibold relative z-10 w-2/3 uppercase font-lPublicSans'}>
                                                {contenuto.field_aggiungi_i_contenuti_export.tipologia ? (
                                                    <span className=' text-white'>
                                                    {contenuto.field_aggiungi_i_contenuti_export.tipologia} | {new Date(contenuto.data_inizio).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                                </span>
                                                ) : contenuto.field_aggiungi_i_contenuti_export.tipologia ? (
                                                    <span className=' text-white'>
                                                    {contenuto.field_aggiungi_i_contenuti_export.tipo_della_notizia} | {new Date(contenuto.data_inizio).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                                </span>
                                                ) : (
                                                    <span className=' text-white'>
                                                    Annuncio | {new Date(contenuto.data_inizio).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                                </span>
                                                )}
                                            </p>
                                            <h1 className="text-xl font-semibold text-white uppercase relative z-10" dangerouslySetInnerHTML={{ __html: contenuto.field_aggiungi_i_contenuti_export.title}}>
                                            </h1>

                                            <p className={'text-white text-sm mt-2 relative z-10 w-2/3 max-h-10 overflow-hidden font-lPublicSans'} dangerouslySetInnerHTML={{ __html: (contenuto.field_aggiungi_i_contenuti_export.sottotitolo || contenuto.field_aggiungi_i_contenuti_export.body ? (contenuto.field_aggiungi_i_contenuti_export.sottotitolo ? contenuto.field_aggiungi_i_contenuti_export.sottotitolo : (contenuto.field_aggiungi_i_contenuti_export.body.substring(0, 60) + (contenuto.field_aggiungi_i_contenuti_export.body.length > 60 ? '...' : ''))) : '') }} />
                                            <img
                                                src={arrowMenu}
                                                alt="arrowright"
                                                className="w-2 mt-2 relative z-10 relative left-0 arrownext"
                                                style={{ position: 'relative', transition: 'left 0.3s, opacity 0.3s' }}
                                            />
                                            {/*{isNovelty && <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border border-white"></span>}*/}

                                        </a>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        ) : (
                            <div className="bg-lGrayDark p-8 shadow-lg text-center w-full">
                                <h1 className="text-2xl font-semibold text-white">Nessun contenuto disponibile</h1>
                            </div>
                        )}

                        {pageCount > 1 && (
                            <ReactPaginate
                                previousLabel={
                                    <img className={'rotate-180'} src={arrowRed} alt="Arrow Left" />
                                }
                                nextLabel={
                                    <img className={''} src={arrowRed} alt="Arrow Left" />
                                }
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'absolute right-5 bottom-10 pagination flex items-center -space-x-px h-8 text-sm'}
                                subContainerClassName={'pages pagination flex items-center -space-x-px h-8 text-sm'}
                                activeClassName={'active bg-rPrimary text-white'}
                                // previousLinkClassName={'flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover-bg-gray-100 hover-text-gray-700 dark-bg-gray-800 dark-border-gray-700 dark-text-gray-400 dark-hover-bg-gray-700 dark-hover-text-white'}
                                // nextLinkClassName={'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover-bg-gray-100 hover-text-gray-700 dark-bg-gray-800 dark-border-gray-700 dark-text-gray-400 dark-hover-bg-gray-700 dark-hover-text-white'}
                                pageLinkClassName={'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-rPrimary border border-gray-300 hover-bg-rPrimary hover-text-gray-700 dark-bg-rPrimary dark-border-gray-700 dark-text-gray-400 dark-hover-bg-rPrimary dark-hover-text-white'}
                            />
                        )}
                    </div>




                </div>

            </div>
            <div className={'flex absolute w-full pe-96 ps-8 pb-6 bottom-0 left-0'}>
                <div className={'w-1/3 text-black top-0 text-4xl text-right flex justify-start pe-14 mt-10 text-white'}>
                    <Link to={'/'} className={'text-white'}>
                        <img src={homeButton} alt={'home'} className={'w-16 h-16'} />
                    </Link>
                </div>


            </div>
            {/*<div className="flex h-[10vh]">*/}
            {/*    <MarqueeText />*/}
            {/*</div>*/}

            <ModalComponent
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Contenuto Modale"
                style={{
                    overlay: {
                        position: 'fixed',
                        zIndex: 1020,
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(255, 255, 255, 0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    content: {
                        overflow: 'hidden',
                        inset: '50px',
                    }}}
            >
                {/*<h2>{modalContent.titolo_sezione}</h2>*/}
                {/*{modalContent && modalContent.title}*/}
                {modalContent && modalContent.bundle === 'video' ? (
                    <Video content={modalContent} />
                ) : modalContent && modalContent.bundle === 'documenti' ? (
                    <Documenti content={modalContent} />
                )  : modalContent && modalContent.bundle === 'notizia' ? (
                    <Notizia content={modalContent} />
                )  : modalContent && modalContent.bundle === 'mercatino' ? (
                    <Mercatino content={modalContent} />
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
                        <line x1="5" y1="5" x2="15" y2="15" stroke="white" strokeWidth="2" />
                        <line x1="5" y1="5" x2="15" y2="15" stroke="white" strokeWidth="2" />
                        <line x1="15" y1="5" x2="5" y2="15" stroke="white" strokeWidth="2" />
                    </svg>
                </button>
            </ModalComponent>


        </div>
    );
};
