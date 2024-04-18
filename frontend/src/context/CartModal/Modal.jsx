import { useRef, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import ShoppingCartModal from '../../components/Cart/CartModal';

const ModalContext = createContext();

export function CartModalProvider({ children }) {
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    // callback function that will be called when modal is closing
    const [onModalClose, setOnModalClose] = useState(modalContent);

    const closeModal = () => {
        setModalContent(modalContent); // clear the modal contents
        // If callback function is truthy, call the callback function and reset it
        // to null:
        if (typeof onModalClose === "function") {
            setOnModalClose(modalContent);
            onModalClose();
        }
    };

    const contextValue = {
        modalRef, // reference to modal div
        modalContent, // React component to render inside modal
        setModalContent, // function to set the React component to render inside modal
        setOnModalClose, // function to set the callback function called when modal is closing
        closeModal // function to close the modal
    };

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function CartModal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;

    // Render the following component to the div referenced by the modalRef
    return ReactDOM.createPortal(
        <div className="cartModal">
            <div className="cartModal-background" onClick={closeModal} />
            {/* <div className="cartModal-content">{modalContent}</div> */}
            {modalContent}
        </div>,
        modalRef.current
    );
}

export const useCartModal = () => useContext(ModalContext);
