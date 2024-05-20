import React, {useState, useEffect, useRef} from 'react';
import axios from "../components/general/api.jsx";
import arrowLeft from "../assets/right.svg";
import ReactPaginate from "react-paginate";
import arrowRed from "../assets/arrowMenu.svg";
import {Link, useNavigate} from "react-router-dom";
import homeButton from "../assets/home.svg";
import {TimeClock} from "../components/TimeClock.jsx";
import cercaIcon from "../assets/cerca.png";
import {Video} from "../components/Video.jsx";
import {Documenti} from "../components/Documenti.jsx";
import {Notizia} from "../components/Notizia.jsx";
import {Mercatino} from "../components/Mercatino.jsx";
import ModalComponent from "../components/general/ModalComponent.jsx";
const Search = () => {



    const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
    const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;

    const config = {
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json',
        },
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 8; // Number of results to display per page

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1); // Add 1 to start from page 1
    };

    const pageCount = Math.ceil(searchResults.length / resultsPerPage);

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);



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
        <div className="bg-white h-[85vh] overflow-hidden">
            {/*<div className={'flex w-full pe-96 ps-8 pb-6 bottom-0 left-0 absolute'}>*/}
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



            <form onSubmit={(e) => {
                e.preventDefault();
                if (searchTerm) {
                    axios.get(`/ricerca-custom?combine=${searchTerm}`, config)
                        .then((response) => {
                            setSearchResults(response.data)
                        })
                        .catch((error) => console.log(error));
                }
            }}>
                <h1 className={'top-0 left-0 w-full p-5 text-lGrayDark font-bold text-3xl font-lTekneLDO'}>Ricerca</h1>
                <div className={'flex'}>
                <h1 className={'top-0 left-0 p-5 text-lGrayDark font-bold text-xl font-lTekneLDO'}>Filtra scrivendo il titolo</h1>

                <input
                    type="text"
                    placeholder="cerca.."
                    className={'border border-lGrayDark h-10 rounded mt-4 me-2'}
                    value={searchTerm}
                    minLength={4}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className={'flex flex-wrap border-solid border bg-lGrayDark text-white p-4 rounded mt-3.5 items-center pt-0 pb-0 h-11'} type="submit">Cerca <img className={'flex ms-2 w-[18px] h-[18px] mt-1.5'} src={cercaIcon}/></button>
            </div>
            </form>
            <div className="">
                <div className=" w-full">
                    <div className="h-[51vh] p-5 relative">
                        <table className={'relative border-collapse table-fixed w-full text-sm'}>
                            <thead className={'bg-lGrayDark w-full'}>
                            <tr>
                                <th className={'border-b bg-lGrayDark font-medium p-4 pl-8 pt-3 pb-3 text-white text-xl text-left font-lTekneLDO'}>Title</th>
                                <th className={'border-b bg-lGrayDark font-medium p-4 pl-8 pt-3 pb-3 text-white text-xl text-left font-lTekneLDO'}>Tipologia</th>
                            </tr>
                            </thead>
                            <tbody className={'space-y-4'}>
                            {currentResults.map((result) => (
                                <tr
                                    key={result.id}
                                    className={'bg-lGrayDark bg-opacity-70 mb-5 w-full cursor-pointer'}
                                    onClick={() => handleOpenModal(result)}

                                >
                                    <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                        <p className={'inline'} dangerouslySetInnerHTML={{ __html: result.title}}/>
                                        <img className={'ms-2 right-0 top-1 inline-block'} src={arrowLeft} alt="Arrow Left" />
                                    </td>
                                    <td>
                                        {result.tipologia ? (
                                            <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                                {result.tipologia}
                                            </td>
                                        ) : result.tipologia ? (
                                            <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                                {result.tipo_notizia}
                                            </td>
                                        ) : (
                                            <td className={'border-b border-slate-100 p-4 pl-8 text-white text-xl'}>
                                                Annuncio
                                            </td>
                                        )}

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
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
                                containerClassName={'absolute right-5 bottom-0 pagination flex items-center -space-x-px h-8 text-sm'}
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
                {modalContent && modalContent.bundle === 'Video' ? (
                    <Video content={modalContent} />
                ) : modalContent && modalContent.bundle === 'Documenti' ? (
                    <Documenti content={modalContent} />
                )  : modalContent && modalContent.bundle === 'Notizia' ? (
                    <Notizia content={modalContent} />
                )  : modalContent && modalContent.bundle === 'Mercatino' ? (
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
        </div>

    );
};

export default Search;
