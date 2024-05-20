import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // replace '#root' with the id of your app's root element

function ModalComponent({ isOpen, onRequestClose, children }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
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
                }
            }}
        >
            {children}
        </Modal>
    );
}

export default ModalComponent;