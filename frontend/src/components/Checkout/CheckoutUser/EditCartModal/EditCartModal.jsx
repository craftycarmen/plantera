import { useDispatch } from "react-redux";
import { useModal } from '../../../context/Modal';
import { removeListing } from "../../../store/listings";
import { useState } from "react";

function EditCartModal({ navigate }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState(null)

    const proceed = () => {
        closeModal();
        navigate('/cart')
    }

    return (
        <section className="modal">
            <h1>Checkout Issue</h1>
            <p>Please remove item(s) that belong to you before checking out.</p>
            <button
                id="no"
                onClick={proceed}
                style={{ width: "190px" }}
            >
                Update Cart
            </button>
            )
        </section>
    )
}

export default EditCartModal
