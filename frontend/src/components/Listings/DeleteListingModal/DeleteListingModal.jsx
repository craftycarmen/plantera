import { useDispatch } from "react-redux";
import { useModal } from '../../../context/Modal';
import { removeListing } from "../../../store/listings";
import { useState } from "react";

function DeleteListingModal({ listingId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState(null)

    const yes = async () => {
        try {
            await dispatch(removeListing(listingId))
            closeModal()
        } catch (error) {
            console.error("Error deleting listing:", error);

            // Log the error object to inspect it
            console.log(error.status);
            if (error.status === 403) {
                setErrors("You cannot delete this listing, as there is an active order with this listing.")
            } else {
                console.error("Error deleting listing:", error)
            }
        }
    }

    return (
        <section className="modal">
            <h1>Confirm Delete</h1>
            {!errors ? (
                <>
                    <p>Are you sure you want to delete this listing?</p>
                    <button
                        id="yes"
                        onClick={yes}>
                        Yes, Delete Listing
                    </button>
                    <br />
                    <button
                        id="no"
                        onClick={closeModal}>
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <p>This listing cannot be deleted because it has associated order(s).</p>
                    <button
                        id="no"
                        onClick={closeModal}>
                        Cancel
                    </button>
                </>
            )}
        </section>
    )
}

export default DeleteListingModal
