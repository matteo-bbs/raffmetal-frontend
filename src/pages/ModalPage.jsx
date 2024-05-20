import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Video} from "../components/Video.jsx";
import {Documenti} from "../components/Documenti.jsx";
import {Notizia} from "../components/Notizia.jsx";
import ModalComponent from "../components/general/ModalComponent.jsx";
import { useNavigate } from 'react-router-dom';
export const ModalPage = () => {
    const location = useLocation();
    const content = location.state; // Accedi ai dati passati


    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [modalContent, setModalContent] = useState(null);


    useEffect(() => {
        setModalContent(content);

    }, []);
    const navigate = useNavigate();
    const handleCloseModal = () => {
        setModalContent(null);
        setModalIsOpen(false);

        navigate(`/`);
    };



    const navigateHome = useNavigate();
    const timerRef = useRef(null);

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            navigateHome('/');
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
    return(
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
                <Video content={modalContent} />
            ) : modalContent && modalContent.bundle === "documenti" ? (
                <Documenti content={modalContent} />
            ) : modalContent && modalContent.bundle === "notizia" ? (
                <Notizia content={modalContent} />
            ) : modalContent && modalContent.bundle === "in_evidenza_documenti" ? (
                <Documenti content={modalContent} />
            ) : modalContent && modalContent.bundle === "in_evidenza_notizie" ? (
                <Notizia content={modalContent} />
            ) : (
                <p>Contenuto non valido</p>
            )}
            <Link to={'/'} onClick={handleCloseModal} className="close-button">
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
            </Link>
        </ModalComponent>
    )
}