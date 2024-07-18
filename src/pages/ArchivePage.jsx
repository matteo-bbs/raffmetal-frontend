import React, {useEffect, useRef, useState} from 'react';
import axios from "../components/general/api.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import arrowLeft from "../assets/right.svg";
import arrowRed from "../assets/arrowMenu.svg";
import {Video} from "../components/Video.jsx";
import {Documenti} from "../components/Documenti.jsx";
import {Notizia} from "../components/Notizia.jsx";
import {Mercatino} from "../components/Mercatino.jsx";
import ModalComponent from "../components/general/ModalComponent.jsx";
import ReactPaginate from "react-paginate";
import homeButton from "../assets/home.svg";
import {TimeClock} from "../components/TimeClock.jsx";

export const ArchivePage = () => {
    const [expiredContents, setExpiredContents] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Add this line
    const contentsPerPage = 8; // Add this line

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const username = 'utente_api_totem';
    const password = 'Bettolino@3';
    const config = {
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json',
        },
    };
    const { id_sezione } = useParams();

    const menuItem = JSON.parse(localStorage.getItem('menu'));

    const matchedMenuItem = menuItem.find(item => item.id_sezione === id_sezione);
    if (menuItem) {

        if (matchedMenuItem) {
            localStorage.setItem('field_sfondo_export', JSON.stringify(matchedMenuItem.field_sfondo_export));
        }
    }

    useEffect(() => {
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

                        const expiredContents = combinedContents.filter(content => {
                            const dataFine = content.data_fine ? new Date(content.data_fine) : null;

                            // Se dataFine è null o non definito, il contenuto non è scaduto
                            if (!dataFine || isNaN(dataFine)) {
                                return false;
                            } else {
                                return currentDate > dataFine;
                            }
                        });

                        expiredContents.reverse();
                        setExpiredContents(expiredContents);
                    });

            });
    }, []);

    // console.log(expiredContents)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const handleOpenModal = (content) => {
        setModalContent(content);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalContent(null);
        setModalIsOpen(false);
    };

    const pageCount = Math.ceil(expiredContents.length / contentsPerPage);

    const currentContents = expiredContents.slice(currentPage * contentsPerPage, (currentPage + 1) * contentsPerPage);
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
                <div className=" w-full">

                    <div className="h-[1620px] p-5 pt-20 relative">
                        <img className={'absolute left-0 top-0 w-full h-full object-cover'} src={matchedMenuItem.field_sfondo_export.media_image}/>
                        <h1 className={'top-0 left-0 w-full absolute p-5 text-white font-bold text-3xl font-lTekneLDO'}>Archivio {matchedMenuItem.titolo_sezione}</h1>
                        <table className={'relative border-collapse table-fixed w-full text-sm'}>
                            <thead className={'bg-rPrimary w-full'}>
                            <tr>
                                <th className={'border-b bg-rPrimary font-medium p-4 pl-8 pt-3 pb-3 text-white text-xl text-left font-lTekneLDO w-1/6'}>Area</th>
                                <th className={'border-b bg-rPrimary font-medium p-4 pl-8 pt-3 pb-3 text-white text-xl text-left font-lTekneLDO w-1/6'}>Tipologia</th>
                                <th className={'border-b bg-rPrimary font-medium p-4 pl-8 pt-3 pb-3 text-white text-xl text-left font-lTekneLDO w-1/6'}>Data</th>
                                <th className={'border-b bg-rPrimary font-medium p-4 pl-8 pt-3 pb-3 text-white text-xl text-left font-lTekneLDO w-2/6'}>Titolo</th>
                            </tr>
                            </thead>
                            <tbody className={'space-y-4'}>
                            {currentContents.map(content => (
                                    <tr
                                        key={content.id}
                                        onClick={() => handleOpenModal(content.field_aggiungi_i_contenuti_export)}
                                        className={'bg-lGrayDark bg-opacity-70 mb-5 w-full cursor-pointer'}
                                    >
                                        <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                            {matchedMenuItem.titolo_sezione}
                                        </td>
                                        {/*<td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>*/}
                                        {/*    {content.field_aggiungi_i_contenuti_export ? content.field_aggiungi_i_contenuti_export.tipologia : ''}*/}
                                        {/*</td>*/}

                                        {content.field_aggiungi_i_contenuti_export.tipologia ? (
                                            <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                                {content.field_aggiungi_i_contenuti_export.tipologia}
                                            </td>
                                        ) : content.field_aggiungi_i_contenuti_export.tipologia ? (
                                            <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                                {content.field_aggiungi_i_contenuti_export.tipo_della_notizia}
                                            </td>
                                        ) : (
                                            <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                                Annuncio
                                            </td>
                                        )}
                                        <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                            {content.data_inizio ? new Date(content.data_inizio).toLocaleDateString() : ''}
                                        </td>
                                        <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                            <p className={'inline'} dangerouslySetInnerHTML={{__html:content.field_aggiungi_i_contenuti_export ? content.field_aggiungi_i_contenuti_export.title : ''}}/>
                                            <p className={'inline'} dangerouslySetInnerHTML={{__html:content.field_aggiungi_i_contenuti_export ? content.field_aggiungi_i_contenuti_export.sottotitolo : ''}}/>
                                            <img className={'ms-2 right-0 top-1 inline-block'} src={arrowLeft} alt="Arrow Left" />
                                        </td>

                                    </tr>
                        ))}
                            </tbody>
                        </table>
                        <Link className={'z-10 absolute bottom-5 left-5 py-5 px-10 uppercase bg-rPrimary text-white text-xl font-normal min-w-[250px] flex justify-between'} to={`/snodopage/${id_sezione}`}>Sezione {matchedMenuItem.titolo_sezione} <img className={'ms-5 right-0 top-1 inline-block'} src={arrowRed} alt="Arrow Left" /></Link>

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
                                activeClassName={'active bg-lGrayDark text-white'}
                                // previousLinkClassName={'flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover-bg-gray-100 hover-text-gray-700 dark-bg-gray-800 dark-border-gray-700 dark-text-gray-400 dark-hover-bg-gray-700 dark-hover-text-white'}
                                // nextLinkClassName={'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover-bg-gray-100 hover-text-gray-700 dark-bg-gray-800 dark-border-gray-700 dark-text-gray-400 dark-hover-bg-gray-700 dark-hover-text-white'}
                                pageLinkClassName={'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover-bg-gray-100 hover-text-gray-700 dark-bg-gray-800 dark-border-gray-700 dark-text-gray-400 dark-hover-bg-gray-700 dark-hover-text-white'}
                            />
                        )}
                    </div>

                </div>
            </div>
            {/*<div className={'flex absolute w-full pe-96 ps-8 pb-6 bottom-0 left-0'}>*/}
            {/*    <div className={'w-1/3 text-black top-0 text-4xl text-right flex justify-start pe-14 mt-10 text-white'}>*/}
            {/*        <Link to={'/'} className={'text-white'}>*/}
            {/*            <img src={homeButton} alt={'home'} className={'w-16 h-16'} />*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*    <div className={'w-full text-black top-0 text-4xl text-right flex justify-end pe-14 mt-10 text-white pe-60 me-4'}>*/}
            {/*        {localStorage.getItem("totemType") && JSON.parse(localStorage.getItem("totemType"))[0].layout}*/}
            {/*        <TimeClock />*/}

            {/*    </div>*/}

            {/*</div>*/}

            <div className={'flex absolute w-full pe-96 ps-8 pb-6 bottom-0 left-0'}>
                <div className={'w-1/3 text-black top-0 text-4xl text-right flex justify-start pe-14 mt-10 text-white'}>
                    <Link to={'/'} className={'text-white'}>
                        <img src={homeButton} alt={'home'} className={'w-16 h-16'} />
                    </Link>
                </div>


            </div>
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