import React, { useEffect, useState } from 'react';
import arrowright from "../../assets/next.png";
import 'tailwindcss/tailwind.css';
import ModalComponent from "../../components/general/ModalComponent.jsx";
import {Video} from "../../components/Video.jsx";
import {Documenti} from "../../components/Documenti.jsx";
import {Notizia} from "../../components/Notizia.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Link} from "react-router-dom";
import background from "../../assets/background.svg";
import {BASE_URL} from "../../components/general/baseUrl.jsx";

const Slidercomponent = ({ slides }) => {

    console.log(slides)
    const [currentSlide, setCurrentSlide] = useState(0);

    const [isScrolling, setIsScrolling] = useState(false);
    const handleTouchStart = () => {
        setIsScrolling(true);
    };

    const handleTouchEnd = () => {
        setIsScrolling(false);
    };

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleOpenModal = (videoUrl) => {
        if (!isScrolling) {
            setModalContent(videoUrl);
            setModalIsOpen(true);
        }
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


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 20000, // Aggiungi questa riga
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: setCurrentSlide,
        onSwipe: () => {}
    };

    // function extractTextAndImageFromHtml(htmlString) {
    //     try {
    //         const parser = new DOMParser();
    //         const parsedHtml = parser.parseFromString(htmlString, "text/html");
    //         const textContent = parsedHtml.querySelector(".field__item").textContent;
    //         console.log('textContent' + textContent)
    //         const pdfImageUrl = parsedHtml.querySelector(".pdfpreview-file").attributes[1].value;
    //         console.log('pdfImageUrl' + pdfImageUrl)
    //
    //         return { textContent, pdfImageUrl };
    //     } catch (error) {
    //         console.error("Errore nell'estrazione del contenuto HTML:", error);
    //         return { textContent: "Errore nell'estrazione del testo HTML", pdfImageUrl: "Errore nell'estrazione dell'immagine PDF" };
    //     }
    // }


    console.log(slides)


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

    return (
        <div
            className="slider-container h-full relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="slide h-full relative flex" >

                        <Link
                            to={'/modalpage'}
                            state={slide}
                            // onClick={() => handleOpenModal(slide)}
                            key={index}
                            className=" p-0 w-full h-full cursor-pointer block"
                            style={{ position: 'relative', width: '100%', height: '100%' }}
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



                            <div className="absolute left-0 top-0 w-full h-full bg-white opacity-70 z-10 backcard"
                                 style={{ transition: 'opacity 0.3s' }}
                            ></div>
                            <p className={'text-black mt-2 mb-2 text-sm font-semibold relative z-10 w-2/3 uppercase font-lPublicSans'} >
                                {/*if there is type use or use bundle*/}
                                {slide.tipo_della_notizia ? slide.tipo_della_notizia : slide.tipologia}
                            </p>

                            <p className={'text-black mt-2 mb-2 text-sm font-semibold relative z-10 w-2/3 uppercase font-lTekneLDO'} >{slide.titolo_sezione}</p>
                            <h1 className="text-4xl font-bold text-black uppercase relative z-10" dangerouslySetInnerHTML={{ __html: slide.title }}>
                            </h1>
                            <p className={'text-black text-sm mt-2 relative z-10 w-2/3 max-h-30 font-lPublicSans'} dangerouslySetInnerHTML={{ __html: (slide.sottotitolo || slide.body ? (slide.sottotitolo ? slide.sottotitolo : (slide.body.substring(0, 60) + (slide.body.length > 60 ? '...' : ''))) : '') }} />
                            <img
                                src={arrowright}
                                alt="arrowright"
                                className="w-2 mt-5 relative z-10 relative left-0 arrownext"
                                style={{ position: 'relative', transition: 'left 0.3s, opacity 0.3s' }}
                            />

                            {console.log(slide)}
                            {slide.bundle != 'documenti' ?
                                <img src={slide.galleria_di_immagini[0].media_image} alt="background"
                                     className="mt-5 z-10 absolute bottom-0 left-0 arrownext h-[77%] w-full object-cover"/>
                                :
                                <img
                                    src={`${BASE_URL}${extractPdfImageFromHtml(slide.allegato)}`}
                                    className="mt-3 z-10 relative bottom-0 left-0 arrownext h-full w-full object-contain object-top"
                                />

                            }

                        </Link>
                        {slide.immagine_anteprima &&
                            <img
                                src={extractTextFromHtml(slide.immagine_anteprima)}
                                className="top-0 left-0 w-full oject-cover  absolute z-0"
                        />
                        }
                    </div>
                ))}
            </Slider>
            {/*<div className="flex justify-start z-10 absolute bottom-5 left-8 space-x-2 mt-4">*/}
            {/*    {slides.map((_, index) => (*/}
            {/*        <button*/}
            {/*            key={index}*/}
            {/*            className={` rounded-full ${currentSlide === index ? 'bg-lWhite h-3.5 w-3.5 -mt-0.5' : 'border border-lWhite h-2.5 w-2.5'}`}*/}
            {/*            onClick={() => setCurrentSlide(index)}*/}
            {/*        />*/}
            {/*    ))}*/}
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
                ) : modalContent && modalContent.bundle === "in_evidenza_documenti" ? (
                    <Documenti content={modalContent} />
                ) : modalContent && modalContent.bundle === "in_evidenza_notizie" ? (
                    <Notizia content={modalContent} />
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

export default Slidercomponent;
