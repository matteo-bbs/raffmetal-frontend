import {useEffect, useState} from "react";
import axios from "../components/general/api.jsx";
import ModalComponent from "../components/general/ModalComponent.jsx";

export const Ricerca = () => {

    const [ricercaResult, setRicercaResult] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
    const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;

    const config = {
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json',
        },
    };

    useEffect(() => {
        axios.get(`/ricerca`, config)
            .then((response) => {
                setRicercaResult(response.data)
            })
            .catch((error) => console.log(error));

    }, []);

    const handleOpenModal = (content) => {
        setModalContent(content);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalContent(null);
        setModalIsOpen(false);
    };

    return(
        <div>
            <h1>Ricerca</h1>
            {ricercaResult &&
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th>Tipologia</th>
                            <th>Titolo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {ricercaResult.map((item, index) => {
                                return(
                                    <td key={index} onClick={() => handleOpenModal(item.body_export)}>{item.body_export}</td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
            }
            <ModalComponent
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Contenuto Modale"
            >
                <div>{modalContent}</div>
            </ModalComponent>
        </div>
    )
}